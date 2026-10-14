# ADR-006: Consent

## Status

Accepted

## Context

GTM's consent mode lets a container hold tags until the visitor consents to a type of storage. The embed script stores a session cookie, for the chat's conversation, and localStorage keys for its layout, and sends the visitor's messages to the Smarter platform when they chat. It sets no advertising or analytics storage.

## Decision

The template doesn't check consent itself. Its documentation recommends that the tag require **`functionality_storage`** in the tag's Consent Settings, where the GTM user configures consent for every tag. The template has no consent-related permission, because it reads no consent state.

## Consequences

- **Positive:**
  - Consent stays where GTM users manage it, for every tag.
- **Negative:**
  - A GTM user who skips the Consent Settings loads the chat without consent; the docs say so.

## Related ADRs

- [ADR-011: Documentation](011-documentation.md)
