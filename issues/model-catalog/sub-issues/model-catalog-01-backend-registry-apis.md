# Backend: Model catalog registry, provider state, list & sync APIs

**Type:** Task / Feature (backend)  
**Labels (suggestion):** `kind/task`, `area/models`, `area/platform`  
**Parent epic:** [Epic: Model catalog](../epic-model-catalog.md)

## Problem

The UI needs authoritative data: which **providers** exist, whether each is **connected**, which **models** are exposed per source, and stable **ids** for session/workspace selection. Without a registry and APIs, the catalog and session picker cannot stay in sync.

## Scope

- **Data model** for providers (cloud / in-house / local), model entries, enablement flags, and last sync or health timestamp.
- **CRUD or upsert** for provider configuration references (actual secrets may live in vault—align with platform decision).
- **Read APIs** for catalog list views: grouped by source, filterable metadata for search (name, provider, tags).
- **Sync or probe** hooks (async jobs or synchronous stubs) that downstream tickets implement for each source type.
- **Stable catalog ids** consumed by [model-catalog-06](./model-catalog-06-session-integration-docs.md).

## Acceptance criteria

- [ ] APIs return provider connection state and model lists for at least one vertical slice (e.g. one cloud provider).
- [ ] Catalog entries have stable identifiers suitable for storing on session/workspace records.
- [ ] Unauthorized callers cannot read other tenants’ configuration (RBAC / tenancy as per product).

## References

- Mockup consumer: [models/index.html](../../../models/index.html)

## Tracker

_Paste issue URL after filing:_ 
