import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";

export default function LoginPageExpired(props: PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                }}
            >
                {url.loginRestartFlowUrl && (
                    <a
                        href={url.loginRestartFlowUrl}
                        tabIndex={2}
                        className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        id="kc-restart-login"
                    >
                        {msg("restartLogin")}
                    </a>
                )}
                {url.loginAction && (
                    <a
                        href={url.loginAction}
                        tabIndex={3}
                        className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                        id="kc-continue-login"
                    >
                        {msg("continueLogin")}
                    </a>
                )}
            </div>
        </Template>
    );
}
