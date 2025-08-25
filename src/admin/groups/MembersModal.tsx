/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/MembersModal.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {
    Button,
    Flex,
    Modal,
    ModalVariant,
    Label
} from "../../shared/@patternfly/react-core";
import { UserIcon, MinusCircleIcon } from "../../shared/@patternfly/react-icons";
import { differenceBy } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { ListEmptyState } from "../../shared/keycloak-ui-shared";
import { KeycloakDataTable } from "../../shared/keycloak-ui-shared";
import { emptyFormatter } from "../util";

type MemberModalProps = {
    membersQuery: (first?: number, max?: number) => Promise<UserRepresentation[]>;
    onAdd: (users: UserRepresentation[]) => Promise<void>;
    onClose: () => void;
};

const UserDetail = (user: UserRepresentation) => {
    const { t } = useTranslation();
    return (
        <Flex gap={{ default: "gapSm" }}>
            <span>{user.username}</span>
            {!user.enabled && (
                <Label isCompact color="red" icon={<MinusCircleIcon />}>
                    {t("disabled")}
                </Label>
            )}
        </Flex>
    );
};

export const MemberModal = ({ membersQuery, onAdd, onClose }: MemberModalProps) => {
    const { adminClient } = useAdminClient();

    const { t } = useTranslation();
    const { addError } = useAlerts();
    const [selectedRows, setSelectedRows] = useState<UserRepresentation[]>([]);

    const loader = async (first?: number, max?: number, search?: string) => {
        const members = await membersQuery(first, max);
        const params: { [name: string]: string | number } = {
            first: first!,
            max: max! + members.length,
            search: search || ""
        };

        try {
            const users = await adminClient.users.find({ ...params });
            return differenceBy(users, members, "id").slice(0, max);
        } catch (error) {
            addError("noUsersFoundError", error);
            return [];
        }
    };

    return (
        <Modal
            variant={ModalVariant.large}
            title={t("addMember")}
            isOpen
            onClose={onClose}
            actions={[
                <Button
                    data-testid="add"
                    key="confirm"
                    variant="primary"
                    onClick={async () => {
                        await onAdd(selectedRows);
                        onClose();
                    }}
                >
                    {t("add")}
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
                ariaLabelKey="titleUsers"
                searchPlaceholderKey="searchForUser"
                canSelectAll
                onSelect={rows => setSelectedRows([...rows])}
                emptyState={
                    <ListEmptyState
                        hasIcon
                        message={t("noUsersFound")}
                        instructions={t("emptyInstructions")}
                        icon={UserIcon}
                    />
                }
                columns={[
                    {
                        name: "username",
                        displayKey: "username",
                        cellRenderer: UserDetail
                    },
                    {
                        name: "email",
                        displayKey: "email",
                        cellFormatters: [emptyFormatter()]
                    },
                    {
                        name: "lastName",
                        displayKey: "lastName",
                        cellFormatters: [emptyFormatter()]
                    },
                    {
                        name: "firstName",
                        displayKey: "firstName",
                        cellFormatters: [emptyFormatter()]
                    }
                ]}
            />
        </Modal>
    );
};
