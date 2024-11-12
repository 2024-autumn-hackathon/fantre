import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        "monitor": {
          "raw": "(min-aspect-ratio: 1 / 1) and (max-aspect-ratio: 2 / 1)",
        },
        "wide": {
          "raw": "(min-aspect-ratio: 2 / 1)",
        },
      }
    },
  },
  plugins: [],
};
export default config;
