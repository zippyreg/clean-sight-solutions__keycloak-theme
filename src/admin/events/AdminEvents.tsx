/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/events/AdminEvents.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import type AdminEventRepresentation from "@keycloak/keycloak-admin-client/lib/defs/adminEventRepresentation";
import {
    KeycloakDataTable,
    KeycloakSelect,
    ListEmptyState,
    SelectVariant,
    TextControl,
    useFetch
} from "../../shared/keycloak-ui-shared";
import {
    ActionGroup,
    Button,
    Chip,
    ChipGroup,
    DatePicker,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    Icon,
    IconComponentProps,
    SelectOption
} from "../../shared/@patternfly/react-core";
import {
    ArrowCircleUpIcon,
    PlusCircleIcon,
    MinusCircleIcon,
    RunningIcon,
    SyncAltIcon,
    TenantIcon
} from "../../shared/@patternfly/react-icons";
import { cellWidth } from "../../shared/@patternfly/react-table";
import { pickBy } from "lodash-es";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAdminClient } from "../admin-client";
import { EventsBanners } from "../Banners";
import DropdownPanel from "../components/dropdown-panel/DropdownPanel";
import CodeEditor from "../components/form/CodeEditor";
import { useRealm } from "../context/realm-context/RealmContext";
import { toUser } from "../user/routes/User";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { emptyFormatter, prettyPrintJSON } from "../util";
import useFormatDate, { FORMAT_DATE_AND_TIME } from "../utils/useFormatDate";
import { CellResourceLinkRenderer } from "./ResourceLinks";

import "./events.css";

type AdminEventSearchForm = {
    resourceTypes: string[];
    operationTypes: string[];
    resourcePath: string;
    dateFrom: string;
    dateTo: string;
    authClient: string;
    authUser: string;
    authRealm: string;
    authIpAddress: string;
};

const DetailCell = (event: AdminEventRepresentation) => {
    const { t } = useTranslation();
    return (
        <DescriptionList
            isHorizontal
            className="keycloak_eventsection_details pf-v5-u-mb-lg"
        >
            {event.details &&
                Object.entries(event.details).map(([key, value]) => (
                    <DescriptionListGroup key={key}>
                        <DescriptionListTerm>{key}</DescriptionListTerm>
                        <DescriptionListDescription>{value}</DescriptionListDescription>
                    </DescriptionListGroup>
                ))}
            {event.authDetails && (
                <>
                    <DescriptionListGroup key="realmId">
                        <DescriptionListTerm>{t("realm")}</DescriptionListTerm>
                        <DescriptionListDescription>
                            {event.authDetails?.realmId}
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup key="clientId">
                        <DescriptionListTerm>{t("client")}</DescriptionListTerm>
                        <DescriptionListDescription>
                            {event.authDetails?.clientId}
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup key="userId">
                        <DescriptionListTerm>{t("user")}</DescriptionListTerm>
                        <DescriptionListDescription>
                            {event.authDetails?.userId}
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup key="ipAddress">
                        <DescriptionListTerm>{t("ipAddress")}</DescriptionListTerm>
                        <DescriptionListDescription>
                            {event.authDetails?.ipAddress}
                        </DescriptionListDescription>
                    </DescriptionListGroup>
                </>
            )}
            {event.error && (
                <DescriptionListGroup key="error">
                    <DescriptionListTerm>error</DescriptionListTerm>
                    <DescriptionListDescription>{event.error}</DescriptionListDescription>
                </DescriptionListGroup>
            )}
            {event.representation && (
                <DescriptionListGroup key="representation">
                    <DescriptionListTerm>{t("representation")}</DescriptionListTerm>
                    <DescriptionListDescription>
                        <CodeEditor
                            readOnly
                            value={prettyPrintJSON(JSON.parse(event.representation))}
                            height={512}
                            language="json"
                        />
                    </DescriptionListDescription>
                </DescriptionListGroup>
            )}
        </DescriptionList>
    );
};

const UserDetailLink = (event: AdminEventRepresentation) => {
    const { t } = useTranslation();
    const { realm } = useRealm();

    return event.authDetails.userId ? (
        <Link
            key={`link-${event.time}-${event.operationType}-${event.resourcePath}`}
            to={toUser({
                realm,
                id: event.authDetails.userId,
                tab: "settings"
            })}
        >
            {event.authDetails.userId}
        </Link>
    ) : (
        <span>—</span>
    );
};

const operationTypeCellIcon = (event: AdminEventRepresentation) => {
    function injectIcon(
        icon: JSX.Element,
        status?: IconComponentProps["status"] = "success"
    ) {
        return <Icon status={status}>{icon}</Icon>;
    }

    switch (event.operationType) {
        case "CREATE":
            return injectIcon(<PlusCircleIcon />);
        case "UPDATE":
            return injectIcon(<ArrowCircleUpIcon />);
        case "DELETE":
            return injectIcon(<MinusCircleIcon />, "danger");
        case "ACTION":
            return injectIcon(<TenantIcon />, "info");
        default:
            return null;
    }
};

const OperationTypeCell = (event: AdminEventRepresentation) => (
    <Flex gap={{ default: "gapSm" }}>
        {operationTypeCellIcon(event)}
        <span>{event.operationType}</span>
    </Flex>
);

type AdminEventsProps = {
    resourcePath?: string;
};

export const AdminEvents = ({ resourcePath }: AdminEventsProps) => {
    const { adminClient } = useAdminClient();

    const { t } = useTranslation();
    const { realm } = useRealm();
    const serverInfo = useServerInfo();
    const formatDate = useFormatDate();
    const resourceTypes = serverInfo.enums?.["resourceType"];
    const operationTypes = serverInfo.enums?.["operationType"];

    const [key, setKey] = useState(0);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const [selectResourceTypesOpen, setSelectResourceTypesOpen] = useState(false);
    const [selectOperationTypesOpen, setSelectOperationTypesOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState<Partial<AdminEventSearchForm>>({});

    const defaultValues: AdminEventSearchForm = {
        resourceTypes: [],
        operationTypes: [],
        resourcePath: resourcePath ? resourcePath : "",
        dateFrom: "",
        dateTo: "",
        authClient: "",
        authUser: "",
        authRealm: "",
        authIpAddress: ""
    };

    const [adminEventsEnabled, setAdminEventsEnabled] = useState<boolean>();

    const filterLabels: Record<keyof AdminEventSearchForm, string> = {
        resourceTypes: t("resourceTypes"),
        operationTypes: t("operationTypes"),
        resourcePath: t("resourcePath"),
        dateFrom: t("dateFrom"),
        dateTo: t("dateTo"),
        authClient: t("client"),
        authUser: t("userId"),
        authRealm: t("realm"),
        authIpAddress: t("ipAddress")
    };

    const form = useForm<AdminEventSearchForm>({
        mode: "onChange",
        defaultValues
    });
    const {
        getValues,
        reset,
        formState: { isDirty },
        control
    } = form;

    useFetch(
        () => adminClient.realms.getConfigEvents({ realm }),
        events => {
            setAdminEventsEnabled(events?.adminEventsEnabled!);
        },
        []
    );

    function loader(first?: number, max?: number) {
        return adminClient.realms.findAdminEvents({
            resourcePath,
            // The admin client wants 'dateFrom' and 'dateTo' to be Date objects, however it cannot actually handle them so we need to cast to any.
            ...(activeFilters as any),
            realm,
            first,
            max
        });
    }

    function submitSearch() {
        setSearchDropdownOpen(false);
        commitFilters();
    }

    function resetSearch() {
        reset();
        commitFilters();
    }

    function removeFilter(key: keyof AdminEventSearchForm) {
        const formValues: AdminEventSearchForm = { ...getValues() };
        delete formValues[key];

        reset({ ...defaultValues, ...formValues });
        commitFilters();
    }

    function removeFilterValue(key: keyof AdminEventSearchForm, valueToRemove: string) {
        const formValues = getValues();
        const fieldValue = formValues[key];
        const newFieldValue = Array.isArray(fieldValue)
            ? fieldValue.filter(val => val !== valueToRemove)
            : fieldValue;

        reset({ ...formValues, [key]: newFieldValue });
        commitFilters();
    }

    function commitFilters() {
        const newFilters: Partial<AdminEventSearchForm> = pickBy(
            getValues(),
            value => value !== "" || (Array.isArray(value) && value.length > 0)
        );

        if (resourcePath) {
            delete newFilters.resourcePath;
        }

        setActiveFilters(newFilters);
        setKey(key + 1);
    }

    return (
        <>
            {!adminEventsEnabled && <EventsBanners type="adminEvents" />}
            <KeycloakDataTable
                key={key}
                loader={loader}
                detailColumns={[
                    {
                        name: "details",
                        enabled: event =>
                            event.details !== undefined ||
                            event.authDetails !== undefined ||
                            event.representation !== undefined,
                        cellRenderer: DetailCell
                    }
                ]}
                isPaginated
                ariaLabelKey="adminEvents"
                toolbarItem={
                    <FormProvider {...form}>
                        <Flex
                            direction={{ default: "column" }}
                            spaceItems={{ default: "spaceItemsNone" }}
                        >
                            <FlexItem>
                                <DropdownPanel
                                    buttonText={t("searchForAdminEvent")}
                                    setSearchDropdownOpen={setSearchDropdownOpen}
                                    searchDropdownOpen={searchDropdownOpen}
                                    marginRight="2.5rem"
                                    width="225px"
                                >
                                    <Form
                                        isHorizontal
                                        className="keycloak__events_search__form"
                                        data-testid="searchForm"
                                    >
                                        <FormGroup
                                            label={t("resourceTypes")}
                                            fieldId="kc-resourceTypes"
                                            className="keycloak__events_search__form_label"
                                        >
                                            <Controller
                                                name="resourceTypes"
                                                control={control}
                                                render={({ field }) => (
                                                    <KeycloakSelect
                                                        className="keycloak__events_search__type_select"
                                                        data-testid="resource-types-searchField"
                                                        chipGroupProps={{
                                                            numChips: 1,
                                                            expandedText: t("hide"),
                                                            collapsedText:
                                                                t("showRemaining")
                                                        }}
                                                        variant={
                                                            SelectVariant.typeaheadMulti
                                                        }
                                                        typeAheadAriaLabel="Select"
                                                        onToggle={isOpen =>
                                                            setSelectResourceTypesOpen(
                                                                isOpen
                                                            )
                                                        }
                                                        selections={field.value}
                                                        onSelect={selectedValue => {
                                                            const option =
                                                                selectedValue.toString();
                                                            const changedValue =
                                                                field.value.includes(
                                                                    option
                                                                )
                                                                    ? field.value.filter(
                                                                          item =>
                                                                              item !==
                                                                              option
                                                                      )
                                                                    : [
                                                                          ...field.value,
                                                                          option
                                                                      ];

                                                            field.onChange(changedValue);
                                                        }}
                                                        onClear={() => {
                                                            field.onChange([]);
                                                        }}
                                                        isOpen={selectResourceTypesOpen}
                                                        aria-labelledby={"resourceTypes"}
                                                        chipGroupComponent={
                                                            <ChipGroup>
                                                                {field.value.map(chip => (
                                                                    <Chip
                                                                        key={chip}
                                                                        onClick={resource => {
                                                                            resource.stopPropagation();
                                                                            field.onChange(
                                                                                field.value.filter(
                                                                                    val =>
                                                                                        val !==
                                                                                        chip
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        {chip}
                                                                    </Chip>
                                                                ))}
                                                            </ChipGroup>
                                                        }
                                                    >
                                                        {resourceTypes?.map(option => (
                                                            <SelectOption
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </SelectOption>
                                                        ))}
                                                    </KeycloakSelect>
                                                )}
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            label={t("operationTypes")}
                                            fieldId="kc-operationTypes"
                                            className="keycloak__events_search__form_label"
                                        >
                                            <Controller
                                                name="operationTypes"
                                                control={control}
                                                render={({ field }) => (
                                                    <KeycloakSelect
                                                        className="keycloak__events_search__type_select"
                                                        data-testid="operation-types-searchField"
                                                        chipGroupProps={{
                                                            numChips: 1,
                                                            expandedText: t("hide"),
                                                            collapsedText:
                                                                t("showRemaining")
                                                        }}
                                                        variant={
                                                            SelectVariant.typeaheadMulti
                                                        }
                                                        typeAheadAriaLabel="Select"
                                                        onToggle={isOpen =>
                                                            setSelectOperationTypesOpen(
                                                                isOpen
                                                            )
                                                        }
                                                        selections={field.value}
                                                        onSelect={selectedValue => {
                                                            const option =
                                                                selectedValue.toString();
                                                            const changedValue =
                                                                field.value.includes(
                                                                    option
                                                                )
                                                                    ? field.value.filter(
                                                                          item =>
                                                                              item !==
                                                                              option
                                                                      )
                                                                    : [
                                                                          ...field.value,
                                                                          option
                                                                      ];

                                                            field.onChange(changedValue);
                                                        }}
                                                        onClear={() => {
                                                            field.onChange([]);
                                                        }}
                                                        isOpen={selectOperationTypesOpen}
                                                        aria-labelledby={"operationTypes"}
                                                        chipGroupComponent={
                                                            <ChipGroup>
                                                                {field.value.map(chip => (
                                                                    <Chip
                                                                        key={chip}
                                                                        onClick={operation => {
                                                                            operation.stopPropagation();
                                                                            field.onChange(
                                                                                field.value.filter(
                                                                                    val =>
                                                                                        val !==
                                                                                        chip
                                                                                )
                                                                            );
                                                                        }}
                                                                    >
                                                                        {chip}
                                                                    </Chip>
                                                                ))}
                                                            </ChipGroup>
                                                        }
                                                    >
                                                        {operationTypes?.map(option => (
                                                            <SelectOption
                                                                key={option.toString()}
                                                                value={option}
                                                            >
                                                                {option}
                                                            </SelectOption>
                                                        ))}
                                                    </KeycloakSelect>
                                                )}
                                            />
                                        </FormGroup>
                                        {!resourcePath && (
                                            <TextControl
                                                name="resourcePath"
                                                label={t("resourcePath")}
                                            />
                                        )}
                                        <TextControl
                                            name="authRealm"
                                            label={t("realm")}
                                        />
                                        <TextControl
                                            name="authClient"
                                            label={t("client")}
                                        />
                                        <TextControl
                                            name="authUser"
                                            label={t("userId")}
                                        />
                                        <TextControl
                                            name="authIpAddress"
                                            label={t("ipAddress")}
                                        />
                                        <FormGroup
                                            label={t("dateFrom")}
                                            fieldId="kc-dateFrom"
                                            className="keycloak__events_search__form_label"
                                        >
                                            <Controller
                                                name="dateFrom"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        className="pf-v5-u-w-100"
                                                        value={field.value}
                                                        onChange={(_, value) =>
                                                            field.onChange(value)
                                                        }
                                                        inputProps={{ id: "kc-dateFrom" }}
                                                    />
                                                )}
                                            />
                                        </FormGroup>
                                        <FormGroup
                                            label={t("dateTo")}
                                            fieldId="kc-dateTo"
                                            className="keycloak__events_search__form_label"
                                        >
                                            <Controller
                                                name="dateTo"
                                                control={control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        className="pf-v5-u-w-100"
                                                        value={field.value}
                                                        onChange={(_, value) =>
                                                            field.onChange(value)
                                                        }
                                                        inputProps={{ id: "kc-dateTo" }}
                                                    />
                                                )}
                                            />
                                        </FormGroup>
                                        <ActionGroup>
                                            <Button
                                                variant={"primary"}
                                                onClick={submitSearch}
                                                data-testid="search-events-btn"
                                                isDisabled={!isDirty}
                                            >
                                                {t("searchAdminEventsBtn")}
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={resetSearch}
                                                isDisabled={!isDirty}
                                            >
                                                {t("resetBtn")}
                                            </Button>
                                        </ActionGroup>
                                    </Form>
                                </DropdownPanel>
                            </FlexItem>
                            <FlexItem>
                                {Object.entries(activeFilters).length > 0 && (
                                    <div className="keycloak__searchChips pf-v5-u-ml-md">
                                        {Object.entries(activeFilters).map(filter => {
                                            const [key, value] = filter as [
                                                keyof AdminEventSearchForm,
                                                string | string[]
                                            ];

                                            if (
                                                key === "resourcePath" &&
                                                !!resourcePath
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <ChipGroup
                                                    className="pf-v5-u-mt-md pf-v5-u-mr-md"
                                                    key={key}
                                                    categoryName={filterLabels[key]}
                                                    onClick={() => removeFilter(key)}
                                                >
                                                    {typeof value === "string" ? (
                                                        <Chip isReadOnly>{value}</Chip>
                                                    ) : (
                                                        value.map(entry => (
                                                            <Chip
                                                                key={entry}
                                                                onClick={() =>
                                                                    removeFilterValue(
                                                                        key,
                                                                        entry
                                                                    )
                                                                }
                                                            >
                                                                {entry}
                                                            </Chip>
                                                        ))
                                                    )}
                                                </ChipGroup>
                                            );
                                        })}
                                    </div>
                                )}
                            </FlexItem>
                        </Flex>
                    </FormProvider>
                }
                columns={[
                    {
                        name: "time",
                        displayKey: "time",
                        cellRenderer: row =>
                            formatDate(new Date(row.time!), FORMAT_DATE_AND_TIME)
                    },
                    {
                        name: "resourcePath",
                        displayKey: "resourcePath",
                        cellRenderer: CellResourceLinkRenderer
                    },
                    {
                        name: "resourceType",
                        displayKey: "resourceType",
                        cellFormatters: [emptyFormatter()]
                    },
                    {
                        name: "operationType",
                        displayKey: "operationType",
                        transforms: [cellWidth(10)],
                        cellRenderer: OperationTypeCell
                    },
                    {
                        name: "",
                        displayKey: "user",
                        cellRenderer: UserDetailLink
                    }
                ]}
                emptyState={
                    <ListEmptyState
                        message={t("emptyAdminEvents")}
                        instructions={t("emptyAdminEventsInstructions")}
                        primaryActionText={t("refresh")}
                        onPrimaryAction={() => setKey(key + 1)}
                        primaryActionIcon={<SyncAltIcon />}
                        icon={RunningIcon}
                    />
                }
                isSearching={Object.keys(activeFilters).length > 0}
            />
        </>
    );
};
