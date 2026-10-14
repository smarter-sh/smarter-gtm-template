# ADR-001: Scope: a Custom Tag Template

## Status

Accepted

## Context

[Google Tag Manager](https://tagmanager.google.com) (GTM) lets marketers add tags to a site without changing its code: its container script is already on millions of sites, on every CMS and framework. A **custom template** is a tag type with a settings form, whose code runs in GTM's sandboxed JavaScript, with declared permissions. Templates can be shared in GTM's [Community Template Gallery](https://tagmanager.google.com/gallery/), where anyone can add them to a container. A GTM user could also paste the embed script's tag into a Custom HTML tag.

## Decision

This repository is one **tag template** for **web containers**, `template.tpl`, "Smarter Chat", whose form has the embed script's options (chatbot url, api key, position, label, color, start open, an optional target element) and which loads `@smarter.sh/ui-chat`'s embed script with them. It is published in the Community Template Gallery (ADR-008).

## Alternatives Considered

- **Only documenting a Custom HTML tag.** Works, but Custom HTML runs unsandboxed, with no permissions, and many organizations' GTM policies forbid it. Docs still show it (ADR-011).
- **A server-side (sGTM) template.** The chat runs in the browser; there is nothing for a server container to do.

## Consequences

- **Positive:**
  - Any site with GTM, whatever it is built with, can add the chat without a developer, and with permissions that a reviewer can read.
- **Negative:**
  - GTM's sandbox limits what the template can do (ADR-002, ADR-003).

## Related ADRs

- [ADR-002: Configuration Through window.SmarterChatConfig](002-global-config.md)
- [ADR-008: The Community Template Gallery and Versioning](008-gallery.md)
