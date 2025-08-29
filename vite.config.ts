import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";
import { buildEmailTheme } from "keycloakify-emails";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "Single-Page",
            groupId: "com.cleansightsolutions.id.keycloak-theme",
            keycloakifyBuildDirPath: "./target",
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": "clean-sight-solutions__keycloak-theme.jar"
            },
            postBuild: async buildContext => {
                const { config: loadConfig } = await import("./jsx-email.config");

                const config = await loadConfig;
                // const config = { esbuild: {} };

                await buildEmailTheme({
                    assetsDirPath: path.join(
                        buildContext.themeSrcDirPath,
                        "email",
                        "templates",
                        "assets"
                    ),
                    templatesSrcDirPath: path.join(
                        buildContext.themeSrcDirPath,
                        "email",
                        "templates"
                    ),
                    i18nSourceFile: path.join(
                        buildContext.themeSrcDirPath,
                        "email",
                        "i18n.ts"
                    ),
                    themeNames: buildContext.themeNames,
                    keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
                    locales: ["en"],
                    cwd: import.meta.dirname,
                    esbuild: config.esbuild
                });
            }
        })
    ]
});
