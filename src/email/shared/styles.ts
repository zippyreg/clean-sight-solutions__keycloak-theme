import { CSSProperties } from "react";

export type BaseStyle =
    | "layout"
    | "main"
    | "header"
    | "logo"
    | "body"
    | "content"
    | "button";

export enum BaseStyles {
    Layout = "layout",
    Main = "main",
    Header = "header",
    Logo = "logo",
    Body = "body",
    Content = "content",
    Button = "button"
}

export enum BrandStyles {
    NoSpace = 0,
    AutoSpace = "auto",

    Px = "px",
    OnePx = `1${Px}`,

    BaseSize = 16,
    BaseSizePx = `${BaseSize}${Px}`,
    BaseSize_75x = BaseSize * 0.75,
    BaseSize_75xPx = `${BaseSize_75x}${Px}`,
    BaseSize1_25x = BaseSize * 1.25,
    BaseSize1_25xPx = `${BaseSize1_25x}${Px}`,
    BaseSize1_5x = BaseSize * 1.5,
    BaseSize1_5xPx = `${BaseSize1_5x}${Px}`,
    BaseSize2x = BaseSize * 2,
    BaseSize2xPx = `${BaseSize2x}${Px}`,
    BaseSize3x = BaseSize * 3,
    BaseSize3xPx = `${BaseSize3x}${Px}`,
    BaseSize4x = BaseSize * 4,
    BaseSize4xPx = `${BaseSize4x}${Px}`,
    BaseSize4_5x = BaseSize * 4.5,
    BaseSize4_5xPx = `${BaseSize4_5x}${Px}`,

    FontWeight = "normal",
    FontWeightSemibold = "semibold",
    FontWeightBold = "bold",

    Black = "#000",
    White = "#fff",
    DarkGrey = "#222",
    MediumGrey = "#555",
    LightGrey = "#aaa",
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
    TextAlign = "left",

    BorderWidth = 2,
    BorderRadius = 6,

    ContainerPadding = `${BaseSize2xPx} ${NoSpace} ${BaseSize3xPx}`,
    ContainerMargin = `${NoSpace} ${AutoSpace}`,

    HeaderPadding = `${NoSpace} ${BaseSize4xPx}`,

    BodyPadding = `${NoSpace} ${BaseSize4xPx}`,
    BodyBorderTop = `6px solid ${BlueColor}`,

    ButtonMarginX = BaseSize2xPx,
    ButtonMargin = `${BaseSize2xPx} ${NoSpace}`
}

const main: CSSProperties = {
    backgroundColor: BrandStyles.BackgroundColor,
    margin: BrandStyles.NoSpace,
    fontFamily: BrandStyles.FontFamily
};

const container: CSSProperties = {
    backgroundColor: BrandStyles.BlockColor,
    margin: BrandStyles.ContainerMargin,
    padding: BrandStyles.ContainerPadding
};

const header: CSSProperties = {
    padding: BrandStyles.HeaderPadding
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

const getBaseStyle = (base: BaseStyle): CSSProperties => {
    switch (base) {
        case BaseStyles.Layout:
            return main;
        case BaseStyles.Main:
            return container;
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
