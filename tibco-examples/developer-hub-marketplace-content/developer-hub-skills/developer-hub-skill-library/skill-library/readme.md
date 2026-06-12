# Developer Hub Skills Library

A library of **skills for AI coding agents** that automate the most common TIBCO Developer Hub
tasks — bootstrapping a local environment, authoring Software Templates and Import Flows,
rebranding the portal with a custom theme, and testing it all end-to-end. Drop these skills into
your Developer Hub checkout and your coding agent follows the same proven playbook every time.

The library bundles three things:

- **Seven skills** (`SKILL.md` runbooks) covering the full Developer Hub lifecycle.
- **`AGENTS.md`** — project documentation in the open AGENTS.md standard, auto-discovered by all
  major coding agents.
- **`CLAUDE.md`** — a thin Claude Code entry point that imports `AGENTS.md` and lists the skills.

## What is the TIBCO Developer Hub?

A self-service developer portal built on Backstage.io that centralises your TIBCO services,
templates, and documentation in one place. It scaffolds new BWCE, Flogo, and EMS applications in
minutes via **Software Templates**, automates ingestion of existing repositories via **Import
Flows**, and offers a **Marketplace** of reusable integration patterns. It runs as a Yarn 4
monorepo (`packages/app` frontend on `:3000`, `packages/backend` on `:7007`) with in-repo
Backstage plugins under the `@internal/*` scope.

Setting it up, extending it, and keeping every contribution consistent normally requires a lot of
tribal knowledge. That is exactly what these skills capture.

## The AI Skills approach

The idea is simple: **teach AI agents your team's exact workflows — once.** Instead of explaining
the same template conventions, config wiring, and test procedure to every developer (and every
agent), you encode each workflow as a skill. Any team member then invokes the same skill and the
agent follows the identical, reviewed playbook — no drift, no re-explaining.

### What is a skill?

A **skill** is a plain-Markdown runbook stored at `.claude/skills/<name>/SKILL.md`. It describes,
for one repeatable task: the **trigger** (when the agent should use it), the **key facts**, the
**step-by-step workflow**, and the **failure modes**. The agent reads the skill on demand, asks
the developer for any missing inputs, then executes the whole workflow — file creation, config
wiring, API calls, and browser verification.

```markdown
---
name: <skill-name>
description: <when the agent should use this skill>
---

# Step-by-step instructions, key facts, command references, and failure modes...
```

### How it works

1. **Developer invokes** the skill — e.g. types `/setup-dev-hub` or `/create-template` in the
   agent chat.
2. **Agent reads** the `SKILL.md` runbook — trigger, key facts, step-by-step workflow.
3. **Agent asks** targeted questions (slug, title, tags, parameters) via UI prompts.
4. **Agent executes** all file creation, YAML generation, config wiring, and browser verification.
5. **Developer gets** a fully wired, tested artefact in minutes — not hours.

## The seven skills

The library covers the full Developer Hub lifecycle — from a clean checkout, through authoring
and testing templates and import flows, to rebranding the portal, to assessing the blast radius of a
change before you make it.

| Skill | When to use | What it produces |
|-------|-------------|------------------|
| **`setup-dev-hub`** | Setting up for the first time, onboarding a new machine, or getting the app running locally. | A working local environment: config files created from templates, dependencies installed, backend on `:7007` and frontend on `:3000` (`http://localhost:3000/tibco/hub`). |
| **`create-template`** | Adding a new BWCE, Flogo, or any service template to the `/create` page. | `templates/<slug>/<slug>.yaml` (the `Template` entity) plus a `skeleton/` with `catalog-info.yaml`, a `debug` parameter for safe dry-runs, and the catalog registration. |
| **`create-import-flow`** | Ingesting an existing BWCE, BW6, BW5, Flogo, or EMS repository into the catalog. | An import-flow `Template` using the TIBCO custom actions (clone → extract-parameters → create-yaml → push), optionally with Nunjucks entity skeletons, visible at `/import-flow`. |
| **`create-theme`** | Adding a brand theme, rebranding for a customer, or changing the sidebar logo. | `packages/app/src/themes/<slug>ThemeLight.ts` (and a dark variant if requested), registered in `App.tsx`, with the logo swap wired in `Root.tsx` and type-checked. |
| **`test-template`** | Testing a template, previewing output, or debugging `${{ values.* }}` substitutions. | A full rendered file tree under `template-workspace/dry-run-<N>/` via the scaffolder dry-run API — no GitHub repo created. |
| **`test-import-flow`** | End-to-end validation of an import flow: structure check plus real catalog registration. | Phase 1 dry-run validation, then a real scaffolder task run and a catalog-API check confirming the imported entities were registered. |
| **`impact-analysis`** | Assessing the blast radius before changing a catalog entity — "what breaks if I change this API/Component/Resource?". | A report plus color-coded integration-topology diagrams under `impact_analysis/`, grounded in the live catalog graph read via the catalog REST API. |

## Business value

Encoding these workflows as skills turns hours of expert work into minutes of guided automation.

- **Speed** — new template: ~2 hrs → ~10 min; import flow: ~4 hrs → ~15 min; onboard a developer:
  days → ~1 hr; theme rebrand: ~4 hrs → ~20 min.
- **Consistency** — every template follows the TIBCO tag and folder conventions, the `debug`
  parameter is always added for safe dry-runs, and catalog entries are always registered correctly.
- **Knowledge retention** — tribal knowledge becomes executable, version-controlled runbooks that
  keep working after the original author has moved on; new team members are productive on day one.
- **Governance** — TIBCO tag conventions are enforced automatically, catalog metadata stays
  consistent, and every workflow is reviewable and improvable in version control.

## Cross-agent compatibility

The skills under `.claude/skills/` are Claude Code-native, and `AGENTS.md` (an open standard
adopted by 20k+ projects) is auto-discovered by all major agents — so the same project knowledge
is available everywhere.

| Agent | Config file discovered | Reads project docs | Runs skills natively |
|-------|------------------------|--------------------|----------------------|
| Claude Code | `CLAUDE.md` → `@AGENTS.md` | yes | yes |
| OpenAI Codex | `AGENTS.md` | yes | yes |
| GitHub Copilot | `AGENTS.md` + `copilot-instructions.md` | yes | — |
| Cursor | `AGENTS.md` + `.cursor/rules/` | yes | — |
| Devin | `AGENTS.md` + `SKILL.md` runbooks | yes | yes |
| Gemini CLI | `AGENTS.md` | yes | — |

## Getting started

The [skill library assets](https://github.com/TIBCOSoftware/tibco-developer-hub/tree/main/tibco-examples/developer-hub-marketplace-content/developer-hub-skills/developer-hub-skill-library/skill-library)
are in this entry's repository folder. To use them in your Developer Hub checkout:

1. Copy the `skills/` folder into your project's **`.claude/skills/`** directory (so each skill
   lives at `.claude/skills/<name>/SKILL.md`).
2. Copy **`AGENTS.md`** and **`CLAUDE.md`** to your repository root. If you already have these
   files, merge the **Workflows** / **Skills** sections in rather than overwriting.
3. Open the project in a coding agent (Claude Code, or any agent that reads `AGENTS.md`).
4. Invoke a skill — e.g. `/setup-dev-hub` to bootstrap the environment, or `/create-template` to
   author your first template.

That's it — the agent reads the runbook and drives the task to completion, asking you for any
inputs it needs along the way.
