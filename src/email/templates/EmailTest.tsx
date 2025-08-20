/* eslint-disable react-refresh/only-export-components */
import { render, Text } from "jsx-email";
import { EmailLayout, labeledSubject } from "../shared";
import { createVariablesHelper } from "keycloakify-emails/variables";
import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

const paragraph = {
    color: "#777",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const
};

export const previewProps: TemplateProps = {
    locale: "en",
    themeName: "clean-sight-solutions"
};

export const templateName = "Email Test";

const { exp } = createVariablesHelper("email-test.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout preview={"Here is a preview"} locale={locale}>
        <Text style={paragraph}>This is a test message from {exp("realmName")}</Text>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject("SMTP test message");
};
