# kortex-mockups

Static HTML mockups for **Kaiden**: desktop control plane (install, extensions, projects, sandbox) plus **`kdn`** CLI as the primary coding-agent surface.

Scenario and scope are defined in **[Sprint-290.md](Sprint-290.md)** (CLI workflow, Podman-style onboarding, project policies, sandbox proofs, semantic routing).

## Directory structure

```
kortex-mockups/
├── Sprint-290.md
├── index.html              # Redirects to welcome/index.html (preserves ?demo=…)
├── welcome/index.html      # Fresh-install landing → guided onboarding
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── demo-scenario.js    # Top demo bar (always visible); load before sidebar-loader
│       ├── demo-bar.css        # Styles injected by demo-scenario.js
│       ├── sidebar-loader.js   # Nav + status bar; loads openshift-ai + kaiden-empty-mock
│       ├── kaiden-empty-mock.js
│       ├── openshift-ai.js
│       └── agent-feed.js
├── onboarding/, projects/, extensions/, sandbox/, cli/, …
└── shared/components/sidebar.html   # Reference copy of nav (manual sync)
```

## Getting started

Open `index.html` in a browser to land on **Welcome**, then choose **Start guided setup** to open onboarding.

Subpages load `demo-scenario.js` then `assets/js/sidebar-loader.js` with `data-nav-root=".."` on `<body>` where needed.

## Progressive demo (three steps)

- **Demo bar** — On every screen that loads `demo-scenario.js`, a **fixed top bar** shows three steps. **Start** (or a step dot) begins the scenario; while active: **Play** / **Prev** / **Next** / **Restart** (back to step 1) / **Exit**.
- **`?demo=onboarding`** or **`?demo=empty`** (legacy) — `{ active: true, step: 0 }`.
- **Step 1 — Onboarding:** Clicking the first step dot (or **Start**) opens **`onboarding/index.html`** (Setup). Elsewhere, **Extensions** + **Settings** only, lists cleared; **Extensions** catalog shows **Available** only.
- **Step 2 — Post-onboarding:** Jumps to **Agents** (`sessions/index.html`); agent list is **empty** (no workspaces yet). Other `postOnboarding` JSON still applies on Projects, Vault, Knowledges.
- **Step 3 — Full workspace:** Rich mocks (`full` key in the same JSON files).
- **`?demo=full`** or **`?demo=reset`** — Exits demo mode and reloads.

Screen content is driven by `assets/data/demo-scenario/` (see `manifest.json`). Example: `extensions/index.html?demo=onboarding`.
