# Session (or run) configuration: attach vault secrets by reference; verify prompt redaction

**Type:** Task / Feature  
**Labels (suggestion):** `kind/task`, `area/sessions`, `area/security`  
**Parent epic:** [Epic: Secret Vault (agent-safe credentials)](../epic-secret-vault.md)

## Problem

Session start is when developers often paste API keys “to unblock” the agent. The product must let them **select** vault entries by reference and persist only IDs on the session/run, while verifying secrets do not enter model-visible prompts by default.

## Scope

- Session (or run) configuration UI: attach **vault references** only—pattern per [sessions/create.html](../../sessions/create.html) (grouped rows, selection, **Open vault**, disabled rows + banners when Settings prerequisites missing).
- Persist allowlist of vault entry IDs on session/run; execution layer uses [secret-vault-01](./secret-vault-01-backend-crud-resolution.md) resolution.
- **Verification:** document or automate checks that default prompt/transcript construction does not include plaintext secrets when attachments are present (coordinate with security ticket).

## Acceptance criteria

- [ ] User can select/deselect vault credentials for a session without typing secret values.
- [ ] Session payload stores references only (no raw secret fields in session API for this path).
- [ ] Evidence recorded (test, log review checklist, or security sign-off pointer) that default path does not place resolved secrets in LLM prompt text.

## References

- [sessions/create.html](../../sessions/create.html)

## Dependencies

- [secret-vault-01](./secret-vault-01-backend-crud-resolution.md) (resolution + list of selectable entries).  
- [secret-vault-02](./secret-vault-02-ui-vault-list.md) optional for deep link parity.

## Tracker

_Paste issue URL after filing:_ 
