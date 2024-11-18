import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "my-orange": "#ff9519",
        "my-light-blue": "#88FBFF",
        "my-gray": "#C3D5D6",
        "my-green": "#85f2c6",
        "my-light-green": "#c1ff72",
        "my-yellow": "#FFEC50",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        // "Y-mob": {// モバイル縦(縦が横以上)&横560px以下
        //   "raw": "(max-aspect-ratio: 1 / 1) and (max-width: 560px)",
        // },// これをベースにする
        "Y-tab": {// タブレット・PC縦(縦が横以上)&横560pxより大きい
          "raw": "(max-aspect-ratio: 1 / 1) and (min-width: 560.1px)",
        },
        "X-mob": {// モバイル横(横が縦より大きい)&高さ600px以下
          "raw": "(min-aspect-ratio: 1.001 / 1) and (max-height: 600px)",
        },
        "X-tab": {// タブレット・PC横(横が縦より大きい)&高さ600pxより大きい
          "raw": "(min-aspect-ratio: 1.001 / 1) and (min-height: 600.1px)",
        },
      }
    },
  },
  plugins: [],
};
export default config;
