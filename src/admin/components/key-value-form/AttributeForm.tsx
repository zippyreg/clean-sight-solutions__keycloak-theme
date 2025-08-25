/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/key-value-form/AttributeForm.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { FormProvider, UseFormReturn } from "react-hook-form";

import { FormAccess } from "../form/FormAccess";
import type { KeyValueType } from "./key-value-convert";
import { KeyValueInput } from "./KeyValueInput";
import { FixedButtonsGroup } from "../form/FixedButtonGroup";

import "./AttributeForm.css";

export type AttributeForm = Omit<RoleRepresentation, "attributes"> & {
    attributes?: KeyValueType[];
};

export type AttributesFormProps = {
    form: UseFormReturn<AttributeForm>;
    save?: (model: AttributeForm) => void;
    reset?: () => void;
    fineGrainedAccess?: boolean;
    name?: string;
    isDisabled?: boolean;
    unregisterFieldsOnUnmount?: boolean;
};

export const AttributesForm = ({
    form,
    reset,
    save,
    fineGrainedAccess,
    name = "attributes",
    label = "attributes",
    isDisabled = false,
    unregisterFieldsOnUnmount = true
}: AttributesFormProps) => {
    const noSaveCancelButtons = !save && !reset;
    const { handleSubmit } = form;

    return (
        <FormAccess
            role="manage-realm"
            onSubmit={save ? handleSubmit(save) : undefined}
            fineGrainedAccess={fineGrainedAccess}
        >
            <FormProvider {...form}>
                <KeyValueInput
                    name={name}
                    label={label}
                    isDisabled={isDisabled}
                    unregisterFieldsOnUnmount={unregisterFieldsOnUnmount}
                />
            </FormProvider>
            {!noSaveCancelButtons && (
                <FixedButtonsGroup name="attributes" reset={reset} isSubmit />
            )}
        </FormAccess>
    );
};
