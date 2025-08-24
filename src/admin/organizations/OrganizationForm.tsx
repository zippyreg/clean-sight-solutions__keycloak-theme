/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/organizations/OrganizationForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import {
    FormErrorText,
    HelpItem,
    TextAreaControl,
    TextControl
} from "../../shared/keycloak-ui-shared";
import { FormGroup } from "../../shared/@patternfly/react-core";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AttributeForm } from "../components/key-value-form/AttributeForm";
import { keyValueToArray } from "../components/key-value-form/key-value-convert";
import { MultiLineInput } from "../components/multi-line-input/MultiLineInput";

export type OrganizationFormType = AttributeForm &
    Omit<OrganizationRepresentation, "domains" | "attributes"> & {
        domains?: string[];
    };

export const convertToOrg = (org: OrganizationFormType): OrganizationRepresentation => ({
    ...org,
    domains: org.domains?.map(d => ({ name: d, verified: false })),
    attributes: keyValueToArray(org.attributes)
});

type OrganizationFormProps = {
    readOnly?: boolean;
};

export const OrganizationForm = ({ readOnly = false }: OrganizationFormProps) => {
    const { t } = useTranslation();
    const {
        setValue,
        formState: { errors }
    } = useFormContext();
    const name = useWatch({ name: "name" });

    const convertToSnake = (str?: string): string => {
        if(! str) return "";
        return str
            .replace(/([a-z])([A-Z]+)/g, (m, s1, s2) => s1 + ' ' + s2)
            .replace(
                /([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/, 
                (m, s1, s2, s3) => s1 + s2.toLowerCase() + s3
            )
            .replace(
                /([A-Z]+)([A-Z][a-z])/g, 
                (m, s1, s2) => s1.toLowerCase() + ' ' + s2
            )
            .replace(/\W+/g, " ")
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_')
            .replace(/^_+|_+$/g, '')
    }

    useEffect(() => {
        if (!readOnly) {
            setValue("alias", convertToSnake(name));
        }
    }, [name, readOnly]);

    return (
        <>
            <TextControl
                label={t("name")}
                name="name"
                rules={{ required: t("required") }}
            />
            <TextControl
                label={t("alias")}
                name="alias"
                labelIcon={t("organizationAliasHelp")}
                isDisabled={readOnly}
            />
            <FormGroup
                label={t("domain")}
                fieldId="domain"
                labelIcon={
                    <HelpItem
                        helpText={t("organizationDomainHelp")}
                        fieldLabelId="domain"
                    />
                }
                isRequired
            >
                <MultiLineInput
                    id="domain"
                    name="domains"
                    aria-label={t("domain")}
                    addButtonLabel="addDomain"
                    isRequired
                />
                {errors?.["domains"]?.message && (
                    <FormErrorText message={errors["domains"].message.toString()} />
                )}
            </FormGroup>
            <TextControl
                label={t("redirectUrl")}
                name="redirectUrl"
                labelIcon={t("organizationRedirectUrlHelp")}
            />
            <TextAreaControl name="description" label={t("description")} />
        </>
    );
};
