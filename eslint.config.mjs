import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintReact from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      ...eslintPluginPrettierRecommended.plugins,
    },
    rules: {
      ...eslintPluginPrettierRecommended.rules,
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts, tsx}"],
    plugins: {
      react: eslintReact,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      ...eslintReact.configs.recommended.rules,
    },
  },
];
