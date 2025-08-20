import { Button, Section, ButtonProps } from "jsx-email";
import { BrandStyles, BaseStyles, getStyles } from "../../";
import { CSSProperties } from "react";

export type DefaultButtonProps = Omit<
    ButtonProps,
    "borderRadius" | "borderSize" | "width" | "height"
> & {
    width?: number;
    height?: number;
    styles?: CSSProperties;
};

export const DefaultButton = (props: DefaultButtonProps) => {
    const {
        height,
        width,
        backgroundColor,
        textColor,
        fontSize,
        styles,
        ...buttonProps
    } = props;
    return (
        <Section style={getStyles(BaseStyles.Button, styles)}>
            <Button
                {...buttonProps}
                borderRadius={BrandStyles.BorderRadius as number}
                borderSize={BrandStyles.BorderWidth as number}
                height={height ? height : 40}
                width={width ? width : 300}
                backgroundColor={
                    backgroundColor
                        ? backgroundColor
                        : (BrandStyles.BackgroundColor as string)
                }
                textColor={textColor ? textColor : (BrandStyles.ButtonColor as string)}
                fontSize={fontSize ? fontSize : (BrandStyles.FontSize as number)}
            />
        </Section>
    );
};
