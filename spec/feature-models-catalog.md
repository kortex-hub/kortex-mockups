# Feature: Models catalog (Models tab)

**Status:** Mockup-complete (HTML)  
**Primary mockup:** [`models/index.html`](../models/index.html) (`<body class="models-page">`, document title `Kaiden - Models`)  
**Provider configuration:** [`models/provider-config.html`](../models/provider-config.html) (`Kaiden · Configure provider` / per-provider title)  
**Shared table styles:** [`assets/css/models-catalog-table.css`](../assets/css/models-catalog-table.css) (explicitly shared with onboarding default-model patterns)

This spec is organized in three parts — **Local**, **In-house**, **LLM Providers** — matching how we reason about model sources. The **left rail** in the mockup lists **LLM Providers** first (default category), then **In-house**, then **Local**; behavior is identical across categories, only visible content changes.

**Tracker note:** The [model catalog epic](../issues/model-catalog/epic-model-catalog.md) mentions an **Add model** control in the title row; the current HTML mockup **does not** include that button. Treat Add model as a **product/backlog** item unless the mockup is updated.

---

## Document map

| Part | Scope |
|------|--------|
| [Part A — Local](#part-a--local-host-runtimes) | Ollama / Ramalama cards, loaded-model table, Rescan |
| [Part B — In-house](#part-b--in-house-openshift-ai) | OpenShift AI connection panel, synced catalog table |
| [Part C — LLM Providers](#part-c--llm-providers-hosted-apis) | Provider tiles, cloud models table, links to `provider-config.html` |
| [Edge cases & failure modes](#9-edge-cases--failure-modes-mock-aligned) | Search × category, empty results, provider URL, governance, accessibility gaps |

---

## 1. Problem

Users run models in **three different places**: on the **local machine** (Ollama, Ramalama), on **organizational platforms** (OpenShift AI in this product slice), and via **third-party LLM APIs** (OpenAI, Anthropic, Google, Azure). The **Models** screen must:

- Separate these sources so admins and power users know **where** a model runs and **which** credentials or cluster tokens apply.
- Surface **connection health** for runtimes and providers before users pick defaults in onboarding or session/workspace flows.
- Let users **enable or disable** cloud catalog rows where the mockup shows toggles, and send **API key / endpoint** work to **dedicated pages** (`provider-config.html`), not modals.

---

## 2. Goals

1. **Three-way IA** — `cloud` · `corporate` · `local` as first-class categories (left rail + single visible `.model-source-block` at a time, before search side effects).
2. **Consistent catalog tables** — Reuse `models-data-table` + `models-table-wrap` from `models-catalog-table.css` (status column, name stack, optional RAM line, right-aligned actions).
3. **Search** — Client-side filter on the **active** category only; match against `data-search` **and** full `textContent` of each filterable row/tile (see [3.4 Search behavior](#34-search-behavior-mock-implementation)).
4. **Alignment with onboarding / sessions** — Model **IDs** (e.g. `composer-2-fast`, `gpt-5.3-codex`) and subtitles should match [onboarding](./feature-onboarding-wizard.md) and workspace/session catalog copy (“Names match the Models catalog” in [`sessions/create.html`](../sessions/create.html)); mock data may intentionally duplicate rows across screens.

---

## 3. Page shell (all parts)

### 3.1 Layout and chrome

- **App shell:** `#sidebar-container` via `sidebar-loader.js`, then `<main class="main-content">` with an empty `<div class="header"></div>` placeholder (same pattern as other Kaiden pages).
- **Models layout:** `.services-page-layout` — `height: calc(100vh - 32px)`, `overflow: hidden`.
- **Left rail:** `.services-sidebar` — fixed **288px** width, `--models-nav-accent: #a855f7`, vertical scroll if needed.
- **Main column:** `.services-main` — `flex: 1`, vertical scroll, padding **32px 40px**, `min-width: 0`.
- **Title row:** `.vault-pd-title-row` — aligns visually with Secret Vault (`services/index.html`): title block + (in this mockup) **no primary action** in the row.
- **Search:** `.vault-pd-search`, `role="search"`, max-width **420px**, bottom border accent on `:focus-within` (`--vault-pd-accent`).

### 3.2 Left rail — categories and About

| Label (UI) | `data-cat` on `.services-cat-item` | Default `.active` | Badge text (static mock) |
|------------|--------------------------------------|-------------------|---------------------------|
| LLM Providers | `cloud` | Yes | `4` |
| In-house | `corporate` | No | `3` |
| Local | `local` | No | `2` |

- **Interaction:** `onclick="filterCategory('<cat>', this)"` on each item (inline handler in prototype).
- **Visual active state:** `.services-cat-item.active` — stronger background, **3px** left accent bar (`::before`), brighter label weight, badge uses purple tint.
- **About (sidebar):** Exact copy: *“Cloud keys stay on this device. In-house is OpenShift AI only. Local lists runtimes detected on the host (mock in this prototype).”*

### 3.3 Main header — title and subtitle

- **`<h1 class="services-title">`:** `Models`
- **Subtitle element:** `#headerCountStr` (class `.vault-pd-subtitle`). Updated by `filterCategory` from `categoryLabels`:

| `activeCategory` key | Exact subtitle string |
|----------------------|------------------------|
| `cloud` | `API keys for hosted providers` |
| `corporate` | `In-house · OpenShift AI & models` |
| `local` | `Host detection & loaded models` |

- **Initial load:** First category is `cloud`; only the cloud `.model-source-block` is visible (`corporate` and `local` blocks carry `.hidden` in markup).

### 3.4 Search behavior (mock implementation)

**Controls:** `#modelsSearchInput` — `type="search"`, `placeholder="Search…"`, `autocomplete="off"`, `aria-label="Search models"`. On `input`, `applyModelSearch()` runs.

**State:** `let activeCategory = 'cloud'` mirrors the selected rail item.

**Algorithm (per `.model-source-block`):**

1. Read `cat = section.getAttribute('data-cat')`. If `cat !== activeCategory`, add `.hidden` to the section and **stop** (other categories never show, even if they would match the query).
2. Otherwise remove `.hidden` from the section.
3. Let `q = (input.value || '').trim().toLowerCase()`. If `q` is empty: show every `.llm-provider-tile` and every `tbody tr` inside the section (`display = ''`) and return.
4. If `q` is non-empty:
   - `sectionHay = (section[data-search] || '') + ' ' + section.textContent.toLowerCase()`.
   - For each `.llm-provider-tile` and each `tbody tr`, `hay = (el[data-search] || '') + ' ' + el.textContent.toLowerCase()`; show if `hay.includes(q)`.
   - Track `any = true` if at least one element stayed visible.
5. **Empty-filter fallback:** If `q` is non-empty, `any` is false, and `sectionHay.includes(q)`, then **reset** all those tiles/rows to `display = ''` (user matched “section vibe” but no discrete row — still show full section).
6. **Hide whole section:** If `q` is non-empty, `any` is false, and `sectionHay` does **not** include `q`, add `.hidden` to the section — the main column can show **only** title + search (no table/tiles).

**Implications (edge-relevant):**

- Search is **substring** match, not tokenized; no diacritic folding.
- **Tiles and table rows are one pool** in the cloud section: a query can hide all four provider tiles while leaving table rows visible, or the opposite.
- `section.textContent` includes **all** nested text (headings, hints, button labels), so accidental matches on boilerplate are possible.
- Switching category calls `filterCategory` → `applyModelSearch()`, so a stale query immediately applies to the new category.
- There is **no** “clear search” control besides deleting text; no URL/query sync.

### 3.5 Sections DOM contract

- Wrapper: `#modelSourceSections` contains one `<section class="model-source-block" …>` per category.
- Visibility: `.model-source-block.hidden { display: none; }` — toggled by category and by step 6 of search.
- **Scroll margin:** `.model-source-block { scroll-margin-top: 16px; }` for future in-page anchors.
- **`data-search` on sections** (haystack for fallback / hide):  
  - Cloud: long token string including vendor names and model families.  
  - Corporate: `corporate openshift ai …`  
  - Local: `ollama ramalama local docker gguf`

### 3.6 Deep links and URL state (mock gap)

- **No** `?cat=` or hash routing; refreshing always returns to **cloud** + empty search.
- **Product expectation:** preserve category (and optionally search) in URL or app router state so support links and back/forward are stable.

---

## Part A — Local (host runtimes)

### A.1 Purpose

Show **local inference engines** and **models currently loaded** (or explain idle / unavailable rows when a runtime is stopped).

### A.2 Section chrome

- **`data-cat`:** `local`
- **Title (`.model-source-title`):** `Local · Ollama & Ramalama`
- **Description:** States probe order: binary/container → daemon → **models currently loaded**; notes mock detection.
- **Primary secondary action:** `Rescan` — `<button class="model-ghost-btn" onclick="alert('Mock: rescan local runtimes')">`.

### A.3 Runtime cards

Two `.model-runtime-card` siblings in `.model-runtime-row` (wrap, `min-width: 220px` per card).

| Engine | Badges (exact) | Hint highlights |
|--------|----------------|-------------------|
| **Ollama** | `Installed` (ok), `Running` (ok), `127.0.0.1:11434` (muted) | CLI + HTTP `/api/version`; loaded models = server state |
| **Ramalama** | `Installed` (ok), `Not running` (bad), `Podman service` (muted) | Start service to expose models; stopped ⇒ no loaded models |

### A.4 Table — “Running on local runtimes”

- **`aria-label`:** `Local running models`
- **Columns:** Status · Name · Size · Runtime · Actions (right-aligned).

| Row (name) | Subtitle / RAM | Size | Runtime | Status icon (meaning in mock) | Actions |
|------------|------------------|------|---------|--------------------------------|---------|
| `llama3.2:3b` | `GGUF · loaded in memory`, RAM `3.93 GiB` | `2.0 GB` | Ollama | Cyan “active” style (sunburst) | Playground, Reveal path |
| `mistral:latest` | `GGUF · loaded in memory`, RAM `4.4 GiB` | `4.1 GB` | Ollama | Same active style | Playground, **Stop model** |
| `qwen2.5:7b` | `Not loaded — Ramalama stopped`, RAM `N/A` | `4.7 GB` | Ramalama | Gray hollow circle (idle) | **Disabled** play-style button, `title="Start runtime first"`, `aria-label="Unavailable"` |

- **Product rule implied by mock:** When runtime is down, at least one **disabled** control explains the blocker; do not route to playground with a dead backend.

### A.5 Requirements checklist (Local)

- [ ] Section visible only when `activeCategory === 'local'`.
- [ ] Search filters `.llm-provider-tile` (none here) and **only** `tbody tr` in this section when Local is active.
- [ ] Rescan triggers re-probe (today: mock `alert`).
- [ ] RAM / size strings follow same typographic pattern as OpenShift rows where applicable.

---

## Part B — In-house (OpenShift AI)

### B.1 Purpose

**Single** in-house integration in this slice: **OpenShift AI** — cluster URL + token, then a **governed** model list (ready vs pending approval).

### B.2 Section chrome

- **`data-cat`:** `corporate` (internal name unchanged for filters/scripts).
- **Title:** `In-house · OpenShift AI`
- **Description:** Explicit: *“The in-house model source is **OpenShift AI only**…”*; mentions Data Science / serving stack after sync.

### B.3 Connection panel (`.model-config-panel`)

- **Panel title:** `OpenShift AI connection`
- **Constraint line:** *“No other in-house catalog types are configured here—only OpenShift AI.”*
- **Source row:** uppercase `Source` label + badge `OpenShift AI` (`.service-type-badge.infra`).
- **Fields:**

| Control | `id` / notes | Type | Default / placeholder |
|---------|----------------|------|-------------------------|
| Cluster API URL | `openshiftApiUrl` | `url` | Value `https://api.openshift.corp.example:6443`, placeholder `https://api.cluster.example:6443`, `aria-describedby="openshiftUrlHint"` |
| OpenShift token | `openshiftToken` | `password` | placeholder `sha256~… or OAuth token`, same `aria-describedby` |

- **Actions:** `Save & sync models` (`.services-add-btn`, mock — no handler), `Test connection` (`.model-ghost-btn`, mock).
- **Hint `id="openshiftUrlHint"`:** References `oc login`; token needs access to **model serving / OpenShift AI** resources.

### B.4 Models table

- **`aria-label`:** `OpenShift AI models`
- **Columns:** Status · Name · Size · **Age** · Actions (differs from Local/Cloud: **Age** not Runtime).

| Row | Subtitle / extra | Size | Age | Status glyph | Actions |
|-----|------------------|------|-----|----------------|---------|
| `ibm-granite-3.3-8b-instruct` | `OpenShift AI · Apache-2.0`, VRAM est. | `4.8 GB` | `2 weeks` | Green check | `Use in session` |
| `mistral-small-internal` | `OpenShift AI`, VRAM est. | `6.1 GB` | `1 month` | Green check | `Use in session` |
| `llama-3.1-70b-instruct` | `OpenShift AI · pending approval`, RAM N/A | `—` | `—` | Gray circle + exclamation | **`Request access` only** (no “Use in session”) |

- **Governance:** Pending row uses different primary action and warning-style status to avoid implying deployability.

### B.5 Requirements checklist (In-house)

- [ ] Copy states **no other** in-house catalog types on this screen.
- [ ] Connection fields are on **this** page; cloud keys stay on `provider-config.html`.
- [ ] Table actions distinguish approved vs pending paths.

---

## Part C — LLM Providers (hosted APIs)

### C.1 Purpose

Tiles for **vendor connection status**, links to **per-provider configuration**, and a **unified cloud models** table with **enable/disable** toggles.

### C.2 Provider tiles

- **Container:** `#cloudProviderTiles`, `role="list"`, `aria-label="LLM providers"`.
- **Tile:** `.model-runtime-card.llm-provider-tile`, `role="listitem"`, optional `data-connection` for prototyping semantics: `connected` | `none` | `error`.

| Provider | `data-search` | `data-connection` | Family line | Badges | Hint (abridged) | Configure href |
|-----------|----------------|-------------------|-------------|--------|-----------------|----------------|
| OpenAI | `openai gpt` | `connected` | GPT-4o, GPT-4o-mini, o-series | Connected, Verified 2h ago | Credentials accepted | `provider-config.html?provider=openai` |
| Anthropic | `anthropic claude` | `connected` | Claude 3.5 / 4 | Connected, Verified 1d ago | API responding | `?provider=anthropic` |
| Google AI | `google gemini vertex` | `none` | Gemini (AI Studio / Vertex) | Not configured | No API key stored | `?provider=google` |
| Azure OpenAI | `azure openai microsoft` | `error` | Enterprise deployments | Error, Check failed | Could not reach endpoint | `?provider=azure` |

- **Configure link:** `.provider-config-link` — orange accent, underline on hover (shared CSS).

### C.3 Cloud models catalog

- **Block:** `#cloudModelCatalog` (`.model-catalog-block` — top border separated from tiles).
- **Lead (`model-catalog-lead`):** *“Turn models on or off for chat and agents. Only models from connected providers appear here.”*
- **Product vs mock tension:** Lead says only connected providers’ models appear; the **mock table still lists** Composer / OpenAI / Anthropic models while Google is “Not configured” and Azure is “Error”. Real product should either **filter rows** by `data-connection` or **grey out / bucket** unconnected providers.

- **Table `aria-label`:** `Cloud models`
- **Columns:** Status · Name · Size · **Runtime** (vendor) · Actions (toggles).
- **Name column:** `.models-table-name-with-icon` — stack (`.models-table-name-main` + `.models-table-name-sub` `Cloud · enabled|disabled`) + optional `.models-table-name-brain` icon (`aria-hidden="true"`).
- **Size:** All mock cloud rows show `—` (unknown / not applicable in hosted slice).
- **Toggle pattern:** `.models-table-toggle-input` (visually hidden checkbox) + track/knob; `:focus-visible` ring per CSS; `aria-label="Enable <model-id>"` on each input.

**Mock inventory (main + subtitle):**

| Model id | Runtime column | Subtitle | Default checked |
|----------|----------------|----------|-------------------|
| composer-2-fast | Composer | enabled | yes |
| gpt-5.3-codex | OpenAI | enabled | yes |
| gpt-5.4-medium | OpenAI | enabled | yes |
| claude-4.6-sonnet-medium | Anthropic | enabled | yes |
| claude-4.6-opus-high | Anthropic | enabled | yes |
| composer-2 | Composer | disabled | no |
| composer-1.5 | Composer | disabled | no |
| gpt-5.3-codex-low | OpenAI | disabled | no |

- **Status icon convention in mock:** Cyan sunburst-style icon for **enabled** rows; simple gray circle for **disabled** rows (visual only unless product assigns semantic names).

### C.4 Provider configuration page (`provider-config.html`)

- **Entry:** `models/provider-config.html?provider=<slug>`  
- **Supported slugs (case-insensitive after `toLowerCase().trim()`):** `openai`, `anthropic`, `google`, `azure`
- **Unknown / missing slug:** Renders `Unknown provider <slug>` with escaped HTML; slug `''` displays as `(missing)`. Breadcrumb stays “Configure provider”; **no** form.
- **Known slug:** `#breadcrumbProvider` shows provider display name; `document.title` becomes `Kaiden · Configure <Name>`.

| Slug | Display name | Lead (summary) | Fields (`id`) |
|------|----------------|----------------|-----------------|
| openai | OpenAI | OpenAI dashboard keys; project + legacy | `apiKey` (password), placeholder `sk-… or sk-proj-…` |
| anthropic | Anthropic | Anthropic Console key for Claude | `apiKey` (password), `sk-ant-api03-…` |
| google | Google AI | AI Studio key **or** service account path/JSON | `apiKey` (password, optional if SA), `serviceAccount` (text) |
| azure | Azure OpenAI | Azure portal endpoint + key | `endpoint` (url), `apiKey` (password) |

- **Callout:** Mock disclaimer — saving does not persist; production would encrypt and refresh Models list status after test.
- **Actions:** `Cancel` → `index.html`; **Submit** — `preventDefault`, `alert`, redirect `index.html` (mock).

### C.5 Requirements checklist (LLM Providers)

- [ ] Tiles + cloud rows participate in search when `activeCategory === 'cloud'`.
- [ ] Configure links use exact query param spelling above.
- [ ] Toggle `aria-label` includes model id; keyboard focus ring on track.

---

## 4. Shared styling contract (`models-catalog-table.css`)

- **Wrapper:** `.models-table-wrap` — border, radius **10px**, clip overflow.
- **Table:** `.models-data-table` — uppercase micro-label headers, row hover tint (orange at low alpha).
- **Name stack:** `.models-table-name-main` / `.models-table-name-sub`; optional `.models-table-ram` pill for RAM/VRAM estimates.
- **Actions:** `.models-table-actions` flex-end; `.models-table-icon-btn` 32×32 hit target.
- **Toggles:** 44×26 track, knob translate **18px** when checked, green active track.
- **Cross-screen:** CSS comments note alignment with **onboarding** catalog rows — keep markup in sync when changing Name column structure.

---

## 5. Relationship to other flows

| Consumer | Relationship |
|----------|----------------|
| [Onboarding wizard](./feature-onboarding-wizard.md) | Step 2 references Models catalog naming; same CSS family. |
| [`sessions/create.html`](../sessions/create.html) | Workspace model step links `../models/index.html`; filters models by agent; disabled rows not selectable — should mirror **enabled** cloud state once wired. |
| Settings | Future: global entry point may deep-link to `?provider=` or a category. |

---

## 6. Non-goals (mockup scope)

- Real Ollama/Ramalama/OpenShift/API network calls or persistence.
- Vault / Secret Manager write path from this page (provider page may later **reference** vault entries).
- Inline editing of cloud secrets on `models/index.html` (only links away).
- Dynamic sidebar counts (badges are **static** in HTML).
- Keyboard-accessible category rail without `onclick` / proper `button` semantics (prototype gap).

---

## 7. Accessibility (as implemented + gaps)

**Implemented:**

- Main search `aria-label`; tables have `aria-label`; cloud toggles have per-row `aria-label`.
- Provider tiles list / listitem roles; breadcrumb on config page `aria-label="Breadcrumb"`.
- Toggle focus ring via `:focus-visible` on track.

**Gaps / risks:**

- Category items are `<div role="button">`-less non-buttons with `onclick` — **no** `tabindex`, **no** `Enter`/`Space` handler, poor screen-reader semantics.
- Some status `<svg>` nodes in OpenShift rows omit `aria-hidden="true"` (noise for SR).
- Disabled local button still in tab order unless `tabindex="-1"` added in product.
- **Color-only status:** rely on text badges + titles, not icon hue alone, for WCAG.

---

## 8. Acceptance criteria (cross-part, mock-faithful)

- [ ] Three rail items; default **LLM Providers** active; badges show `4` / `3` / `2`.
- [ ] Exactly one `.model-source-block` visible for empty search; `corporate` and `local` start with `.hidden`.
- [ ] `#headerCountStr` matches `categoryLabels[activeCategory].subtitle` after each category change.
- [ ] Search trims whitespace, lowercases query, filters **only** within active category.
- [ ] Search fallback restores rows when query matches section haystack but no row `data-search`; hides entire section when nothing matches.
- [ ] Local: two runtime cards + three-row table + Rescan mock.
- [ ] In-house: connection panel with both actions + three-row governance table.
- [ ] Cloud: four tiles + eight-row toggle table + `provider-config.html?provider=*` links.
- [ ] `provider-config.html` renders form for known slug; unknown/missing shows safe unknown copy and link home.

---

## 9. Edge cases & failure modes (mock-aligned)

### 9.1 Search and visibility

- **Whitespace-only input:** `trim()` ⇒ empty ⇒ show all rows/tiles in active section.
- **Very short query (e.g. `a`):** Broad `includes` matches; may match hidden link text or hints — expect noisy results unless product tokenizes.
- **Query matches section `data-search` but no row:** Fallback shows **all** rows (surprising if user expected narrowing).
- **Query matches nothing:** Section gets `.hidden` — user sees **blank** content below search; product should add **“No results”** empty state.
- **Cloud + query hiding all tiles but some table rows:** Valid; tiles and rows are independent visibility units.
- **Unicode / emoji model names:** `toLowerCase()` behavior is JS default; no normalization.

### 9.2 Category and navigation

- **Rapid category switching:** Each switch reapplies search; no debounce (fine for local demo).
- **No URL state:** Bookmarking “Local” is impossible in mock.
- **`filterCategory` called with invalid `cat`:** Would leave blocks mismatched if ever wired wrong — product should use enum + tests.

### 9.3 Provider configuration

- **Slug typos:** `?provider=openaii` → unknown provider message; XSS slug escaped via `escapeHtml`.
- **Mixed-case slug:** Normalized to lowercase.
- **Double submit / slow network:** Not modeled; product needs idempotent save + loading state on primary button.
- **Azure / Google partial config:** Validation rules not in mock (empty endpoint, key-only, etc.).

### 9.4 Data / governance

- **Enabled toggle for model whose provider is error/offline:** Mock allows; product should disable toggle or show inline error.
- **Pending OpenShift model:** Must not show “Use in session” without approval — mock complies.
- **Concurrent edits:** Two tabs toggling same model — last-write-wins unless versioned.

### 9.5 Local runtimes

- **Partial install (binary without daemon):** Not shown as separate card state in mock — product needs more badge states.
- **Multiple Ollama endpoints:** Mock assumes single default host.
- **Row with runtime stopped but model still resident:** Mock uses Ramalama + “Not loaded” copy; real unload timing may differ.

### 9.6 Session / onboarding consistency

- **Renamed model in catalog only:** Session UI may show stale labels until refresh — define invalidation event.
- **Agent-specific allowlists (Codex vs Claude):** Session create already filters; Models page is **superset** — users may enable models they cannot use in a given agent; product should clarify in UI or filter toggles.

### 9.7 Performance (large catalogs)

- **Thousands of rows:** Current script does O(n) `textContent` reads per keystroke — product should virtualize or index `data-search`.

---

## 10. Open questions

- Should **enabled/disabled** cloud toggles persist (demo `localStorage` vs backend) and **emit** an event for session/workspace UIs?
- Should the cloud table **strictly hide** models for `data-connection !== 'connected'` tiles, or show them disabled with CTA to configure?
- Should **In-house** ever add a second connector (generic vLLM), or stay OpenShift-only by IA?
- **Add model** control: add to mockup to match epic, or downgrade epic until IA for custom endpoints exists?
- Unified **“All sources”** view vs category-only: product decision (search today is category-scoped).
