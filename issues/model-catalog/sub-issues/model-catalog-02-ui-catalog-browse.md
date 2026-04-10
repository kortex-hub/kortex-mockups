# UI: Models catalog browse (sidebar, search, source blocks)

**Type:** Task / Feature (frontend)  
**Labels (suggestion):** `kind/task`, `area/ui`, `topic/model-catalog`  
**Parent epic:** [Epic: Model catalog](../epic-model-catalog.md)

## Problem

Users cannot discover or triage models without a single page that mirrors how sources are organized (cloud vs. in-house vs. local) and supports quick search.

## Scope

- Implement **Models** page per [models/index.html](../../../models/index.html): layout with **sidebar categories**, main title row, **search**, **Add model** (wire or stub until backend exists).
- **Source blocks**: LLM providers grid/tiles with **Configure** links, OpenShift AI section, local Ollama/Ramalama section—including section show/hide when filtering by category.
- Wire list/state to [model-catalog-01](./model-catalog-01-backend-registry-apis.md) when available; use feature-flagged mock data if needed.
- **P1:** empty states and “no search results” behavior.

## Acceptance criteria

- [ ] Category selection filters visible sections to match mockup behavior.
- [ ] Search filters content within the active view (or global, per mockup script).
- [ ] Configure links route to provider configuration ([model-catalog-03](./model-catalog-03-ui-provider-config.md)).
- [ ] Basic keyboard and screen-reader affordances for nav and tiles.

## References

- [models/index.html](../../../models/index.html)

## Dependencies

- [model-catalog-01](./model-catalog-01-backend-registry-apis.md) for live data (optional for first UI slice with mocks).

## Tracker

_Paste issue URL after filing:_ 
