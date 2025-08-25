/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/ProfilesTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import {
    Action,
    KeycloakDataTable,
    KeycloakSpinner,
    ListEmptyState,
    useAlerts,
    useFetch
} from "../../shared/keycloak-ui-shared";
import {
    ActionGroup,
    AlertVariant,
    Button,
    ButtonVariant,
    FormGroup,
    Label,
    PageSection,
    Tabs,
    Tab,
    ToolbarItem,
    TabTitleText
} from "../../shared/@patternfly/react-core";
import { PlusIcon, PrivateIcon } from "../../shared/@patternfly/react-icons";
import { omit } from "lodash-es";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import CodeEditor from "../components/form/CodeEditor";
import { useRealm } from "../context/realm-context/RealmContext";
import { prettyPrintJSON } from "../util";
import { toAddClientProfile } from "./routes/AddClientProfile";
import { toClientProfile } from "./routes/ClientProfile";

import "./realm-settings-section.css";

type ClientProfile = ClientProfileRepresentation & {
    global: boolean;
};

export default function ProfilesTab() {
    const { adminClient } = useAdminClient();

    const { t } = useTranslation();
    const { realm } = useRealm();
    const { addAlert, addError } = useAlerts();
    const [tableProfiles, setTableProfiles] = useState<ClientProfile[]>();
    const [globalProfiles, setGlobalProfiles] = useState<ClientProfileRepresentation[]>();
    const [selectedProfile, setSelectedProfile] = useState<ClientProfile>();
    const [code, setCode] = useState<string>();
    const [key, setKey] = useState(0);
    const [activeTab, setActiveTab] = useState(1);

    useFetch(
        () =>
            adminClient.clientPolicies.listProfiles({
                includeGlobalProfiles: true
            }),
        allProfiles => {
            setGlobalProfiles(allProfiles.globalProfiles);

            const globalProfiles = allProfiles.globalProfiles?.map(globalProfiles => ({
                ...globalProfiles,
                global: true
            }));

            const profiles = allProfiles.profiles?.map(profiles => ({
                ...profiles,
                global: false
            }));

            const allClientProfiles = globalProfiles?.concat(profiles ?? []);
            setTableProfiles(allClientProfiles || []);
            setCode(JSON.stringify(allClientProfiles, null, 2));
        },
        [key]
    );

    const loader = async () => tableProfiles ?? [];

    const normalizeProfile = (profile: ClientProfile): ClientProfileRepresentation =>
        omit(profile, "global");

    const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
        titleKey: t("deleteClientProfileConfirmTitle"),
        messageKey: t("deleteClientProfileConfirm", {
            profileName: selectedProfile?.name
        }),
        continueButtonLabel: t("delete"),
        continueButtonVariant: ButtonVariant.danger,
        onConfirm: async () => {
            const updatedProfiles = tableProfiles
                ?.filter(
                    profile => profile.name !== selectedProfile?.name && !profile.global
                )
                .map<ClientProfileRepresentation>(profile => normalizeProfile(profile));

            try {
                await adminClient.clientPolicies.createProfiles({
                    profiles: updatedProfiles,
                    globalProfiles
                });
                addAlert(t("deleteClientSuccess"), AlertVariant.success);
                setKey(key + 1);
            } catch (error) {
                addError("deleteClientError", error);
            }
        }
    });

    const cellFormatter = (row: ClientProfile) => (
        <Link
            to={toClientProfile({
                realm,
                profileName: row.name!
            })}
            key={row.name}
        >
            {row.name}{" "}
            {row.global && (
                <Label isCompact color="green">
                    {t("global")}
                </Label>
            )}
        </Link>
    );

    if (!tableProfiles) {
        return <KeycloakSpinner />;
    }

    const save = async () => {
        if (!code) {
            return;
        }

        try {
            const obj: ClientProfile[] = JSON.parse(code);
            const changedProfiles = obj
                .filter(profile => !profile.global)
                .map(profile => normalizeProfile(profile));

            const changedGlobalProfiles = obj
                .filter(profile => profile.global)
                .map(profile => normalizeProfile(profile));

            try {
                await adminClient.clientPolicies.createProfiles({
                    profiles: changedProfiles,
                    globalProfiles: changedGlobalProfiles
                });
                addAlert(t("updateClientProfilesSuccess"), AlertVariant.success);
                setKey(key + 1);
            } catch (error) {
                addError("updateClientProfilesError", error);
            }
        } catch (error) {
            addError("invalidJsonClientProfilesError", error);
        }
    };

    return (
        <>
            <DeleteConfirm />
            <Tabs
                activeKey={activeTab}
                onSelect={(_, key) => setActiveTab(key as number)}
            >
                <Tab
                    id="label"
                    isDisabled
                    eventKey={0}
                    title={<TabTitleText>{t("profilesConfigType")}</TabTitleText>}
                    data-testid="profiles-label-tab"
                ></Tab>
                <Tab
                    id="settings"
                    eventKey={1}
                    title={
                        <TabTitleText>{t("profilesConfigTypes.formView")}</TabTitleText>
                    }
                    data-testid="profiles-setting-view-tab"
                >
                    <PageSection padding={{ default: "noPadding" }}>
                        <KeycloakDataTable
                            key={tableProfiles.length}
                            ariaLabelKey="profiles"
                            searchPlaceholderKey="clientProfileSearch"
                            loader={loader}
                            toolbarItem={
                                <ToolbarItem>
                                    <Button
                                        id="createProfile"
                                        component={props => (
                                            <Link
                                                {...props}
                                                to={toAddClientProfile({
                                                    realm,
                                                    tab: "profiles"
                                                })}
                                            />
                                        )}
                                        data-testid="createProfile"
                                        icon={<PlusIcon />}
                                    >
                                        {t("createClientProfile")}
                                    </Button>
                                </ToolbarItem>
                            }
                            isRowDisabled={value => value.global}
                            actions={[
                                {
                                    title: t("delete"),
                                    onRowClick: profile => {
                                        setSelectedProfile(profile);
                                        toggleDeleteDialog();
                                    }
                                } as Action<ClientProfile>
                            ]}
                            columns={[
                                {
                                    name: "name",
                                    displayKey: t("name"),
                                    cellRenderer: cellFormatter
                                },
                                {
                                    name: "description",
                                    displayKey: t("clientProfileDescription")
                                }
                            ]}
                            emptyState={
                                <ListEmptyState
                                    hasIcon
                                    message={t("emptyClientProfiles")}
                                    instructions={t("emptyClientProfilesInstructions")}
                                    icon={PrivateIcon}
                                />
                            }
                        />
                    </PageSection>
                </Tab>
                <Tab
                    id="json"
                    eventKey={2}
                    title={
                        <TabTitleText>{t("profilesConfigTypes.jsonEditor")}</TabTitleText>
                    }
                    data-testid="profiles-josn-view-tab"
                >
                    <PageSection
                        padding={{ default: "noPadding" }}
                        className="pf-v5-u-pb-4xl pf-v5-u-pr-lg"
                    >
                        <FormGroup fieldId={"jsonEditor"}>
                            <div className="pf-v5-u-mt-md pf-v5-u-ml-lg">
                                <CodeEditor
                                    value={code}
                                    language="json"
                                    onChange={value => setCode(value ?? "")}
                                    height={480}
                                />
                            </div>
                            <ActionGroup>
                                <div className="pf-v5-u-mt-md">
                                    <Button
                                        variant={ButtonVariant.primary}
                                        className="pf-v5-u-mr-md pf-v5-u-ml-lg"
                                        onClick={save}
                                        data-testid="jsonEditor-saveBtn"
                                    >
                                        {t("save")}
                                    </Button>
                                    <Button
                                        variant={ButtonVariant.link}
                                        onClick={() => {
                                            setCode(prettyPrintJSON(tableProfiles));
                                        }}
                                        data-testid="jsonEditor-reloadBtn"
                                    >
                                        {t("reload")}
                                    </Button>
                                </div>
                            </ActionGroup>
                        </FormGroup>
                    </PageSection>
                </Tab>
            </Tabs>
        </>
    );
}
