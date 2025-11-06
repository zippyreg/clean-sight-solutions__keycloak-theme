/* eslint-disable react-refresh/only-export-components */
import { Container, render } from "jsx-email";
import { Content, EmailLayout, Greeting, HeroText, labeledSubject } from "../shared";
import * as Fm from "keycloakify-emails/jsx-email";
import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

export const previewProps: TemplateProps = {
    locale: "en",
    themeName: "clean-sight-solutions"
};

export const templateName = "Event: User Temporary Lockout";

const { exp, v } = createVariablesHelper("event-user_disabled_by_temporary_lockout.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout
        preview={`Your ${exp("realmName")} account has been temporarily disabled.`}
        locale={locale}
    >
        <Container>
            <HeroText>Account temporarily disabled.</HeroText>

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
                Your {exp("realmName")} account has been <strong>temporarily</strong>{" "}
                disabled due to multiple failed login attempts on {exp("event.date")}. If
                this wasn&apos;t you, please update your password once you are able to
                access your account again.
            </Content>
        </Container>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject("Account temporarily disabled");
};
