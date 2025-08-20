import { CSSProperties, PropsWithChildren } from "react";
import { Text } from "jsx-email";
import { BaseStyles, getStyles } from "../";

export const Content = ({
    children,
    styles = {},
    overrides = {}
}: PropsWithChildren<{
    overrides?: CSSProperties;
    styles?: CSSProperties;
}>) => <Text style={getStyles(BaseStyles.Content, styles, overrides)}>{children}</Text>;
