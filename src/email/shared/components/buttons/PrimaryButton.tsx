import { BrandStyles } from "../../";
import { DefaultButton, DefaultButtonProps } from "./DefaultButton";

export type PrimaryButtonProps = Omit<
    DefaultButtonProps,
    "backgroundColor" | "borderColor"
>;

export const PrimaryButton = (props: PrimaryButtonProps) => (
    <DefaultButton
        {...props}
        backgroundColor={BrandStyles.PrimaryColor as string}
        borderColor={BrandStyles.PrimaryColor as string}
    />
);
