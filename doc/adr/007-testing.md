# ADR-007: Testing

## Status

Accepted

Follows the Python SDK's [ADR-009: Testing](https://github.com/smarter-sh/smarter-python/blob/main/doc/adr/009-testing.md).

## Context

GTM runs a template's tests (its `___TESTS___` section) in the template editor, by hand. GTM's sandbox accepts only a subset of JavaScript, and fails only when the template is imported or run.

## Decision

- **The tests are GTM's own**, in `template.tpl`'s `___TESTS___` section, so that they run in the template editor as well.
- **`npm test`** runs the same scenarios in Node: `test/harness.mjs` reads `template.tpl`, and runs its sandboxed code and each scenario with fakes of GTM's apis (`require`, `mock`, `assertApi`, `assertThat`, `runCode`, `fail`), so the tests run in CI. The harness runs the code from a generated file whose lines are `template.tpl`'s, so that V8 measures its coverage, which CI uploads to Codecov (`codecov.yml`).
- **A sandbox lint** (`test/sandbox.test.mjs`) parses the sandboxed code and rejects what GTM's sandbox doesn't accept: arrow functions, classes, template literals, regular expression literals, spread, `typeof`, `new`, `this`, and globals other than `data` and `require`. It also checks that every `require`d api has its permission, and that the template's sections are valid JSON and YAML.
- Before a release to the Gallery, import `template.tpl` into a test container, and run its tests and a Preview there, by hand.

## Consequences

- **Positive:**
  - One set of tests, in GTM's format, that CI runs.
- **Negative:**
  - The harness's fakes are not GTM: the import into a real container is still needed for a release.

## Related ADRs

- [ADR-008: The Community Template Gallery and Versioning](008-gallery.md)
- [ADR-010: Code Quality and CI](010-code-quality.md)
