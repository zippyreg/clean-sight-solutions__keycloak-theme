/* eslint-disable react-refresh/only-export-components */
import { Container, render } from "jsx-email";
import {
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

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

export const previewProps: TemplateProps = {
    locale: "en",
    themeName: "clean-sight-solutions"
};

export const templateName = "Event: Credential Updated";

const { exp, v } = createVariablesHelper("event-update_credential.ftl");

export const Template = ({ locale }: TemplateProps) => (
    <EmailLayout
        preview={`A credential was recently updated for your ${exp("realmName")} account.`}
        locale={locale}
    >
        <Container>
            <HeroText>Credential updated.</HeroText>

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
                We noticed a credential was recently updated for your {exp("realmName")}{" "}
                account from
                {exp("event.ipAddress")} on {exp("event.date")}. If this wasn&apos;t you,
                please update your password.
            </Content>
            <Disclaimer>If this was you, feel free to ignore this message.</Disclaimer>
        </Container>
    </EmailLayout>
);

export const getTemplate: GetTemplate = async props => {
    return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async _props => {
    return labeledSubject("Credential updated");
};
