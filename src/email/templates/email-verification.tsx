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

export const templateName = "Email Verification";

const { exp, v } = createVariablesHelper("email-verification.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout
        preview={`Verify your ${exp("realmName")} email address.`}
        locale={locale}
    >
        <Container>
            <HeroText>Verify your email.</HeroText>

            <Greeting>
                <Fm.If condition={`${v("user.firstName")}?? && ${v("user.lastName")}??`}>
                    <Fm.Then>
                        Hi, {exp("user.firstName")} {exp("user.lastName")}
                    </Fm.Then>
                    <Fm.ElseIf condition={`${v("user.firstName")}??`}>
                        Hi, {exp("user.firstName")}
                    </Fm.ElseIf>
                    <Fm.Else>Hi</Fm.Else>
                </Fm.If>
            </Greeting>
            <Content>
                This email has been added to a new account on {exp("realmName")}. If this
                was you, please click the button below to verify your email address.
            </Content>
            <PrimaryButton align="center" href={exp("link")} target="_blank">
                Verify email
            </PrimaryButton>
            <Content>
                This link will expire in {exp("linkExpirationFormatter(linkExpiration)")}.
            </Content>
            <Disclaimer>
                If this wasn&apos;t you, feel free to ignore this message. If you
                can&apos;t click the link, copy and paste the following URL into your
                browser:{" "}
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
    return labeledSubject("Verify email");
};
