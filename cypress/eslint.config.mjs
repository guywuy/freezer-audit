import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        tsconfigRootDir: ".",
        project: "./tsconfig.json",
      },
    },
  },
]);
