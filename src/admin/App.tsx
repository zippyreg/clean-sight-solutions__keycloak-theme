/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/App.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import "./app.custom.css";

import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import {
    mainPageContentId,
    useColorMode,
    useEnvironment
} from "../shared/keycloak-ui-shared";
import {
    Flex,
    FlexItem,
    Page,
    PageSection,
    TextContent,
    Text
} from "../shared/@patternfly/react-core";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
    ErrorBoundaryFallback,
    ErrorBoundaryProvider,
    KeycloakSpinner,
    BrandWordmark
} from "../shared/keycloak-ui-shared";
import { Header } from "./PageHeader";
import { PageNav } from "./PageNav";
import { AdminClientContext, initAdminClient } from "./admin-client";
import { PageBreadCrumbs } from "./components/bread-crumb/PageBreadCrumbs";
import { ErrorRenderer } from "./components/error/ErrorRenderer";
import { RecentRealmsProvider } from "./context/RecentRealms";
import { AccessContextProvider } from "./context/access/Access";
import { RealmContextProvider } from "./context/realm-context/RealmContext";
import { ServerInfoProvider } from "./context/server-info/ServerInfoProvider";
import { WhoAmIContextProvider } from "./context/whoami/WhoAmI";
import type { Environment } from "./environment";
import { SubGroups } from "./groups/SubGroupsContext";
import { AuthWall } from "./root/AuthWall";
import { Banners } from "./Banners";

export const AppContexts = ({ children }: PropsWithChildren) => (
    <ErrorBoundaryProvider>
        <ServerInfoProvider>
            <RealmContextProvider>
                <WhoAmIContextProvider>
                    <RecentRealmsProvider>
                        <AccessContextProvider>
                            <SubGroups>{children}</SubGroups>
                        </AccessContextProvider>
                    </RecentRealmsProvider>
                </WhoAmIContextProvider>
            </RealmContextProvider>
        </ServerInfoProvider>
    </ErrorBoundaryProvider>
);

const LiveCopyrightDate = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

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
                        <BrandWordmark size="xs" variant={isDark ? "white" : "default"} />
                    </FlexItem>
                </Flex>
            </Text>
        </TextContent>
    );
};

export const App = () => {
    const { keycloak, environment } = useEnvironment<Environment>();
    const [adminClient, setAdminClient] = useState<KeycloakAdminClient>();

    useEffect(() => {
        const init = async () => {
            const client = await initAdminClient(keycloak, environment);
            setAdminClient(client);
        };
        init().catch(console.error);
    }, []);

    if (!adminClient) return <KeycloakSpinner />;
    return (
        <AdminClientContext.Provider value={{ keycloak, adminClient }}>
            <AppContexts>
                <Flex
                    direction={{ default: "column" }}
                    flexWrap={{ default: "nowrap" }}
                    spaceItems={{ default: "spaceItemsNone" }}
                    style={{ minHeight: "100vh" }}
                >
                    <FlexItem>
                        <Banners />
                    </FlexItem>
                    <FlexItem grow={{ default: "grow" }} style={{ minHeight: 0 }}>
                        <Page
                            header={<Header />}
                            isManagedSidebar
                            sidebar={<PageNav />}
                            mainContainerId={mainPageContentId}
                        >
                            <ErrorBoundaryFallback fallback={ErrorRenderer}>
                                <Suspense fallback={<KeycloakSpinner />}>
                                    <AuthWall>
                                        <Outlet />
                                        <PageSection className="pf-v5-u-display-flex">
                                            <Flex
                                                alignItems={{
                                                    default: "alignItemsFlexEnd"
                                                }}
                                                justifyContent={{
                                                    default: "justifyContentCenter"
                                                }}
                                                style={{ width: "100%" }}
                                            >
                                                <LiveCopyrightDate />
                                            </Flex>
                                        </PageSection>
                                    </AuthWall>
                                </Suspense>
                            </ErrorBoundaryFallback>
                        </Page>
                    </FlexItem>
                </Flex>
            </AppContexts>
        </AdminClientContext.Provider>
    );
};
