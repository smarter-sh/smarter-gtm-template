# ADR-009: Licensing

## Status

Accepted

## Context

The Community Template Gallery requires templates to be licensed under the Apache License 2.0, and the template file to start with the Gallery's terms of service notice. Smarter is AGPL-3.0-or-later.

## Decision

The repository is **Apache-2.0**. It contains only the template, its tests and its tooling; the embed script it loads keeps its own license, AGPL-3.0-or-later.

## Consequences

- **Positive:**
  - Accepted by the Gallery.
- **Negative:**
  - The only Smarter repository with a permissive license.

## Related ADRs

- [ADR-008: The Community Template Gallery and Versioning](008-gallery.md)
