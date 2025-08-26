/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            /* Custom Entries */
            doRegister: "Register now",
            doLogInOtp: "Enter your Authenticator code",
            doFinishLogIn: "Finish Sign-in",
            emailInstructionEmail:
                "Enter your email address and we will send you instructions on how to create a new password.",

            // Footer
            loginFooterHtml:
                "Copyright &copy; {0} <strong>Clean Sight Solutions</strong>",
            /* End Custom Entries */

            // TOTP configuration translations
            loginTotpScanBarcode: "Scan QR instead",
            loginTotpDocumentTitle: "Authenticator setup for {0}",
            loginTotpTitle: "Authenticator setup",
            loginTotpStep1:
                "Install an Authenticator application on your mobile device. Some supported applications are:",
            loginTotpStep2: "Open your Authenticator application and scan the QR code:",
            loginTotpStep3DeviceName:
                "Give this device a name to organize your OTP devices.",
            loginTotpManualStep2:
                "Open your Authenticator application and enter the key:",
            loginTotpManualStep3:
                "Use the following configuration values if your Authenticator application allows:",

            "loginTotp.totp": "Time-based (TOTP)",
            "loginTotp.hotp": "Counter-based (HOTP)",

            // Update password translations
            loginUpdatePasswordDocumentTitle: "Update password for {0}",

            // Attempted login
            loginAttempted: "Logging in as {0}",
            loginAttemptedHtml: "Logging in as <strong>{0}</strong>",

            // Login error page
            restartLogin: "Restart Login",
            continueLogin: "Continue Login"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
