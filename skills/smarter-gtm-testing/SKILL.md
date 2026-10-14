---
name: smarter-gtm-testing
description: Use when writing or running smarter-gtm-template's tests - GTM ___TESTS___ scenarios in template.tpl (mock, assertApi, assertThat, runCode), which test/harness.mjs runs in Node with fakes of GTM's sandbox apis, the sandbox lint that rejects JavaScript GTM's sandbox doesn't accept and checks permissions, and the tests of the template's JSON/YAML sections and metadata.yaml.
---

# Smarter Chat for Google Tag Manager: Testing

`make test` runs Vitest on `test/*.test.mjs`. `make coverage` runs them with
a coverage report of the template's code: the harness runs it from
`test/.compiled/template.js` (generated, gitignored), padded so that its line
numbers are `template.tpl`'s, and `codecov.yml` reports it as `template.tpl`.
CI uploads the report to Codecov; keep the code's branches covered.

## Scenarios (`___TESTS___`)

The tests live in `template.tpl` itself, in GTM's format, so GTM's template
editor runs them too. A scenario's `code` sets `mockData`, may `mock()` an
api, calls `runCode(mockData)`, and asserts:

```yaml
- name: Loads the embed script with the launcher's options
  code: |-
    const mockData = { chatbot: 'https://chat.example.com/', position: 'bottom-right' };
    runCode(mockData);
    assertApi('injectScript').wasCalled();
    assertApi('setInWindow').wasCalledWith('SmarterChatConfig', [{ chatbot: 'https://chat.example.com/', mode: 'launcher', position: 'bottom-right' }], true);
    assertApi('gtmOnSuccess').wasCalled();
```

The scenarios' own code is sandboxed JavaScript too: keep to the same subset.

`test/harness.mjs` implements, in Node: `require` for the apis the template
uses (`injectScript` calls its success callback unless mocked, `copyFromWindow`
and `setInWindow` share a fake window), `mock(name, value)`, `runCode(data)`,
`assertApi(name)` with `wasCalled()`, `wasNotCalled()`,
`wasCalledWith(...args)` (deep equality), `assertThat(value)` with `isEqualTo`,
`isNotEqualTo`, `isTrue`, `isFalse`, `isUndefined`, `isDefined`, and `fail()`.
`setup` runs before each scenario. Add to the harness when a scenario needs an
api it lacks, following GTM's documented behavior.

## Sandbox lint (`test/sandbox.test.mjs`)

Parses the sandboxed code and the scenarios with Acorn and rejects the syntax
that GTM's sandbox doesn't accept, and globals other than `data`, `require`
and the test apis. It checks that every `require('<api>')` has a permission in
`___WEB_PERMISSIONS___`, and that the permissions are exactly the ones in
`doc/adr/003-permissions.md`.

## Sections and metadata (`test/template.test.mjs`)

Every JSON section parses; the fields have unique names, help texts and the
names that containers store (never removed); `metadata.yaml` parses, and its
shas are 40-character hex.

## Before a Gallery release

Import `template.tpl` into a test container (Templates → New → ⋮ → Import),
run its tests in the editor, and preview a tag on a page. Not automated.
