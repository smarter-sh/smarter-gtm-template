# ADR-002: Configuration Through window.SmarterChatConfig

## Status

Accepted

## Context

A sandboxed template loads a script with `injectScript(url, onSuccess, onFailure, cacheToken)`, which can't set the script tag's attributes, so the embed script's `data-chatbot` can't be used. The embed script also reads `window.SmarterChatConfig`, an object or an array of them, when it runs, and adds a chat for each.

## Decision

The template builds the options object from its fields, in the embed script's camelCase names, leaving out empty ones, and adds it to `window.SmarterChatConfig` with `setInWindow`, then calls `injectScript`. When the embed script has already run (`window.SmarterChat.version` exists), it calls `window.SmarterChat.mount(options)` instead (ADR-005).

## Alternatives Considered

- **The options in the script's url's query string.** The embed script doesn't read them, and urls with an api key end up in logs.

## Consequences

- **Positive:**
  - Uses an interface of the embed script that exists for this reason, and works with GTM's sandbox.
- **Negative:**
  - The template depends on `window.SmarterChatConfig` and `window.SmarterChat.mount`, which the embed script must keep.

## Related ADRs

- [ADR-003: Minimal Sandbox Permissions](003-permissions.md)
- [ADR-005: Several Tags, and Single-Page Apps](005-several-tags.md)
