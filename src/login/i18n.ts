/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            loginFooterHtml:
                "Copyright &copy; {0} <strong>Clean Sight Solutions</strong>",

            // TOTP configuration translations
            loginTotpScanBarcode: "Scan QR instead",
            loginTotpDocumentTitle: "Authenticator setup for {0}",
            loginTotpTitle: "Authenticator setup",
            loginTotpStep1:
                "Install one of the following Authenticator applications on your mobile device:",
            loginTotpStep2: "Open your Authenticator application and scan the QR code:",
            loginTotpStep3DeviceName:
                "Give this device a name to organize your OTP devices.",
            loginTotpManualStep2:
                "Open your Authenticator application and enter the key:",
            loginTotpManualStep3:
                "Use the following configuration values if your Authenticator application allows:",

            // Update password translations
            loginUpdatePasswordDocumentTitle: "Update password for {0}",

            // Attempted login
            loginAttempted: "Logging in as {0}",
            loginAttemptedHtml: "Logging in as <strong>{0}</strong>",
            
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
