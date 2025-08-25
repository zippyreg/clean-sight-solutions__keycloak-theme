import { Label, Tooltip } from "../../../shared/@patternfly/react-core";
import { ExclamationCircleIcon } from "../../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";

export type DisableLabelProps = {
    isCompact?: boolean;
    labelKey?: string;
    helpKey?: string;
};

export const TemporaryAdminLabel = ({
    isCompact = true,
    labelKey = "temporaryAdmin",
    helpKey = "helpTemporaryAdmin"
}: DisableLabelProps) => {
    const { t } = useTranslation();

    return (
        <Tooltip content={t(helpKey)}>
            <Label
                isCompact={isCompact}
                color="red"
                icon={<ExclamationCircleIcon id="temporary-admin-label" />}
            >
                {t(labelKey)}
            </Label>
        </Tooltip>
    );
};
