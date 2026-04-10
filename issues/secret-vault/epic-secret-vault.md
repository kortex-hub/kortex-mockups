# Epic: Secret Vault (agent-safe credentials for developers)

### Epic domain

**Problem Statement**

Developers who work with coding agents still need API keys, PATs, and infrastructure credentials for Git providers, issue trackers, clusters, and other tools. Today that often means granting access via ENV variables, dropping them into files the agent can read, or repeating configuration in several places. 

Any of those patterns increases the risk that a secret ends up in model context, logs, transcripts, or published on public places.

We want one place in the product where a developer configures secrets **once**. From there, agents that need those credentials should receive them only through a controlled  path, **not** by the developer copying values into the agent or by the agent reading raw secrets from prompts or workspace files.

**User Story**

As a developer using coding agents, I want to manage all my credentials in a single Secret Vault so that my agents can use integrations (Git, Jira, cloud APIs, infra) **without ever handing the actual secret strings to the agent**, and so I can rotate or revoke access in one place when something changes.

## Context

**Who this is for**

- Developers who drive automated or agent-assisted coding sessions and want parity with “it works on my machine” without leaking tokens.

**Security posture we are aiming for**

- **Configure in vault** — user enters or rotates secrets only in the vault UI or CLI, not in the agent's environment.

- **Bind by reference** — agent workspaces and projects declare *which* vault entries may be used (e.g. “GitHub PAT for this org,” “OpenShift kubeconfig”), analogous to selecting capabilities.

- **Resolve at execution** — tools, subprocesses, or platform APIs fetch secret material only when needed, in a layer the agent does not read as plain prompt text; 

- **Minimize blast radius** — optional scoping (org vs. project vs. session) and clear expiry/rotation UX so developers retire credentials before they appear in old logs or forks.

## Mockups 

#### Secret Vault list
Single inventory of credentials with search, categories (API vs. infrastructure), status and expiry at a glance.

#### Add Secret
One canonical path to add or describe a new secret with clear security copy.

#### Credential detail
Lifecycle and metadata for one entry without treating the chat as the source of truth.


## Features / Scope

**Must have (P0)** — the happy path:

- **Vault as the only intentional secret input surface**: Developers add, view (masked), edit, rotate, and remove credentials through the vault experience aligned with [services/index.html](../services/index.html), [services/create.html](../services/create.html), and [services/details.html](../services/details.html).

- **Runtime resolution, not prompt copy**: Execution layer (tools, sandboxes, or brokered calls) loads secret material only for authorized operations; agent-facing surfaces show labels, ids, or capability names—not raw secrets.

**Should have (P1)** — important but not blocking:

- **Discover & filter**: Search and category tabs so a developer with many tokens can find the right entry quickly (same interaction model as the list mockup).

- Guidance when an integration depends on Settings vs. vault (e.g. disabled rows and banners as in session create) so developers know where to fix configuration without exposing secrets.

- Empty and “no search results” states that nudge toward **Add Secret** in the vault rather than ad-hoc `.env` or chat pastes.

- Clear copy in-product that explains *why* we avoid putting secrets in the agent (short, non-alarmist).

**Nice to have (P2)** — future considerations:

- Honest status & expiry: Rows and detail show active / expired / warning states so developers fix problems in the vault instead of debugging mysterious auth failures in chat.
- “Used by N sessions / flows” (or similar) so developers see blast radius before revoke.
- Audit of create/rotate/revoke events.

## Acceptance Criteria

- [ ] A developer can manage all vault entries from the Secret Vault list and detail flows without using the coding agent chat to store the canonical secret.

- [ ] A developer can attach vault credentials to an agent session (or equivalent) by **selection/reference** only; attaching a secret does not place the secret value into model-visible prompt text by default (verify with platform logging / redaction policy).

- [ ] List and detail APIs and UIs never return full secret payloads to the browser or agent context in normal operation; masked display matches the intent of the detail mockup.

- [ ] Search plus category filters work together on the vault list without errors.

- [ ] Documentation aimed at developers: “configure in vault, never paste into the agent.”


## Out of Scope

- Full design of the execution sandbox (containers, network policy)—this epic assumes a platform hook exists to inject or broker secrets; we specify product behavior and boundaries, not every implementation detail.

## Success Metrics

- Reduction in flows that require the user to paste a raw API key into chat or agent-visible fields to complete a task (measurable via UX audit or telemetry on “secret pasted” heuristics if available—definition to be refined).

- Time from “new integration needed” to “working agent session” when the developer only uses vault + session attachment (baseline after launch).

- Qualitative: developers report they trust that tokens are not sitting in transcript/context.

## Dependencies

- Agent session model and tool runtime that can consume **vault references** and resolve secrets outside model context.
- Identity and RBAC: who can create, use, and revoke vault entries.
- Integrations layer (e.g. GitHub, Jira) that can authenticate using vault-resolved credentials without exposing them upstream to the LLM.

## Sub-issues (P0 — ticket bodies in repo)

File each item in your tracker, then add the issue link in the ticket’s **Tracker** section.

- [ ] [Backend: vault CRUD, encryption, resolution API](./sub-issues/secret-vault-01-backend-crud-resolution.md)
- [ ] [UI: Secret Vault list](./sub-issues/secret-vault-02-ui-vault-list.md)
- [ ] [UI: Add Secret & credential detail](./sub-issues/secret-vault-03-ui-add-detail.md)
- [ ] [Session: attach vault by reference + prompt redaction verify](./sub-issues/secret-vault-04-session-vault-attachment.md)
- [ ] [Security: threat model & sign-off](./sub-issues/secret-vault-05-security-threat-model.md)
- [ ] [Documentation: Secret Vault for developers](./sub-issues/secret-vault-06-end-user-documentation.md)

_Index:_ [sub-issues/README.md](./sub-issues/README.md)

## Future Considerations

- P1/P2 items above; project vs. org scoping rules; enterprise KMS.

