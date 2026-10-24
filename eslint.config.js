import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import reactPlugin from "eslint-plugin-react-x";
import importPlugin from "eslint-plugin-import-x";
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
  reactPlugin.configs.recommended,
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
      "import-x": importPlugin,
      "@stylistic": stylistic,
    },
    settings: {
      "import-x/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "@stylistic/jsx-self-closing-comp": "error",
      "import-x/no-unresolved": "error",
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
