# Feature: Vault credential lifecycle (add & detail)

**Parent epic:** [Epic: Secret Vault](./epic-secret-vault.md)

### Problem

Adding a secret should feel safe and obvious; managing it afterward should support rotation and audit-friendly metadata without exposing full values in the browser.

### Solution (capabilities)

**Add secret** (`services/create.html`):

- Breadcrumb back to vault list.
- Short lead paragraph + **callout** explaining we avoid putting secrets in agent chat (purple info panel in mockup).
- Fields: name, type/category, secret value, optional scope labels—exact set follows HTML.
- Submit creates entry and returns to list or detail.

**Credential detail** (`services/details.html`):

- Breadcrumb; hero with type icon (API vs infra color coding).
- Masked secret with reveal/copy policy per security review (mockup shows pattern).
- Metadata: created, last used, expiry, tags—align with HTML sections.
- Actions: edit, rotate, delete (or equivalent)—labels as in mockup.

**Mockups:** [`services/create.html`](../../services/create.html) · [`services/details.html`](../../services/details.html)

## Sub-tasks

- [ ] Create: client-side validation for required fields; server-side encryption at rest (engineering-owned).
- [ ] Detail: never log full secret; clipboard copy uses short-lived UX if allowed by threat model.
- [ ] Rotate flow: old secret invalidated or versioned—product copy TBD.
- [ ] Delete: confirm dialog; warn if credential is referenced by active sessions/projects (definition to be refined).

## Related

- [Vault inventory](./feature-vault-inventory.md)
- [Project workspace: Secrets](../projects/feature-project-workspace.md)
