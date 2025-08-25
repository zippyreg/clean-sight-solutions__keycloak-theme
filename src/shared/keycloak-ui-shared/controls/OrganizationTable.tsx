/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260200.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/OrganizationTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import OrganizationRepresentation from "@keycloak/keycloak-admin-client/lib/defs/organizationRepresentation";
import { Flex, Label, LabelGroup } from "../../@patternfly/react-core";
import { TableText } from "../../@patternfly/react-table";
import { FunctionComponent, PropsWithChildren, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { KeycloakDataTable, LoaderFunction } from "./table/KeycloakDataTable";
import { DisabledLabel } from "../../../admin/components/label/DisabledLabel";

type OrgDetailLinkProps = {
    link: FunctionComponent<
        PropsWithChildren<{ organization: OrganizationRepresentation }>
    >;
    organization: OrganizationRepresentation;
};

const OrgDetailLink = ({ link, organization }: OrgDetailLinkProps) => {
    const Component = link;
    return (
        <TableText wrapModifier="truncate">
            <Flex gap={{ default: "gapSm" }} flexWrap={{ default: "nowrap" }}>
                <Component organization={organization}>{organization.name}</Component>

                {!organization.enabled && (
                    <DisabledLabel isCompact key={`${organization.id}-disabled`} />
                )}
            </Flex>
        </TableText>
    );
};

const Domains = (org: OrganizationRepresentation) => {
    const { t } = useTranslation();
    return (
        <LabelGroup
            isCompact
            numLabels={2}
            expandedText={t("hide")}
            collapsedText={t("showRemaining")}
        >
            {org.domains?.map(dn => {
                const name = typeof dn === "string" ? dn : dn.name;
                return (
                    <Label key={name} isCompact>
                        {name}
                    </Label>
                );
            })}
        </LabelGroup>
    );
};

export type OrganizationTableProps = PropsWithChildren & {
    loader: LoaderFunction<OrganizationRepresentation> | OrganizationRepresentation[];
    link: FunctionComponent<
        PropsWithChildren<{ organization: OrganizationRepresentation }>
    >;
    toolbarItem?: ReactNode;
    isPaginated?: boolean;
    isSearching?: boolean;
    searchPlaceholderKey?: string;
    onSelect?: (orgs: OrganizationRepresentation[]) => void;
    onDelete?: (org: OrganizationRepresentation) => void;
    deleteLabel?: string;
};

export const OrganizationTable = ({
    loader,
    toolbarItem,
    isPaginated = false,
    isSearching = false,
    searchPlaceholderKey,
    onSelect,
    onDelete,
    deleteLabel = "delete",
    link,
    children
}: OrganizationTableProps) => {
    const { t } = useTranslation();

    return (
        <KeycloakDataTable
            loader={loader}
            isPaginated={isPaginated}
            isSearching={isSearching}
            ariaLabelKey="organizationList"
            searchPlaceholderKey={searchPlaceholderKey}
            toolbarItem={toolbarItem}
            onSelect={onSelect}
            canSelectAll={onSelect !== undefined}
            actions={
                onDelete
                    ? [
                          {
                              title: t(deleteLabel),
                              onRowClick: onDelete
                          }
                      ]
                    : undefined
            }
            columns={[
                {
                    name: "name",
                    displayKey: "name",
                    cellRenderer: row => <OrgDetailLink link={link} organization={row} />
                },
                {
                    name: "domains",
                    displayKey: "domains",
                    cellRenderer: Domains
                },
                {
                    name: "description",
                    displayKey: "description"
                },
                {
                    name: "membershipType",
                    displayKey: "membershipType"
                }
            ]}
            emptyState={children}
        />
    );
};
