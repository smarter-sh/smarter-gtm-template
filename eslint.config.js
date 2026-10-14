// ESLint for the harness, tests and scripts. template.tpl's code is linted by test/sandbox.test.mjs, against GTM's
// sandbox. See skills/smarter-code-quality.
import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", "coverage/", "venv/", "test/.compiled/"] },
  js.configs.recommended,
  { files: ["**/*.{js,mjs}"], languageOptions: { globals: globals.node } },
];
