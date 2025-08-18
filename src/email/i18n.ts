import { GetMessages } from "keycloakify-emails";

export const getMessages: GetMessages = (props) => {
  // All properties are optional. If you omit them, they will fall back to the base theme defaults.
  if (props.locale === "en") {
    return {
      "requiredAction.CONFIGURE_TOTP": "Setup Authenticator Application",
    };
  } else {
    return {};
  }
};