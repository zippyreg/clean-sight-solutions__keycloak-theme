import { defineConfig, JsxEmailConfig } from "jsx-email/config";

export const config = defineConfig({
    render: {
        minify: true
    },
    esbuild: {}
} as JsxEmailConfig);
