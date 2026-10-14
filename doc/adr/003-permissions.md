# ADR-003: Minimal Sandbox Permissions

## Status

Accepted

## Context

A template's permissions are shown to every GTM user who adds it, and reviewed for the Community Template Gallery. Each one should be necessary, and as narrow as possible.

## Decision

The template asks for exactly:

- **Injects scripts**: `https://cdn.jsdelivr.net/npm/@smarter.sh/ui-chat@*`, the embed script's package on jsDelivr, at any version (ADR-004).
- **Accesses global variables**: `SmarterChatConfig` (read, write), `SmarterChat.version` (read), and `SmarterChat.mount` (execute).
- **Logs to console**: in debug (Preview) mode only.

It reads no cookies, sends no pixels, and reads nothing about the page or the visitor. The embed script then talks to the Smarter platform itself, outside the sandbox, as any injected script does.

## Consequences

- **Positive:**
  - A short, readable list for reviewers and security teams.
- **Negative:**
  - The embed script can't be self-hosted with this template: the permission names jsDelivr. A site that hosts it uses a Custom HTML tag.

## Related ADRs

- [ADR-004: The Embed Script Is Loaded from jsDelivr, at a Pinned Version](004-cdn.md)
