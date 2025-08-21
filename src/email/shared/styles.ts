import { CSSProperties } from "react";

export type BaseStyle =
    | "layout"
    | "main"
    | "header"
    | "logo"
    | "body"
    | "content"
    | "button"
    | "hero-border"
    | "footer";

export enum BaseStyles {
    Layout = "layout",
    Main = "main",
    Header = "header",
    Logo = "logo",
    Body = "body",
    Content = "content",
    Button = "button",
    HeroBorder = "hero-border",
    Footer = "footer"
}

export enum BrandStyles {
    NoSpace = 0,
    AutoSpace = "auto",

    Px = "px",
    OnePx = `1${Px}`,

    BaseSize = 16,
    BaseSizePx = `${BaseSize}${Px}`,
    BaseSize_25x = BaseSize * 0.25,
    BaseSize_25xPx = `${BaseSize_25x}${Px}`,
    BaseSize_5x = BaseSize * 0.5,
    BaseSize_5xPx = `${BaseSize_5x}${Px}`,
    BaseSize_75x = BaseSize * 0.75,
    BaseSize_75xPx = `${BaseSize_75x}${Px}`,
    BaseSize1_25x = BaseSize * 1.25,
    BaseSize1_25xPx = `${BaseSize1_25x}${Px}`,
    BaseSize1_5x = BaseSize * 1.5,
    BaseSize1_5xPx = `${BaseSize1_5x}${Px}`,
    BaseSize1_75x = BaseSize * 1.75,
    BaseSize1_75xPx = `${BaseSize1_75x}${Px}`,
    BaseSize2x = BaseSize * 2,
    BaseSize2xPx = `${BaseSize2x}${Px}`,
    BaseSize2_5x = BaseSize * 2.5,
    BaseSize2_5xPx = `${BaseSize2_5x}${Px}`,
    BaseSize3x = BaseSize * 3,
    BaseSize3xPx = `${BaseSize3x}${Px}`,
    BaseSize3_5x = BaseSize * 3.5,
    BaseSize3_5xPx = `${BaseSize3_5x}${Px}`,
    BaseSize4x = BaseSize * 4,
    BaseSize4xPx = `${BaseSize4x}${Px}`,
    BaseSize4_5x = BaseSize * 4.5,
    BaseSize4_5xPx = `${BaseSize4_5x}${Px}`,

    FontWeightNormal = "normal",
    FontWeightSemibold = "semibold",
    FontWeightBold = "bold",
    FontWeight = FontWeightNormal,

    Black = "#000",
    White = "#fff",
    DarkGrey = "#222",
    MediumGrey = "#555",
    LightGrey = "#aaa",
    LighterGrey = "#ccc",
    PrimaryColor = "#F5E701",
    SecondaryColor = "#1A6AFF",
    BlueColor = "#082F7B",
    BackgroundColor = "#E4E4E4",

    ButtonColor = Black,
    ContentColor = MediumGrey,
    BlockColor = White,

    FontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    FontSize = BaseSize,
    FontSizePx = BaseSizePx,
    LineHeight = BaseSize1_5xPx,

    TextAlignCenter = "center",
    TextAlignRight = "right",
    TextAlignLeft = "left",
    TextAlign = TextAlignLeft,

    BorderWidth = 2,
    BorderRadius = 6,

    ContainerPadding = `${BaseSize2xPx} ${NoSpace} ${NoSpace}`,
    ContainerMargin = `${NoSpace} ${AutoSpace}`,

    HeaderPadding = `${NoSpace} ${BaseSize4xPx}`,

    HeroTextBorder = `3px solid ${LightGrey}`,
    HeroTextPadding = `${BaseSize1_5xPx} ${NoSpace}`,
    HeroTextBordersPadding = `${BaseSize1_5xPx} ${BaseSizePx} ${BaseSize1_75xPx}`,

    BodyPadding = `${BaseSizePx} ${BaseSize3xPx} ${NoSpace}`,
    BodyBorderTop = `6px solid ${BlueColor}`,

    ButtonMargin = `${BaseSize2xPx} ${NoSpace}`
}

const layout: CSSProperties = {
    backgroundColor: BrandStyles.BackgroundColor,
    margin: BrandStyles.NoSpace,
    fontFamily: BrandStyles.FontFamily
};

const main: CSSProperties = {
    backgroundColor: BrandStyles.BlockColor,
    margin: BrandStyles.ContainerMargin,
    padding: BrandStyles.ContainerPadding
};

const header: CSSProperties = {
    padding: BrandStyles.HeaderPadding
};

const heroBorder: CSSProperties = {
    border: BrandStyles.HeroTextBorder,
    borderRadius: BrandStyles.BorderRadius
};

const logo: CSSProperties = {
    paddingBottom: BrandStyles.BaseSize2xPx
};

const body: CSSProperties = {
    padding: BrandStyles.BodyPadding,
    borderTop: BrandStyles.BodyBorderTop
};

const content: CSSProperties = {
    color: BrandStyles.ContentColor,
    fontSize: BrandStyles.FontSize,
    lineHeight: BrandStyles.LineHeight,
    textAlign: BrandStyles.TextAlign
};

const button: CSSProperties = {
    margin: BrandStyles.ButtonMargin
};

const footer: CSSProperties = {
    backgroundColor: BrandStyles.LighterGrey,
    color: BrandStyles.DarkGrey,
    fontSize: BrandStyles.BaseSize_75xPx,
    textAlign: BrandStyles.TextAlignCenter
};

const getBaseStyle = (base: BaseStyle): CSSProperties => {
    switch (base) {
        case BaseStyles.Layout:
            return layout;
        case BaseStyles.Main:
            return main;
        case BaseStyles.Header:
            return header;
        case BaseStyles.Logo:
            return logo;
        case BaseStyles.Body:
            return body;
        case BaseStyles.Content:
            return content;
        case BaseStyles.Button:
            return button;
        case BaseStyles.HeroBorder:
            return heroBorder;
        case BaseStyles.Footer:
            return footer;
        default:
            return {};
    }
};

export const getStyles = (
    base: BaseStyle,
    styles: CSSProperties = {},
    overrides: CSSProperties = {}
): CSSProperties => {
    return {
        ...styles,
        ...getBaseStyle(base),
        ...overrides
    };
};
