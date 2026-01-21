/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/realm-settings/event-config/EventsTypeTable.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { 
    Action,
    KeycloakDataTable,
    ListEmptyState 
} from "../../../shared/keycloak-ui-shared";
import { Button, ToolbarItem } from "../../../shared/@patternfly/react-core";
import { AsleepIcon, PlusIcon, TrashIcon } from "../../../shared/@patternfly/react-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
    onDeleteAll?: (value: EventType[]) => void;
};

export function EventsTypeTable({
    ariaLabelKey = "userEventsRegistered",
    eventTypes,
    addTypes,
    onSelect,
    onDelete,
    onDeleteAll,
}: EventsTypeTableProps) {
    const { t } = useTranslation();
    const [selectedTypes, setSelectedTypes] = useState<EventType[]>([]);

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
            onSelect={onSelect ? onSelect : setSelectedTypes}
            canSelectAll
            toolbarItem={
                <>
                    {addTypes && (
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
                    )}
                    {onDeleteAll && (
                        <ToolbarItem>
                            <Button
                                onClick={() => onDeleteAll(selectedTypes)}
                                data-testid="removeAll"
                                variant="secondary"
                                isDisabled={selectedTypes.length === 0}
                                icon={<TrashIcon />}
                            >
                                {t("remove")}
                            </Button>
                        </ToolbarItem>
                )}
                </>
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
