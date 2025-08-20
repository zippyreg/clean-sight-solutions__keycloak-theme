import { PropsWithChildren } from "react";
import { BrandStyles, Content } from "../";

export const Disclaimer = ({ children }: PropsWithChildren) => (
    <Content
        overrides={{
            color: BrandStyles.LightGrey,
            fontSize: BrandStyles.BaseSize_75xPx,
            lineHeight: BrandStyles.BaseSize1_25xPx
        }}
    >
        {children}
    </Content>
);
