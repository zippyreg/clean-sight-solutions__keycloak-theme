import { label } from "../../../shared/keycloak-ui-shared";
import { clsx } from "keycloakify/tools/clsx";
import { Label, LabelGroup } from "../../../shared/@patternfly/react-core";
import { CubesIcon } from "../../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import { useHref } from "react-router-dom";
import { useRealm } from "../../context/realm-context/RealmContext";
import { toDashboard } from "../../dashboard/routes/Dashboard";

export type CurrentRealmProps = {
    className?: string,
    textMaxWidth?: string,
};

export const CurrentRealm = ({ className, textMaxWidth }: CurrentRealmProps) => {
    const { t } = useTranslation();
    const { realm, realmRepresentation } = useRealm();
    const realmBadgeUrl = useHref(toDashboard({ realm }));

    return (
        <h2
            className={"pf-v5-c-nav__section-title"}
            style={{ wordWrap: "break-word" }}
        >
            <LabelGroup 
                categoryName={`${t("currentRealm")}:`}
                className={clsx(className)}
            >
                <Label 
                    isCompact
                    color="blue" 
                    href={realmBadgeUrl}
                    icon={<CubesIcon key="cubes-icon" />}
                    textMaxWidth={textMaxWidth}
                >
                    <span data-testid="currentRealm">
                        {realmRepresentation?.displayName
                            ? <span>{label(t, realm)} (<strong>{label(t, realmRepresentation.displayName)}</strong>)</span>
                            : label(t, realm) }
                    </span>
                </Label>
            </LabelGroup>
        </h2>
    );
}