// @ts-check

import eslint from "@eslint/js";
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    name: "mini-result/languages",
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
  {
    name: "mini-result/ignores",
    ignores: ["coverage", "dist", "docs"],
  },
  {
    name: "mini-result/files",
    files: ["**/*.?(c|m){j,t}s"],
  },
  {
    name: "mini-result/eslint",
    extends: [
      {
        name: "eslint/recommended",
        ...eslint.configs.recommended,
      },
    ],
    rules: {
      "no-use-before-define": [
        "error",
        {
          classes: true,
          functions: false,
          variables: false,
          allowNamedExports: false,
        },
      ],
      "no-param-reassign": "error",
    },
  },
  {
    name: "mini-result/typescript",
    extends: tseslint.configs.recommendedTypeChecked,
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: true,
        },
      ],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    name: "simple-import-sort/all",
    plugins: {
      "simple-import-sort": pluginSimpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
);
