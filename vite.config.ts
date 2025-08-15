import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "Single-Page",
            groupId: "store.cleansightsolutions.id.keycloak-theme",
            keycloakifyBuildDirPath: "./target",
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": "clean-sight-solutions.jar"
            }
        })
    ]
});
