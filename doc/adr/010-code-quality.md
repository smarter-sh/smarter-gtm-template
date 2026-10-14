# ADR-010: Code Quality and CI

## Status

Accepted

## Context

The template's code is sandboxed JavaScript inside a text file that no linter understands.

## Decision

- The sandbox lint (ADR-007) is the template's linter. The harness, tests and scripts are linted with ESLint, and formatted with Prettier.
- codespell, the generic pre-commit hooks and commitlint, as in every Smarter repository.
- GitHub Actions run the lint and the tests for every push and pull request (`test.yml`), and semantic-release on `main`, `beta` and `alpha` (`pushMain.yml`).

## Consequences

- **Positive:**
  - The template is checked in CI, although GTM is not there.

## Related ADRs

- [ADR-007: Testing](007-testing.md)
