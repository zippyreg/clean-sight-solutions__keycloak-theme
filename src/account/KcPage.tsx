/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260200.1.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/KcPage.tsx" --revert
 */

import { lazy, useEffect } from "react";
import { KcAccountUiLoader } from "@keycloakify/keycloak-account-ui";
import { useColorMode } from "../shared/keycloak-ui-shared/";
import type { KcContext } from "./KcContext";

const KcAccountUi = lazy(() => import("./KcAccountUi"));

const DARK_MODE_CLASS = "pf-v5-theme-dark";

function setDarkTheme(isDark: boolean): void {
    const { classList } = document.documentElement;

    if (isDark) {
        classList.add(DARK_MODE_CLASS);
    } else {
        classList.remove(DARK_MODE_CLASS);
    }
}

function getThemeFromUrl(): string | undefined {
    const url = new URL(window.location.href);

    const value = url.searchParams.get("color-mode");

    if (value === null) {
        // There was no &dark= query param in the URL,
        // so we check session storage next.
        return;
    }

    // Remove &color-mode=<xyz> from the URL (just to keep it clean)
    url.searchParams.delete("color-mode");
    window.history.replaceState({}, "", url.toString());

    // We have a valid color mode from the URL.
    // Persist the value in local storage for use
    // in the next block. If the user navigates,
    // for example, from login.ftl to register.ftl,
    // we won’t lose the state.
    return `${value}`;
}

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const [colorMode, setColorMode, isDark] = useColorMode();

    from_url: {
        const themeFromUrl = getThemeFromUrl();

        if (themeFromUrl === undefined) {
            break from_url;
        }

        setColorMode(themeFromUrl);
    }

    useEffect(() => {
        setDarkTheme(isDark);
    }, [isDark, colorMode]);

    return (
        <KcAccountUiLoader
            enableDarkModeIfPreferred={false}
            kcContext={kcContext}
            KcAccountUi={KcAccountUi}
        />
    );
}
