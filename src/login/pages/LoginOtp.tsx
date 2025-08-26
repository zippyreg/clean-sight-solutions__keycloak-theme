import { clsx } from "keycloakify/tools/clsx";
import { createRef, useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import PinField from "../../shared/keycloak-ui-shared/controls/pin-input";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { auth, otpLogin, url, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCredentialIndex, setSelectedCredentialIndex] = useState(-1);
    const [otpCode, setOtpCode] = useState<string>("");
    const submitRef = createRef<HTMLInputElement>();

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogInOtp")}
        >
            <form
                id="kc-otp-login-form"
                className={kcClsx("kcFormClass")}
                action={url.loginAction}
                onSubmit={() => {
                    setIsSubmitting(true);
                    return true;
                }}
                method="post"
            >
                {otpLogin.userOtpCredentials.length > 1 && (
                    <div className={kcClsx("kcFormGroupClass")}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            {otpLogin.userOtpCredentials.map((otpCredential, index) => (
                                <div className="relative-wrapper" key={index}>
                                    <input
                                        id={`kc-otp-credential-${index}`}
                                        className={kcClsx("kcLoginOTPListInputClass")}
                                        type="radio"
                                        name="selectedCredentialId"
                                        value={otpCredential.id}
                                        defaultChecked={otpCredential.id === otpLogin.selectedCredentialId}
                                        onChange={() => setSelectedCredentialIndex(index)}
                                    />
                                    <label
                                        htmlFor={`kc-otp-credential-${index}`}
                                        className={clsx(kcClsx("kcLoginOTPListClass"), selectedCredentialIndex === index ? "pf-m-selected" : null)}
                                        tabIndex={index}
                                    >
                                        <span className={kcClsx("kcLoginOTPListItemHeaderClass")}>
                                            <span className={kcClsx("kcLoginOTPListItemIconBodyClass")}>
                                                <i className={kcClsx("kcLoginOTPListItemIconClass")} aria-hidden="true"></i>
                                            </span>
                                            <span className={kcClsx("kcLoginOTPListItemTitleClass")}>{otpCredential.userLabel}</span>
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {auth !== undefined && auth.showUsername && !auth.showResetCredentials && (
                    <div className="pf-u-mb-xl" id="kc-fallback-otp-instruction">
                        {msg("doLogInOtp")}
                    </div>
                )}

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="otp" className={kcClsx("kcLabelClass")}>
                            <span>{msg("loginOtpOneTime")}</span> <span className="required">*</span>
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <input type="hidden" id="otp" name="otp" autoComplete="off" value={otpCode} />
                        <PinField
                            length={otpLogin.policy.digits}
                            formatAriaLabel={(n, total) => `OTP Code field ${n} of ${total}`}
                            aria-invalid={messagesPerField.existsError("totp")}
                            className={kcClsx("kcInputClass")}
                            autoComplete="off"
                            onChange={value => setOtpCode(value)}
                            autoFocus
                        />

                        {messagesPerField.existsError("totp") && (
                            <span
                                id="input-error-otp-code"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("totp"))
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                            name="login"
                            id="kc-login"
                            type="submit"
                            value={msgStr("doFinishLogIn")}
                            disabled={isSubmitting}
                            ref={submitRef}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
