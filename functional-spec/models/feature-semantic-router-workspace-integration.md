# Feature: Semantic Router in workspace creation

**Parent epic:** [Epic: Semantic Routers](./epic-semantic-routers.md)

### Problem

When a developer creates a new workspace, they currently select a single model from the catalog. Agentic workflows that generate many requests of varying complexity waste tokens when every request goes to the same heavyweight model. There is no way to attach an intelligent router as the inference backend so the workspace can automatically distribute requests across cheap and expensive models.

### Solution (capabilities)

- In **Step 2 (Model selection)** of the workspace creation wizard (`sessions/create.html`), add a **"Use Semantic Router"** mode alongside the existing direct model selection.
- A mode toggle (tabs or segmented control) lets the user switch between "Single model" (existing UI) and "Semantic Router".
- In Semantic Router mode: a card grid of configured routers is shown. Each card has a header (icon, name, listener port) with a blue-accent gradient, an abstract flow visualization (Agents → Router → local/cloud backend dots), a backend model list (name + local/cloud tag), and feature chips (e.g. Semantic cache, PII detection, Keyword signals). The user selects one router.
- Selection state follows the same blue-accent pattern as the rest of the wizard (accent-colored border + subtle background tint, no checkmark), consistent with `.ob-agent-tile.selected` and `.ca-workspace-source-option.is-selected`.
- The selected router's endpoint (e.g. `http://localhost:8899`) is stored as the inference endpoint for the session.
- In **Step 4 (Review)**, the inference endpoint row shows "Semantic Router: [name]" with the listener address/port, instead of a single model name.
- A "Manage routers" link below the card grid navigates to `models/index.html` with the Semantic Routers category active.

**Mockup:** [`sessions/create.html`](../../sessions/create.html)

### Priority

- **P0:** Mode toggle between Single model and Semantic Router in Step 2 (blue-accent active state); router card grid with visual flow + backend list + feature chips; blue-accent selection state; router appears in Step 4 review.
- **P1:** "No routers configured" empty state with a link to `models/semantic-router-create.html`.

## Sub-tasks

- [ ] Add segmented control ("Single model" / "Semantic Router") at the top of Step 2 panel; active button uses blue-accent background tint + inner border ring.
- [ ] "Semantic Router" panel: card grid with at least 2 demo routers. Each card: header (icon + name + port, blue-accent gradient), abstract flow dots (Agents → Router → backend dots), backend model list with local/cloud tags, feature chips.
- [ ] Selected router card: blue-accent border + background tint, no checkmark. Matches agent tile and workspace source option selection patterns.
- [ ] `code` elements in the router description text use blue accent color (`#4fc3f7`).
- [ ] Step 4 review row: replace model name with "Semantic Router: [name]" and endpoint display.
- [ ] "Manage routers" link below cards navigates to `models/index.html?cat=router`.
- [ ] Keep mockup in sync when the HTML changes.

## Related

- [Semantic Router catalog & configuration](./feature-semantic-router-catalog.md)
- [Create coding agent workspace](../agents/feature-create-agent-workspace.md)
- [Epic: Secret Vault](../secret-vault/epic-secret-vault.md) — credentials for cloud backends in the router are vault-referenced, not surfaced directly in this wizard
