# Feature: First-run onboarding wizard

**Status:** Mockup-complete (HTML)  
**Primary mockup:** [`onboarding/index.html`](../onboarding/index.html)  
**Stakeholder instructions (historical):** [`summary/onboarding-flow-instructions.md`](../summary/onboarding-flow-instructions.md)

---

## 1. Problem

New users need a **guided first-run** experience that:

- Chooses a **coding agent runtime** and captures the minimum **credentials / backend** context for that agent.
- Sets a **default model** that aligns with the Models catalog and the agent’s actual backend (local vs cloud).
- **Discovers and registers** local AI assets (MCP tool configs, skills) so agents can use them without a separate import wizard on day one.
- Lands in the product with **persisted defaults** and a clear next step (create a workspace, open sessions, or projects depending on product mode).

Without this flow, users misconfigure models, miss local tooling, or conflate **global onboarding** with **per-workspace sandbox** policy.

---

## 2. Goals

1. **Reduce time-to-first-session** by front-loading only what is truly global: agent family, model default, and registered local assets.
2. **Keep sandbox policy out of onboarding** — filesystem and egress rules are chosen when **creating a workspace**, not during first-run (see §7).
3. **Validate OpenCode setup** before advancing: local runtime probe or cloud provider + required fields.
4. **Surface detection UX** for MCP and skills with clear progress and outcomes, without blocking completion if the user skips detection (they can continue; summary reflects state).
5. **Persist** enough state for the rest of the app mockups (`kaidenSettings`, completion flag, demo hooks).

---

## 3. Non-goals (explicit)

- **No filesystem or network sandbox configuration** in the onboarding wizard. That belongs to workspace creation ([`sessions/create.html`](../sessions/create.html)) with catalog-style tables and onboarding-aligned copy.
- **No knowledge-base or full AI Assets management** in the scan step — copy positions KB elsewhere; post-scan management is under **AI Assets** in product language.
- **No server-side enforcement** in the mockup — local probe, scan, and “import” are simulated; a real product would replace timers/APIs while preserving UX contracts below.

---

## 4. Entry, completion, and navigation

### 4.1 Entry

- User opens the onboarding route (mockup: `onboarding/index.html`).
- Demo layer may route here via query params or helpers in [`assets/js/demo-scenario.js`](../assets/js/demo-scenario.js) (`kaidenExitDemoPreserveOnboarding`, optional projects mode, etc.).

### 4.2 Completion

- **Finish** (step 4 primary button: “Go to Dashboard”) or **Use all defaults** (header or footer) should:
  1. Persist workspace sandbox defaults and agent defaults (§8).
  2. Set **`kaidenOnboardingComplete`** to `'1'` in `localStorage`.
  3. Invoke demo cleanup when `window.kaidenExitDemoPreserveOnboarding` exists.
  4. Redirect to **`../sessions/index.html`** when optional-projects mode is active (`kaidenIsOptionalProjectsMode`), else **`../projects/index.html`**.

### 4.3 Global chrome

- **Header:** product logo / name (“Kaiden”), **Use all defaults** (visible on steps 1–3).
- **Stepper:** four labeled steps — **Coding agent**, **Model**, **Local AI assets**, **Ready** — with dots and connector lines reflecting `active` / `done` state.
- **Footer:** **Back** (steps 2–3 only; hidden on step 1 and step 4), **Use all defaults** (steps 1–3), **Continue** (steps 1–3) or **Go to Dashboard** (step 4).

---

## 5. Wizard steps (functional requirements)

### 5.1 Step 1 — Coding agent

**Purpose:** Select exactly one coding agent and show agent-specific configuration.

**UI**

- **Tile grid** (listbox semantics): OpenCode (recommended), Claude Code, Claude Code + Vertex AI, Codex. One tile selected at a time; selection drives visible API panel.
- **Per-agent panels:**
  - **OpenCode:** “Models & providers” — radio choice **Local · Ollama or Ramalama** vs **Cloud providers**.
    - **Local:** simulated probe with states — checking, success (“Local runtime detected”), failure with links to Ollama/Ramalama and **Check again**.
    - **Cloud:** provider `<select>` (OpenAI, Gemini, Anthropic, Azure OpenAI, Custom) with **extra vertical spacing** between the provider control and the credential block below. Conditional fields: standard API key; Azure endpoint + deployment + key; custom base URL + optional key.
  - **Claude / Codex:** optional API key fields with env-var naming hints in copy.
  - **Claude + Vertex:** GCP project, region, mount toggles, documentation link; explains ADC / gcloud.

**Validation (Continue from step 1)**

- If agent is **OpenCode**:
  - **Local:** Continue is blocked until local setup is considered ready (green detected state or user path product defines); otherwise show inline alert and scroll it into view.
  - **Cloud:** Continue is blocked until selected provider’s required fields are filled; show **Select a provider and fill in the required fields** (or equivalent) and scroll into view.

**Other agents:** Continue allowed without mandatory keys if product copy marks keys optional (current mockup: optional for Claude/Codex).

---

### 5.2 Step 2 — Default model

**Purpose:** Choose the default catalog model for the selected agent; align UI with **Models** catalog naming and links.

**UI**

- Title/description reference the active agent name; link to **`../models/index.html`** for catalog management.
- **Agent-specific model groups** (only one visible):
  - **OpenCode:** Two branches — **local** vs **cloud** — driven by step 1 backend choice.
    - **Local branch:** tables for local runtimes (e.g. Ollama/Ramalama) and in-house (e.g. OpenShift AI). Warn if step 1 did not detect local runtime (mock catalog still visible).
    - **Cloud branch:** single table whose rows are **filtered to the cloud provider selected in step 1** (OpenAI, Gemini, Anthropic, Azure, Custom). Row metadata uses `data-opencode-provider` (or equivalent) for filtering.
  - **Claude / Codex / Vertex:** respective catalog tables with radio **Use** per row.

**Behavior**

- **Selection:** Row click and radio update selection; selected row styling consistent with models table patterns.
- **Preview line** at bottom of step updates from selection (human-readable model name).
- **Identity for persistence:** `obGetActiveCatalogModelId()` returns the value of the checked radio in the **active** branch for OpenCode; other agents use their group’s checked radio. **`obActiveModelLabel()`** resolves display name from the row for Ready summary.

**On entering step 2**

- If OpenCode: sync backend UI (`obSyncOpencodeBackendUI`), update local-model banner, refresh preview.

---

### 5.3 Step 3 — Local AI assets (detection)

**Purpose:** User-initiated scan that **discovers** MCP configs and skills under project roots; mock shows progress and a structured result list.

**UI states**

1. **Intro:** Explainer (`.mcp/`, skills directories, auto-import into Kaiden, KB out of scope). Primary action: **Detect resources**.
2. **Progress:** Progress bar, spinner, status text, **current path / tick** line updating during scan.
3. **Results:** Summary bar, import hint, grouped **MCP Tools** and **Skills** with counts and per-item source paths.

**Behavior**

- **Detect resources** starts a single scan run; concurrent start should be ignored while scan is in progress (`scanStarted` guard in mockup).
- **Reset policy:** When navigating **from step 2 (Model) to step 3**, the scan UI **resets** to intro (clear interval, hide progress/results). When navigating **back from step 4 (Ready) to step 3**, **do not** reset — preserve last results until the user runs **Detect resources** again or leaves step 3 toward Model again (next forward from 2 clears on re-entry from 2).

**Continue**

- Continue does not require scan completion (user may skip running detection); Ready step reflects whether results are visible (§5.4).

---

### 5.4 Step 4 — Ready

**Purpose:** Confirm configuration and set expectations for **workspace creation** (FS + network).

**UI**

- Success icon and **You're All Set!** heading.
- Body copy states that **filesystem and network** for the sandbox are chosen when creating a workspace, with link to **`../sessions/create.html`** and mention of `kdn workspace start`.
- **Summary stats:** Coding agent name, default model label, **Local AI assets** count:
  - If scan results panel is visible / complete, show **count of asset cards** (or product-defined metric).
  - If user never completed scan, show **—** for assets.
- Optional dynamic summary line (`readySummaryLine`) for agent + model (+ assets) narrative.

**On entering step 4**

- Call **`showReadySummary()`** to populate stats and line from current DOM state.

---

## 6. Accessibility and UX notes

- Use semantic roles where implemented (`role="listbox"` / `role="option"`, `aria-live` on probe and scan status).
- Validation messages use `role="alert"` where appropriate.
- Keyboard: catalog rows support activation via keyboard handler (`obCatalogModelRowKey`) in mockup — product should preserve full keyboard parity.
- Stepper labels on narrow viewports may need truncation or wrap rules; verify against design breakpoints.

---

## 7. Relationship to workspace creation

Onboarding **does not** collect:

- Sandbox **filesystem** allow/deny paths or catalog rows.
- **Network** policy (blocked, registries-only, open, etc.).

Those are specified and mocked in **`sessions/create.html`**, reusing onboarding-adjacent visual language. After onboarding, the user is directed to create a workspace to apply those constraints.

---

## 8. Data persistence (mockup contract)

On **finish** or **skip with defaults**, merge into `localStorage` key **`kaidenSettings`** (JSON object), including at least:

| Field | Description |
|--------|-------------|
| `workspaceSandboxDefaults.agent` | Selected agent key (`opencode`, `claude`, …). |
| `workspaceSandboxDefaults.catalogModel` | `obGetActiveCatalogModelId()`. |
| `workspaceSandboxDefaults.opencodeBackend` | `local` / `cloud` when agent is OpenCode; else `null`. |
| `workspaceSandboxDefaults.opencodeCloud` | When OpenCode + cloud: `{ provider, configured }` (mock reflects provider + “configured” flag). |
| `workspaceSandboxDefaults.fileAccess` | Mock uses placeholder defaults (e.g. `workspace`) — align with product when FS moves fully to workspace create. |
| `workspaceSandboxDefaults.customFsPath` | Empty in mock unless product extends. |
| `workspaceSandboxDefaults.networkPolicy` | Derived from internal default net key (e.g. registries allowlist) — onboarding UI does not edit this. |
| `workspaceSandboxDefaults.deployment` | e.g. `local`. |
| `workspaceSandboxDefaults.skills` / `mcpServers` | Arrays; mock may leave empty while HTML lists scan results (product would populate from real scan). |
| `agentDefaults.defaultAgent` | Mirror of agent key. |
| `agentDefaults.defaultFileAccess` | Mirror of file access default. |
| `network.networkPolicy` | High-level enum derived from same internal defaults. |

Also set **`kaidenOnboardingComplete` = `'1'`**.

---

## 9. Acceptance criteria (checklist)

- [ ] Four steps appear in order with correct stepper and footer visibility.
- [ ] OpenCode Continue blocked until local detection OK or cloud provider fields valid; inline errors scroll into view.
- [ ] Model step shows **local-only** or **cloud-only** OpenCode branch matching step 1; cloud table shows **only** rows for the selected provider.
- [ ] Model selection updates preview and Ready summary model name.
- [ ] Local AI assets: Detect shows progress then results; **reset only when entering from Model**, not when Back from Ready.
- [ ] Ready shows **—** for assets if scan not completed; otherwise shows count consistent with listed items.
- [ ] Ready copy links to workspace create for FS/network and mentions terminal command per copy.
- [ ] Finish and Use all defaults persist `kaidenSettings`, set onboarding complete, redirect per optional-projects mode.
- [ ] No filesystem or network configuration UI appears in onboarding panels.

---

## 10. Related documents

- [`summary/onboarding-flow-instructions.md`](../summary/onboarding-flow-instructions.md) — condensed stakeholder instructions.
- [`feature-models-catalog.md`](./feature-models-catalog.md) — Models tab (Local, In-house, LLM Providers); catalog naming aligns with step 2.
- [`functional-spec/agents/feature-create-agent-workspace.md`](../functional-spec/agents/feature-create-agent-workspace.md) — workspace creation feature (vault, project binding).
- [`sessions/create.html`](../sessions/create.html) — workspace wizard including FS/network catalog UI.

---

## 11. Open questions (for product/engineering)

- Should **scan results** be written into `kaidenSettings.workspaceSandboxDefaults.mcpServers` / `skills` on finish, or only after explicit “Import” in a future AI Assets screen?
- Should **Use all defaults** skip OpenCode validation in a real app, or always apply a safe default agent/backend?
- Exact **redirect** targets when projects are required vs optional may evolve with navigation IA.
