import { GetMessages } from "keycloakify-emails";

export const getMessages: GetMessages = props => {
    // Assume "en" locale. When needed, implement other languages here.
    switch (props.locale) {
        // case "fr":
        //   return {

        //   }
        default:
            return {
                "requiredAction.CONFIGURE_TOTP": "Setup Authenticator Application"
            };
    }
};
