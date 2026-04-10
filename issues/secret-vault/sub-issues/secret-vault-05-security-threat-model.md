# Security / platform review: threat model (logs, transcripts, tool output) and sign-off

**Type:** Task  
**Labels (suggestion):** `kind/task`, `area/security`  
**Parent epic:** [Epic: Secret Vault (agent-safe credentials)](../epic-secret-vault.md)

## Problem

Injection and reference-based attachment reduce risk, but secrets can still leak via tool stdout, error stacks, application logs, traces, or exports. We need an explicit threat model and sign-off before claiming agent-safe handling.

## Scope

- **Threat model** (short doc): prompts, transcripts, provider-side retention, logs, traces, crash dumps, admin tooling.
- **Gap analysis** against current implementation for [secret-vault-01](./secret-vault-01-backend-crud-resolution.md) and [secret-vault-04](./secret-vault-04-session-vault-attachment.md) (and tool runner).
- **Recommendations**: redaction rules, log scrubbing, error message hygiene; file follow-ups for must-fix vs. accepted risk.
- **Sign-off** from security/platform owner (name + date in ticket).

## Acceptance criteria

- [ ] Threat model document linked from this issue (or attached).
- [ ] Listed residual risks and mitigations or explicit acceptance.
- [ ] Sign-off recorded; blocking issues filed if any.

## Dependencies

- Enough of backend + session attachment to review a vertical slice (can be staging).

## Tracker

_Paste issue URL after filing:_ 
