/**
 * This file has been claimed for ownership from @keycloakify/keycloak-admin-ui version 260200.0.3.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "admin/dashboard/Dashboard.tsx" --revert
 */

/* eslint-disable */

// @ts-nocheck

import iconSvgUrl from "../assets/icon.svg";
import FeatureRepresentation, {
    FeatureType
} from "@keycloak/keycloak-admin-client/lib/defs/featureRepresentation";
import {
    HelpItem,
    KeycloakSpinner,
    BrandWordmark,
    BrandLettermark,
    label,
    useColorMode,
    useEnvironment
} from "../../shared/keycloak-ui-shared";
import {
    ActionList,
    ActionListItem,
    Brand,
    Button,
    Card,
    CardBody,
    CardTitle,
    DescriptionList,
    DescriptionListDescription,
    DescriptionListGroup,
    DescriptionListTerm,
    EmptyState,
    EmptyStateBody,
    EmptyStateHeader,
    Flex,
    Grid,
    GridItem,
    Label,
    List,
    ListItem,
    ListVariant,
    PageSection,
    Tab,
    TabTitleText,
    Text,
    TextContent,
    TextVariants,
    Title
} from "../../shared/@patternfly/react-core";
import {
    CheckCircleIcon,
    CogIcon,
    EnhancementIcon,
    MinusCircleIcon,
    TimesCircleIcon
} from "../../shared/@patternfly/react-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RoutableTabs, useRoutableTab } from "../components/routable-tabs/RoutableTabs";
import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import helpUrls from "../help-urls";
import useLocaleSort, { mapByKey } from "../utils/useLocaleSort";
import { ProviderInfo } from "./ProviderInfo";
import { DashboardTab, toDashboard } from "./routes/Dashboard";

import "./dashboard.css";

const EmptyDashboard = () => {
    const { environment } = useEnvironment();
    const [isDark] = useColorMode();

    const { t } = useTranslation();
    const { realm, realmRepresentation: realmInfo } = useRealm();

    const realmDisplayInfo = label(t, realmInfo?.displayName, realm);

    return (
        <PageSection variant="light">
            <Grid hasGutter>
                <GridItem>
                    <Card isPlain>
                        <EmptyState variant="lg">
                            <Flex
                                direction={{ default: "column" }}
                                alignItems={{ default: "alignItemsCenter" }}
                                gap={{ default: "gapLg" }}
                            >
                                <BrandWordmark
                                    variant={isDark ? "white" : "default"}
                                    size="xl"
                                />
                                <Flex
                                    direction={{ default: "column" }}
                                    gap={{ default: undefined }}
                                >
                                    <EmptyStateHeader
                                        titleText={<>{t("welcome")}</>}
                                        headingLevel="h2"
                                        className="pf-v5-u-mb-0"
                                    />
                                    <EmptyStateHeader
                                        titleText={<strong>{realmDisplayInfo}</strong>}
                                        headingLevel="h1"
                                        titleClassName="pf-v5-u-font-size-4xl"
                                    />
                                </Flex>
                                <EmptyStateBody className="keycloak__dashboard_introduction pf-v5-u-font-size-lg">
                                    {t("introduction")}
                                </EmptyStateBody>
                            </Flex>
                        </EmptyState>
                    </Card>
                </GridItem>
            </Grid>
        </PageSection>
    );
};

type FeatureItemProps = {
    feature: FeatureRepresentation;
};

const featureNameToHeaderCase = (str: FeatureRepresentation.name = ""): string => {
    if (!str) return "";

    return String(str)
        .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
        .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}_${b.toLowerCase()}`)
        .replace(/[^A-Za-z0-9]+|_+/g, " ")
        .toLowerCase()
        .replace(
            /( ?)(\w+)( ?)/g,
            (m, a, b, c) => a + b.charAt(0).toUpperCase() + b.slice(1) + c
        )
        .replaceAll(/Api/g, "API")
        .replaceAll(/Ui/g, "UI")
        .replaceAll(/Ciba/g, "CIBA")
        .replaceAll(/Par/g, "PAR")
        .replaceAll(/Fips/g, "FIPS")
        .replaceAll(/Oid4vc Vci/g, "OID4VC VCI")
        .replaceAll(/Dpop/g, "DPOP")
        .replaceAll(/Ipa/g, "IPA");
};

const FeatureItem = ({ feature }: FeatureItemProps) => {
    const { t } = useTranslation();
    return (
        <ListItem className="pf-v5-u-mb-sm">
            <span className="pf-v5-u-mr-xs">{featureNameToHeaderCase(feature.name)}</span>
            {feature.type === FeatureType.Default && (
                <Label color="green" icon={<CheckCircleIcon />}>
                    {t("supported")}
                </Label>
            )}
            {feature.type === FeatureType.Preview && (
                <Label color="purple" icon={<EnhancementIcon />}>
                    {t("preview")}
                </Label>
            )}
            {feature.type === FeatureType.Experimental && (
                <Label color="cyan" icon={<CogIcon />}>
                    {t("experimental")}
                </Label>
            )}
            {feature.type === FeatureType.PreviewDisabledByDefault && (
                <Label color="gold" icon={<TimesCircleIcon />}>
                    {t("previewDefaultDisabled")}
                </Label>
            )}
            {feature.type === FeatureType.DisabledByDefault && (
                <Label color="gold" icon={<TimesCircleIcon />}>
                    {t("defaultDisabled")}
                </Label>
            )}
            {feature.type === FeatureType.Deprecated && (
                <Label color="grey" icon={<MinusCircleIcon />}>
                    {t("deprecated")}
                </Label>
            )}
        </ListItem>
    );
};

const Dashboard = () => {
    const { t } = useTranslation();
    const { realm, realmRepresentation: realmInfo } = useRealm();
    const serverInfo = useServerInfo();
    const localeSort = useLocaleSort();

    const sortedFeatures = useMemo(
        () => localeSort(serverInfo.features ?? [], mapByKey("name")),
        [serverInfo.features]
    );

    const disabledFeatures = useMemo(
        () => sortedFeatures.filter(f => !f.enabled) || [],
        [serverInfo.features]
    );

    const enabledFeatures = useMemo(
        () => sortedFeatures.filter(f => f.enabled) || [],
        [serverInfo.features]
    );

    const useTab = (tab: DashboardTab) =>
        useRoutableTab(
            toDashboard({
                realm,
                tab
            })
        );

    const realmDisplayInfo = label(t, realmInfo?.displayName, realm);

    const welcomeTab = useTab("welcome");
    const infoTab = useTab("info");
    const providersTab = useTab("providers");

    if (Object.keys(serverInfo).length === 0) {
        return <KeycloakSpinner />;
    }

    return (
        <>
            <PageSection variant="light">
                <TextContent className="pf-v5-u-mr-sm">
                    <Text component="h1">{t("realmNameTitle", { name: realm })}</Text>
                </TextContent>
            </PageSection>
            <PageSection variant="light" className="pf-v5-u-p-0">
                <RoutableTabs
                    data-testid="dashboard-tabs"
                    defaultLocation={toDashboard({
                        realm,
                        tab: "welcome"
                    })}
                    isBox
                    mountOnEnter
                >
                    <Tab
                        id="welcome"
                        data-testid="welcomeTab"
                        title={<TabTitleText>{t("welcomeTabTitle")}</TabTitleText>}
                        {...welcomeTab}
                    >
                        <PageSection variant="light">
                            <Grid>
                                <GridItem>
                                    <Card isPlain>
                                        <CardTitle
                                            data-testid="welcomeTitle"
                                            className="pf-v5-u-font-weight-bold pf-v5-u-font-size-3xl"
                                            component={TextVariants.h2}
                                        >
                                            {t("welcomeTo", { realmDisplayInfo })}
                                        </CardTitle>
                                        <CardBody className="keycloak__dashboard_welcome_tab">
                                            <Text component={TextVariants.h3}>
                                                {t("welcomeText")}
                                            </Text>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                                <GridItem span={10}>
                                    <Card isPlain>
                                        <CardBody>
                                            <Button
                                                className="pf-v5-u-px-lg pf-v5-u-py-sm"
                                                component="a"
                                                href={helpUrls.documentation}
                                                target="_blank"
                                                variant="primary"
                                            >
                                                {t("viewDocumentation")}
                                            </Button>
                                        </CardBody>
                                        <CardBody>
                                            <ActionList>
                                                <ActionListItem>
                                                    <Button
                                                        component="a"
                                                        href={helpUrls.guides}
                                                        target="_blank"
                                                        variant="tertiary"
                                                    >
                                                        {t("viewGuides")}
                                                    </Button>
                                                </ActionListItem>
                                                <ActionListItem>
                                                    <Button
                                                        component="a"
                                                        href={helpUrls.community}
                                                        target="_blank"
                                                        variant="tertiary"
                                                    >
                                                        {t("joinCommunity")}
                                                    </Button>
                                                </ActionListItem>
                                                <ActionListItem>
                                                    <Button
                                                        component="a"
                                                        href={helpUrls.blog}
                                                        target="_blank"
                                                        variant="tertiary"
                                                    >
                                                        {t("readBlog")}
                                                    </Button>
                                                </ActionListItem>
                                            </ActionList>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </Grid>
                        </PageSection>
                    </Tab>
                    <Tab
                        id="info"
                        data-testid="infoTab"
                        title={<TabTitleText>{t("serverInfo")}</TabTitleText>}
                        {...infoTab}
                    >
                        <PageSection variant="light">
                            <Grid hasGutter>
                                <GridItem xl2={2} xl={3} lg={12}>
                                    <Card isFlat className="keycloak__dashboard_card">
                                        <CardTitle className="pf-v5-u-font-weight-bold pf-v5-u-font-size-xl">
                                            {t("serverInfo")}
                                        </CardTitle>
                                        <CardBody
                                            isFilled={false}
                                            className="pf-v5-u-mb-xl"
                                        >
                                            <DescriptionList>
                                                <DescriptionListGroup>
                                                    <DescriptionListTerm>
                                                        {t("version")}
                                                    </DescriptionListTerm>
                                                    <DescriptionListDescription>
                                                        {serverInfo.systemInfo?.version}
                                                    </DescriptionListDescription>
                                                </DescriptionListGroup>
                                            </DescriptionList>
                                        </CardBody>
                                        <CardTitle className="pf-v5-u-font-weight-bold pf-v5-u-font-size-lg">
                                            {t("memory")}
                                        </CardTitle>
                                        <CardBody>
                                            <DescriptionList>
                                                <DescriptionListGroup>
                                                    <DescriptionListTerm>
                                                        {t("totalMemory")}
                                                    </DescriptionListTerm>
                                                    <DescriptionListDescription>
                                                        {
                                                            serverInfo.memoryInfo
                                                                ?.totalFormated
                                                        }
                                                    </DescriptionListDescription>
                                                    <DescriptionListTerm>
                                                        {t("freeMemory")}
                                                    </DescriptionListTerm>
                                                    <DescriptionListDescription>
                                                        {
                                                            serverInfo.memoryInfo
                                                                ?.freeFormated
                                                        }
                                                    </DescriptionListDescription>
                                                    <DescriptionListTerm>
                                                        {t("usedMemory")}
                                                    </DescriptionListTerm>
                                                    <DescriptionListDescription>
                                                        {
                                                            serverInfo.memoryInfo
                                                                ?.usedFormated
                                                        }
                                                    </DescriptionListDescription>
                                                </DescriptionListGroup>
                                            </DescriptionList>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                                <GridItem xl={7} lg={12}>
                                    <Card isPlain className="keycloak__dashboard_card">
                                        <CardTitle className="pf-v5-u-font-weight-bold pf-v5-u-font-size-xl">
                                            {t("featureProfile")}
                                        </CardTitle>
                                        <CardBody>
                                            <DescriptionList>
                                                <DescriptionListGroup className="pf-v5-u-mb-lg">
                                                    <DescriptionListTerm>
                                                        <span className="pf-v5-u-mr-sm">
                                                            {t("enabledFeatures")}
                                                        </span>
                                                        <HelpItem
                                                            fieldLabelId="enabledFeatures"
                                                            helpText={t(
                                                                "infoEnabledFeatures"
                                                            )}
                                                        />
                                                    </DescriptionListTerm>
                                                    <DescriptionListDescription>
                                                        <List
                                                            variant={ListVariant.inline}
                                                        >
                                                            {enabledFeatures.map(
                                                                feature => (
                                                                    <FeatureItem
                                                                        key={feature.name}
                                                                        feature={feature}
                                                                    />
                                                                )
                                                            )}
                                                        </List>
                                                    </DescriptionListDescription>
                                                </DescriptionListGroup>
                                                <DescriptionListGroup>
                                                    <DescriptionListTerm>
                                                        <span className="pf-v5-u-mr-sm">
                                                            {t("disabledFeatures")}
                                                        </span>
                                                        <HelpItem
                                                            fieldLabelId="disabledFeatures"
                                                            helpText={t(
                                                                "infoDisabledFeatures"
                                                            )}
                                                        />
                                                    </DescriptionListTerm>
                                                    <DescriptionListDescription>
                                                        <List
                                                            variant={ListVariant.inline}
                                                        >
                                                            {disabledFeatures.map(
                                                                feature => (
                                                                    <FeatureItem
                                                                        key={feature.name}
                                                                        feature={feature}
                                                                    />
                                                                )
                                                            )}
                                                        </List>
                                                    </DescriptionListDescription>
                                                </DescriptionListGroup>
                                            </DescriptionList>
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </Grid>
                        </PageSection>
                    </Tab>
                    <Tab
                        id="providers"
                        data-testid="providersTab"
                        title={<TabTitleText>{t("providerInfo")}</TabTitleText>}
                        {...providersTab}
                    >
                        <ProviderInfo />
                    </Tab>
                </RoutableTabs>
            </PageSection>
        </>
    );
};

export default function DashboardSection() {
    const { realm } = useRealm();
    const isMasterRealm = realm === "master";
    return (
        <>
            {!isMasterRealm && <EmptyDashboard />}
            {isMasterRealm && <Dashboard />}
        </>
    );
}
