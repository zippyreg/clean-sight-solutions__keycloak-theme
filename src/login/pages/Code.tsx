import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useSetTimeout } from "../../shared/keycloak-ui-shared";
import { useEffect, useState } from "react";

enum CopyState {
    Ready,
    Copied,
    Error
}

function CopyButton({ code }: { code: string }) {
    const setTimeout = useSetTimeout();
    const [copyState, setCopyState] = useState(CopyState.Ready);

    // Reset the message of the copy button after copying to the clipboard.
    useEffect(() => {
        if (copyState !== CopyState.Ready) {
            return setTimeout(() => setCopyState(CopyState.Ready), 1000);
        }
    }, [copyState, setTimeout]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopyState(CopyState.Copied);
        } catch {
            setCopyState(CopyState.Error);
        }
    };

    return (
        <button
            type="button"
            className="pf-c-button pf-m-control"
            aria-label="Copy code to clipboard"
            aria-controls="code"
            onClick={() => copyToClipboard(code)}
        >
            <i className="fa fa-copy" aria-hidden />
        </button>
    );
}

export default function Code(props: PageProps<Extract<KcContext, { pageId: "code.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { code } = kcContext;

    const { msg } = i18n;
    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={code.success ? msg("codeSuccessTitle") : msg("codeErrorTitle", code.error)}
        >
            <div id="kc-code">
                {code.success ? (
                    <div className={kcClsx("kcFormGroupClass")}>
                        <label htmlFor="code" className={kcClsx("kcLabelClass")}>
                            {msg("copyCodeInstruction")}
                        </label>
                        <div className={kcClsx("kcInputGroup")}>
                            <input id="code" className={kcClsx("kcInputClass")} defaultValue={code.code} readOnly />
                            {code.code && <CopyButton code={code.code} />}
                        </div>
                    </div>
                ) : (
                    code.error && (
                        <p
                            id="error"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(code.error)
                            }}
                        />
                    )
                )}
            </div>
        </Template>
    );
}
