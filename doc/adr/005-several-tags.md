# ADR-005: Several Tags, and Single-Page Apps

## Status

Accepted

## Context

A container can have several Smarter Chat tags (two chatbots, for two parts of a site), which may fire before the embed script has loaded. Single-page apps fire tags again on history changes, and a tag may fire again on the same page.

## Decision

- Before the script has run, each tag **appends** its options to `window.SmarterChatConfig` (made an array if it was an object), and calls `injectScript` with the script's url as its cache token, so the script is loaded once and runs once, with every tag's options.
- After it has run, each tag calls `window.SmarterChat.mount(options)`.
- The embed script adds a chatbot once per page (it skips a chatbot that it has already added), so a tag that fires twice adds one launcher.

## Consequences

- **Positive:**
  - "All Pages" and "History Change" triggers are both safe.
- **Negative:**
  - A tag can't remove its chat; a page reload does.

## Related ADRs

- [ADR-002: Configuration Through window.SmarterChatConfig](002-global-config.md)
