# Feature: Agent session workspace (detail)

**Parent epic:** [Epic: Agents](./epic-agents.md)

### Problem

After creation, a user must inspect configuration, adjust settings, open CLI/chat affordances, and understand session health without returning to the list only.

### Solution (capabilities)

- **Detail** view for a single session: summary, linked project, model, status, and actions (mockup: `sessions/details.html`).
- **Settings** and **CLI** sub-pages or tabs where the product exposes advanced configuration and command-line entry (`sessions/settings.html`, `sessions/cli.html`).
- Clear path back to list and to Chat if applicable.

**Mockups:** [`sessions/details.html`](../../sessions/details.html) · [`sessions/settings.html`](../../sessions/settings.html) · [`sessions/cli.html`](../../sessions/cli.html)

### Priority

- **P0:** Read session config; navigate back; open chat/CLI entry points shown in mockup.
- **P1:** Edit-in-place settings; parity with create-flow fields.

### Visual reference

_Add a `website/screenshot-session-detail.png` when we have a product capture; until then the HTML mockup is the reference._

## Sub-tasks

- [ ] Session detail loads by id; handles missing session gracefully.
- [ ] Linked project name/path matches Projects mockup conventions.
- [ ] Settings changes persist and reflect on reload (conflict handling TBD).
- [ ] CLI page documents or generates the command the user expects—CLI UX detail per soul.md when we finalize copy.

## Related

- [Create agent workspace](./feature-create-agent-workspace.md)
- [Projects: workspace](../projects/feature-project-workspace.md)
