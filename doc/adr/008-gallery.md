# ADR-008: The Community Template Gallery and Versioning

## Status

Accepted

## Context

The [Community Template Gallery](https://developers.google.com/tag-platform/tag-manager/templates/gallery) imports a template from a public GitHub repository that has `template.tpl`, `metadata.yaml` and `LICENSE` at its root. `metadata.yaml` lists the template's versions as **commit shas** of `template.tpl`, with change notes; the Gallery offers a new version to containers when a new sha is added.

## Decision

- The repository's root has `template.tpl`, `metadata.yaml` and `LICENSE` (Apache-2.0, ADR-009), as the Gallery requires.
- semantic-release versions the repository from conventional commits, as every Smarter repository does, and tags releases.
- A Gallery release is a second step, by hand: after the release commit is on `main`, add its sha, with the release's notes, at the top of `metadata.yaml`'s `versions`, and commit that. A test checks that `metadata.yaml` is well formed, and that every sha in it is a sha.
- A field's `name` is never renamed or removed: containers store values by name.

## Consequences

- **Positive:**
  - GTM users get updates through the Gallery, with notes.
- **Negative:**
  - The Gallery's version and the repository's tag are linked by hand, in `metadata.yaml`.

## Related ADRs

- [ADR-004: The Embed Script Is Loaded from jsDelivr, at a Pinned Version](004-cdn.md)
- [ADR-009: Licensing](009-licensing.md)
