# Epic: Semantic Routers

### Epic domain

**Problem statement**

Agentic workflows fire hundreds of requests per session. Without intelligent routing, every request—simple or complex—hits the same (often expensive) model. This wastes tokens on trivial tasks and slows agents down when heavier reasoning would actually be faster. Developers have no way to express routing policies or see which model handled which request.

**User story**

As a developer, I want to define a Semantic Router that sits in front of my LLM backends, classifies each request by intent and complexity, and automatically routes it to the cheapest model that can do the job—so I reduce token costs while maintaining quality for tasks that need it.

## Context

The vLLM Semantic Router (Athena release) is an upstream open-source routing layer. It exposes a standard `/v1/chat/completions` endpoint (OpenAI-compatible), so any agent or session that speaks that API gains multi-model routing without code changes. The router sits between clients and model backends, adds a classification pipeline (28–93 ms overhead), and selects a backend via configurable signal-decision rules.

Key concepts:
- **Listener** — the proxy port and timeout the router accepts connections on (e.g. `0.0.0.0:8899`)
- **Backend models** — the pool of LLM endpoints the router can forward to (local or cloud)
- **Signals** — pattern detectors on incoming requests: keyword lists, embedding similarity against anchor prompts, or neural domain classifiers (mmBERT)
- **Decisions / Routes** — priority-ordered rules that consume signals and select a backend model, optionally toggling reasoning mode
- **Advanced features** — HNSW semantic cache (dedup), jailbreak detection, PII redaction, complexity scoring

Semantic Routers appear in the **Models** tab as a distinct category (not a provider), because they are an intelligent routing layer rather than a model source. A configured router can then be selected as the inference endpoint when creating a Workspace.

## Features / scope

**Must have (P0)**

- [Semantic Router catalog](./feature-semantic-router-catalog.md) — list, create (4-step wizard), and detail/edit views inside the Models tab.
- [Semantic Router in workspace creation](./feature-semantic-router-workspace-integration.md) — option to select a configured router as the inference backend in the workspace creation wizard.

**Should have (P1)**

- YAML config preview (read-only) in the create wizard and detail view — shows what the underlying `config.yaml` would look like, useful for developers who want to understand the generated configuration.
- Athena DSL preview alongside YAML (v0.2 feature: human-readable typed DSL that compiles to the same internal representation).

**Deliberately de-scoped from mockup**

- Router status indicator (Running / Stopped / Error) and Start/Stop action button — not shown in the detail view or catalog cards. The router's lifecycle is managed outside the UI (e.g. CLI or container orchestration); the UI focuses on configuration only.

**Out of scope**

- Actual runtime start/stop backend calls — this is a UI mockup; actions are simulated.
- Live monitoring dashboards and request replay (Athena ships a React dashboard on port 8700; this is a future integration point).
- Kubernetes CRD / Helm chart export (`IntelligentPool`, `IntelligentRoute`) — P1/future.
- Real-time routing metrics (P99 latency, cache hit rate) — P1/future.

## Dependencies

- [Agents epic](../agents/epic-agents.md) — the workspace creation flow where router selection is surfaced.
- [Secret Vault epic](../secret-vault/epic-secret-vault.md) — cloud backend model API keys should reference vault entries, not be stored in plain text in the router config.
- Models tab (`models/index.html`) — Semantic Routers is a new sidebar category alongside LLM Providers, In-house, and Local.

## Feature index

| Feature | Mockup |
|---------|--------|
| [Semantic Router catalog & configuration](./feature-semantic-router-catalog.md) | `models/index.html`, `models/semantic-router-create.html`, `models/semantic-router-details.html` |
| [Semantic Router in workspace creation](./feature-semantic-router-workspace-integration.md) | `sessions/create.html` |
