import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A custom ESLint configuration for TypeScript libraries.
 *
 * This configuration is tailored for libraries written in TypeScript, meant to be consumed by other projects.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
    ...baseConfig,
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.serviceworker,
                ...globals.browser,
            }
        }
    },
    {
        rules: {
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "error",
            "@typescript-eslint/no-unused-vars": 'off',
            "@typescript-eslint/explicit-module-boundary-types": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
        },
    },
    {
        ignores: ["dist/**", "node_modules/**"],
    },
];