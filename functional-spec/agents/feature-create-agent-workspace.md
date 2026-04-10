# Feature: Create coding agent workspace

**Parent epic:** [Epic: Agents](./epic-agents.md)

### Problem

Spinning up an agent with the wrong repo, model, or credentials wastes time and can leak secrets if users paste tokens into chat. We want one guided flow that binds project context and **vault references** before the session runs.

### Solution (capabilities)

- Step-style or grouped layout for: identity, model, optional **project** (loads path, skills, MCP, vault bindings, access defaults per mockup copy).
- **Secret Vault** section: selectable rows by credential id; groups for API vs infrastructure; disabled rows when a credential is expired with copy pointing to Secret Vault (no raw values in UI).
- Link out to open full vault management when needed.
- Submit creates the session and lands in workspace or list per product decision.

**Mockup:** [`sessions/create.html`](../../sessions/create.html)

### Priority

- **P0:** Project optional binding; vault multi-select by reference; expired/disabled credential UX.
- **P1:** Validation messages, “recommended” model hints—follow mockup as source of truth.

## Sub-tasks

- [ ] Form state: selected project id propagates to dependent panels (skills, MCP, vault list).
- [ ] Vault: toggle selection stores **reference ids** only; no secret payload in client state for display beyond masked meta.
- [ ] Expired credential row: non-selectable, tooltip or meta line matches mockup (“renew in Secret Vault”).
- [ ] Breadcrumb / cancel returns to list without orphan drafts (definition to be refined for autosave).

## Related

- [Secret Vault: inventory](../secret-vault/feature-vault-inventory.md)
- [Secret Vault: add & detail](../secret-vault/feature-vault-credential-lifecycle.md)
- [Projects: directory](../projects/feature-projects-directory.md)
