import { defineConfig } from "eslint/config";

export default defineConfig([{
    languageOptions: {
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            tsconfigRootDir: "/Users/guysmith/projects/freezer-audit/cypress",
            project: "./tsconfig.json",
        },
    },
}]);