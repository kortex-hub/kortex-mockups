# Session/workspace: model picker from catalog + end-user documentation

**Type:** Task / Feature  
**Labels (suggestion):** `kind/task`, `area/sessions`, `kind/documentation`  
**Parent epic:** [Epic: Model catalog](../epic-model-catalog.md)

## Problem

Workspace or session creation must use the **same catalog** as the Models page so users pick a default model that is actually enabled. Without this, catalog work does not reach the coding-agent path.

## Scope

### Session / workspace UI

- Implement model section per [sessions/create.html](../../../sessions/create.html): tables (or equivalent) for cloud, in-house, and local slices; **search filter**; **selected row** state; **disabled** rows when provider not configured.
- Persist **catalog id** (and resolved provider reference) on session/workspace via backend contract from [model-catalog-01](./model-catalog-01-backend-registry-apis.md).
- **Open Models catalog** deep link to [models/index.html](../../../models/index.html).

### Documentation

- Help or in-product copy: difference between **Models** (administer catalog) and **session picker** (choose default); how to enable a grayed-out row.

## Acceptance criteria

- [ ] User can select exactly one default model from enabled catalog rows; selection persists on create/save.
- [ ] Disabled rows are not selectable; tooltip or inline text explains how to enable (link to catalog/configure).
- [ ] Published documentation linked from Models or session flow satisfies epic acceptance criteria.

## References

- [sessions/create.html](../../../sessions/create.html)

## Dependencies

- [model-catalog-01](./model-catalog-01-backend-registry-apis.md), [model-catalog-02](./model-catalog-02-ui-catalog-browse.md), [model-catalog-04](./model-catalog-04-cloud-provider-connectivity.md) for meaningful enabled/disabled rows (minimal slice acceptable).

## Tracker

_Paste issue URL after filing:_ 
