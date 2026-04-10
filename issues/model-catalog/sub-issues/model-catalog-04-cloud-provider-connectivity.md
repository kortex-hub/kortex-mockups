# Cloud LLM providers: connectivity, credentials, health

**Type:** Task / Feature  
**Labels (suggestion):** `kind/task`, `area/models`, `area/integrations`  
**Parent epic:** [Epic: Model catalog](../epic-model-catalog.md)

## Problem

Tiles show “connected” or error states, but that requires real (or stubbed) checks against each cloud API and safe handling of credentials configured on [provider-config pages](./model-catalog-03-ui-provider-config.md).

## Scope

- Implement **connection test** and **model enumeration** (or catalog fetch) for providers in the mockup: OpenAI, Anthropic, Google, Azure (and Composer/OpenAI-family variants if product requires).
- Persist credentials per [model-catalog-01](./model-catalog-01-backend-registry-apis.md); integrate with org **Secret Vault** or equivalent if that is the chosen store.
- Update **health / status** fields consumed by catalog tiles and session picker (enabled vs. disabled rows).

## Acceptance criteria

- [ ] After valid configuration, provider tile shows connected state and models appear in catalog lists.
- [ ] After invalid key or network failure, user sees error state with path to reconfigure—no raw key in error payloads to browser.
- [ ] Rate limits and partial failures degrade gracefully (message + retry guidance).

## References

- [models/index.html](../../../models/index.html) (LLM Providers block)

## Dependencies

- [model-catalog-01](./model-catalog-01-backend-registry-apis.md), [model-catalog-03](./model-catalog-03-ui-provider-config.md)

## Tracker

_Paste issue URL after filing:_ 
