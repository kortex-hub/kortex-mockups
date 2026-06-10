/**
 * page-data.js — loads mock data from assets/data/*.json and renders it into the page.
 * No demo-scenario logic; always shows the full dataset.
 * Supports both HTTP and file:// (falls back to inline defaults when fetch is unavailable).
 */
(function () {
    function esc(s) {
        if (s == null) return '';
        var d = document.createElement('div');
        d.textContent = String(s);
        return d.innerHTML;
    }

    function dataRoot() {
        var el = document.querySelector('script[src*="page-data.js"]');
        if (el && el.src) {
            try { return new URL('../data', el.src).href; } catch (e) { /* fall through */ }
        }
        var nav = document.body && document.body.getAttribute('data-nav-root');
        return (nav || '..') + '/assets/data';
    }

    function fetchJSON(url, fallback) {
        if (typeof fetch === 'undefined') return Promise.resolve(fallback);
        return fetch(url)
            .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
            .catch(function () { return fallback; });
    }

    /* ── Projects ──────────────────────────────────────────────────── */

    var GIT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';
    var CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
    var ASSET_SVG = {
        skills: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        mcp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        knowledge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>'
    };

    function renderProjectCard(p) {
        var assets = (p.assets || []).map(function (a) {
            return '<span class="project-asset-tag ' + esc(a.type) + '">' + (ASSET_SVG[a.type] || '') + esc(a.label) + '</span>';
        }).join('');
        var badgeClass = 'project-card-agents-badge ' + (p.agentsBadgeVariant === 'running' ? 'running' : 'idle');
        var statusTitle = p.statusDot === 'active' ? (p.agentsBadge || 'Active') : 'No agents running';
        return (
            '<div class="project-card" data-project-slug="' + esc(p.slug) + '" onclick="openProject(this.getAttribute(\'data-project-slug\'))">' +
            '<div class="project-card-header">' +
            '<div class="project-card-icon" style="background:' + esc(p.icon.gradient) + '">' + esc(p.icon.text) + '</div>' +
            '<div class="project-card-title-area">' +
            '<div class="project-card-name">' + esc(p.name) + '</div>' +
            '<div class="project-card-path">' + esc(p.path) + '</div>' +
            '</div>' +
            '<div class="project-card-status-dot ' + esc(p.statusDot) + '" title="' + esc(statusTitle) + '"></div>' +
            '</div>' +
            '<div class="project-card-git">' + GIT_SVG +
            '<span class="project-card-git-remote">' + esc(p.gitRemote) + '</span>' +
            '<span class="project-card-branch">' + esc(p.branch) + '</span>' +
            '</div>' +
            '<div class="project-card-assets">' + assets + '</div>' +
            '<div class="project-card-workspace-row">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px;flex-shrink:0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
            '<span>' + (p.workspacesCount || 0) + ' sandbox' + ((p.workspacesCount || 0) !== 1 ? 'es' : '') + '</span>' +
            (p.activeSessionsCount > 0 ? '<span class="project-card-sessions-pill running">' + p.activeSessionsCount + ' running</span>' : '') +
            '<a href="../work/index.html" class="project-card-work-link" onclick="event.stopPropagation()">Open in Work →</a>' +
            '</div>' +
            '<div class="project-card-footer">' +
            '<div class="project-card-meta"><div class="project-card-meta-item">' + CLOCK_SVG + esc(p.footerMeta) + '</div></div>' +
            '<span class="' + badgeClass + '">' + esc(p.agentsBadge) + '</span>' +
            '</div></div>'
        );
    }

    function hydrateProjects(data) {
        var grid = document.getElementById('projectsGrid');
        if (!grid) return;
        var label = document.getElementById('projectsCountLabel');
        if (label) label.textContent = data.countLabel || '';
        grid.innerHTML = (data.projects || []).map(renderProjectCard).join('');
    }

    /* ── Knowledges ────────────────────────────────────────────────── */

    function renderKnowledgeRow(row) {
        var dbClass = row.databaseIcon === 'chroma' ? 'chroma-icon' : 'milvus-icon';
        var actionBtn = row.primaryAction === 'stop'
            ? '<button class="action-button" title="Stop"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg></button>'
            : '<button class="action-button" title="Start"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 8 19 19 12 8 5"/></svg></button>';
        var statusSvg = '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>';
        var deleteSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6m3,0V4a2,2 0,0,1,2-2h4a2,2 0,0,1,2,2v2"/></svg>';
        return (
            '<tr data-kb-env="' + esc(row.env) + '" onclick="window.location.href=\'details.html?env=\'+encodeURIComponent(this.getAttribute(\'data-kb-env\'))">' +
            '<td class="checkbox-cell"><input type="checkbox" class="checkbox" onclick="event.stopPropagation()"></td>' +
            '<td class="status-cell">' + statusSvg + '</td>' +
            '<td><span class="env-name">' + esc(row.name) + '</span></td>' +
            '<td><span class="database-badge"><div class="tech-icon ' + dbClass + '"></div>' + esc(row.database) + '</span></td>' +
            '<td><span class="chunker-badge"><div class="tech-icon" style="background:' + esc(row.chunkerStyle) + ';border-radius:20%"></div>' + esc(row.chunker) + '</span></td>' +
            '<td class="sources-cell"><span class="sources-count">' + esc(row.sources) + '</span></td>' +
            '<td class="actions-cell"><div class="actions-row" onclick="event.stopPropagation()">' + actionBtn +
            '<button class="action-button delete" title="Delete">' + deleteSvg + '</button></div></td></tr>'
        );
    }

    function hydrateKnowledges(data) {
        var tbody = document.querySelector('.knowledges-page table.rag-table tbody');
        var emptyEl = document.getElementById('kbEmptyState');
        var panel = document.getElementById('kbTablePanel');
        if (!tbody) return;
        var rows = data.rows || [];
        if (rows.length === 0) {
            document.body.setAttribute('data-demo-kb-mode', 'empty');
            if (emptyEl) emptyEl.style.display = 'flex';
            if (panel) panel.style.display = 'none';
            return;
        }
        document.body.setAttribute('data-demo-kb-mode', 'list');
        if (emptyEl) emptyEl.style.display = 'none';
        if (panel) panel.style.display = '';
        tbody.innerHTML = rows.map(renderKnowledgeRow).join('');
    }

    /* ── Secret Vault (Services) ───────────────────────────────────── */

    var EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    var MORE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>';
    var KEY_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M12 11V7a4 4 0 0 0-4-4H8"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>';

    var VAULT_ICONS = {
        github:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
        gitlab:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.65 14.39 12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51a.42.42 0 0 1 .8-.01l2.44 7.49h8.1l2.44-7.51a.42.42 0 0 1 .8 0l2.44 7.51 1.22 3.78a.84.84 0 0 1-.29.94z"/></svg>',
        jira:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        slack:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>',
        openshift:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        'ansible-aap':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
    };

    function renderVaultProviderRow(entry) {
        var REG = window.VAULT_PROVIDER_REGISTRY || {};
        var ORDER = window.VAULT_PROVIDERS_ORDER || Object.keys(REG);
        var pid = entry.providerId;
        var meta = REG[pid] || {};
        var tone = meta.defaultCategory === 'infra' ? 'infra' : 'api';
        var icon = meta.icon || VAULT_ICONS[pid] || KEY_SVG;
        var label = meta.label || pid;
        var description = (meta.description || '').slice(0, 88);
        var configured = !!entry.configured;
        var expired = entry.status === 'expired';
        var conn = esc(entry.connection || '—');
        var mask = esc(entry.masked || '••••••••••••');
        var full = esc(entry.revealValue || entry.masked || '••••••••••••');
        var detailHref = configured && entry.detailId ? 'details.html?id=' + encodeURIComponent(entry.detailId) : 'index.html';
        var trClass = 'vault-catalog-row' + (expired ? ' vault-row-expired' : '') + (!configured ? ' vault-catalog-row--inactive' : '');

        var nameInner = configured
            ? '<a href="' + esc(detailHref) + '" class="vault-int-name" style="color:inherit;text-decoration:none">' + esc(label) + '</a><div class="vault-int-sub">' + esc(description) + '</div>'
            : '<span class="vault-int-name">' + esc(label) + '</span><div class="vault-int-sub">' + esc(description) + '</div>';

        var secretCell, actionsCell;
        if (configured) {
            secretCell = '<span class="vault-secret-dots" data-mask="' + mask + '" data-full="' + full + '">' + mask + '</span>';
            actionsCell = '<div class="vault-row-actions">' +
                '<button type="button" class="vault-icon-btn vault-secret-reveal" aria-pressed="false" aria-label="Show secret">' + EYE_SVG + '</button>' +
                '<a href="' + esc(detailHref) + '" class="vault-icon-btn" aria-label="Open details">' + MORE_SVG + '</a>' +
                '</div>';
        } else {
            secretCell = '<span>—</span>';
            actionsCell = '<button type="button" class="vault-configure-btn vault-config-toggle" aria-expanded="false">Configure</button>';
        }

        var syncStatus;
        if (expired) {
            syncStatus = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#f59e0b;font-weight:500;" title="Credential rejected — please refresh"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Expired</span>';
        } else if (configured) {
            syncStatus = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#4ade80;font-weight:500;" title="Provider synced with OpenShell"><span style="width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;"></span> Synced</span>';
        } else {
            syncStatus = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--kd-text-muted);font-weight:500;" title="Will be synced next time a sandbox uses it"><span style="width:7px;height:7px;border-radius:50%;background:var(--kd-text-muted);opacity:0.5;display:inline-block;"></span> Pending</span>';
        }

        return '<tr class="' + trClass + '" data-provider="' + esc(pid) + '" data-type="' + esc(tone) + '">' +
            '<td><div class="vault-int-cell"><span class="vault-int-icon ' + esc(tone) + '">' + icon + '</span><div class="vault-int-text">' + nameInner + '</div></div></td>' +
            '<td class="vault-connection-cell">' + conn + '</td>' +
            '<td class="vault-secret-cell">' + secretCell + '</td>' +
            '<td>' + syncStatus + (expired ? ' <button type="button" style="margin-left:8px;font-size:11px;padding:2px 8px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);border-radius:4px;color:#f59e0b;cursor:pointer;">Refresh</button>' : '') + '</td>' +
            '<td>' + actionsCell + '</td></tr>';
    }

    function renderVaultGenericRow(g) {
        var configured = !!g.configured;
        var expired = g.status === 'expired';
        var conn = esc(g.connection || '—');
        var mask = esc(g.masked || '••••••••••••');
        var full = esc(g.revealValue || g.masked || '••••••••••••');
        var detailHref = configured && g.detailId ? 'details.html?id=' + encodeURIComponent(g.detailId) : 'index.html';
        var trClass = 'vault-catalog-row vault-catalog-row--generic' + (expired ? ' vault-row-expired' : '') + (!configured ? ' vault-catalog-row--inactive' : '');

        var nameInner = configured
            ? '<a href="' + esc(detailHref) + '" class="vault-int-name" style="color:inherit;text-decoration:none">' + esc(g.title) + '</a><div class="vault-int-sub">' + esc(g.subtitle || '') + '</div>'
            : '<span class="vault-int-name">' + esc(g.title) + '</span><div class="vault-int-sub">' + esc(g.subtitle || '') + '</div>';

        var secretCell, actionsCell;
        if (configured) {
            secretCell = '<span class="vault-secret-dots" data-mask="' + mask + '" data-full="' + full + '">' + mask + '</span>';
            actionsCell = '<div class="vault-row-actions">' +
                '<button type="button" class="vault-icon-btn vault-secret-reveal" aria-pressed="false" aria-label="Show secret">' + EYE_SVG + '</button>' +
                '<a href="' + esc(detailHref) + '" class="vault-icon-btn" aria-label="Open details">' + MORE_SVG + '</a>' +
                '</div>';
        } else {
            secretCell = '<span>—</span>';
            actionsCell = '<a href="create.html" class="vault-configure-btn">Add secret</a>';
        }

        var gSyncStatus;
        if (expired) {
            gSyncStatus = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#f59e0b;font-weight:500;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> Expired</span>';
        } else if (configured) {
            gSyncStatus = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:#4ade80;font-weight:500;"><span style="width:7px;height:7px;border-radius:50%;background:#4ade80;display:inline-block;"></span> Synced</span>';
        } else {
            gSyncStatus = '<span style="display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--kd-text-muted);font-weight:500;"><span style="width:7px;height:7px;border-radius:50%;background:var(--kd-text-muted);opacity:0.5;display:inline-block;"></span> Pending</span>';
        }

        return '<tr class="' + trClass + '" data-type="generic">' +
            '<td><div class="vault-int-cell"><span class="vault-int-icon generic">' + KEY_SVG + '</span><div class="vault-int-text">' + nameInner + '</div></div></td>' +
            '<td class="vault-connection-cell">' + conn + '</td>' +
            '<td class="vault-secret-cell">' + secretCell + '</td>' +
            '<td>' + gSyncStatus + '</td>' +
            '<td>' + actionsCell + '</td></tr>';
    }

    function hydrateServices(data) {
        var tbody = document.getElementById('vaultCatalogBody');
        if (!tbody) return;

        var sub = document.getElementById('vaultSubtitle');
        var catLead = document.getElementById('vaultCatalogLead');
        var emptyEl = document.getElementById('vaultEmptyState');

        if (sub) sub.textContent = data.subtitle || '';
        if (catLead && data.catalogLead) catLead.textContent = data.catalogLead;
        if (emptyEl) emptyEl.style.display = 'none';

        var REG = window.VAULT_PROVIDER_REGISTRY || {};
        var ORDER = window.VAULT_PROVIDERS_ORDER || Object.keys(REG);

        var catalogMap = {};
        (data.integrationCatalog || []).forEach(function (e) {
            if (e && e.providerId) catalogMap[e.providerId] = e;
        });

        var parts = ORDER.filter(function (pid) { return pid !== 'custom'; }).map(function (pid) {
            var entry = Object.assign({ providerId: pid, configured: false }, catalogMap[pid] || {});
            return renderVaultProviderRow(entry);
        });

        var generics = data.genericSecrets || [];
        if (generics.length) {
            parts.push('<tr class="vault-catalog-section-row"><td colspan="5" class="vault-catalog-section-cell">Generic secrets</td></tr>');
            generics.forEach(function (g) { parts.push(renderVaultGenericRow(g)); });
        }

        tbody.innerHTML = parts.join('');
    }

    /* ── MCP ───────────────────────────────────────────────────────── */

    var MCP_READY_STATUS = '<div class="mcp-status-icon ready" title="Ready"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>';
    var MCP_INSTALL_STATUS = '<div class="mcp-status-icon install" title="Not installed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M7 3v14M3 8h18"/><line x1="14" y1="14" x2="19" y2="19"/><line x1="19" y1="14" x2="14" y2="19"/></svg></div>';
    var MCP_INTERNAL_BADGE = '<span class="internal-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Internal</span>';
    var MCP_CONFIGURE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    var MCP_INSTALL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';

    function renderMcpReadyRow(item) {
        var href = 'details.html?mcp=' + encodeURIComponent(item.id);
        var versionTools = [item.version, item.tools ? item.tools + ' tools' : null].filter(Boolean).join(' · ');
        var internalCls = item.internal ? ' internal-asset' : '';
        return '<tr class="mcp-server-row' + internalCls + '"' +
            (item.internal ? ' data-internal="true"' : '') +
            ' data-search="' + esc(item.search || item.name) + '" onclick="window.location.href=\'' + esc(href) + '\'">' +
            '<td class="status-cell">' + MCP_READY_STATUS + '</td>' +
            '<td><div class="mcp-name-cell">' +
            (item.internal ? MCP_INTERNAL_BADGE : '') +
            '<span class="mcp-name-primary">' + esc(item.name) + '</span>' +
            (versionTools ? '<span class="mcp-name-id">' + esc(versionTools) + '</span>' : '') +
            '</div></td>' +
            '<td><div class="mcp-desc-cell">' + esc(item.description) + '</div></td>' +
            '<td class="actions-cell" style="text-align:right">' +
            '<button type="button" class="mcp-action-btn" onclick="event.stopPropagation();window.location.href=\'' + esc(href) + '\'" title="Configure" aria-label="Configure">' + MCP_CONFIGURE_SVG + '</button>' +
            '</td></tr>';
    }

    function renderMcpInstallRow(item) {
        var href = item.detailUrl || ('details.html?mcp=' + encodeURIComponent(item.id));
        var versionTools = [item.version, item.tools ? item.tools + ' tools' : null, item.source].filter(Boolean).join(' · ');
        var internalCls = item.internal ? ' internal-asset' : '';
        return '<tr class="mcp-server-row' + internalCls + '"' +
            (item.internal ? ' data-internal="true"' : '') +
            ' data-search="' + esc(item.search || item.name) + '" onclick="window.location.href=\'' + esc(href) + '\'">' +
            '<td class="status-cell">' + MCP_INSTALL_STATUS + '</td>' +
            '<td><div class="mcp-name-cell">' +
            (item.internal ? MCP_INTERNAL_BADGE : '') +
            '<span class="mcp-name-primary">' + esc(item.name) + '</span>' +
            (versionTools ? '<span class="mcp-name-id">' + esc(versionTools) + '</span>' : '') +
            '</div></td>' +
            '<td><div class="mcp-desc-cell">' + esc(item.description) + '</div></td>' +
            '<td class="actions-cell" style="text-align:right">' +
            '<button type="button" class="mcp-action-btn primary" data-install-btn onclick="event.stopPropagation();installMcpFromCatalog(this,\'' + esc(href) + '\')" title="Install" aria-label="Install">' + MCP_INSTALL_SVG + '</button>' +
            '</td></tr>';
    }

    function hydrateMcp(data) {
        var readyBody = document.getElementById('mcpReadyBody');
        var installBody = document.getElementById('mcpInstallBody');
        if (readyBody) readyBody.innerHTML = (data.ready || []).map(renderMcpReadyRow).join('');
        if (installBody) installBody.innerHTML = (data.install || []).map(renderMcpInstallRow).join('');
    }

    /* ── Sessions ──────────────────────────────────────────────────── */

    var STOP_SVG   = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    var PLAY_SVG   = '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    var TERM_SVG   = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>';
    var TRASH_SVG  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>';

    function formatSessionCost(s) {
        if (s.costUSD === 0 || s.costUSD == null) {
            return '<span style="color:var(--kd-text-muted);font-size:12px">Free</span>';
        }
        var prefix = s.status === 'running' ? '' : '';
        return '<span style="font-size:12px;font-weight:600;font-variant-numeric:tabular-nums">' +
            prefix + '$' + s.costUSD.toFixed(2) + '</span>' +
            (s.status === 'running'
                ? '<div style="font-size:10px;color:var(--kd-text-muted);margin-top:1px">accumulating</div>'
                : '<div style="font-size:10px;color:var(--kd-text-muted);margin-top:1px">total</div>');
    }

    function renderSessionRow(s) {
        var running = s.status === 'running';
        var href = 'details.html?session=' + encodeURIComponent(s.id);
        var dotCls = running ? 'running' : 'stopped';
        var actions = running
            ? '<button type="button" class="models-table-icon-btn sess-stop" onclick="event.stopPropagation();stopSession(\'' + esc(s.id) + '\')" title="Stop">' + STOP_SVG + '</button>' +
              '<button type="button" class="models-table-icon-btn" onclick="event.stopPropagation();window.location.href=\'cli.html?session=' + esc(s.id) + '\'" title="Open Terminal">' + TERM_SVG + '</button>' +
              '<button type="button" class="models-table-icon-btn sess-del" onclick="event.stopPropagation();deleteSession(\'' + esc(s.id) + '\')" title="Delete">' + TRASH_SVG + '</button>'
            : '<button type="button" class="models-table-icon-btn sess-play" onclick="event.stopPropagation();startSession(\'' + esc(s.id) + '\')" title="Start">' + PLAY_SVG + '</button>' +
              '<button type="button" class="models-table-icon-btn" onclick="event.stopPropagation();window.location.href=\'cli.html?session=' + esc(s.id) + '\'" title="Open Terminal">' + TERM_SVG + '</button>' +
              '<button type="button" class="models-table-icon-btn sess-del" onclick="event.stopPropagation();deleteSession(\'' + esc(s.id) + '\')" title="Delete">' + TRASH_SVG + '</button>';
        return '<tr style="cursor:pointer" onclick="window.location.href=\'' + href + '\'">' +
            '<td class="models-table-status"><span class="sess-status-dot ' + dotCls + '"></span></td>' +
            '<td><div class="models-table-name-stack">' +
            '<div class="models-table-name-main">' + esc(s.title) + '</div>' +
            '</div></td>' +
            '<td><span class="sess-agent-badge ' + esc(s.agentType) + '">' + esc(s.agentLabel) + '</span></td>' +
            '<td style="text-align:right">' + formatSessionCost(s) + '</td>' +
            '<td style="text-align:right;font-variant-numeric:tabular-nums">' + esc(s.time) + '</td>' +
            '<td><div class="models-table-actions">' + actions + '</div></td>' +
            '</tr>';
    }

    function hydrateSessions(data) {
        var stats = data.stats || {};
        var statVals = document.querySelectorAll('.sessions-stats .stat-value');
        if (statVals[0]) statVals[0].textContent = String(stats.activeSessions != null ? stats.activeSessions : '');
        if (statVals[1]) statVals[1].textContent = String(stats.totalSessions != null ? stats.totalSessions : '');
        if (statVals[2]) statVals[2].textContent = String(stats.configuredAgents != null ? stats.configuredAgents : '');

        var tbody = document.getElementById('sessionsTableBody');
        if (!tbody) return;
        tbody.innerHTML = (data.sessions || []).map(renderSessionRow).join('');
    }

    /* ── Tasks (left panel) ────────────────────────────────────────── */

    var SECTION_ICONS = {
        'needs-input': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
        'running':     '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
        'paused':      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
        'completed':   '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
    };
    var PROJECT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';
    var BRANCH_SVG  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>';
    var CHECK_SVG   = '<svg class="project-option-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';

    function renderTaskItem(t) {
        var needsInput = t.status === 'blocked' || t.status === 'waiting';
        var cls = 'task-item' + (needsInput ? ' needs-input' : '') + (t.active ? ' active' : '');
        var dotStyle = t.statusColor
            ? ' style="background:' + esc(t.statusColor) + ';box-shadow:0 0 6px rgba(248,113,113,0.4);animation:taskPulse 2s infinite"'
            : '';
        var dotCls = 'task-status-dot' + (t.statusColor ? '' : ' ' + esc(t.status));
        var labelStyle = t.statusColor ? ' style="color:#fca5a5"' : '';
        var attentionBadge = t.needsAction
            ? '<span class="task-item-attention-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>Action</span>'
            : '';
        var timeBadge = t.time ? '<span class="task-item-time">' + esc(t.time) + '</span>' : '';
        return '<div class="' + cls + '" data-project="' + esc(t.project) + '" data-task-id="' + esc(t.id) + '" onclick="selectTask(this,\'' + esc(t.id) + '\')">' +
            '<div class="task-item-body">' +
            '<div class="task-item-goal">' + esc(t.goal) + '</div>' +
            '<div class="task-item-meta">' +
            '<div class="' + dotCls + '"' + dotStyle + '></div>' +
            '<span class="task-item-status-label"' + labelStyle + '>' + esc(t.statusLabel) + '</span>' +
            attentionBadge + timeBadge +
            '</div>' +
            '<div class="task-item-context">' +
            '<div class="task-item-project">' + PROJECT_SVG + '<span class="task-item-project-name">' + esc(t.project) + '</span></div>' +
            '<div class="task-item-git">' + BRANCH_SVG + '<span class="task-item-git-text"><span class="task-item-git-branch">' + esc(t.branch) + '</span></span></div>' +
            '</div></div></div>';
    }

    function renderTaskSection(sec) {
        var icon = SECTION_ICONS[sec.type] || '';
        var sectionCls = 'tasks-section-label section-' + esc(sec.type);
        var header = '<div class="' + sectionCls + '" id="section-' + esc(sec.id) + '">' +
            icon + ' ' + esc(sec.label) +
            ' <span class="section-count">' + (sec.tasks || []).length + '</span></div>';
        return header + (sec.tasks || []).map(renderTaskItem).join('');
    }

    function hydrateTasks(data) {
        var tasksList = document.getElementById('tasksList');
        if (!tasksList) return;

        var sections = data.sections || [];
        var total = sections.reduce(function (n, s) { return n + (s.tasks || []).length; }, 0);

        var liveBtn = tasksList.querySelector('.live-monitor-btn');
        tasksList.innerHTML = sections.map(renderTaskSection).join('');
        if (liveBtn) tasksList.appendChild(liveBtn);

        var dropdown = document.getElementById('projectDropdown');
        if (dropdown && data.projects) {
            var allOpt = '<div class="tasks-project-option active" data-project="all" onclick="selectProjectFilter(\'all\',this)">' +
                PROJECT_SVG + '<span class="project-option-name">All Projects</span><span class="project-option-count">' + total + '</span>' + CHECK_SVG + '</div>';
            var opts = data.projects.map(function (p) {
                return '<div class="tasks-project-option" data-project="' + esc(p.name) + '" onclick="selectProjectFilter(\'' + esc(p.name) + '\',this)">' +
                    PROJECT_SVG + '<span class="project-option-name">' + esc(p.name) + '</span><span class="project-option-count">' + p.count + '</span>' + CHECK_SVG + '</div>';
            }).join('');
            dropdown.innerHTML = allOpt + opts;
        }
    }

    /* ── Dashboard ─────────────────────────────────────────────────── */

    var ACTIVITY_ICONS = {
        completed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
        pr:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>',
        deploy:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        alert:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        asset:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        error:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    };
    var PROVIDER_ICONS = {
        chat:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
        bot:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg>',
        layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
    };

    function renderAgentItem(w) {
        var pct = w.progress || 0;
        var deg = Math.round(pct / 100 * 360);
        var svgInner = w.status === 'running'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
        var badgeCls = w.status === 'running' ? 'running' : (w.status === 'paused' ? 'paused' : 'waiting');
        var badgeLabel = w.status === 'running' ? 'Running' : (w.status === 'paused' ? 'Paused' : 'Needs Review');
        return '<div class="dash-agent-item" onclick="window.location.href=\'../sessions/index.html\'">' +
            '<div class="dash-agent-status-ring ' + esc(w.status) + '" style="--progress:' + deg + 'deg">' +
            '<div class="dash-agent-status-ring-inner">' + svgInner + '</div></div>' +
            '<div class="dash-agent-info">' +
            '<div class="dash-agent-name">' + esc(w.name) + '</div>' +
            '<div class="dash-agent-task">' + esc(w.task) + '</div>' +
            '</div>' +
            '<div class="dash-agent-right">' +
            '<span class="dash-agent-badge ' + badgeCls + '">' + badgeLabel + '</span>' +
            '<span class="dash-agent-time">' + esc(w.time) + '</span>' +
            '</div></div>';
    }

    function renderActivityItem(a) {
        var icon = ACTIVITY_ICONS[a.type] || ACTIVITY_ICONS.asset;
        return '<div class="dash-activity-item">' +
            '<div class="dash-activity-icon ' + esc(a.type) + '">' + icon + '</div>' +
            '<div class="dash-activity-info">' +
            '<div class="dash-activity-text">' + a.html + '</div>' +
            '<div class="dash-activity-time">' + esc(a.time) + '</div>' +
            '</div></div>';
    }

    function renderResourceTile(r) {
        var RESOURCE_ICONS = {
            cpu:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></svg>',
            memory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 19v-3M10 19v-3M14 19v-3M18 19v-3M8 11V9M16 11V9M12 11V9M2 15h20M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z"/></svg>',
            tokens: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
        };
        return '<div class="dash-resource-tile ' + esc(r.type) + '">' +
            '<div class="dash-resource-tile-header">' +
            '<span class="dash-resource-tile-label">' + esc(r.label) + '</span>' +
            '<div class="dash-resource-tile-icon ' + esc(r.type) + '">' + (RESOURCE_ICONS[r.type] || '') + '</div>' +
            '</div>' +
            '<div class="dash-resource-tile-value">' + esc(r.value) + '</div>' +
            '<div class="dash-resource-bar-bg"><div class="dash-resource-bar ' + esc(r.type) + '" style="width:' + r.barPct + '%"></div></div>' +
            '<div class="dash-resource-tile-detail">' + r.detail + '</div>' +
            '</div>';
    }

    function renderCostProviderRow(p) {
        var strokeColor = p.iconStroke || '#a78bfa';
        var icon = p.iconPath && PROVIDER_ICONS[p.iconPath]
            ? p.iconPath === 'layers'
                ? p.iconPath
                : p.iconPath
            : 'chat';
        var iconSvg = PROVIDER_ICONS[p.iconPath] || PROVIDER_ICONS.chat;
        var coloredSvg = iconSvg.replace('stroke="currentColor"', 'stroke="' + esc(strokeColor) + '"');
        return '<div class="dash-cost-row">' +
            '<div class="dash-cost-row-icon">' + coloredSvg + '</div>' +
            '<div class="dash-cost-row-info"><div class="dash-cost-row-name">' + esc(p.name) + '</div>' +
            '<div class="dash-cost-row-detail">' + p.detail + '</div></div>' +
            '<div class="dash-cost-row-bar-wrap"><div class="dash-cost-row-bar-bg">' +
            '<div class="dash-cost-row-bar" style="width:' + p.barPct + '%;background:' + esc(strokeColor) + '"></div>' +
            '</div></div>' +
            '<div class="dash-cost-row-amount">' + esc(p.amount) + '</div></div>';
    }

    function renderCostWorkspaceRow(w) {
        return '<div class="dash-cost-row">' +
            '<div class="dash-cost-row-info"><div class="dash-cost-row-name">' + esc(w.name) + '</div>' +
            '<div class="dash-cost-row-detail">' + esc(w.detail) + '</div></div>' +
            '<div class="dash-cost-row-bar-wrap"><div class="dash-cost-row-bar-bg">' +
            '<div class="dash-cost-row-bar" style="width:' + w.barPct + '%"></div>' +
            '</div></div>' +
            '<div class="dash-cost-row-amount">' + esc(w.amount) + '</div></div>';
    }

    function hydrateDashboard(data) {
        var user = data.user || {};
        var nameEl = document.querySelector('.dash-greeting-text h1 span');
        var ctxEl  = document.querySelector('.dash-greeting-text p');
        if (nameEl) nameEl.textContent = user.name || '';
        if (ctxEl)  ctxEl.textContent = user.contextLine || '';

        var statCards = document.querySelectorAll('.dash-stat-card');
        (data.stats || []).forEach(function (s, i) {
            var card = statCards[i];
            if (!card) return;
            var valEl = card.querySelector('.dash-stat-value');
            var detEl = card.querySelector('.dash-stat-detail');
            var lblEl = card.querySelector('.dash-stat-label');
            if (valEl) {
                valEl.textContent = s.value;
                valEl.removeAttribute('style');
                if (s.valueStyle) valEl.setAttribute('style', s.valueStyle);
            }
            if (detEl) detEl.innerHTML = s.detail;
            if (lblEl) lblEl.textContent = s.label;
        });

        var agentList = document.querySelector('.dash-agent-list');
        if (agentList) agentList.innerHTML = (data.activeWorkspaces || []).map(renderAgentItem).join('');

        var activityList = document.querySelector('.dash-activity-list');
        if (activityList) activityList.innerHTML = (data.recentActivity || []).map(renderActivityItem).join('');

        var resourceTiles = document.querySelector('.dash-resource-tiles');
        if (resourceTiles) resourceTiles.innerHTML = (data.resources || []).map(renderResourceTile).join('');

        var cost = data.cost || {};
        var totalVal = document.querySelector('.dash-cost-total-value');
        var totalChg = document.querySelector('.dash-cost-total-change');
        if (totalVal) totalVal.textContent = cost.total || '';
        if (totalChg && cost.change) {
            var dir = cost.changeDirection === 'up' ? 'up' : 'down';
            totalChg.innerHTML = '<span class="' + dir + '">' + (dir === 'up' ? '&uarr;' : '&darr;') + ' ' + cost.change.replace(/[↑↓&uarr;&darr;]/g, '').trim() + '</span> vs last week';
        }

        var breakdowns = document.querySelectorAll('.dash-cost-breakdown');
        if (breakdowns[0] && cost.byProvider) {
            var h0 = breakdowns[0].querySelector('.dash-cost-breakdown-header');
            var hdr0 = h0 ? h0.outerHTML : '';
            breakdowns[0].innerHTML = hdr0 + '<div class="dash-cost-breakdown-list">' + cost.byProvider.map(renderCostProviderRow).join('') + '</div>';
        }
        if (breakdowns[1] && cost.byWorkspace) {
            var h1 = breakdowns[1].querySelector('.dash-cost-breakdown-header');
            var hdr1 = h1 ? h1.outerHTML : '';
            breakdowns[1].innerHTML = hdr1 + '<div class="dash-cost-breakdown-list">' + cost.byWorkspace.map(renderCostWorkspaceRow).join('') + '</div>';
        }
    }

    /* ── Model pricing ────────────────────────────────────────────── */

    function formatCost(p) {
        if (!p || (p.inputPer1M === 0 && p.outputPer1M === 0)) {
            return '<span style="color:var(--kd-text-muted);font-size:12px">Free · self-hosted</span>';
        }
        var fmt = function (n) { return '$' + n.toFixed(2); };
        return '<div style="font-size:12px;font-weight:600;color:var(--kd-text-primary);font-variant-numeric:tabular-nums">' +
            fmt(p.inputPer1M) + ' <span style="color:var(--kd-text-muted);font-weight:400">/</span> ' + fmt(p.outputPer1M) + '</div>' +
            '<div style="font-size:11px;color:var(--kd-text-muted);margin-top:1px">in / out</div>';
    }

    function hydrateModelPricing(data) {
        var pricing = data.pricing || {};
        document.querySelectorAll('tr[data-model-id]').forEach(function (row) {
            var id = row.getAttribute('data-model-id');
            var p = pricing[id];
            var cells = row.querySelectorAll('td');
            var costCell = cells[2]; /* 3rd td — replaces the "—" Size cell */
            if (costCell) costCell.innerHTML = formatCost(p);
        });
        /* Expose pricing globally so other screens can import it */
        window.kaidenModelPricing = pricing;
    }

    /* ── Bootstrap ─────────────────────────────────────────────────── */

    var DEFAULTS = {
        projects:   { countLabel: '0 projects', projects: [] },
        services:   { subtitle: '', catalogLead: '', integrationCatalog: [], genericSecrets: [] },
        knowledges: { rows: [] },
        mcp:        { ready: [], install: [] },
        sessions: {
            stats: { activeSessions: 3, totalSessions: 5, configuredAgents: 3 },
            sessions: [
                { id: 'my-new-app',        title: 'My New App',               agentType: 'claude-code', agentLabel: 'Claude Code', iconClass: 'claude',   iconLetter: 'MN', status: 'running', runtime: 'podman', time: '25m', model: 'claude-4.6-sonnet-medium', inputTokens:   52000, outputTokens:  13000, costUSD:  0.35 },
                { id: 'frontend-refactor', title: 'Frontend Refactor',         agentType: 'claude-code', agentLabel: 'Claude Code', iconClass: 'claude',   iconLetter: 'C',  status: 'running', runtime: 'podman', time: '2h',  model: 'claude-4.6-sonnet-medium', inputTokens:  485000, outputTokens: 118000, costUSD:  3.23 },
                { id: 'api-integration',   title: 'API Integration',           agentType: 'codex',       agentLabel: 'Codex',       iconClass: 'codex',    iconLetter: 'AI', status: 'running', runtime: 'podman', time: '45m', model: 'gpt-5.3-codex',            inputTokens:  128000, outputTokens:  31000, costUSD:  1.00 },
                { id: 'test-suite',        title: 'Test Suite Setup',          agentType: 'opencode',    agentLabel: 'OpenCode',    iconClass: 'opencode', iconLetter: 'TS', status: 'stopped', runtime: 'podman', time: '1d',  model: 'qwen3-code',               inputTokens:  312000, outputTokens:  74000, costUSD:  0    },
                { id: 'docs-generator',    title: 'Documentation Generator',   agentType: 'claude-code', agentLabel: 'Claude Code', iconClass: 'claude',   iconLetter: 'C',  status: 'stopped', runtime: 'podman', time: '3d',  model: 'claude-4.6-sonnet-medium', inputTokens: 2100000, outputTokens: 510000, costUSD: 13.95 }
            ]
        },
        tasks:      { projects: [], sections: [] },
        dashboard:  { user: {}, stats: [], activeWorkspaces: [], recentActivity: [], resources: [], cost: {} },
        models: { pricing: {
            'composer-2-fast':            { provider: 'Composer',    tier: 'cloud',    contextK: 32,  inputPer1M: 0.50,  outputPer1M: 1.50  },
            'composer-2':                 { provider: 'Composer',    tier: 'cloud',    contextK: 64,  inputPer1M: 2.00,  outputPer1M: 6.00  },
            'composer-1.5':               { provider: 'Composer',    tier: 'cloud',    contextK: 32,  inputPer1M: 1.00,  outputPer1M: 3.00  },
            'gpt-5.3-codex':              { provider: 'OpenAI',      tier: 'cloud',    contextK: 200, inputPer1M: 3.00,  outputPer1M: 20.00 },
            'gpt-5.4-medium':             { provider: 'OpenAI',      tier: 'cloud',    contextK: 272, inputPer1M: 2.50,  outputPer1M: 15.00 },
            'gpt-5.3-codex-low':          { provider: 'OpenAI',      tier: 'cloud',    contextK: 128, inputPer1M: 0.75,  outputPer1M: 4.00  },
            'claude-4.6-sonnet-medium':   { provider: 'Anthropic',   tier: 'cloud',    contextK: 200, inputPer1M: 3.00,  outputPer1M: 15.00 },
            'claude-4.6-opus-high':       { provider: 'Anthropic',   tier: 'cloud',    contextK: 200, inputPer1M: 5.00,  outputPer1M: 25.00 },
            'claude-sonnet-4-5@20250929': { provider: 'Anthropic',   tier: 'cloud',    contextK: 200, inputPer1M: 3.00,  outputPer1M: 15.00 },
            'claude-opus-4-1@20250805':   { provider: 'Anthropic',   tier: 'cloud',    contextK: 200, inputPer1M: 15.00, outputPer1M: 75.00 },
            'claude-sonnet-4@20250514':   { provider: 'Anthropic',   tier: 'cloud',    contextK: 200, inputPer1M: 3.00,  outputPer1M: 15.00 },
            'ibm-granite-3.3-8b-instruct':{ provider: 'IBM / RHOAI', tier: 'internal', contextK: 128, inputPer1M: 0.50,  outputPer1M: 0.50  },
            'mistral-small-internal':     { provider: 'OpenShift AI',tier: 'internal', contextK: 32,  inputPer1M: 0.80,  outputPer1M: 0.80  },
            'llama-3.1-70b-instruct':     { provider: 'OpenShift AI',tier: 'internal', contextK: 128, inputPer1M: 1.20,  outputPer1M: 1.20  },
            'qwen3-code':                 { provider: 'Ollama',      tier: 'local',    contextK: 32,  inputPer1M: 0,     outputPer1M: 0     },
            'llama3.2:3b':                { provider: 'Ollama',      tier: 'local',    contextK: 8,   inputPer1M: 0,     outputPer1M: 0     },
            'mistral:latest':             { provider: 'Ollama',      tier: 'local',    contextK: 32,  inputPer1M: 0,     outputPer1M: 0     },
            'qwen2.5:7b':                 { provider: 'Ramalama',    tier: 'local',    contextK: 32,  inputPer1M: 0,     outputPer1M: 0     }
        }}
    };

    document.addEventListener('DOMContentLoaded', function () {
        var root = dataRoot();
        var body = document.body;

        if (body.classList.contains('projects-page')) {
            fetchJSON(root + '/projects.json', DEFAULTS.projects).then(hydrateProjects);
        }
        if (body.classList.contains('knowledges-page')) {
            fetchJSON(root + '/knowledges.json', DEFAULTS.knowledges).then(hydrateKnowledges);
        }
        if (body.classList.contains('services-page')) {
            fetchJSON(root + '/services.json', DEFAULTS.services).then(hydrateServices);
        }
        if (body.classList.contains('mcp-page')) {
            fetchJSON(root + '/mcp.json', DEFAULTS.mcp).then(hydrateMcp);
        }
        if (body.classList.contains('sessions-page')) {
            fetchJSON(root + '/sessions.json', DEFAULTS.sessions).then(hydrateSessions);
        }
        if (body.classList.contains('tasks-page')) {
            fetchJSON(root + '/tasks.json', DEFAULTS.tasks).then(hydrateTasks);
        }
        if (body.classList.contains('dashboard-page')) {
            fetchJSON(root + '/dashboard.json', DEFAULTS.dashboard).then(hydrateDashboard);
        }
        if (body.classList.contains('models-page')) {
            fetchJSON(root + '/models.json', DEFAULTS.models).then(hydrateModelPricing);
        }
    });
})();
