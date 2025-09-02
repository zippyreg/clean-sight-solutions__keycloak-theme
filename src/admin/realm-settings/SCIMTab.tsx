/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/EmailTab.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import {
    ActionGroup,
    ActionListItem,
    Button,
    PageSection,
    Switch
} from "../../shared/@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    FormPanel,
    TextControl
} from "../../shared/keycloak-ui-shared";
import { useAlerts } from "../../shared/keycloak-ui-shared";
import { FormAccess } from "../components/form/FormAccess";
import useToggle from "../utils/useToggle";

import "./realm-settings-section.css";
import { convertAttributeNameToForm } from "../util";

type RealmSettingsSCIMTabProps = {
    realm: RealmRepresentation;
    save: (realm: RealmRepresentation) => void;
};

type FormFields = Omit<RealmRepresentation, "users" | "federatedUsers">;

export const RealmSettingsSCIMTab = ({ realm, save }: RealmSettingsSCIMTabProps) => {
    const { t } = useTranslation();
    const { addAlert, addError } = useAlerts();

    const form = useForm<FormFields>({ defaultValues: realm });
    const { handleSubmit, reset: resetForm, watch } = form;

    const reset = () => resetForm(realm);
    const [isEnabled, _, setEnable] = useToggle(realm.attributes?.["scim.enabled"] === "true");

    const watchAuthMode = watch(convertAttributeNameToForm("attributes.scim.authentication.mode"), "KEYCLOAK");

    const toggleKey = (key: string) => {
        return key.startsWith("_")
            ? key.substring(1)
            : `_${key}`;
    }

    const toggleScim = () => {
        const newIsEnabled = !isEnabled;
        // Toggle the state
        setEnable(newIsEnabled);

        // If disabling, rename any realm SCIM attributes to _scim (so they 
        // are invalided by SCIM server)
        const attributes = { ...realm.attributes };
        for (const key in attributes) {
            if (key.startsWith(newIsEnabled ? "_scim." : "scim") && !key.includes("enabled")) {
                attributes[toggleKey(key)] = attributes[key];
                delete attributes[key];
            }
        }

        // Set the new enabled attribute
        attributes["scim.enabled"] = newIsEnabled;

        if(newIsEnabled && !("scim.authentication.mode" in attributes)) {
            attributes["scim.authentication.mode"] = "KEYCLOAK";
        }

        console.log(attributes);

        // Save this update
        save({ ...realm, attributes });
    }

    const saveForm = () => {

    }

    return (
        <PageSection variant="light">
            <FormProvider {...form}>
                <FormPanel title={t("scim.setup")} className="kc-scim-template">
                    <FormAccess
                        isHorizontal
                        role="manage-realm"
                        className="pf-v5-u-mt-lg"
                        onSubmit={handleSubmit(save)}
                    >
                        <Switch
                            id="realm-scim-enabled-switch"
                            data-testid="realm-scim-enabled-switch"
                            label={t("scim.enabled")}
                            labelOff={t("scim.disabled")}
                            className="pf-v5-u-mr-lg"
                            isChecked={isEnabled}
                            aria-label={t("enabled")}
                            onChange={() => {
                                toggleScim();
                            }}
                        />
                    </FormAccess>
                </FormPanel>
                <FormPanel title={t("scim.modes")} className="kc-scim-template">
                    <FormAccess
                        isHorizontal
                        role="manage-realm"
                        className="pf-v5-u-mt-lg"
                        onSubmit={handleSubmit(save)}
                    >
                        <Switch
                            id="realm-scim-auth-mode-switch"
                            data-testid="realm-scim-auth-mode-switch"
                            name={convertAttributeNameToForm("attributes.scim.authentication.mode")}
                            label={t("scim.modes.keycloak")}
                            labelOff={t("scim.modes.external")}
                            className="pf-v5-u-mr-lg"
                            isDisabled={!isEnabled}
                            defaultChecked={["KEYCLOAK", undefined].includes(realm.attributes?.["scim.authentication.mode"])}
                            aria-label={t("scim.modes.keycloak")}
                            onChange={(_event, value) => {
                                form.setValue(convertAttributeNameToForm("attributes.scim.authentication.mode"), value ? "KEYCLOAK" : "EXTERNAL");
                            }}
                        />
                        <TextControl
                            name={convertAttributeNameToForm("attributes.scim.external.issuer")}
                            label={t("scim.external.issuer")}
                            labelIcon={t("scim.external.issuerHelp")}
                            placeholder={t("scim.external.issuerPlaceholder")}
                            isDisabled={! (isEnabled && watchAuthMode === "EXTERNAL")}
                        />
                        <TextControl
                            name={convertAttributeNameToForm("attributes.scim.external.jwks.uri")}
                            label={t("scim.external.jwks.uri")}
                            labelIcon={t("scim.external.jwks.uriHelp")}
                            placeholder={t("scim.external.jwks.uriPlaceholder")}
                            isDisabled={! (isEnabled && watchAuthMode === "EXTERNAL")}
                        />
                        <TextControl
                            name={convertAttributeNameToForm("attributes.scim.external.audience")}
                            label={t("scim.external.audience")}
                            labelIcon={t("scim.external.audienceHelp")}
                            placeholder={t("scim.external.audiencePlaceholder")}
                            isDisabled={! (isEnabled && watchAuthMode === "EXTERNAL")}
                        />

                        <ActionGroup>
                            <ActionListItem>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    data-testid="scim-tab-save"
                                    isDisabled={! isEnabled}
                                    onClick={saveForm}
                                >
                                    {t("save")}
                                </Button>
                            </ActionListItem>
                            <ActionListItem>
                                <Button
                                    variant="link"
                                    onClick={reset}
                                    data-testid="scim-tab-revert"
                                >
                                    {t("revert")}
                                </Button>
                            </ActionListItem>
                        </ActionGroup>
                    </FormAccess>
                </FormPanel>
            </FormProvider>
        </PageSection>
    );
};
