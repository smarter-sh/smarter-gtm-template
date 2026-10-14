# ADR Introduction

Architectural Design Records (ADRs) are short documents that capture a single architectural or design decision, its context, and its consequences. Less is more: keep them brief.

These are the ADRs of Smarter Chat for Google Tag Manager, the GTM custom tag template that adds a Smarter chatbot to any site that has a GTM web container. They follow the Smarter platform's own [ADRs](https://github.com/smarter-sh/smarter/tree/main/docs/source/adr) and those of the [Python SDK](https://github.com/smarter-sh/smarter-python/tree/main/doc/adr), from which this repository's layout is copied, and its siblings for [WordPress](https://github.com/smarter-sh/smarter-wordpress/tree/main/doc/adr), [Drupal](https://github.com/smarter-sh/smarter-drupal/tree/main/doc/adr) and [Shopify](https://github.com/smarter-sh/smarter-shopify/tree/main/doc/adr).

See: [Michael Nygard's ADRs](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions.html)

## Guidelines for writing ADRs

- **One decision per ADR.**
- **Be concise.** Focus on clarity and brevity.
- **State the context:** the forces that led to the decision.
- **List the alternatives**, and why they weren't chosen.
- **Explain the decision**, and **describe its consequences**, positive and negative.
- **Use simple language**, for future contributors without today's context.
- **Use the same format** as the others, and **reference related ADRs**.

## Index

- [ADR-001: Scope: a Custom Tag Template](001-scope.md)
- [ADR-002: Configuration Through window.SmarterChatConfig](002-global-config.md)
- [ADR-003: Minimal Sandbox Permissions](003-permissions.md)
- [ADR-004: The Embed Script Is Loaded from jsDelivr, at a Pinned Version](004-cdn.md)
- [ADR-005: Several Tags, and Single-Page Apps](005-several-tags.md)
- [ADR-006: Consent](006-consent.md)
- [ADR-007: Testing](007-testing.md)
- [ADR-008: The Community Template Gallery and Versioning](008-gallery.md)
- [ADR-009: Licensing](009-licensing.md)
- [ADR-010: Code Quality and CI](010-code-quality.md)
- [ADR-011: Documentation](011-documentation.md)
