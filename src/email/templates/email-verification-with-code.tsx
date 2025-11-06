/* eslint-disable react-refresh/only-export-components */
import { Container, render } from "jsx-email";
import {
    BrandStyles,
    Content,
    Disclaimer,
    EmailLayout,
    Greeting,
    HeroText,
    labeledSubject
} from "../shared";
import * as Fm from "keycloakify-emails/jsx-email";
import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

export type EmailVerificationWithCode = {
    emailId: "email-verification-with-code.ftl";
    vars:
        | "code"
        | "realmName"
        | "linkExpiration"
        | "linkExpirationFormatter(linkExpiration))";
    // ${kcSanitize(msg("emailVerificationBodyCodeHtml",code))?no_esc}
};

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

export const previewProps: TemplateProps = {
    locale: "en",
    themeName: "clean-sight-solutions"
};

export const templateName = "Email Verification With Code";

// TODO: need this to work?
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
                        Hi {exp("user.firstName")} {exp("user.lastName")},
                    </Fm.Then>
                    <Fm.ElseIf condition={`${v("user.firstName")}??`}>
                        Hi {exp("user.firstName")},
                    </Fm.ElseIf>
                    <Fm.Else>Hi</Fm.Else>
                </Fm.If>
            </Greeting>
            <Content>
                Please enter the following code to verify your email address.
            </Content>
            <HeroText borders align={BrandStyles.TextAlignCenter}>
                123456
            </HeroText>
            <Disclaimer>
                If this wasn&apos;t you, feel free to ignore this message.
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
