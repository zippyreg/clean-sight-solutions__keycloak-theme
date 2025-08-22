/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/keycloak-card/ClickableCard.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { KeyboardEvent, useId } from "react";
import { Card, CardHeader, CardProps } from "../../../shared/@patternfly/react-core";

type ClickableCardProps = Omit<CardProps, "onClick"> & {
    onClick: () => void;
};

export const ClickableCard = ({ onClick, children, ...rest }: ClickableCardProps) => {
    const id = useId();
    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
            onClick();
        }
    };
    return (
        <Card
            id={id}
            isClickable
            isRounded
            onKeyDown={onKeyDown}
            onClick={onClick}
            {...rest}
        >
            <CardHeader
                selectableActions={{
                    onClickAction: onClick,
                    selectableActionId: `input-${id}`,
                    selectableActionAriaLabelledby: id
                }}
            >
                {children}
            </CardHeader>
        </Card>
    );
};
