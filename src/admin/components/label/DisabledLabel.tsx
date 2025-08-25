import { Label } from "../../../shared/@patternfly/react-core";
import { MinusCircleIcon } from "../../../shared/@patternfly/react-icons";
import { useTranslation } from "react-i18next";

export type DisableLabelProps = {
  isCompact?: boolean;
}

export const DisabledLabel = ({
  isCompact=true,
}: DisableLabelProps) => {
  const { t } = useTranslation();

  return (
    <Label isCompact={isCompact} color="red" icon={<MinusCircleIcon />}>
        {t("disabled")}
    </Label>
  )
}