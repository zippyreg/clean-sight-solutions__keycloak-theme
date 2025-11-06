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

export const templateName = "Event: User Permanent Lockout";

const { exp, v } = createVariablesHelper("event-user_disabled_by_permanent_lockout.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout
        preview={`Your ${exp("realmName")} account has been permanently disabled.`}
        locale={locale}
    >
        <Container>
            <HeroText>Account permanently disabled.</HeroText>

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
                Your {exp("realmName")} account has been <strong>permanently</strong>{" "}
                disabled due to multiple failed login attempts on {exp("event.date")}.
            </Content>
        </Container>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject("Account permanently disabled");
};
