import { PropsWithChildren } from "react";
import { BrandStyles, Greeting } from "../";

export const HeroText = ({ children }: PropsWithChildren) => (
    <Greeting
        overrides={{
            color: BrandStyles.DarkGrey,
            fontSize: BrandStyles.BaseSize2xPx,
            margin: `${BrandStyles.BaseSize2xPx} ${BrandStyles.NoSpace}`,
            letterSpacing: `-${BrandStyles.OnePx}`
        }}
    >
        {children}
    </Greeting>
);
