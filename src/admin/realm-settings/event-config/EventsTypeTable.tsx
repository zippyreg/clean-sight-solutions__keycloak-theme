/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/event-config/EventsTypeTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { Button, ToolbarItem } from "../../../shared/@patternfly/react-core";
import { AsleepIcon, PlusIcon } from "../../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { ListEmptyState } from "../../../shared/keycloak-ui-shared";
import { Action, KeycloakDataTable } from "../../../shared/keycloak-ui-shared";
import { translationFormatter } from "../../utils/translationFormatter";

export type EventType = {
    id: string;
};

type EventsTypeTableProps = {
    ariaLabelKey?: string;
    eventTypes: string[];
    addTypes?: () => void;
    onSelect?: (value: EventType[]) => void;
    onDelete?: (value: EventType) => void;
};

export function EventsTypeTable({
    ariaLabelKey = "userEventsRegistered",
    eventTypes,
    addTypes,
    onSelect,
    onDelete
}: EventsTypeTableProps) {
    const { t } = useTranslation();

    const data = eventTypes.map(type => ({
        id: type,
        name: t(`eventTypes.${type}.name`),
        description: t(`eventTypes.${type}.description`)
    }));
    return (
        <KeycloakDataTable
            ariaLabelKey={ariaLabelKey}
            searchPlaceholderKey="searchEventType"
            loader={data}
            onSelect={onSelect ? onSelect : undefined}
            canSelectAll={!!onSelect}
            toolbarItem={
                addTypes && (
                    <ToolbarItem>
                        <Button 
                            id="addTypes" 
                            onClick={addTypes} 
                            data-testid="addTypes"
                            icon={<PlusIcon />}
                        >
                            {t("addSavedTypes")}
                        </Button>
                    </ToolbarItem>
                )
            }
            actions={
                !onDelete
                    ? []
                    : [
                          {
                              title: t("remove"),
                              onRowClick: onDelete
                          } as Action<EventType>
                      ]
            }
            columns={[
                {
                    name: "name",
                    displayKey: "eventType"
                },
                {
                    name: "description",
                    cellFormatters: [translationFormatter(t)]
                }
            ]}
            emptyState={
                <ListEmptyState
                    hasIcon
                    icon={AsleepIcon}
                    message={t("emptyEvents")}
                    instructions={t("emptyEventsInstructions")}
                />
            }
        />
    );
}
