---
name: smarter-gtm-development
description: Start here for any change to the smarter-gtm-template repository, Smarter Chat for Google Tag Manager - a GTM custom tag template (template.tpl) that loads @smarter.sh/ui-chat's embed script from jsDelivr with injectScript, configured through window.SmarterChatConfig. Gives the rules of GTM's sandboxed JavaScript, the template file's sections, permissions, how to add a field, several tags and single-page apps, the Gallery's metadata.yaml, and an index of the narrower skills.
---

# Smarter Chat for Google Tag Manager: Development

## template.tpl's sections

The file is sections, each headed `___NAME___` and separated by blank lines,
in this order: `___TERMS_OF_SERVICE___`, `___INFO___` (JSON: type, name,
brand, categories, `containerContexts: ["WEB"]`), `___TEMPLATE_PARAMETERS___`
(JSON: the fields), `___SANDBOXED_JS_FOR_WEB_TEMPLATE___` (the code),
`___WEB_PERMISSIONS___` (JSON), `___TESTS___` (YAML: `scenarios`, `setup`) and
`___NOTES___`. Keep the order and the blank lines: GTM's import is strict.
Editing it in GTM's template editor and exporting it again is fine; then
re-run `make test`.

## Sandboxed JavaScript

GTM runs the code in a sandbox that accepts a subset of ES5 plus `const` and
`let`. Everything else is an api from `require('<name>')`, each with a
permission. In particular:

- no arrow functions, classes, template literals, spread, regex literals,
  `typeof` (use `require('getType')`), `new`, `this`, `try`;
- no `window` or `document`: `copyFromWindow`, `setInWindow`, `callInWindow`;
- the tag must call `data.gtmOnSuccess()` or `data.gtmOnFailure()`, once.

The sandbox lint (`test/sandbox.test.mjs`) rejects the syntax, and checks that
every `require()`d api has its permission.

## What the code does

1. Builds the embed script's options from `data` (camelCase names; empty
   fields are left out; `mode` is `inline` when `target` is set).
2. If `SmarterChat.version` exists, the script has run: `callInWindow('SmarterChat.mount', options)`.
3. Else appends the options to `SmarterChatConfig` (an array), and calls
   `injectScript(url, onSuccess, onFailure, url)` (the url is the cache token,
   so the script loads once). See `doc/adr/005-several-tags.md`.

## Adding a field

1. Check the option in `../smarter-chat/src/embed/options.ts`.
2. Add the field to `___TEMPLATE_PARAMETERS___` with a `help` text and
   `valueValidators`; put rarely used ones in the Advanced group.
3. Map it in the code, leaving it out when empty.
4. Add a `___TESTS___` scenario; run `make test`.
5. Describe it on `../smarter/docs/source/smarter-framework/smarter-gtm.rst`.

## Releasing to the Gallery

semantic-release tags the repository. Then, by hand: add the release commit's
sha and notes at the top of `metadata.yaml`'s `versions`
(`doc/adr/008-gallery.md`). Remind the user; never invent a sha.

## Related skills

| Skill                  | Use it when                                            |
| ---------------------- | ------------------------------------------------------ |
| `smarter-gtm-testing`  | Writing scenarios, or changing the harness or the lint |
| `smarter-code-quality` | Before finishing                                       |
| `smarter-git-commits`  | Asked to write a commit message                        |
| `monthly-maintenance`  | Bumping the embed script version and dependencies      |
