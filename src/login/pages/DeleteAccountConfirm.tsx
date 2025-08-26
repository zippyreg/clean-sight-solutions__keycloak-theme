import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function DeleteAccountConfirm(props: PageProps<Extract<KcContext, { pageId: "delete-account-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, triggered_from_aia } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("deleteAccountConfirm")}>
            <form action={url.loginAction} className="form-vertical" method="post">
                <div className="alert-error kcAlertClass pf-c-alert pf-m-inline pf-m-danger" style={{ marginTop: "0", marginBottom: "30px" }}>
                    <div className="pf-c-alert__icon">
                        <span className="fa fa-fw fa-exclamation-circle"></span>
                    </div>
                    <span className="kcAlertTitleClass pf-c-alert__title">{msg("irreversibleAction")}</span>
                </div>
                <p>{msg("deletingImplies")}</p>
                <ul
                    style={{
                        color: "#72767b",
                        listStyle: "disc",
                        listStylePosition: "inside"
                    }}
                >
                    <li>{msg("loggingOutImmediately")}</li>
                    <li>{msg("errasingData")}</li>
                </ul>
                <p className="delete-account-text">{msg("finalDeletionConfirmation")}</p>
                <div id="kc-form-buttons">
                    <input
                        className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonLargeClass")}
                        type="submit"
                        value={msgStr("doConfirmDelete")}
                    />
                    {triggered_from_aia && (
                        <button
                            className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                            style={{ marginLeft: "calc(100% - 220px)" }}
                            type="submit"
                            name="cancel-aia"
                            value="true"
                        >
                            {msgStr("doCancel")}
                        </button>
                    )}
                </div>
            </form>
        </Template>
    );
}
