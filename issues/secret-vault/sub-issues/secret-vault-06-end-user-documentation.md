# Documentation: Secret Vault for end users (developers)

**Type:** Task  
**Labels (suggestion):** `kind/task`, `kind/documentation`  
**Parent epic:** [Epic: Secret Vault (agent-safe credentials)](../epic-secret-vault.md)

## Problem

Developers will not adopt vault-first behavior without clear docs: what the vault is, how to add secrets, how session attachment works, and why pasting into the agent is discouraged.

## Scope

- End-user documentation (help center, in-app links, or product docs—per your doc system):
  - What Secret Vault stores and what it does **not** replace (e.g. project secrets if separate).
  - How to add, rotate, and remove a credential.
  - How to attach vault credentials to a coding-agent session **by reference**.
  - Short **security framing**: configure in vault; avoid pasting tokens into chat or agent-readable files (helpful tone).
- Link from product where appropriate (vault empty state, session create, settings).

## Acceptance criteria

- [ ] Published doc(s) live and linked from at least one in-product surface (vault or session flow).
- [ ] Content reviewed for accuracy against shipped UI.
- [ ] Epic acceptance item “Documentation aimed at developers…” satisfied.

## References

- Epic: [epic-secret-vault.md](../epic-secret-vault.md)

## Dependencies

- Stable enough UI copy and flows from [secret-vault-02](./secret-vault-02-ui-vault-list.md), [secret-vault-03](./secret-vault-03-ui-add-detail.md), [secret-vault-04](./secret-vault-04-session-vault-attachment.md) (docs can ship last in milestone).

## Tracker

_Paste issue URL after filing:_ 
