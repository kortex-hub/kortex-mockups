# Epic: Projects

### Epic domain

**Problem statement**

Agent behavior depends on repo context, attached skills, MCP servers, knowledge sources, secrets policy, filesystem bounds, and network rules. Those knobs scatter across files and tools today; we want a **project** object that agents and sessions can bind to.

**User story**

As a developer, I want each repo (or workspace) represented as a project with consistent sections for capabilities and policy so that new agent sessions inherit the right defaults in one selection.

## Context

Landing route [`index.html`](../../index.html) redirects to **`projects/index.html`**, so projects are the default home in this mockup set.

## Features / scope

**Must have (P0)**

- [Projects directory](./feature-projects-directory.md) — search, cards or rows, create project.
- [Project workspace (sections)](./feature-project-workspace.md) — overview plus Skills, MCP, Knowledge, Secrets & Tokens, Filesystem, Network Policy.

**Should have (P1)**

- Deeper edit flows inside each section (forms, validation)—tracked as sub-tasks inside the feature file as mockups grow.

## Out of scope

- Git hosting provider implementation; cluster provisioning—product surfaces only.

## Dependencies

- [Secret Vault](../secret-vault/epic-secret-vault.md) for credentials referenced from project **Secrets & Tokens**.
- [Agents epic](../agents/epic-agents.md) consumes project binding at session create.

## Feature index

| Feature | Mockup |
|--------|--------|
| [Projects directory](./feature-projects-directory.md) | `projects/index.html` |
| [Project workspace](./feature-project-workspace.md) | `projects/details.html` |
