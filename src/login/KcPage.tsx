import "./login.custom.css";

import { Suspense, lazy, useEffect } from "react";
import type { ClassKey } from "keycloakify/login";
import { useColorMode, LOCAL_STORAGE_KEY } from "../shared/keycloak-ui-shared/";
import type { KcContext } from "./KcContext";
import { useI18n } from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "./Template";
const UserProfileFormFields = lazy(() => import("./UserProfileFormFields"));

// Custom pages
const Code = lazy(() => import("./pages/Code"));
const DeleteAccountConfirm = lazy(() => import("./pages/DeleteAccountConfirm"));
const LoginConfigTotp = lazy(() => import("./pages/LoginConfigTotp"));
const LoginOtp = lazy(() => import("./pages/LoginOtp"));
const LoginPageExpired = lazy(() => import("./pages/LoginPageExpired"));
const LoginPassword = lazy(() => import("./pages/LoginPassword"));
const LoginResetPassword = lazy(() => import("./pages/LoginResetPassword"));
const LoginUpdatePassword = lazy(() => import("./pages/LoginUpdatePassword"));
const LoginUsername = lazy(() => import("./pages/LoginUsername"));
const Register = lazy(() => import("./pages/Register"));
const Terms = lazy(() => import("./pages/Terms"));
const WebauthnAuthenticate = lazy(() => import("./pages/WebauthnAuthenticate"));

const DARK_MODE_CLASS = "pf-theme-dark";

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

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const { kcContext } = props;

    const { i18n } = useI18n({ kcContext });

    const [isDark, colorMode, setColorMode] = useColorMode(
        "dark",
        `${LOCAL_STORAGE_KEY}__login`
    );

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
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {
                    case "code.ftl":
                        return (
                            <Code
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "delete-account-confirm.ftl":
                        return (
                            <DeleteAccountConfirm
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-config-totp.ftl":
                        return (
                            <LoginConfigTotp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-otp.ftl":
                        return (
                            <LoginOtp
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-page-expired.ftl":
                        return (
                            <LoginPageExpired
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-password.ftl":
                        return (
                            <LoginPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-reset-password.ftl":
                        return (
                            <LoginResetPassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-update-password.ftl":
                        return (
                            <LoginUpdatePassword
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "login-username.ftl":
                        return (
                            <LoginUsername
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "register.ftl":
                        return (
                            <Register
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                    case "terms.ftl":
                        return (
                            <Terms
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    case "webauthn-authenticate.ftl":
                        return (
                            <WebauthnAuthenticate
                                {...{ kcContext, i18n, classes }}
                                Template={Template}
                                doUseDefaultCss={true}
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss={true}
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
