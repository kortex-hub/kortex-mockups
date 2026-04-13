# Epic: Agents (coding agent workspaces)

### Epic domain

**Problem statement**

Developers run multiple coding agents (different tools, models, and repos). Without a single place to see what is running, what is blocked, and how a workspace was configured, they lose time context-switching and risk misconfiguring credentials or policies.

**User story**

As a developer, I want to list, create, and monitor coding agent sessions in one product area so that I can attach the right project defaults, vault credentials, and policies—then see when an agent needs input or is making progress.

## Context

In the shell mockups, primary navigation label is **Workspaces** (`shared/components/sidebar.html` → `sessions/index.html`). **Alerts** (`agent-feed/index.html`) is the cross-session feed for items that need attention versus background activity.

## Features / scope

**Must have (P0)**

- [Sessions list & entry](./feature-agent-sessions-list.md) — browse sessions, open detail, start new workspace.
- [Create coding agent workspace](./feature-create-agent-workspace.md) — project, model, skills/MCP/knowledge selection, **Secret Vault** attachment by reference.
- [Alerts & activity feed](./feature-alerts-activity-feed.md) — “needs input” vs “activity & progress,” live monitoring affordance.

**Should have (P1)**

- [Agent session workspace](./feature-agent-session-workspace.md) — detail, settings, CLI paths; parity with mockup depth to be refined.

## Out of scope

- Real execution/runtime implementation (sandboxes, brokered tool calls)—we specify product surfaces and boundaries only.

## Dependencies

- [Secret Vault epic](../secret-vault/epic-secret-vault.md) for credential inventory and session attachment model.
- [Projects epic](../projects/epic-projects.md) for optional project binding at session create.

## Feature index

| Feature | Mockup |
|--------|--------|
| [Agent sessions list](./feature-agent-sessions-list.md) | `sessions/index.html` |
| [Create agent workspace](./feature-create-agent-workspace.md) | `sessions/create.html` |
| [Alerts & activity](./feature-alerts-activity-feed.md) | `agent-feed/index.html` |
| [Session workspace](./feature-agent-session-workspace.md) | `sessions/details.html`, `sessions/settings.html`, `sessions/cli.html` |
