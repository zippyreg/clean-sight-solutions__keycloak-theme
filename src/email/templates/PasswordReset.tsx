/* eslint-disable react-refresh/only-export-components */
import { Text, render } from "jsx-email";
import { EmailLayout, labeledSubject } from "../shared";
import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

const paragraph = {
    color: "#777",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const
};

export const previewProps: TemplateProps = {
    locale: "en",
    themeName: "vanilla"
};

export const templateName = "Password Reset";

const { exp } = createVariablesHelper("password-reset.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout preview={`Here is a preview`} locale={locale}>
        <Text style={paragraph}>
            <p>
                Someone just requested to change your {exp("realmName")} account&apos;s
                credentials. If this was you, click on the link below to reset them.
            </p>
            <p>
                <a href={exp("link")}>Link to reset credentials</a>
            </p>
            <p>
                This link will expire within{" "}
                {exp("linkExpirationFormatter(linkExpiration)")}.
            </p>
            <p>
                If you don&apos;t want to reset your credentials, just ignore this message
                and nothing will be changed.
            </p>
        </Text>
    </EmailLayout>
);
export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject("Reset your password");
};
