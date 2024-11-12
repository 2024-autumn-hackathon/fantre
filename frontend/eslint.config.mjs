import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import nextPlugin from "@next/eslint-plugin-next"

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {plugins: {"@next/next": nextPlugin}},
  {
    rules: {
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      // React import省略時のエラー無効化
      "react/react-in-jsx-scope": "off",
      // セミコロンなしスタイル用設定
      "semi": ["error", "never", {"beforeStatementContinuationChars": "never"}],
      "semi-spacing": ["error", {"after": true, "before": false}],
      "semi-style": ["error", "first"],
      "no-extra-semi": "error",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      // -----------------------------
    },
  },
]