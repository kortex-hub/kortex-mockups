/**
 * Fills list UIs from demo JSON (projects, Secret Vault, Knowledges).
 * Load after demo-screen-data.js; run from sidebar-loader after data promise resolves.
 */
(function () {
    function escapeHtml(s) {
        if (s == null) return '';
        var d = document.createElement('div');
        d.textContent = String(s);
        return d.innerHTML;
    }

    /** Always use live demo state; __kaidenDemoScreenData.viewKey is fixed at fetch start and can mismatch. */
    function currentDemoViewKey() {
        if (typeof window.getKaidenDemoViewKey === 'function') {
            return window.getKaidenDemoViewKey();
        }
        return 'full';
    }

    var GIT_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>';
    var CLOCK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

    var ASSET_SVG = {
        skills: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        mcp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
        knowledge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>'
    };

    function renderProjectCard(p) {
        var statusTitle = p.statusDot === 'active' ? (p.agentsBadge || 'Active') : 'No agents running';
        var assets = (p.assets || []).map(function (a) {
            var svg = ASSET_SVG[a.type] || '';
            return '<span class="project-asset-tag ' + escapeHtml(a.type) + '">' + svg + escapeHtml(a.label) + '</span>';
        }).join('');
        var badgeClass = 'project-card-agents-badge ' + (p.agentsBadgeVariant === 'running' ? 'running' : 'idle');
        return (
            '<div class="project-card" data-project-slug="' + escapeHtml(p.slug) + '" onclick="openProject(this.getAttribute(\'data-project-slug\'))">' +
            '<div class="project-card-header">' +
            '<div class="project-card-icon" style="background: ' + escapeHtml(p.icon.gradient) + ';">' + escapeHtml(p.icon.text) + '</div>' +
            '<div class="project-card-title-area">' +
            '<div class="project-card-name">' + escapeHtml(p.name) + '</div>' +
            '<div class="project-card-path">' + escapeHtml(p.path) + '</div>' +
            '</div>' +
            '<div class="project-card-status-dot ' + escapeHtml(p.statusDot) + '" title="' + escapeHtml(statusTitle) + '"></div>' +
            '</div>' +
            '<div class="project-card-git">' + GIT_SVG +
            '<span class="project-card-git-remote">' + escapeHtml(p.gitRemote) + '</span>' +
            '<span class="project-card-branch">' + escapeHtml(p.branch) + '</span>' +
            '</div>' +
            '<div class="project-card-assets">' + assets + '</div>' +
            '<div class="project-card-footer">' +
            '<div class="project-card-meta"><div class="project-card-meta-item">' + CLOCK_SVG + escapeHtml(p.footerMeta) + '</div></div>' +
            '<span class="' + badgeClass + '">' + escapeHtml(p.agentsBadge) + '</span>' +
            '</div></div>'
        );
    }

    var VAULT_ICONS = {
        'github-pat': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
        'github-project': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
        jira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        slack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>',
        openshift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        'ansible-aap': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
    };

    function vaultCardIcon(item, sectionType) {
        return VAULT_ICONS[item.id] || (sectionType === 'infra'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
            : VAULT_ICONS['github-pat']);
    }

    function renderVaultItem(item, sectionType) {
        var icon = vaultCardIcon(item, sectionType);
        var metaStyle = item.metaTone === 'danger' ? ' style="color: #f87171;"' : '';
        var metaSvg = item.metaTone === 'danger'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
        var statusClass = item.status === 'expired' ? 'expired' : 'active';
        var statusLabel = item.status === 'expired' ? 'Expired' : 'Active';
        var desc = escapeHtml(item.desc);
        return (
            '<a href="details.html?id=' + escapeHtml(item.id) + '" class="service-card" data-type="' + escapeHtml(sectionType) + '">' +
            '<div class="service-card-icon ' + escapeHtml(sectionType) + '">' + icon + '</div>' +
            '<div class="service-card-info">' +
            '<div class="service-card-title-row">' +
            '<div class="service-card-title">' + escapeHtml(item.title) + '</div>' +
            '<span class="service-type-badge ' + escapeHtml(sectionType) + '">' + escapeHtml(item.badge) + '</span>' +
            '</div>' +
            '<div class="service-card-desc">' + desc + '</div>' +
            '</div>' +
            '<div class="service-card-footer">' +
            '<div class="service-card-meta"><div class="service-card-meta-item"' + metaStyle + '>' + metaSvg + escapeHtml(item.meta) + '</div></div>' +
            '<span class="service-card-status ' + statusClass + '">' + statusLabel + '</span>' +
            '</div></a>'
        );
    }

    function renderKnowledgeRow(row) {
        var dbClass = row.databaseIcon === 'chroma' ? 'chroma-icon' : 'milvus-icon';
        var stopBtn = row.primaryAction === 'stop'
            ? '<button class="action-button" title="Stop"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg></button>'
            : '<button class="action-button" title="Start"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="8 5 8 19 19 12 8 5"/></svg></button>';
        var statusSvg = '<svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>';
        return (
            '<tr data-kb-env="' + escapeHtml(row.env) + '" onclick="window.location.href=\'details.html?env=\'+encodeURIComponent(this.getAttribute(\'data-kb-env\'))">' +
            '<td class="checkbox-cell"><input type="checkbox" class="checkbox" onclick="event.stopPropagation()"></td>' +
            '<td class="status-cell">' + statusSvg + '</td>' +
            '<td><span class="env-name">' + escapeHtml(row.name) + '</span></td>' +
            '<td><span class="database-badge"><div class="tech-icon ' + dbClass + '"></div>' + escapeHtml(row.database) + '</span></td>' +
            '<td><span class="chunker-badge"><div class="tech-icon" style="background: ' + escapeHtml(row.chunkerStyle) + '; border-radius: 20%;"></div>' + escapeHtml(row.chunker) + '</span></td>' +
            '<td class="sources-cell"><span class="sources-count">' + escapeHtml(row.sources) + '</span></td>' +
            '<td class="actions-cell"><div class="actions-row" onclick="event.stopPropagation()">' + stopBtn +
            '<button class="action-button delete" title="Delete"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2 0,0,1-2,2H7a2,2 0,0,1-2-2V6m3,0V4a2,2 0,0,1,2-2h4a2,2 0,0,1,2,2v2"/></svg></button></div></td></tr>'
        );
    }

    function hydrateProjects(d) {
        var grid = document.getElementById('projectsGrid');
        if (!grid || !d.projects) return;
        var block = d.projects[currentDemoViewKey()];
        if (!block) return;
        var label = document.getElementById('projectsCountLabel');
        if (label) label.textContent = block.countLabel || '';
        grid.innerHTML = (block.projects || []).map(renderProjectCard).join('');
    }

    function hydrateServices(d) {
        var sub = document.getElementById('vaultSubtitle');
        var emptyEl = document.getElementById('vaultEmptyState');
        var listEl = document.getElementById('vaultMockList');
        if (!d.services || !listEl) return;
        var cfg = d.services[currentDemoViewKey()];
        if (!cfg) return;
        if (sub) sub.textContent = cfg.subtitle || '';

        if (cfg.mode === 'empty') {
            document.body.setAttribute('data-demo-vault-mode', 'empty');
            if (emptyEl) {
                emptyEl.style.display = 'flex';
            }
            listEl.innerHTML = '';
            listEl.style.display = 'none';
            return;
        }

        document.body.setAttribute('data-demo-vault-mode', 'list');
        if (emptyEl) emptyEl.style.display = 'none';
        listEl.style.display = 'contents';

        var parts = [];
        (cfg.sections || []).forEach(function (sec) {
            parts.push('<div class="services-section-header" data-type="' + escapeHtml(sec.type) + '"><span>' + escapeHtml(sec.header) + '</span></div>');
            (sec.items || []).forEach(function (item) {
                parts.push(renderVaultItem(item, sec.type));
            });
        });
        listEl.innerHTML = parts.join('');
    }

    function hydrateKnowledges(d) {
        var tbody = document.querySelector('.knowledges-page table.rag-table tbody');
        var emptyEl = document.getElementById('kbEmptyState');
        var panel = document.getElementById('kbTablePanel');
        if (!d.knowledges || !tbody) return;
        var block = d.knowledges[currentDemoViewKey()];
        if (!block) return;
        var rows = block.rows || [];
        if (rows.length === 0) {
            document.body.setAttribute('data-demo-kb-mode', 'empty');
            tbody.innerHTML = '';
            if (emptyEl) emptyEl.style.display = 'flex';
            if (panel) panel.style.display = 'none';
            return;
        }
        document.body.setAttribute('data-demo-kb-mode', 'list');
        if (emptyEl) emptyEl.style.display = 'none';
        if (panel) panel.style.display = '';
        tbody.innerHTML = rows.map(renderKnowledgeRow).join('');
    }

    var DEFAULT_POST_ONBOARDING_SESSIONS = {
        activeCount: 0,
        totalCount: 0,
        agentsCount: 0,
        emptyTitle: 'No agents yet',
        emptyBody: 'You have not created any agent workspaces. After setup, start one with New Agent or from the CLI when you are ready.'
    };

    function sessionRowSvgStop() {
        return '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
    }

    function sessionRowSvgOpen() {
        return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
    }

    function hydrateSessions(d) {
        if (!document.body.classList.contains('sessions-page')) return;
        var vk = currentDemoViewKey();
        if (vk !== 'postOnboarding' && vk !== 'codingAgent') return;
        d = d || {};

        var list = document.querySelector('.sessions-page .sessions-list');
        if (!list) return;

        var statsRoot = document.querySelector('.sessions-page .sessions-stats');

        if (vk === 'postOnboarding') {
            var cfg = (d.sessions && d.sessions.postOnboarding) ? d.sessions.postOnboarding : DEFAULT_POST_ONBOARDING_SESSIONS;
            if (statsRoot) {
                var valsPo = statsRoot.querySelectorAll('.stat-value');
                if (valsPo[0]) valsPo[0].textContent = String(cfg.activeCount != null ? cfg.activeCount : 0);
                if (valsPo[1]) valsPo[1].textContent = String(cfg.totalCount != null ? cfg.totalCount : 0);
                if (valsPo[2]) valsPo[2].textContent = String(cfg.agentsCount != null ? cfg.agentsCount : 0);
            }
            var title = escapeHtml(cfg.emptyTitle || 'No agents yet');
            var body = escapeHtml(cfg.emptyBody || '');
            list.innerHTML =
                '<div class="sessions-empty-state" role="status" aria-live="polite">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
                '<path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2z"/>' +
                '<circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" stroke="none"/>' +
                '<circle cx="16.5" cy="14.5" r="1.5" fill="currentColor" stroke="none"/>' +
                '</svg>' +
                '<h2 class="sessions-empty-state__title">' + title + '</h2>' +
                '<p class="sessions-empty-state__text">' + body + '</p>' +
                '</div>';
            return;
        }

        var ccfg = d.sessions && d.sessions.codingAgent;
        var row = ccfg && ccfg.rows && ccfg.rows[0];
        if (!row) return;

        if (statsRoot) {
            var valsCa = statsRoot.querySelectorAll('.stat-value');
            if (valsCa[0]) valsCa[0].textContent = String(ccfg.activeCount != null ? ccfg.activeCount : 1);
            if (valsCa[1]) valsCa[1].textContent = String(ccfg.totalCount != null ? ccfg.totalCount : 1);
            if (valsCa[2]) valsCa[2].textContent = String(ccfg.agentsCount != null ? ccfg.agentsCount : 1);
        }

        var sid = String(row.sessionId || 'quadlet-openshift-demo');
        var sidEsc = escapeHtml(sid);
        var pctStr = String(row.contextPct || '50%');
        var pctNum = parseInt(pctStr, 10);
        if (isNaN(pctNum)) pctNum = 52;
        var tags = (row.tags || []).map(function (t) {
            var c = t.class || 'skill';
            return '<span class="session-row-tag ' + escapeHtml(c) + '">' + escapeHtml(t.label) + '</span>';
        }).join('');
        var detailsHref = 'details.html?session=' + encodeURIComponent(sid);

        list.innerHTML =
            '<div class="sessions-section-header">' + escapeHtml(ccfg.sectionLabel || 'Active') + '</div>' +
            '<div class="session-row" onclick="window.location.href=\'' + detailsHref + '\'">' +
            '<div class="session-row-icon claude">C</div>' +
            '<div class="session-row-body">' +
            '<div class="session-row-title">' + escapeHtml(row.title) + '</div>' +
            '<div class="session-row-subtitle">' + escapeHtml(row.subtitle) + '</div>' +
            '</div>' +
            '<div class="session-row-tags">' + tags + '</div>' +
            '<div class="session-row-context">' +
            '<div class="session-row-context-tooltip"><div class="tooltip-label">Context Window</div><div class="tooltip-value">' + escapeHtml(row.contextTooltip || '') + '</div></div>' +
            '<div class="session-row-context-bar"><div class="session-row-context-fill medium" style="width: ' + pctNum + '%"></div></div>' +
            '<span class="session-row-context-pct">' + escapeHtml(pctStr) + '</span>' +
            '</div>' +
            '<div class="session-row-status">' +
            '<span class="session-row-status-dot running"></span>' +
            '<span class="session-row-status-label running">Running</span>' +
            '</div>' +
            '<span class="session-row-time">' + escapeHtml(row.timeLabel || '') + '</span>' +
            '<div class="session-row-actions" onclick="event.stopPropagation()">' +
            '<button class="session-row-action stop" onclick="stopSession(\'' + sidEsc + '\')" title="Stop">' + sessionRowSvgStop() + '</button>' +
            '<button class="session-row-action open" onclick="window.location.href=\'' + detailsHref + '\'" title="Open">' + sessionRowSvgOpen() + '</button>' +
            '</div></div>';
    }

    function run() {
        var d = window.__kaidenDemoScreenData;
        if (d) {
            if (d.projects) hydrateProjects(d);
            if (d.services) hydrateServices(d);
            if (d.knowledges) hydrateKnowledges(d);
        }
        /* Agents list: post-onboarding empty state or coding-agent single row — even if JSON failed. */
        hydrateSessions(d || {});
    }

    window.kaidenHydrateDemoPages = run;
})();
