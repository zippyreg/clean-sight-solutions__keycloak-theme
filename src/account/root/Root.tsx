/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260200.1.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Root.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
    ErrorPage,
    KeycloakSpinner,
    useEnvironment,
    KeycloakContext
} from "../../shared/keycloak-ui-shared";
import { Page } from "../../shared/@patternfly/react-core";
import { Suspense, useState } from "react";
import {
    createBrowserRouter,
    Outlet,
    RouteObject,
    RouterProvider
} from "react-router-dom";
import fetchContentJson from "../content/fetchContent";
import { Environment, environment } from "../environment";
import { usePromise } from "../utils/usePromise";
import { Header } from "./Header";
import { MenuItem, PageNav } from "./PageNav";
import { routes } from "../routes";

function mapRoutes(
    context: KeycloakContext<Environment>,
    content: MenuItem[]
): RouteObject[] {
    return content
        .map(item => {
            if ("children" in item) {
                return mapRoutes(context, item.children);
            }

            // Do not add route disabled via feature flags
            if (item.isVisible && !context.environment.features[item.isVisible]) {
                return null;
            }

            return {
                ...item,
                element:
                    "path" in item
                        ? routes.find(r => r.path === (item.id ?? item.path))?.element
                        : undefined
            };
        })
        .filter(item => !!item)
        .flat();
}

export const Root = () => {
    const context = useEnvironment<Environment>();
    const [content, setContent] = useState<RouteObject[]>();

    usePromise(
        signal => fetchContentJson({ signal, context }),
        content => {
            setContent([
                {
                    path: decodeURIComponent(new URL(environment.baseUrl).pathname),
                    element: (
                        <Page header={<Header />} sidebar={<PageNav />} isManagedSidebar>
                            <Suspense fallback={<KeycloakSpinner />}>
                                <Outlet />
                            </Suspense>
                        </Page>
                    ),
                    errorElement: <ErrorPage />,
                    children: mapRoutes(context, content)
                }
            ]);
        }
    );

    if (!content) {
        return <KeycloakSpinner />;
    }
    return <RouterProvider router={createBrowserRouter(content)} />;
};
