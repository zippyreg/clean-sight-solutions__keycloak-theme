/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/user/UserAttributes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { PageSection, PageSectionVariants } from "../../shared/@patternfly/react-core";
import { UseFormReturn, useFormContext } from "react-hook-form";

import {
    AttributeForm,
    AttributesForm
} from "../components/key-value-form/AttributeForm";
import { UserFormFields, toUserFormFields } from "./form-state";
import {
    UnmanagedAttributePolicy,
    UserProfileConfig
} from "@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata";

type UserAttributesProps = {
    user: UserRepresentation;
    save: (user: UserFormFields) => void;
    upConfig?: UserProfileConfig;
};

export const UserAttributes = ({ user, save, upConfig }: UserAttributesProps) => {
    const form = useFormContext<UserFormFields>();

    return (
        <PageSection variant={PageSectionVariants.light}>
            <AttributesForm
                form={form as UseFormReturn<AttributeForm>}
                save={save}
                fineGrainedAccess={user.access?.manage}
                reset={() =>
                    form.reset({
                        ...form.getValues(),
                        attributes: toUserFormFields(user).attributes
                    })
                }
                name="unmanagedAttributes"
                label="user"
                isDisabled={
                    UnmanagedAttributePolicy.AdminView ==
                    upConfig?.unmanagedAttributePolicy
                }
            />
        </PageSection>
    );
};
