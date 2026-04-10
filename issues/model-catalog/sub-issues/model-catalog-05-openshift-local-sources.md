# In-house & local model sources: OpenShift AI, Ollama, Ramalama

**Type:** Task / Feature  
**Labels (suggestion):** `kind/task`, `area/models`  
**Parent epic:** [Epic: Model catalog](../epic-model-catalog.md)

## Problem

Many users run models on **OpenShift AI** (or similar) or **locally** via Ollama/Ramalama. The catalog must list those models after sync or host probe, not only cloud APIs.

## Scope

### In-house (OpenShift AI)

- Connect cluster API or dashboard URL + OAuth token (per mockup copy on [models/index.html](../../../models/index.html)).
- **Sync** approved/served models into catalog registry ([model-catalog-01](./model-catalog-01-backend-registry-apis.md)).

### Local (Ollama & Ramalama)

- **Probe** daemon/binary or container reachability; list **currently available** models (mockup describes loaded models; implementation may differ).
- Surface status cards (running / not detected) as in mockup.

## Acceptance criteria

- [ ] User can complete OpenShift AI connection flow and see models in the in-house section after successful sync.
- [ ] User sees local runtime status and model list when daemons are reachable; clear message when not installed or not running.
- [ ] Catalog ids for these models work with session picker ([model-catalog-06](./model-catalog-06-session-integration-docs.md)).

## References

- [models/index.html](../../../models/index.html) (In-house · OpenShift AI; Local · Ollama & Ramalama sections)

## Dependencies

- [model-catalog-01](./model-catalog-01-backend-registry-apis.md), [model-catalog-02](./model-catalog-02-ui-catalog-browse.md)

## Tracker

_Paste issue URL after filing:_ 
