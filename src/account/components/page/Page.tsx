/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260200.1.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/page/Page.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import "./page.custom.css";

import { clsx } from "keycloakify/tools/clsx";
import { BrandWordmark, useColorMode } from "../../../shared/keycloak-ui-shared";
import {
    Flex,
    FlexItem,
    PageSection,
    Text,
    TextContent,
    Title
} from "../../../shared/@patternfly/react-core";
import { PropsWithChildren, useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";

type PageProps = {
    title: string;
    description: string;
};

const LiveCopyrightDate = () => {
    const [currentDate, setCurrentDate] = useDebounceValue(new Date(), 900000);
    const [isDark] = useColorMode();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date()); // Update the current date every minute
        }, 1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <TextContent>
            <Text component="small" className="pf-v5-u-color-100">
                <Flex
                    gap={{ default: "gapXs" }}
                    alignItems={{ default: "alignItemsCenter" }}
                >
                    <FlexItem>Copyright &copy; {currentDate.getFullYear()} </FlexItem>
                    <FlexItem>
                        <BrandWordmark size="xs" />
                    </FlexItem>
                </Flex>
            </Text>
        </TextContent>
    );
};

export const Page = ({ title, description, children }: PropsWithChildren<PageProps>) => {
    return (
        <>
            <PageSection variant="light">
                <TextContent>
                    <Title headingLevel="h1" data-testid="page-heading">
                        {title}
                    </Title>
                    <Text component="p">{description}</Text>
                </TextContent>
            </PageSection>
            <PageSection variant="light">{children}</PageSection>
            <PageSection className="pf-v5-u-display-flex">
                <Flex
                    alignItems={{ default: "alignItemsFlexEnd" }}
                    justifyContent={{ default: "justifyContentCenter" }}
                    style={{ width: "100%" }}
                >
                    <LiveCopyrightDate />
                </Flex>
            </PageSection>
        </>
    );
};
