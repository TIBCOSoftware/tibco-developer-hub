# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Project documentation shared with all AI agents lives in `AGENTS.md` and is imported below.

@AGENTS.md

## Claude Code-specific

### Skills

Twelve custom skills are available under `.claude/skills/` — invoke them with `/skill-name` in Claude Code:

| Skill | Purpose |
|-------|---------|
| `setup-dev-hub` | Bootstrap a fresh local dev environment end-to-end |
| `create-template` | Author a new Backstage scaffolder template |
| `create-import-flow` | Author a new import flow template |
| `create-self-service-flow` | Author a new self service flow that drives the TIBCO Platform APIs |
| `create-theme` | Create or replace a Backstage theme with optional custom logo |
| `test-template` | Dry-run a scaffolder template and inspect rendered output |
| `test-import-flow` | Validate an import flow (dry-run + live catalog verification) |
| `test-self-service-flow` | Validate a self service flow (dry-run + live platform & catalog verification) |
| `reuse-or-build` | Decide whether to reuse/extend an existing service or build a new one, via the catalog REST API |
| `impact-analysis` | Assess the change blast radius of a catalog entity via the catalog REST API |
| `data-lineage` | Trace where a field or message comes from and where it ends up, via the catalog REST API |
| `api-version-diff` | Diff two versions of an API specification and publish the differences as TechDocs |

