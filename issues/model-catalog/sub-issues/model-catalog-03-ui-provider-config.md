# UI: Per-provider configuration pages

**Type:** Task / Feature (frontend)  
**Labels (suggestion):** `kind/task`, `area/ui`, `topic/model-catalog`  
**Parent epic:** [Epic: Model catalog](../epic-model-catalog.md)

## Problem

Provider keys and endpoints must be edited on a **dedicated page** (not only inline modals) so users can focus, validate, and return to the catalog with clear context—per product mockup.

## Scope

- Implement **Configure provider** flow per [models/provider-config.html](../../../models/provider-config.html): breadcrumb back to Models, title, lead, callout, form fields per provider type (query param or route segment `provider=…`).
- Submit saves via APIs from [model-catalog-01](./model-catalog-01-backend-registry-apis.md); show success and validation errors.
- **Secrets:** use platform pattern (masked inputs, vault reference, or direct field—align with security); never log raw keys.

## Acceptance criteria

- [ ] At least OpenAI, Anthropic, Google, and Azure routes render correct field sets (or a pluggable schema from backend).
- [ ] Save updates provider state visible on catalog ([model-catalog-02](./model-catalog-02-ui-catalog-browse.md)).
- [ ] Invalid or failed connection surfaces actionable error without exposing secrets in UI copy.

## References

- [models/provider-config.html](../../../models/provider-config.html)

## Dependencies

- [model-catalog-01](./model-catalog-01-backend-registry-apis.md); [model-catalog-04](./model-catalog-04-cloud-provider-connectivity.md) for test-connection behavior.

## Tracker

_Paste issue URL after filing:_ 
