/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/components/form/CodeEditor.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import { useColorMode } from "../../../shared/keycloak-ui-shared";

import CodeEditorComponent from "@uiw/react-textarea-code-editor";

type CodeEditorProps = {
    id?: string;
    "aria-label"?: string;
    "data-testid"?: string;
    value?: string;
    onChange?: (value: string) => void;
    language?: string;
    readOnly?: boolean;
    /* The height of the editor in pixels */
    height?: number;
};

const CodeEditor = ({ onChange, height = 128, ...rest }: CodeEditorProps) => {
    const [isDark] = useColorMode();

    return (
        <div style={{ height: `${height}px`, overflow: "auto" }}>
            <CodeEditorComponent
                padding={15}
                minHeight={height}
                style={{
                    fontFamily: "var(--pf-global--FontFamily--monospace)"
                }}
                onChange={event => onChange?.(event.target.value)}
                data-color-mode={isDark ? "dark" : "light"}
                {...rest}
            />
        </div>
    );
};

export default CodeEditor;
