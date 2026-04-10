# Epic: Secret Vault

### Epic domain

**Problem statement**

Developers still need API keys and infra credentials for agent-driven work. Storing them in chat, random `.env` files, or prompts increases leak risk. We want **one vault** where secrets are configured and **referenced** elsewhere—resolved at execution, not copied into model context.

**User story**

As a developer, I want to manage credentials in Secret Vault and attach them to sessions or projects by reference so agents can use integrations without receiving raw secret strings in the conversation.

## Context

Sidebar label **Secret Vault** → [`services/index.html`](../../services/index.html) (folder name `services/` is legacy; product string is Secret Vault). Create and detail: [`services/create.html`](../../services/create.html), [`services/details.html`](../../services/details.html).

## Features / scope

**Must have (P0)**

- [Vault inventory](./feature-vault-inventory.md) — list, search, category tabs (API vs infrastructure), add secret CTA.
- [Credential lifecycle](./feature-vault-credential-lifecycle.md) — add flow with security callout; detail with masked value, metadata, lifecycle actions.

**Should have (P1)**

- Session attachment UX already sketched in [`sessions/create.html`](../../sessions/create.html); keep copy aligned (“Open vault”, expired row messaging).
- Threat model and documentation as separate tracker items when we leave mockup-only phase.

## Out of scope

- Full sandbox / broker implementation—assume platform can resolve references outside LLM-visible text.

## Dependencies

- Agent runtime capable of consuming vault reference ids.
- RBAC: who can create, use, and revoke entries (definition to be refined).

## Feature index

| Feature | Mockup |
|--------|--------|
| [Vault inventory](./feature-vault-inventory.md) | `services/index.html` |
| [Credential lifecycle](./feature-vault-credential-lifecycle.md) | `services/create.html`, `services/details.html` |
