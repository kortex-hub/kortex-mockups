# Model catalog — sub-issues (ticket bodies)

These files are **ready-to-file** sub-issues for [Epic: Model catalog](../epic-model-catalog.md). Copy each file into your tracker (GitHub, Jira, etc.), then paste the created issue URL into the **Tracker** section at the bottom of each file.

| # | Title | File |
|---|--------|------|
| 1 | Backend: registry, provider state, APIs | [model-catalog-01-backend-registry-apis.md](./model-catalog-01-backend-registry-apis.md) |
| 2 | UI: catalog browse | [model-catalog-02-ui-catalog-browse.md](./model-catalog-02-ui-catalog-browse.md) |
| 3 | UI: provider configuration pages | [model-catalog-03-ui-provider-config.md](./model-catalog-03-ui-provider-config.md) |
| 4 | Cloud providers: connectivity & health | [model-catalog-04-cloud-provider-connectivity.md](./model-catalog-04-cloud-provider-connectivity.md) |
| 5 | OpenShift AI + local runtimes | [model-catalog-05-openshift-local-sources.md](./model-catalog-05-openshift-local-sources.md) |
| 6 | Session picker + docs | [model-catalog-06-session-integration-docs.md](./model-catalog-06-session-integration-docs.md) |

**Suggested dependency order:** 1 → (2, 3 in parallel) → 4 → 5 → 6. Ticket 4 may start once 1 has draft APIs; ticket 6 after 2 + 4 have a minimal vertical slice.
