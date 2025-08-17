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
import {
    Flex,
    PageSection,
    Text,
    TextContent,
    Title
} from "../../../shared/@patternfly/react-core";
import { PropsWithChildren, useState, useEffect } from "react";

type PageProps = {
    title: string;
    description: string;
};

const LiveCopyrightDate = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

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
                Copyright &copy; {currentDate.getFullYear()}{" "}
                <strong>Clean Sight Solutions</strong>
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
