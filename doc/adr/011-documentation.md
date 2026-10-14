# ADR-011: Documentation

## Status

Accepted

## Context

The template's users are marketers and analysts in GTM, who read its fields' help texts and its Gallery page, and Smarter users, who read docs.smarter.sh.

## Decision

- Every field has a help text, which is the template's user documentation in GTM.
- **docs.smarter.sh** has the page `smarter-framework/smarter-gtm.rst`, in the platform's repository, listed in Smarter APIs and SDKs: adding the template, the trigger, the Consent Settings (ADR-006), the LLMClient's `allowedOrigins`, and the Custom HTML alternative.
- **`README.md`** is the Gallery's documentation link, and is for contributors too.

## Consequences

- **Positive:**
  - Each audience has one place to look.
