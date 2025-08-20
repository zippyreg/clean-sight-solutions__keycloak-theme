import { clsx } from "keycloakify/tools/clsx";
import { Flex, FlexItem } from "../../@patternfly/react-core";

import "./Brand.css";

export type BrandSize = "default" | "sm" | "lg" | "xl" | undefined;
export type BrandVariant = "default" | "white" | "blue" | undefined;

export type BrandProps = {
    variant: BrandVariant;
    size: BrandSize;
};

const getClassNames = ({ variant, size }: BrandProps) => {
    return clsx(
        "brand",
        variant ? `brand__${variant}` : null,
        size ? `brand__${size}` : null
    );
};

export const BrandWordmark = (props: BrandProps) => (
    <Flex gap={{ default: "gapNone" }} className={getClassNames(props)}>
        <FlexItem>CleanSight</FlexItem>
        <FlexItem>Solutions</FlexItem>
    </Flex>
);

export const BrandLettermark = (props: BrandProps) => (
    <Flex gap={{ default: "gapNone" }} className={getClassNames(props)}>
        <FlexItem>CS</FlexItem>
        <FlexItem>S</FlexItem>
    </Flex>
);
