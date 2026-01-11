import js from "@eslint/js";
import globals from "globals";

import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import jestPlugin from "eslint-plugin-jest";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";
import cypress from "eslint-plugin-cypress/flat";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  // 1. Global Ignores
  {
    ignores: ["public/build/", "build/", ".react-router/", "**/.eslintrc.js"],
  },

  // 2. Base Configuration (JS + TS)
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // 3. Global Settings & Options
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.commonjs },
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // 4. React & JSX A11y
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...reactPlugin.configs.flat.recommended,
    ...reactPlugin.configs.flat["jsx-runtime"],
    settings: {
      react: { version: "detect" },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat["jsx-runtime"].rules,
      "react/jsx-no-leaked-render": ["warn", { validStrategies: ["ternary"] }],
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
  },

  // 5. React Hooks (Legacy - requires manual fixup)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // 6. Testing (Jest/RTL)
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],
    ...jestPlugin.configs["flat/recommended"],
    ...jestDom.configs["flat/recommended"],
    ...testingLibrary.configs["flat/react"],
    settings: { jest: { version: 28 } },
    languageOptions: {
      globals: { ...globals.jest },
    },
  },

  // 7. Cypress
  {
    files: ["cypress/**/*.ts"],
    ...cypress.configs.recommended,
  },

  // 8. Node Environment Overrides
  {
    files: ["mocks/**/*.js", "mocks/**/*.ts", "prisma/**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // 9. Prettier
  eslintConfigPrettier,
];
