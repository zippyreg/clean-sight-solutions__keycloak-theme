/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/clients/initial-access/InitialAccessTokenList.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientInitialAccessPresentation from "@keycloak/keycloak-admin-client/lib/defs/clientInitialAccessPresentation";
import {
    AlertVariant,
    Button,
    ButtonVariant
} from "../../../shared/@patternfly/react-core";
import { CloudSecurityIcon, PlusIcon } from "../../../shared/@patternfly/react-icons";
import { wrappable } from "../../../shared/@patternfly/react-table";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAdminClient } from "../../admin-client";
import { useAlerts } from "../../../shared/keycloak-ui-shared";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { Action, KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import { useRealm } from "../../context/realm-context/RealmContext";
import useFormatDate, { FORMAT_DATE_AND_TIME } from "../../utils/useFormatDate";
import { toCreateInitialAccessToken } from "../routes/CreateInitialAccessToken";

export const InitialAccessTokenList = () => {
    const { adminClient } = useAdminClient();

    const { t } = useTranslation();

    const { addAlert, addError } = useAlerts();
    const { realm } = useRealm();
    const formatDate = useFormatDate();

    const navigate = useNavigate();

    const [token, setToken] = useState<ClientInitialAccessPresentation>();

    const loader = async () => {
        try {
            return await adminClient.realms.getClientsInitialAccess({ realm });
        } catch {
            return [];
        }
    };

    const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
        titleKey: "tokenDeleteConfirmTitle",
        messageKey: t("tokenDeleteConfirm", { id: token?.id }),
        continueButtonLabel: "delete",
        continueButtonVariant: ButtonVariant.danger,
        onConfirm: async () => {
            try {
                await adminClient.realms.delClientsInitialAccess({
                    realm,
                    id: token!.id!
                });
                addAlert(t("tokenDeleteSuccess"), AlertVariant.success);
                setToken(undefined);
            } catch (error) {
                addError("tokenDeleteError", error);
            }
        }
    });

    return (
        <>
            <DeleteConfirm />
            <KeycloakDataTable
                key={token?.id}
                ariaLabelKey="initialAccessToken"
                searchPlaceholderKey="searchInitialAccessToken"
                loader={loader}
                toolbarItem={
                    <Button
                        icon={<PlusIcon />}
                        component={props => (
                            <Link {...props} to={toCreateInitialAccessToken({ realm })} />
                        )}
                    >
                        {t("create")}
                    </Button>
                }
                actions={[
                    {
                        title: t("delete"),
                        onRowClick: token => {
                            setToken(token);
                            toggleDeleteDialog();
                        }
                    } as Action<ClientInitialAccessPresentation>
                ]}
                columns={[
                    {
                        name: "id",
                        displayKey: "id"
                    },
                    {
                        name: "timestamp",
                        displayKey: "timestamp",
                        cellRenderer: row =>
                            formatDate(
                                new Date(row.timestamp! * 1000),
                                FORMAT_DATE_AND_TIME
                            )
                    },
                    {
                        name: "expiration",
                        displayKey: "expires",
                        cellRenderer: row =>
                            formatDate(
                                new Date(row.timestamp! * 1000 + row.expiration! * 1000),
                                FORMAT_DATE_AND_TIME
                            )
                    },
                    {
                        name: "count",
                        displayKey: "count"
                    },
                    {
                        name: "remainingCount",
                        displayKey: "remainingCount",
                        transforms: [wrappable]
                    }
                ]}
                emptyState={
                    <ListEmptyState
                        message={t("noTokens")}
                        instructions={t("noTokensInstructions")}
                        primaryActionText={t("createToken")}
                        onPrimaryAction={() =>
                            navigate(toCreateInitialAccessToken({ realm }))
                        }
                        primaryActionIcon={<PlusIcon />}
                        icon={CloudSecurityIcon}
                    />
                }
            />
        </>
    );
};
