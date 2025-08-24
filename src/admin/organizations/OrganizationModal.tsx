/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/OrganizationModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { KeycloakDataTable, ListEmptyState } from "../../shared/keycloak-ui-shared";
import { UsersIcon } from "../../shared/@patternfly/react-icons";
import { Button, Modal, ModalVariant } from "../../shared/@patternfly/react-core";
import { TableText } from "../../shared/@patternfly/react-table";
import { differenceBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";

type OrganizationModalProps = {
    isJoin?: boolean;
    existingOrgs: OrganizationRepresentation[];
    onAdd: (orgs: OrganizationRepresentation[]) => Promise<void>;
    onClose: () => void;
};

export const OrganizationModal = ({
    isJoin = true,
    existingOrgs,
    onAdd,
    onClose
}: OrganizationModalProps) => {
    const { adminClient } = useAdminClient();
    const { t } = useTranslation();

    const [selectedRows, setSelectedRows] = useState<UserRepresentation[]>([]);

    const loader = async (first?: number, max?: number, search?: string) => {
        const params = {
            first,
            search,
            max: max! + existingOrgs.length
        };

        const orgs = await adminClient.organizations.find(params);
        return differenceBy(orgs, existingOrgs, "id");
    };

    return (
        <Modal
            variant={ModalVariant.small}
            title={isJoin ? t("joinOrganization") : t("sendInvitation")}
            isOpen
            onClose={onClose}
            actions={[
                <Button
                    data-testid="join"
                    key="confirm"
                    variant="primary"
                    onClick={async () => {
                        await onAdd(selectedRows);
                        onClose();
                    }}
                >
                    {isJoin ? t("join") : t("send")}
                </Button>,
                <Button
                    data-testid="cancel"
                    key="cancel"
                    variant="link"
                    onClick={onClose}
                >
                    {t("cancel")}
                </Button>
            ]}
        >
            <KeycloakDataTable
                loader={loader}
                isPaginated
                ariaLabelKey="organizationsList"
                searchPlaceholderKey="searchOrganization"
                canSelectAll
                onSelect={rows => setSelectedRows([...rows])}
                columns={[
                    {
                        name: "name",
                        displayKey: "organizationName"
                    },
                    {
                        name: "description",
                        cellRenderer: row => (
                            <TableText wrapModifier="truncate">
                                {row.description}
                            </TableText>
                        )
                    }
                ]}
                emptyState={(
                    <ListEmptyState
                        hasIcon
                        message={t("emptyUserOrganizations")}
                        instructions={t("emptyUserOrganizationsInstructions")}
                        icon={UsersIcon}
                    />
                )}
            />
        </Modal>
    );
};
