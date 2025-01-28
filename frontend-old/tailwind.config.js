import { nextui } from "@nextui-org/react";
import { withTV } from "tailwind-variants/transformer";

/** @type {import("tailwindcss").Config} */
module.exports = withTV({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/*/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
});
