/* eslint-disable @typescript-eslint/no-magic-numbers */
/** @type {import('tailwindcss').Config} */

import type { Config } from "tailwindcss";
import colors from "@/assets/styles/colors";

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {
        neutral: colors.primary,
        secondary: colors.secondary,
      },
    },
  },
};

module.exports = config;
