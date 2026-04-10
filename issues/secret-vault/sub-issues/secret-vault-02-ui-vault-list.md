# UI: Secret Vault list (search, tabs, rows, navigation)

**Type:** Task / Feature (frontend)  
**Labels (suggestion):** `kind/task`, `area/ui`, `topic/secret-vault`  
**Parent epic:** [Epic: Secret Vault (agent-safe credentials)](../epic-secret-vault.md)

## Problem

Developers need a single screen to see all vault credentials, filter by kind, and search—without opening each integration separately. The mockup defines the target layout and interactions.

## Scope

- Implement **Secret Vault** list per [services/index.html](../../services/index.html): title, subtitle (count/summary), **Add Secret** primary action, search, category tabs (All / API tokens / Infrastructure).
- **Rows**: icon, title, type badge, description line, date, status pill; navigate to credential detail on row click.
- Wire to vault list API from [secret-vault-01](./secret-vault-01-backend-crud-resolution.md) (or stub until backend exists).
- **P1 (if in same milestone):** empty state and no search-results state per epic.

## Acceptance criteria

- [ ] List loads from API; shows masked/safe fields only.
- [ ] Search filters visible rows by safe metadata (title, description, type—not raw secret).
- [ ] Tabs combine correctly with search (same behavior as mockup scripts).
- [ ] Keyboard focus and basic accessibility for list and tabs.

## References

- Mockup: [services/index.html](../../services/index.html)

## Dependencies

- Backend list API from secret-vault-01 (can use mock data behind a flag until ready).

## Tracker

_Paste issue URL after filing:_ 
