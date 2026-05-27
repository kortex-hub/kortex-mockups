# Feature: Semantic Router catalog & configuration

**Parent epic:** [Epic: Semantic Routers](./epic-semantic-routers.md)

### Problem

Developers need to define, manage, and iterate on Semantic Router configurations from within the product UI rather than hand-editing YAML files. Without a visual catalog, it is hard to see which routers exist, what backends they pool, or which routing rules they apply. Without a guided creation wizard, the full YAML configuration surface (listeners, backend models, signals, decisions, advanced toggles) is too dense to configure correctly from scratch.

### Solution (capabilities)

- **Semantic Routers sidebar category** in `models/index.html`: a new left-nav item alongside LLM Providers, In-house, and Local. Badge shows count of configured routers.
- **Router list view**: when the category is active, the main area shows a card grid of configured routers. Each card shows: a header section (icon + name + listener port, blue-accent gradient background), an abstract flow visualization (Agents node → Router node → local/cloud backend dots), a full-width backend model list (name + local/cloud tag, one row per backend), and feature chips (e.g. Semantic cache, PII detection, Keyword signals). The entire card is a clickable link to the detail view.
- **"Add Semantic Router" button** in the list view header, navigating to the create wizard.
- **Create wizard** (`models/semantic-router-create.html`): 4-step guided flow.
- **Detail / edit view** (`models/semantic-router-details.html`): tabbed layout for reviewing and editing an existing router.

**Mockup:** [`models/index.html`](../../models/index.html), [`models/semantic-router-create.html`](../../models/semantic-router-create.html), [`models/semantic-router-details.html`](../../models/semantic-router-details.html)

### Create wizard — step detail

**Step 1 — Basic setup**
- Router name (required, used as the identifier in workspace selection)
- Description (optional, freeform)
- Listener address (default `0.0.0.0`)
- Listener port (default `8899`)
- Request timeout (default `300s`)

**Step 2 — Backend models**
- Add/remove backend model rows (at least one required)
- Per model: name (must match what the backend expects, e.g. Hugging Face model ID), endpoint URL, protocol (HTTP / HTTPS), weight (integer, for load balancing), capabilities (multi-select tags: coding, reasoning, math, analysis, creative, debugging), quality score (0–1), optional pricing (USD per 1M tokens prompt/completion), optional API access key
- Mark one model as the default (fallback when no decision matches)
- Hint: "Do not add `/v1` to the endpoint — the router adds the path automatically"

**Step 3 — Signals & decisions**
- **Signals section**: add keyword signals (name, AND/OR operator, keyword list, case-sensitive toggle) or embedding signals (name, anchor prompt list, similarity threshold)
- Domain classifier toggle: enable mmBERT neural classifier for automatic domain detection (math, code, creative) without keyword lists
- **Decisions section**: add routing decisions — name, description, priority (integer, higher = evaluated first), rules (AND/OR operator + conditions referencing defined signals), target model reference, use-reasoning toggle
- Visual priority ordering (higher priority decisions shown first)
- Default route is auto-generated pointing to the default model at priority 1

**Step 4 — Advanced & review**
- Toggle: HNSW semantic cache — deduplicates paraphrased identical requests via vector similarity
- Toggle: Jailbreak detection — blocks prompt injection attempts before they reach models
- Toggle: PII detection — redacts sensitive information (emails, phone numbers, tokens) from requests
- Toggle: Complexity scoring — neural pipeline estimates request complexity and adjusts routing
- YAML config preview (read-only) — shows the `config.yaml` the router would generate
- Save button creates the router and returns to the catalog list

**Detail / edit view — tab layout**

| Tab | Content |
|-----|---------|
| Overview | Quick stats grid (backends, decisions, signals, latency P50, local %, cache hit rate) + **Routing flow diagram** (Agents → Router box with decision rules → backend nodes with local/cloud tags, connected by branch lines) + Router configuration info rows (listener, last verified, description, default model, advanced features enabled, created date) |
| Backend models | Editable table with add/delete per row. "Add model" button opens an inline form: model picker (grouped local/cloud), endpoint URL, protocol, weight, quality score, capabilities (comma-separated), set-as-default checkbox. Trash icon appears on row hover to remove. |
| Signals | List of keyword/embedding signals. "Add signal" button opens inline form: name, type (Keyword/Semantic/Regex), keywords (comma-separated textarea), operator (OR/AND), case-insensitive toggle. Keywords displayed as comma-separated monospace text (not pill badges). Trash icon on hover to delete. |
| Decisions | Priority-ordered decision list. "Add decision" button opens inline form: name, priority, condition signal (select), backend model (select), description, reasoning mode toggle. Trash icon on hover to delete. |
| Advanced | Vertical list of feature rows, each with icon + name + description + toggle switch. Features: Semantic cache (HNSW), Jailbreak detection, PII detection & redaction, Complexity scoring, Domain classifier. |
| YAML Config | Read-only generated YAML, copy-to-clipboard button |

### Priority

- **P0:** Router list view in `models/index.html` sidebar; router cards with flow visualization + backend list + feature chips; "Add" button linking to create wizard; all 4 wizard steps; at least 2 demo routers; detail page with all 6 tabs including routing flow diagram in Overview and inline add/delete in Backends, Signals, and Decisions tabs.
- **P1:** Inline validation messages on required fields; "Test connection" action per backend model; YAML and DSL toggle in Step 4 preview; sorting and filtering in the router list.

## Sub-tasks

- [ ] Add "Semantic Routers" to the left sidebar nav in `models/index.html`; implement `filterCategory('router', this)` handler; add demo router cards in the main area section.
- [ ] Create `models/semantic-router-create.html`: 4-step wizard with the same stepper visual language as `sessions/create.html`.
- [ ] Step 2: "Add backend model" row must support at least 3 demo rows pre-populated with realistic values (local + cloud examples).
- [ ] Step 3: keyword signal builder UI; decisions priority-ordered list; auto-generated default route.
- [ ] Step 4: toggle cards for advanced features; YAML preview code block.
- [ ] Create `models/semantic-router-details.html`: breadcrumb + tabbed layout; Overview tab shows stat grid + routing flow diagram + config info rows (no status badge); Backends tab has add/delete; Signals tab has add/delete with inline form; Decisions tab has add/delete with inline form; Advanced tab is a toggle list.
- [ ] API key fields for cloud backends must use `type="password"` input; display masked value after save (same pattern as Secret Vault).
- [ ] Keep mockup files in sync when the HTML changes.

## Related

- [Semantic Router in workspace creation](./feature-semantic-router-workspace-integration.md)
- [Epic: Secret Vault](../secret-vault/epic-secret-vault.md) — future: reference vault entries for backend API keys instead of inline input
