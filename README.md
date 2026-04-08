# kortex-mockups

Static HTML mockups for **Kaiden**: desktop control plane (install, extensions, projects, sandbox) plus **`kdn`** CLI as the primary coding-agent surface.

Scenario and scope are defined in **[Sprint-290.md](Sprint-290.md)** (CLI workflow, Podman-style onboarding, project policies, sandbox proofs, semantic routing).

## Directory structure

```
kortex-mockups/
├── Sprint-290.md
├── index.html              # Redirects to projects/index.html
├── assets/
│   ├── css/styles.css
│   └── js/
│       ├── sidebar-loader.js   # Nav + status bar (use data-nav-root on body)
│       ├── openshift-ai.js
│       └── agent-feed.js
├── onboarding/, projects/, extensions/, sandbox/, cli/, …
└── shared/components/sidebar.html   # Reference copy of nav (manual sync)
```

## Getting started

Open `index.html` (or `projects/index.html` directly) in a browser. Subpages load the sidebar from `assets/js/sidebar-loader.js` with `data-nav-root=".."` on `<body>` where needed.
