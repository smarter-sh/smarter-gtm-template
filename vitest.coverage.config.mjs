// The tests with a coverage report of template.tpl's code: `make coverage`, or `npm run coverage`. The harness runs
// the code from test/.compiled/template.js, whose lines are template.tpl's, and CI uploads coverage/lcov.info to
// Codecov, where codecov.yml maps the file to template.tpl. See doc/adr/007-testing.md.
import { defineConfig, mergeConfig } from "vitest/config";

import project from "./vitest.config.mjs";

export default mergeConfig(
  project,
  defineConfig({
    test: {
      coverage: {
        provider: "v8",
        include: ["test/.compiled/template.js"],
        reporter: ["text", "lcov"],
        reportsDirectory: "coverage",
      },
    },
  }),
);
