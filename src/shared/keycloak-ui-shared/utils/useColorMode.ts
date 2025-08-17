import { useMediaQuery, useLocalStorage } from "usehooks-ts";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "css__dark-theme-preference";
const VALID_COLOR_MODES = ["auto", "light", "dark"];

export type ColorModeSetterFn = (value: string) => void;

function wrapSetColorMode(setColorMode: ColorModeSetterFn) {
    return (value: string): void => {
        if (!VALID_COLOR_MODES.includes(value)) {
            console.warn(`Invalid color mode value: ${value}`);
            return;
        }

        setColorMode(value);
    };
}

export function useColorMode(): [string, ColorModeSetterFn, boolean] {
    const prefersDarkTheme = useMediaQuery("(prefers-color-scheme: dark)");
    const [colorMode, setColorMode] = useLocalStorage(LOCAL_STORAGE_KEY, "auto");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        switch (colorMode) {
            case "auto":
                setIsDark(prefersDarkTheme);
                break;
            case "light":
                setIsDark(false);
                break;
            case "dark":
                setIsDark(true);
                break;
        }
    }, [prefersDarkTheme, colorMode]);

    return [colorMode, wrapSetColorMode(setColorMode), isDark];
}
