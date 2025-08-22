/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/UserRegistration.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import {
    AlertVariant,
    Tab,
    Tabs,
    TabTitleText
} from "../../shared/@patternfly/react-core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../admin-client";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { RoleMapping } from "../components/role-mapping/RoleMapping";
import { useRealm } from "../context/realm-context/RealmContext";
import { DefaultsGroupsTab } from "./DefaultGroupsTab";

export const UserRegistration = () => {
    const { adminClient } = useAdminClient();

    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(10);
    const { realmRepresentation: realm } = useRealm();
    const [key, setKey] = useState(0);

    const { addAlert, addError } = useAlerts();
    const { realm: realmName } = useRealm();

    const addComposites = async (composites: RoleRepresentation[]) => {
        const compositeArray = composites;

        try {
            await adminClient.roles.createComposite(
                { roleId: realm?.defaultRole!.id!, realm: realmName },
                compositeArray
            );
            setKey(key + 1);
            addAlert(t("addAssociatedRolesSuccess"), AlertVariant.success);
        } catch (error) {
            addError("addAssociatedRolesError", error);
        }
    };

    return (
        <Tabs
            activeKey={activeTab}
            onSelect={(_, key) => setActiveTab(key as number)}
            inset={{
                default: "insetNone",
                xl: "insetLg",
                "2xl": "inset2xl"
            }}
        >
            <Tab
                key={key}
                id="roles"
                eventKey={10}
                title={<TabTitleText>{t("defaultRoles")}</TabTitleText>}
                data-testid="default-roles-tab"
            >
                <RoleMapping
                    name={realm?.defaultRole!.name!}
                    id={realm?.defaultRole!.id!}
                    type="roles"
                    isManager
                    save={rows => addComposites(rows.map(r => r.role))}
                />
            </Tab>
            <Tab
                id="groups"
                eventKey={20}
                title={<TabTitleText>{t("defaultGroups")}</TabTitleText>}
                data-testid="default-groups-tab"
            >
                <DefaultsGroupsTab />
            </Tab>
        </Tabs>
    );
};
