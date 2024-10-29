import react from "eslint-plugin-react";
import globals from "globals";
import love from "eslint-config-love";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/metro.config.js",
      "app.config.js",
      "babel.config.js",
      "android/**/*",
      "ios/**/*",
      ".expo/**/*",
    ],
  },
  {
    plugins: {
      react,
    },

    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {},
  },
  love,
  eslintConfigPrettier,
];
