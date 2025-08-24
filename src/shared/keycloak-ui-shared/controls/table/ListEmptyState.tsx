/**
 * This file has been claimed for ownership from @keycloakify/keycloak-ui-shared version 260200.0.0.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "shared/keycloak-ui-shared/controls/table/ListEmptyState.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { ComponentClass, MouseEventHandler, ReactNode } from "react";
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody,
    Button,
    ButtonVariant,
    EmptyStateActions,
    EmptyStateHeader,
    EmptyStateFooter
} from "../../../@patternfly/react-core";
import type { SVGIconProps } from "@patternfly/react-icons/dist/js/createIcon";
import { PlusCircleIcon, SearchIcon } from "../../../@patternfly/react-icons";

export type Action = {
    text: string;
    type?: ButtonVariant;
    onClick: MouseEventHandler<HTMLButtonElement>;
    icon?: ComponentClass<SVGIconProps>;
};

export type ListEmptyStateProps = {
    message: string;
    instructions: ReactNode;
    primaryActionText?: string;
    onPrimaryAction?: MouseEventHandler<HTMLButtonElement>;
    hasIcon?: boolean;
    icon?: ComponentClass<SVGIconProps>;
    primaryActionIcon?: ComponentClass<SVGIconProps>;
    isSearchVariant?: boolean;
    secondaryActions?: Action[];
    isDisabled?: boolean;
};

export const ListEmptyState = ({
    message,
    instructions,
    onPrimaryAction,
    hasIcon = true,
    isSearchVariant,
    primaryActionText,
    secondaryActions,
    icon,
    primaryActionIcon,
    isDisabled = false
}: ListEmptyStateProps) => {
    return (
        <EmptyState data-testid="empty-state" variant="lg">
            {hasIcon && isSearchVariant ? (
                <EmptyStateIcon icon={SearchIcon} />
            ) : (
                hasIcon && <EmptyStateIcon icon={icon ? icon : PlusCircleIcon} />
            )}
            <EmptyStateHeader titleText={message} headingLevel="h1" />
            <EmptyStateBody>{instructions}</EmptyStateBody>
            <EmptyStateFooter>
                {primaryActionText && (
                    <Button
                        data-testid={`${message
                            .replace(/\W+/g, "-")
                            .toLowerCase()}-empty-action`}
                        icon={primaryActionIcon}
                        variant="primary"
                        onClick={onPrimaryAction}
                        isDisabled={isDisabled}
                    >
                        {primaryActionText}
                    </Button>
                )}
                {secondaryActions && (
                    <EmptyStateActions>
                        {secondaryActions.map(action => (
                            <Button
                                key={action.text}
                                data-testid={`${action.text
                                    .replace(/\W+/g, "-")
                                    .toLowerCase()}-empty-action`}
                                variant={action.type || ButtonVariant.secondary}
                                onClick={action.onClick}
                                isDisabled={isDisabled}
                                icon={action?.icon}
                            >
                                {action.text}
                            </Button>
                        ))}
                    </EmptyStateActions>
                )}
            </EmptyStateFooter>
        </EmptyState>
    );
};
