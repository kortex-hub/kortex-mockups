# Feature: Projects directory

**Parent epic:** [Epic: Projects](./epic-projects.md)

### Problem

Users with many repositories need to find the right project quickly and create one when it does not exist yet.

### Solution (capabilities)

- Page title **Projects** with count badge.
- Search input filtering the visible set (underline / focus ring per mockup styling).
- **New project** primary action.
- Each project tile/card: icon, name, path, optional stats (agents, last activity) as shown in HTML.
- Click navigates to project workspace detail.

**Mockup:** [`projects/index.html`](../../projects/index.html)

### Visual reference

_Add `website/screenshot-projects.png` after capture; until then use the HTML mockup._

## Sub-tasks

- [ ] Search filters client- or server-side consistent with performance expectations (TBD).
- [ ] Empty state when no projects: CTA to create first project.
- [ ] New project flow destination (modal vs page)—align with mockup when implemented.

## Related

- [Project workspace](./feature-project-workspace.md)
- [Create agent workspace](../agents/feature-create-agent-workspace.md) (optional project picker)
