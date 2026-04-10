# Feature: Secret Vault inventory

**Parent epic:** [Epic: Secret Vault](./epic-secret-vault.md)

### Problem

With many tokens across APIs and clusters, developers lose track of what exists, what expired, and what an agent is allowed to use.

### Solution (capabilities)

- Title row: **Secret Vault** + subtitle explaining purpose (mockup: Podman Extensions–style title + primary **Add secret**).
- Search: bottom-border field; filters list.
- Category tabs: **All**, **API tokens**, **Infrastructure** (text tabs per mockup).
- Table or list rows: name, type, scope/meta, status (active / warning / expired), last rotated or similar—match HTML columns.
- Row opens credential detail.

**Mockup:** [`services/index.html`](../../services/index.html)

### Visual reference

_Add a dedicated vault list screenshot under `website/` when ready; table layout is authoritative in HTML._

## Sub-tasks

- [ ] List API returns masked summary fields only (no full secret in JSON for normal UI).
- [ ] Search + tab filters compose without error (AND semantics).
- [ ] Status chips match backend states (active, expiring soon, expired).
- [ ] Primary CTA routes to add-secret flow.

## Related

- [Credential lifecycle](./feature-vault-credential-lifecycle.md)
- [Create agent workspace](../agents/feature-create-agent-workspace.md) (vault picker)
