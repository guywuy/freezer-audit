import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import _import from "eslint-plugin-import";
import tsParser from "@typescript-eslint/parser";
import markdown from "eslint-plugin-markdown";
import jest from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";
import cypress from "eslint-plugin-cypress";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
      globals: { ...globals.browser, ...globals.commonjs },

      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  globalIgnores(["./public/build/", "./build", "./.react-router/"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    extends: fixupConfigRules(
      compat.extends(
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "prettier",
      ),
    ),

    plugins: {
      react: fixupPluginRules(react),
      "jsx-a11y": fixupPluginRules(jsxA11Y),
    },

    settings: {
      react: { version: "detect" },

      formComponents: ["Form"],

      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },

    rules: {
      "react/jsx-no-leaked-render": ["warn", { validStrategies: ["ternary"] }],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],

    extends: fixupConfigRules(
      compat.extends(
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
      ),
    ),

    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
    },

    languageOptions: { parser: tsParser },

    settings: {
      "import/internal-regex": "^~/",

      "import/resolver": {
        node: { extensions: [".ts", ".tsx"] },

        typescript: { alwaysTryTypes: true },
      },
    },

    rules: {
      "import/order": [
        "error",
        {
          alphabetize: { caseInsensitive: true, order: "asc" },

          groups: ["builtin", "external", "internal", "parent", "sibling"],
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    files: ["**/*.md"],
    extends: compat.extends("plugin:markdown/recommended-legacy", "prettier"),

    plugins: { markdown },
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],

    extends: compat.extends(
      "plugin:jest/recommended",
      "plugin:jest-dom/recommended",
      "plugin:testing-library/react",
      "prettier",
    ),

    plugins: { jest, "jest-dom": jestDom, "testing-library": testingLibrary },

    languageOptions: { globals: { ...jest.environments.globals.globals } },

    settings: { jest: { version: 28 } },
  },
  {
    files: ["cypress/**/*.ts"],
    extends: compat.extends("plugin:cypress/recommended", "prettier"),

    plugins: { cypress },
  },
  {
    files: ["**/.eslintrc.js", "mocks/**/*.js"],

    languageOptions: { globals: { ...globals.node } },
  },
]);
