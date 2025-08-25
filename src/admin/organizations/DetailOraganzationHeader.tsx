/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/DetailOraganzationHeader.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useMemo } from "react";
import {
    ButtonVariant,
    DropdownItem,
    Tooltip
} from "../../shared/@patternfly/react-core";
import { ViewHeader, ViewHeaderBadge } from "../components/view-header/ViewHeader";
import { useTranslation } from "react-i18next";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { useAdminClient } from "../admin-client";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { toOrganizations } from "./routes/Organizations";
import { useRealm } from "../context/realm-context/RealmContext";
import { DisabledLabel } from "../components/label/DisabledLabel";

type DetailOrganizationHeaderProps = {
    save: () => void;
};

export const DetailOrganizationHeader = ({ save }: DetailOrganizationHeaderProps) => {
    const { adminClient } = useAdminClient();
    const { realm } = useRealm();
    const navigate = useNavigate();

    const { t } = useTranslation();
    const { addAlert, addError } = useAlerts();

    const id = useWatch({ name: "id" });
    const name = useWatch({ name: "name" });
    const enabled = useWatch({ name: "enabled" });

    const { setValue } = useFormContext();

    const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
        titleKey: "disableConfirmOrganizationTitle",
        messageKey: "disableConfirmOrganization",
        continueButtonLabel: "disable",
        onConfirm: () => {
            setValue("enabled", false);
            save();
        }
    });

    const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
        titleKey: "organizationDelete",
        messageKey: "organizationDeleteConfirm",
        continueButtonLabel: "delete",
        continueButtonVariant: ButtonVariant.danger,
        onConfirm: async () => {
            try {
                await adminClient.organizations.delById({ id });
                addAlert(t("organizationDeletedSuccess"));
                navigate(toOrganizations({ realm }));
            } catch (error) {
                addError("organizationDeleteError", error);
            }
        }
    });

    const badges = useMemo<ViewHeaderBadge[]>(() => [
        !enabled && {
            text: (
                <Tooltip content={t("helpOrganizationDisabled")}>
                    <DisabledLabel />
                </Tooltip>
            )
        }
    ]);

    return (
        <Controller
            name="enabled"
            render={({ field: { value, onChange } }) => (
                <>
                    <DeleteConfirm />
                    <DisableConfirm />
                    <ViewHeader
                        titleKey={name || ""}
                        badges={badges}
                        divider={false}
                        dropdownItems={[
                            <DropdownItem
                                data-testid="delete-client"
                                key="delete"
                                onClick={toggleDeleteDialog}
                            >
                                {t("delete")}
                            </DropdownItem>
                        ]}
                        isEnabled={value}
                        onToggle={value => {
                            if (!value) {
                                toggleDisableDialog();
                            } else {
                                onChange(value);
                                save();
                            }
                        }}
                    />
                </>
            )}
        />
    );
};
