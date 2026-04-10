# Epic: Model catalog

### Epic domain

**Problem Statement**

Developers who use coding agents need a clear inventory of **which models they can run**: cloud LLM APIs, in-house serving (for example OpenShift AI), and local runtimes (for example Ollama or Ramalama). Today that knowledge is scattered across provider dashboards, env vars, and tribal knowledge. Teams lack a single place to see **connection status**, **available models**, and **where to configure credentials**—so sessions ship with the wrong default model or fail at runtime.

We want one **model catalog** in the product: browse by source (cloud, in-house, local), search and filter, configure each provider on a **dedicated page**, and expose the same catalog slices when picking a **default model** for a workspace or session.

**User Story**

As a developer using coding agents, I want a single model catalog so that I can see which models are available, fix provider configuration in one place, and pick a default model for my workspace **without guessing** which backends are connected.

## Context

**Who this is for**

- Developers and platform admins who enable models for themselves or their org.
- Anyone configuring a coding-agent workspace who must choose a model from an authoritative list.

**What “good” looks like**

- **Discover** — Sidebar categories and search align with how people think: cloud APIs vs. in-house vs. local.
- **Configure** — API keys and endpoints live on **per-provider pages**, not buried in modals (see mockup copy).
- **Truthful status** — Tiles or rows show connected / error / not configured so users fix the right provider.
- **Reuse in sessions** — Session (or workspace) creation offers the **same catalog** (enabled rows only), with a link back to the full Models page.

## Mockups

#### Models catalog ([models/index.html](../../models/index.html))

Title row, search, **Add model** action, left nav (Cloud LLM APIs · In-house · Local), blocks for **LLM providers** (OpenAI, Anthropic, Google, Azure), **OpenShift AI**, and **Ollama & Ramalama** with runtime cards and model lists.

#### Configure provider ([models/provider-config.html](../../models/provider-config.html))

Breadcrumb from catalog, per-provider form (keys, endpoints, validation).

#### Session model picker ([sessions/create.html](../../sessions/create.html))

Table of catalog rows by source; filter search; disabled rows when provider not enabled; link **Open Models catalog**.

## Features / Scope

**Must have (P0)** — the happy path:

- **Catalog home** implementing the structure and navigation of [models/index.html](../../models/index.html): categories, search, provider sections, and paths to configure each provider.
- **Provider configuration** flow per [models/provider-config.html](../../models/provider-config.html) (dedicated page per provider, not only a modal).
- **Backend contract** for listing models, provider connection state, and persisting configuration (org- or user-scoped per product rules—definition to be aligned with identity).

**Should have (P1)** — important but not blocking:

- **Add model** or equivalent entry point for extending the catalog when the product supports custom endpoints or BYO models.
- Empty, error, and “provider not connected” states that deep-link to the right configure page.
- Parity between catalog visibility and **session model picker**: only **enabled** catalog entries selectable in [sessions/create.html](../../sessions/create.html).

**Nice to have (P2)** — future considerations:

- Usage or cost hints per model; deprecation labels.
- Audit of who changed provider configuration.
- Bulk enable/disable for org admins.

## Acceptance Criteria

- [ ] User can open **Models** from primary navigation and see cloud, in-house, and local sections with search and category filtering consistent with the mockup behavior.
- [ ] User can open **Configure** for a cloud provider, save settings, and see connection status reflected on the catalog (success and failure paths).
- [ ] User can attach or sync in-house (OpenShift AI) and local (Ollama / Ramalama) sources per mockup intent; listed models update after sync or probe (exact mechanics per engineering).
- [ ] User can choose a default model from the embedded catalog in session/workspace configuration; disabled rows cannot be selected; link opens full catalog.
- [ ] Documentation explains catalog vs. session picker and where API keys are stored (e.g. vault alignment if applicable).

## Out of Scope

- Choosing the **best** model for a task (routing, auto-selection)—this epic is **inventory + configuration + selection from known list**.
- Billing integration for cloud providers (beyond optional P2 hints).
- Full implementation of every provider’s proprietary API surface—P0 covers the providers shown in mockups first; others follow the same patterns.

## Success Metrics

- Time to first successful model-backed agent session after onboarding (baseline after launch).
- Reduction in “model not found / not configured” support tickets (qualitative or volume).
- Catalog configure completion rate after visiting a “not connected” tile.

## Dependencies

- Identity and storage for provider credentials (may align with [Secret Vault](../secret-vault/epic-secret-vault.md) or a dedicated credentials path—explicit decision required).
- Agent runtime or gateway that can invoke models by **catalog id** or resolved provider + model id.
- Session/workspace model that stores selected default model reference.

## Sub-issues (P0 — ticket bodies in repo)

File each item in your tracker, then add the issue link in the ticket’s **Tracker** section.

- [ ] [Backend: catalog registry, provider state, list & sync APIs](./sub-issues/model-catalog-01-backend-registry-apis.md)
- [ ] [UI: Models catalog browse (nav, search, source blocks)](./sub-issues/model-catalog-02-ui-catalog-browse.md)
- [ ] [UI: Per-provider configuration pages](./sub-issues/model-catalog-03-ui-provider-config.md)
- [ ] [Cloud LLM providers: connectivity, credentials, health](./sub-issues/model-catalog-04-cloud-provider-connectivity.md)
- [ ] [In-house & local sources: OpenShift AI, Ollama, Ramalama](./sub-issues/model-catalog-05-openshift-local-sources.md)
- [ ] [Session/workspace model picker + documentation](./sub-issues/model-catalog-06-session-integration-docs.md)

_Index:_ [sub-issues/README.md](./sub-issues/README.md)

## Future Considerations

- P1/P2 items above; additional providers; enterprise policy (allowlist models).

**Labels (suggestion):** `kind/epic`, `area/models`, `persona/developer`, `topic/coding-agents` (adjust to team taxonomy)
