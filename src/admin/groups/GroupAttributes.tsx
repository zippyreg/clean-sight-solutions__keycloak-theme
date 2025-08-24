/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/groups/GroupAttributes.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useAlerts, useFetch } from "../../shared/keycloak-ui-shared";
import {
    AlertVariant,
    PageSection,
    PageSectionVariants
} from "../../shared/@patternfly/react-core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import {
    AttributeForm,
    AttributesForm
} from "../components/key-value-form/AttributeForm";
import { arrayToKeyValue } from "../components/key-value-form/key-value-convert";
import { convertFormValuesToObject } from "../util";
import { getLastId } from "./groupIdUtils";

export const GroupAttributes = () => {
    const { adminClient } = useAdminClient();

    const { t } = useTranslation();
    const { addAlert, addError } = useAlerts();
    const form = useForm<AttributeForm>({
        mode: "onChange"
    });

    const location = useLocation();
    const id = getLastId(location.pathname)!;
    const [currentGroup, setCurrentGroup] = useState<GroupRepresentation>();

    useFetch(
        () => adminClient.groups.findOne({ id }),
        group => {
            form.reset({
                attributes: arrayToKeyValue(group?.attributes!)
            });
            setCurrentGroup(group);
        },
        [id]
    );

    const save = async (attributeForm: AttributeForm) => {
        try {
            const attributes = convertFormValuesToObject(attributeForm).attributes;
            await adminClient.groups.update({ id: id! }, { ...currentGroup, attributes });

            setCurrentGroup({ ...currentGroup, attributes });
            addAlert(t("groupUpdated"), AlertVariant.success);
        } catch (error) {
            addError("groupUpdateError", error);
        }
    };

    return (
        <PageSection variant={PageSectionVariants.light}>
            <AttributesForm
                label="group"
                form={form}
                save={save}
                fineGrainedAccess={currentGroup?.access?.manage}
                reset={() =>
                    form.reset({
                        attributes: arrayToKeyValue(currentGroup?.attributes!)
                    })
                }
            />
        </PageSection>
    );
};
