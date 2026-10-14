---
name: smarter-code-quality
description: Use before finishing any change to smarter-gtm-template, to lint and format it - the sandbox lint for template.tpl's code, ESLint and Prettier for the harness, tests and scripts, codespell, the generic pre-commit hooks and commitlint.
---

# Smarter Chat for Google Tag Manager: Code Quality

`.pre-commit-config.yaml` is the standard. Never bypass a hook.

| Tool         | Covers                                                |
| ------------ | ----------------------------------------------------- |
| sandbox lint | `template.tpl`'s code and scenarios (`make test`)     |
| ESLint       | `test/`, `scripts/`                                   |
| Prettier     | Markdown, YAML, JSON, JavaScript (not `template.tpl`) |
| codespell    | everything                                            |

```console
make lint test
git diff --name-only | xargs pre-commit run --files
```

Prettier never formats `template.tpl`: GTM's export format is not one that
Prettier knows, and reformatting it breaks the import.
