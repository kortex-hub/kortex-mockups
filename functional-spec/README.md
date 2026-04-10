# Functional specification (living)

We keep this folder aligned with the HTML mockups in the repo. When we change navigation, copy, layout, or flows under `sessions/`, `projects/`, `services/`, or `agent-feed/`, we update the matching epic or feature file here in the same change (or immediately after).

## Map: epics → mockups

| Epic folder | Primary mockup paths |
|-------------|----------------------|
| [agents](./agents/epic-agents.md) | `sessions/`, `agent-feed/` |
| [projects](./projects/epic-projects.md) | `projects/` |
| [secret-vault](./secret-vault/epic-secret-vault.md) | `services/` (product label: Secret Vault) |

## Structure

- **Epic** — one file per domain: problem, P0/P1 scope, links to feature files.
- **Feature** — one markdown file per feature; **sub-tasks** live in that file as checklists (no separate file per sub-task).
- **Screenshots** — we reuse captures under `website/` when they exist; add new PNGs there (or next to the epic) and reference them from the feature file.

## Voice

We write specs in the same style as product issues: context before requirements, collective “we,” honest gaps (“definition to be refined”), and links to related mockups—no orphan pages.
