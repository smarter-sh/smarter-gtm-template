# CLAUDE.md

Guidance for Claude Code (and other coding agents) working in this repository.

smarter-gtm-template is **Smarter Chat for Google Tag Manager**: one GTM
custom tag template, `template.tpl`, for web containers, published in GTM's
Community Template Gallery. It adds a Smarter chatbot to any site that has GTM,
by loading the embed script of
[`@smarter.sh/ui-chat`](https://github.com/smarter-sh/smarter-chat)
(`../smarter-chat`) from jsDelivr with GTM's `injectScript`, configured
through `window.SmarterChatConfig`. The chatbot is an LLMClient on a Smarter
platform ([smarter-sh/smarter](https://github.com/smarter-sh/smarter), `../smarter`).

Detailed know-how lives in the Agent Skills under `skills/` (symlinked to
`.claude/skills`). **Load `smarter-gtm-development` first for any change.**

## Hard rules

1. **Never run git write commands**, here, in `../smarter` or in
   `../smarter-chat`. "Write a git commit" means print the command as text.
   See `smarter-git-commits`.
2. **Run the tests yourself** after any change (`make test`): the template's
   own `___TESTS___` scenarios, run in Node, and the sandbox lint.
3. **GTM's sandbox is not JavaScript.** No arrow functions, classes, template
   literals, regex literals, spread, `typeof`, `new` or `this` in the template's
   code. The sandbox lint enforces it.
4. **Permissions are minimal and declared.** A new `require()` needs its
   permission in `___WEB_PERMISSIONS___`, as narrow as possible.
5. **Never rename or remove a field's `name`**: containers store values by name.
6. **`template.tpl`, `metadata.yaml` and `LICENSE` stay at the repository
   root**, and the license stays Apache-2.0: the Gallery requires both.
7. **This repository is public.** No api keys, container ids, account ids or
   customer data anywhere.

## Repository map

| Path                  | Contents                                                              |
| --------------------- | --------------------------------------------------------------------- |
| `template.tpl`        | The template: info, fields, sandboxed code, permissions, tests, notes |
| `metadata.yaml`       | The Gallery's versions (commit shas) and links                        |
| `test/harness.mjs`    | Runs the template's code and `___TESTS___` in Node, with fakes of GTM |
| `test/*.test.mjs`     | Vitest: the scenarios, the sandbox lint, the sections and metadata    |
| `scripts/`            | `embed-version.mjs`                                                   |
| `doc/adr/`, `skills/` | Architecture decisions, Agent Skills                                  |

User documentation lives in the platform's repository:
`../smarter/docs/source/smarter-framework/smarter-gtm.rst`.

## Common commands

```bash
make init                    # npm dev dependencies, pre-commit hooks
make test                    # Vitest: scenarios, sandbox lint, sections, metadata
make coverage                # the same, with coverage of template.tpl's code
make lint                    # ESLint and Prettier
make embed-version V=0.9.1   # the default embed script version
```

## Definition of done

- The change follows an existing pattern and the ADRs in `doc/adr/`.
- A `___TESTS___` scenario covers it, and `make test` passes.
- Pre-commit hooks pass on the changed files.
- Field help texts and docs.smarter.sh describe user-facing changes.
- Your summary says what changed, what you verified, and what you skipped
  (such as importing the template into a real container).
