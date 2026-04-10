# Backend: Vault CRUD, encryption at rest, reference-based resolution API

**Type:** Task / Feature (backend)  
**Labels (suggestion):** `kind/task`, `area/security`, `area/platform`  
**Parent epic:** [Epic: Secret Vault (agent-safe credentials)](../epic-secret-vault.md)

## Problem

There is no durable, encrypted store for org-level vault credentials or a safe way for the execution layer to resolve **references** to plaintext only when authorized. Without this, the UI and session flows cannot enforce “configure once, resolve at runtime.”

## Scope

- **CRUD** for vault entries scoped per product rules (e.g. org); stable **entry IDs** usable as references elsewhere.
- **Encryption at rest** for secret payloads (platform KMS or equivalent).
- **API contract**: list/detail return **metadata + masked** secret representation only; no full plaintext in normal read paths.
- **Internal resolution API** (service-to-service): given an authorized run/session context and allowed reference IDs, return plaintext **only** to the execution layer—not to browser or LLM-facing APIs.
- **RBAC hooks**: who can create, read metadata, rotate, delete, and trigger resolution (align with identity team).

## Acceptance criteria

- [ ] Create, read (masked), update, delete vault entries via API; plaintext write paths are minimal and audited.
- [ ] Resolution endpoint rejects requests without a valid allowlist / run binding.
- [ ] Automated tests cover CRUD, masking, and unauthorized resolution attempts.

## References

- Mockups (consumer): [services/index.html](../../services/index.html), [services/details.html](../../services/details.html)

## Tracker

_Paste issue URL after filing:_ 
