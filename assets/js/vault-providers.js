/**
 * Predefined Secret Vault providers — add entries here to extend the catalog and Add Secret flow.
 * Used by services/index.html (built-in integration table) and related mocks. Generic add-secret UI is services/create.html (standalone form).
 */
(function (global) {
    var ICONS = {
        github: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
        jira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        gitlab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22.65 14.39 12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51a.42.42 0 0 1 .8-.01l2.44 7.49h8.1l2.44-7.51a.42.42 0 0 1 .8 0l2.44 7.51 1.22 3.78a.84.84 0 0 1-.29.94z"/></svg>',
        slack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>',
        openshift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        ansible: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
        custom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M12 11V7a4 4 0 0 0-4-4H8"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>'
    };

    global.VAULT_PROVIDERS_ORDER = ['github', 'jira', 'gitlab', 'slack', 'openshift', 'ansible-aap', 'custom'];

    global.VAULT_PROVIDER_REGISTRY = {
        github: {
            id: 'github',
            label: 'GitHub',
            description: 'Personal or fine-grained token for repos, pull requests, and issues.',
            defaultCategory: 'api',
            icon: ICONS.github,
            fields: [
                { id: 'github_pat', name: 'github_pat', label: 'Personal access token', type: 'password', placeholder: 'ghp_… or github_pat_…', hint: 'From GitHub → Settings → Developer settings.', required: true, secretToggle: true },
                { id: 'github_org', name: 'github_org', label: 'Organization or owner', type: 'text', placeholder: 'e.g. acme-corp (optional)', hint: 'Helps agents pick the right namespace when you have access to several.', required: false }
            ]
        },
        jira: {
            id: 'jira',
            label: 'Jira',
            description: 'API token plus Atlassian account email and site URL (Cloud or Data Center).',
            defaultCategory: 'api',
            icon: ICONS.jira,
            fields: [
                { id: 'jira_token', name: 'jira_token', label: 'API token', type: 'password', placeholder: 'Paste API token', hint: 'Create at id.atlassian.com → API tokens.', required: true, secretToggle: true },
                { id: 'jira_email', name: 'jira_email', label: 'Atlassian account email', type: 'email', placeholder: 'you@company.com', required: true },
                { id: 'jira_url', name: 'jira_url', label: 'Site URL', type: 'url', placeholder: 'https://your-domain.atlassian.net', required: true },
                { id: 'jira_project', name: 'jira_project', label: 'Default project key', type: 'text', placeholder: 'e.g. KX (optional)', required: false }
            ]
        },
        gitlab: {
            id: 'gitlab',
            label: 'GitLab',
            description: 'Personal, project, or group access token for GitLab.com or self-managed.',
            defaultCategory: 'api',
            icon: ICONS.gitlab,
            fields: [
                { id: 'gitlab_token', name: 'gitlab_token', label: 'Token', type: 'password', placeholder: 'glpat-…', hint: 'From User Settings → Access Tokens (or project/group token).', required: true, secretToggle: true },
                { id: 'gitlab_host', name: 'gitlab_host', label: 'Instance URL', type: 'url', placeholder: 'https://gitlab.com (optional)', hint: 'Leave default for GitLab.com.', required: false }
            ]
        },
        slack: {
            id: 'slack',
            label: 'Slack',
            description: 'Bot token for posting messages and reacting in channels your app is in.',
            defaultCategory: 'api',
            icon: ICONS.slack,
            fields: [
                { id: 'slack_token', name: 'slack_token', label: 'Bot token', type: 'password', placeholder: 'xoxb-…', hint: 'From your Slack app → OAuth & Permissions.', required: true, secretToggle: true }
            ]
        },
        openshift: {
            id: 'openshift',
            label: 'OpenShift / Kubernetes',
            description: 'Cluster API URL and bearer token (or service account token) for kubectl-compatible access.',
            defaultCategory: 'infra',
            icon: ICONS.openshift,
            fields: [
                { id: 'k8s_server', name: 'k8s_server', label: 'API server URL', type: 'url', placeholder: 'https://api.cluster.example:6443', required: true },
                { id: 'k8s_token', name: 'k8s_token', label: 'Token', type: 'password', placeholder: 'Paste bearer token', hint: 'Often from oc whoami -t or a service account secret.', required: true, secretToggle: true }
            ]
        },
        'ansible-aap': {
            id: 'ansible-aap',
            label: 'Ansible Automation Platform',
            description: 'Controller URL and OAuth or personal access token for job templates and inventories.',
            defaultCategory: 'infra',
            icon: ICONS.ansible,
            fields: [
                { id: 'aap_url', name: 'aap_url', label: 'Controller URL', type: 'url', placeholder: 'https://aap.example', required: true },
                { id: 'aap_token', name: 'aap_token', label: 'Token', type: 'password', placeholder: 'Paste token', required: true, secretToggle: true }
            ]
        },
        custom: {
            id: 'custom',
            label: 'Custom',
            description: 'Any other API key, OAuth material, or secret — you choose the credential shape.',
            defaultCategory: 'api',
            icon: ICONS.custom,
            customKind: true,
            fields: [
                { id: 'custom_secret', name: 'secret', label: 'Secret value', type: 'password', placeholder: 'Paste token or key', hint: 'Use the real credential here. This mock does not send data anywhere.', required: true, secretToggle: true }
            ]
        }
    };
})(typeof window !== 'undefined' ? window : globalThis);
