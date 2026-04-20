# Kaiden mockups

Static HTML mockups for the **Kaiden** desktop control plane: install wiring, workspaces, models and providers, projects, Secret Vault, extensions, and related surfaces. Pages are plain HTML/CSS/JS (no build step) so designers and PMs can open them directly in a browser.


## What is in the repo

| Area | Mockup paths | Notes |
|------|----------------|------|
| Welcome & first-run | `welcome/index.html`, `onboarding/index.html` |  |
| Workspaces | `sessions/index.html`, `sessions/create.html` | Primary nav label: **Workspaces** |
| Coding agents & sessions | `coding-agent/index.html`, `agent-feed/index.html`, `chat/index.html`, `tasks/index.html` | Agent-oriented flows |
| Models | `models/index.html`, `models/provider-config.html` | Local, in-house (OpenShift AI), LLM providers; see [spec/feature-models-catalog.md](spec/feature-models-catalog.md) |
| Projects | `projects/index.html` | Optional in some demo modes |
| Secret Vault | `services/index.html` | Product label in the UI: **Secret Vault** |
| Catalogs | `knowledges/index.html`, `mcp/index.html`, `skills/index.html`, `extensions/index.html` | |
| Sandbox & CLI | `sandbox/index.html`, `cli/index.html` | Supporting mocks for policies and terminal workflow |
| Settings | `settings/index.html` | |

Shared UI: `assets/css/styles.css`, `assets/js/sidebar-loader.js` (navigation + status chrome), `assets/js/demo-scenario.js` (progressive demo). A reference copy of the nav lives at `shared/components/sidebar.html` (sync with `sidebar-loader.js` when the sidebar changes).

## Directory layout (high level)

```
kortex-mockups/
├── index.html                 # Redirects to welcome/ (query string preserved)
├── welcome/
├── onboarding/
├── sessions/
├── coding-agent/, agent-feed/, chat/, tasks/
├── projects/, models/, services/
├── knowledges/, mcp/, skills/, extensions/
├── sandbox/, cli/, settings/
├── assets/                    # css/, js/, data/ (e.g. demo scenarios)
├── shared/components/
├── functional-spec/           # Epics/features mapped to mockups
├── summary/, issues/, website/
└── Sprint-290.md
```

## Getting started

Open `index.html` in a browser to land on **Welcome**, then use **Start guided setup** (or open `onboarding/index.html`) for the onboarding mock.

Subpages that use the shell typically load `assets/js/demo-scenario.js` first, then `assets/js/sidebar-loader.js`, with `data-nav-root=".."` on `<body>` where paths are one level deep.

## Progressive demo (`demo-scenario.js`)

- **Demo bar** — On screens that load `demo-scenario.js`, a fixed top bar runs a short scenario: **Start** (or a step dot) begins; while active: **Play**, **Prev**, **Next**, **Restart**, **Exit**.
- **`?demo=onboarding`** or **`?demo=empty`** (legacy) — `{ active: true, step: 0 }`.
- **Step 1 — Onboarding:** Opens `onboarding/index.html`; elsewhere, **Extensions** + **Settings** only, lists cleared; Extensions catalog shows **Available** only.
- **Step 2 — Post-onboarding:** Jumps to **Workspaces** (`sessions/index.html`) with an empty list.
- **Step 3 — Full workspace:** Rich data from the demo JSON (`full` key under `assets/data/demo-scenario/`).
- **`?demo=full`** or **`?demo=reset`** — Exits demo mode and reloads.

Content is driven by `assets/data/demo-scenario/` (see `manifest.json`). Example: `extensions/index.html?demo=onboarding`.
