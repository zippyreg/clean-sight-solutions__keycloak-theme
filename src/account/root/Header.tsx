/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260200.1.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/root/Header.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import {
    BrandLettermark,
    KeycloakMasthead,
    label,
    useEnvironment
} from "../../shared/keycloak-ui-shared";
import { Button } from "../../shared/@patternfly/react-core";
import { ExternalLinkSquareAltIcon } from "../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

import { environment } from "../environment";
import { joinPath } from "../utils/joinPath";

import style from "./header.module.css";

const ReferrerLink = () => {
    const { t } = useTranslation();

    return environment.referrerUrl ? (
        <Button
            data-testid="referrer-link"
            component="a"
            href={environment.referrerUrl.replace("_hash_", "#")}
            variant="link"
            icon={<ExternalLinkSquareAltIcon />}
            iconPosition="right"
            isInline
        >
            {t("backTo", {
                app: label(t, environment.referrerName, environment.referrerUrl)
            })}
        </Button>
    ) : null;
};

export const Header = () => {
    const { environment, keycloak } = useEnvironment();
    const { t } = useTranslation();

    const organization = Object.values(keycloak.idTokenParsed?.organization ?? {})?.[0];
    const organizationLogo = organization?.logo?.[0];

    const logoUrl = environment.logoUrl ? environment.logoUrl : "/";
    const internalLogoHref = useHref(logoUrl);

    // User can indicate that he wants an internal URL by starting it with "/"
    const indexHref = logoUrl.startsWith("/") ? internalLogoHref : logoUrl;

    return (
        <KeycloakMasthead
            data-testid="page-header"
            keycloak={keycloak}
            features={{ hasManageAccount: false }}
            brand={{
                children: [
                    organizationLogo ? (
                        <img
                            className={style.brand}
                            src={organizationLogo}
                            alt={t("logo")}
                        />
                    ) : <BrandLettermark variant="white" key="brand-lettermark" />
                ]
            }}
            toolbarItems={[
                {
                    children: [<ReferrerLink key="link" />]
                },
            ]}
        />
    );
};
