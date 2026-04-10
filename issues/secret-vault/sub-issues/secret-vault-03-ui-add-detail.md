# UI: Add Secret and credential detail (masked values, rotate, delete)

**Type:** Task / Feature (frontend)  
**Labels (suggestion):** `kind/task`, `area/ui`, `topic/secret-vault`  
**Parent epic:** [Epic: Secret Vault (agent-safe credentials)](../epic-secret-vault.md)

## Problem

Developers must add and lifecycle credentials only through the vault—not via chat or agent-readable files. Add and detail flows are the canonical UX for create, rotate, and remove.

## Scope

### Add Secret

- Flow per [services/create.html](../../services/create.html): breadcrumb to vault, title, lead, security callout, form (category/type, name, secret value, notes as applicable).
- Client-side validation; submit creates entry via API; success returns to list or detail.

### Credential detail

- View per [services/details.html](../../services/details.html): breadcrumb, hero, metadata, **masked** secret display (reveal only if product policy explicitly allows—otherwise omit reveal).
- Actions: edit metadata, **rotate** secret, **delete** with confirmation.

## Acceptance criteria

- [ ] User can create a credential from **Add Secret** without exposing full value in post-create URLs or error toasts.
- [ ] Detail page never shows full plaintext by default; matches masking intent of mockup.
- [ ] Rotate and delete call backend and update list/detail state.
- [ ] Errors do not echo raw secret input in logs or UI beyond the controlled input field.

## References

- [services/create.html](../../services/create.html)  
- [services/details.html](../../services/details.html)

## Dependencies

- [secret-vault-01](./secret-vault-01-backend-crud-resolution.md) APIs.

## Tracker

_Paste issue URL after filing:_ 
