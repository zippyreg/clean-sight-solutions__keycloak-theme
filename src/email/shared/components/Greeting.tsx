import { CSSProperties, PropsWithChildren } from "react";
import { BrandStyles, Content } from "../";

export const Greeting = ({
    children,
    styles = {},
    overrides = {}
}: PropsWithChildren<{
    overrides?: CSSProperties;
    styles?: CSSProperties;
}>) => (
    <Content
        styles={{
            ...styles,
            fontWeight: BrandStyles.FontWeightBold
        }}
        overrides={{
            color: BrandStyles.MediumGrey,
            ...overrides
        }}
    >
        {children}
    </Content>
);
