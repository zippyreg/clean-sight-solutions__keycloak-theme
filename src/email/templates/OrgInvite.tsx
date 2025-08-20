/* eslint-disable react-refresh/only-export-components */
import { Text, render } from "jsx-email";
import { EmailLayout, labeledSubject } from "./common";
import * as Fm from "keycloakify-emails/jsx-email";
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
    themeName: "clean-sight-solutions"
};

export const templateName = "Org Invite";

const { exp, v } = createVariablesHelper("org-invite.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout preview={`Here is a preview`} locale={locale}>
        <Text style={paragraph}>
            <p>
                <Fm.If condition={`${v("firstName")}?? && ${v("lastName")}??`}>
                    <Fm.Then>
                        Hi, {exp("firstName")} {exp("lastName")}.
                    </Fm.Then>
                    <Fm.ElseIf condition={`${v("firstName")}??`}>
                        Hi, {exp("firstName")}.
                    </Fm.ElseIf>
                    <Fm.Else>Hi.</Fm.Else>
                </Fm.If>
            </p>

            <p>
                You were invited to join the {exp("organization.name")} organization.
                Click the link below to join.{" "}
            </p>
            <p>
                <a href={exp("link")}>Link to join the organization</a>
            </p>
            <p>
                This link will expire within{" "}
                {exp("linkExpirationFormatter(linkExpiration)")}.
            </p>
            <p>
                If you don&apos;t want to join the organization, or this email was sent in
                error, feel free to ignore this message.
            </p>
        </Text>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject("Invitation to join the {0} organization");
};
