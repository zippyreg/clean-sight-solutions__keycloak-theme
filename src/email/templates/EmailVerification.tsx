/* eslint-disable react-refresh/only-export-components */
import { Text, render } from "jsx-email";
import { labeledSubject } from "./common/labeledSubject";
import { EmailLayout } from "./common/Layout";
import { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";

export type TemplateProps = Omit<GetTemplateProps, "plainText">;

const paragraph = {
  color: "#777",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

export const previewProps: TemplateProps = {
  locale: "en",
  themeName: "vanilla",
};

export const templateName = "Email Verification";

const { exp } = createVariablesHelper("email-verification.ftl");

export const Template = ({ locale }: TemplateProps) => (
  <EmailLayout preview={`This email address has been added to Clean Sight Solutions. Verify your email address now.`} locale={locale}>
    <Text style={paragraph}>
      <p>
        Someone has created a {exp("user.firstName")} account with this email address. If
        this was you, click the link below to verify your email address
      </p>
      <p>
        <a href={exp("link")}>Link to e-mail address verification</a>
      </p>
      <p>
        This link will expire within {exp("linkExpirationFormatter(linkExpiration)")}.
      </p>
      <p>If you didn&apos;t create this account, just ignore this message.</p>
    </Text>
  </EmailLayout>
);

export const getTemplate: GetTemplate = async (props) => {
  return await render(<Template {...props} />, { plainText: props.plainText });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getSubject: GetSubject = async (_props) => {
  return labeledSubject("Verify email");
};