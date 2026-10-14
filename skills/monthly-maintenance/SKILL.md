---
name: monthly-maintenance
description: Use when asked to do smarter-gtm-template's monthly maintenance, or part of it - update the default embed script version to the latest @smarter.sh/ui-chat and pick up new options as fields, update npm dev dependencies, retest, and write a "fix" or "feat" git commit, then remind the user to add the release's sha to metadata.yaml.
---

# Monthly Maintenance

1. **The embed script.** Compare the **Embed script version** field's default
   in `template.tpl` with `npm view @smarter.sh/ui-chat version`. Read
   `../smarter-chat/CHANGELOG.md` between them; check that
   `window.SmarterChatConfig` and `SmarterChat.mount` haven't changed. Update
   it with `make embed-version V=<version>`, and add fields for new options.
   Minor: `feat`; patch: `fix`.
2. **Dependencies.** `npm update`, `pre-commit autoupdate`.
3. **Test.** `make lint test`.
4. **Commit.** Load `smarter-git-commits`. After the release, the user adds
   its sha to `metadata.yaml` (`doc/adr/008-gallery.md`).
