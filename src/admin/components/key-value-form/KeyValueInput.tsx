/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/key-value-form/KeyValueInput.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
    ActionList,
    ActionListItem,
    Button,
    EmptyState,
    Grid,
    GridItem,
    HelperText,
    HelperTextItem,
    TextInput
} from "../../../shared/@patternfly/react-core";
import {
    ListIcon,
    PlusCircleIcon,
    PlusIcon,
    TimesIcon
} from "../../../shared/@patternfly/react-icons";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { Fragment, FunctionComponent, PropsWithChildren } from "react";
import { FieldValues, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type DefaultValue = {
    key: string;
    values?: string[];
    label: string;
};

type Field = {
  name: string;
};

type ValueField = Field & {
  keyValue: string;
};

type KeyValueInputProps = {
    name: string;
    label?: string;
    isDisabled?: boolean;
    KeyComponent?: FunctionComponent<Field>;
    ValueComponent?: FunctionComponent<ValueField>;
};

export const KeyValueInput = ({
    name,
    label = "attributes",
    isDisabled = false,
    KeyComponent,
    ValueComponent,
}: KeyValueInputProps) => {
    const { t } = useTranslation();
    const {
        control,
        register,
        formState: { errors }
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name
    });

    const appendNew = () => append({ key: "", value: "" });

    const values = useWatch<FieldValues>({
        name,
        control,
        defaultValue: []
    });

    return fields.length > 0 ? (
        <>
            <Grid hasGutter>
                <GridItem className="pf-v5-c-form__label" span={5}>
                    <span className="pf-v5-c-form__label-text">{t("key")}</span>
                </GridItem>
                <GridItem className="pf-v5-c-form__label" span={7}>
                    <span className="pf-v5-c-form__label-text">{t("value")}</span>
                </GridItem>
                {fields.map((attribute, index) => {
                    const error = (errors as any)[name]?.[index];
                    const keyError = !!error?.key;
                    const valueErrorPresent = !!error?.value || !!error?.message;
                    const valueError = error?.message || t("valueError");
                    return (
                        <Fragment key={attribute.id}>
                            <GridItem span={5}>
                                {KeyComponent ? (
                                    <KeyComponent name={`${name}.${index}.key`} />
                                ) : (
                                    <TextInput
                                        placeholder={t("keyPlaceholder")}
                                        aria-label={t("key")}
                                        data-testid={`${name}-key`}
                                        {...register(`${name}.${index}.key`, { required: true })}
                                        validated={keyError ? "error" : "default"}
                                        isRequired
                                        isDisabled={isDisabled}
                                    />
                                )}
                                {keyError && (
                                    <HelperText>
                                        <HelperTextItem variant="error">
                                            {t("keyError")}
                                        </HelperTextItem>
                                    </HelperText>
                                )}
                            </GridItem>
                            <GridItem span={5}>
                                {ValueComponent ? (
                                    <ValueComponent
                                        name={`${name}.${index}.value`}
                                        keyValue={values[index]?.key}
                                    />
                                ) : (
                                    <TextInput
                                        placeholder={t("valuePlaceholder")}
                                        aria-label={t("value")}
                                        data-testid={`${name}-value`}
                                        {...register(`${name}.${index}.value`, { required: true })}
                                        validated={valueErrorPresent ? "error" : "default"}
                                        isRequired
                                        isDisabled={isDisabled}
                                    />
                                )}
                                {valueErrorPresent && (
                                    <HelperText>
                                        <HelperTextItem variant="error">
                                            {valueError}
                                        </HelperTextItem>
                                    </HelperText>
                                )}
                            </GridItem>
                            <GridItem span={2}>
                                <Button
                                    variant="plain"
                                    title={t("removeAttribute")}
                                    onClick={() => remove(index)}
                                    data-testid={`${name}-remove`}
                                    isDisabled={isDisabled}
                                >
                                    <TimesIcon />
                                </Button>
                            </GridItem>
                        </Fragment>
                    );
                })}
            </Grid>
            <ActionList>
                <ActionListItem>
                    <Button
                        data-testid={`${name}-add-row`}
                        className="pf-v5-u-px-0 pf-v5-u-mt-sm"
                        variant="link"
                        icon={<PlusCircleIcon />}
                        onClick={appendNew}
                        isDisabled={isDisabled}
                    >
                        {t("addAttribute", { label })}
                    </Button>
                </ActionListItem>
            </ActionList>
        </>
    ) : (
        <ListEmptyState
            data-testid={`${name}-empty-state`}
            hasIcon
            message={t("noAttributes", { label })}
            instructions={t("missingAttributes", { label })}
            primaryActionText={t("addAttribute", { label })}
            primaryActionIcon={<PlusIcon />}
            onPrimaryAction={appendNew}
            isDisabled={isDisabled}
            icon={ListIcon}
        />
    );
};
