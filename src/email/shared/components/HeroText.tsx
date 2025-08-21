import { Section } from "jsx-email";
import { CSSProperties, PropsWithChildren } from "react";
import { BaseStyles, BrandStyles, getStyles, Greeting } from "../";

export type HeroTextAlign = "left" | "right" | "center";

export const HeroText = ({
    children,
    borders,
    align = "left"
}: PropsWithChildren<{
    borders?: boolean;
    align?: HeroTextAlign;
}>) => (
    <Section style={borders ? getStyles(BaseStyles.HeroBorder) : ({} as CSSProperties)}>
        <Greeting
            overrides={{
                color: BrandStyles.DarkGrey,
                fontSize: BrandStyles.BaseSize2xPx,
                lineHeight: BrandStyles.BaseSize2_5xPx,
                letterSpacing: `-${BrandStyles.OnePx}`,
                padding: borders
                    ? BrandStyles.HeroTextBordersPadding
                    : BrandStyles.HeroTextPadding,
                margin: BrandStyles.NoSpace,
                textAlign: align
            }}
        >
            {children}
        </Greeting>
    </Section>
);
