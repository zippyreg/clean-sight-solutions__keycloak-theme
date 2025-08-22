/* eslint-disable react-refresh/only-export-components */
import { Container, render } from "jsx-email";
import {
    Content,
    Disclaimer,
    EmailLayout,
    Greeting,
    HeroText,
    PrimaryButton,
    labeledSubject
} from "../shared";
import * as Fm from "keycloakify-emails/jsx-email";
import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

export const previewProps: TemplateProps = {
    locale: "en",
    themeName: "clean-sight-solutions"
};

export const templateName = "Org Invite";

const { exp, v } = createVariablesHelper("org-invite.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout
        preview={`Join the ${exp("organization.name")} organization.`}
        locale={locale}
    >
        <Container>
            <HeroText>You&apos;re invited.</HeroText>

            <Greeting>
                <Fm.If condition={`${v("firstName")}?? && ${v("lastName")}??`}>
                    <Fm.Then>
                        Hi, {exp("firstName")} {exp("lastName")}
                    </Fm.Then>
                    <Fm.ElseIf condition={`${v("firstName")}??`}>
                        Hi, {exp("firstName")}
                    </Fm.ElseIf>
                    <Fm.Else>Hi</Fm.Else>
                </Fm.If>
            </Greeting>
            <Content>
                You have been invited to join the {exp("organization.name")} organization.
                Click the link below to finish creating your account.{" "}
            </Content>
            <PrimaryButton align="center" href={exp("link")} target="_blank">
                Join {exp("organization.name")}
            </PrimaryButton>
            <Content>
                This link will expire in {exp("linkExpirationFormatter(linkExpiration)")}.
            </Content>
            <Disclaimer>
                If you don&apos;t want to join the organization, or this email was sent in
                error, feel free to ignore this message. If you can&apos;t click the link,
                copy and paste the following URL into your browser:{" "}
                <a href={exp("link")} target="_blank" rel="noreferrer">
                    {exp("link")}
                </a>
            </Disclaimer>
        </Container>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject(
        `Invitation to join the ${exp("organization.name")} organization`
    );
};
