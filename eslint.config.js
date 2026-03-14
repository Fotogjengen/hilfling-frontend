import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "build/**",
      "dist/**",
      "generated/**",
      "node_modules/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactPlugin.configs.flat.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2018,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/self-closing-comp": "error",
      "import/no-unresolved": "error",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
  },
]);
