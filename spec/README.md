# Kaiden mockups

This folder holds **feature specifications** for flows that are primarily implemented as static HTML mockups in this repository.

## Onboarding

| Document | Purpose |
|----------|---------|
| [Feature: First-run onboarding wizard](./feature-onboarding-wizard.md) | Complete specification for the four-step onboarding flow (coding agent, model, local AI assets, ready). |

**Primary mockup:** [`../onboarding/index.html`](../onboarding/index.html)

**Related:**

- Consolidated implementation notes from stakeholder instructions: [`../summary/onboarding-flow-instructions.md`](../summary/onboarding-flow-instructions.md)
- Workspace creation (filesystem & network catalog UI moved out of onboarding): [`../sessions/create.html`](../sessions/create.html)
- Broader functional-spec conventions: [`../functional-spec/README.md`](../functional-spec/README.md)

When onboarding copy, steps, or persistence behavior changes in the mockup, update `feature-onboarding-wizard.md` in the same change or immediately after.

## Models (Models tab)

| Document | Purpose |
|----------|---------|
| [Feature: Models catalog](./feature-models-catalog.md) | Models page split by **Local**, **In-house** (OpenShift AI), and **LLM Providers**; search, tables, provider config routes. |

**Primary mockups:** [`../models/index.html`](../models/index.html), [`../models/provider-config.html`](../models/provider-config.html)

**Related:** [Onboarding — default model step](./feature-onboarding-wizard.md) (links to Models catalog).

When Models navigation, copy, or table behavior changes, update `feature-models-catalog.md` in the same change or immediately after.
