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
        gitlab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.65 14.39 12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51a.42.42 0 0 1 .8-.01l2.44 7.49h8.1l2.44-7.51a.42.42 0 0 1 .8 0l2.44 7.51 1.22 3.78a.84.84 0 0 1-.29.94z"/></svg>',
        jira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
        slack: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>',
        openshift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        'ansible-aap': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
    };

    var GENERIC_SECRET_CARD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M12 11V7a4 4 0 0 0-4-4H8"/><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none"/></svg>';

    var VAULT_EYE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    var VAULT_MORE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/></svg>';

    function vaultCardIcon(item, sectionType) {
        if (sectionType === 'generic' || (item.id && String(item.id).indexOf('generic-') === 0)) {
            return GENERIC_SECRET_CARD_ICON;
        }
        return VAULT_ICONS[item.id] || (sectionType === 'infra'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'
            : VAULT_ICONS['github-pat']);
    }

    function readVaultInlineSessionMock() {
        try {
            var raw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('kaidenVaultInlineMock') : null;
            if (!raw) return {};
            var o = JSON.parse(raw);
            return o && typeof o === 'object' ? o : {};
        } catch (e) {
            return {};
        }
    }

    function mergeIntegrationCatalog(cfg, ORDER) {
        var map = {};
        (cfg.integrationCatalog || []).forEach(function (e) {
            if (e && e.providerId) map[e.providerId] = e;
        });
        var mock = readVaultInlineSessionMock();
        Object.keys(mock).forEach(function (pid) {
            var m = mock[pid];
            if (!m || !m.configured) return;
            map[pid] = Object.assign({ providerId: pid }, map[pid] || {}, m, { configured: true });
        });
        var rows = [];
        (ORDER || []).forEach(function (pid) {
            if (pid === 'custom') return;
            rows.push(map[pid] ? Object.assign({ providerId: pid }, map[pid]) : { providerId: pid, configured: false });
        });
        return rows;
    }

    function vaultExtractConnectionFromForm(form, providerMeta) {
        if (!form || !providerMeta || !providerMeta.fields) return '—';
        for (var i = 0; i < providerMeta.fields.length; i++) {
            var f = providerMeta.fields[i];
            if (f.type === 'password') continue;
            var el = form.elements.namedItem(f.name);
            if (el && el.value && String(el.value).trim()) return String(el.value).trim();
        }
        return '—';
    }

    function vaultMaskedFromPasswordFields(form, providerMeta) {
        if (!form || !providerMeta || !providerMeta.fields) return '••••••••••••';
        for (var i = 0; i < providerMeta.fields.length; i++) {
            var f = providerMeta.fields[i];
            if (f.type !== 'password') continue;
            var el = form.elements.namedItem(f.name);
            if (!el || !el.value) return '••••••••••••';
            var v = String(el.value);
            if (v.length <= 4) return '••••••••';
            return v.slice(0, 4) + '••••••••••••';
        }
        return '••••••••••••';
    }

    function vaultRevealFromPasswordFields(form, providerMeta) {
        if (!form || !providerMeta || !providerMeta.fields) return '••••••••••••';
        for (var i = 0; i < providerMeta.fields.length; i++) {
            var f = providerMeta.fields[i];
            if (f.type !== 'password') continue;
            var el = form.elements.namedItem(f.name);
            if (!el || !el.value) return '••••••••••••';
            var v = String(el.value);
            if (v.length <= 6) return v + '••••••';
            return v.slice(0, 6) + '••••••••••••';
        }
        return '••••••••••••';
    }

    function renderVaultInlineForm(pid, REG) {
        var p = REG[pid];
        if (!p) return '';
        var parts = [];
        parts.push('<p class="vault-inline-form-title">Connect ' + escapeHtml(p.label) + '</p>');
        parts.push('<form class="vault-inline-form" data-provider="' + escapeHtml(pid) + '">');
        parts.push('<div class="vault-inline-form-grid">');
        p.fields.forEach(function (f) {
            var fid = f.id + '_' + pid.replace(/[^a-z0-9-]/gi, '_');
            var req = f.required ? ' required' : '';
            var hintHtml = f.hint
                ? '<p class="vault-inline-field-hint">' + escapeHtml(f.hint) + '</p>'
                : '';
            var label = '<label for="' + escapeHtml(fid) + '">' + escapeHtml(f.label) + '</label>';
            var inputHtml;
            if (f.type === 'password' && f.secretToggle) {
                inputHtml =
                    '<div class="vault-inline-secret-wrap">' +
                    '<input type="password" class="vault-inline-input" id="' + escapeHtml(fid) + '" name="' + escapeHtml(f.name) + '" placeholder="' + escapeHtml(f.placeholder || '') + '" autocomplete="off"' + req + '>' +
                    '<button type="button" class="vault-inline-toggle-secret">Show</button></div>';
            } else {
                inputHtml =
                    '<input type="' + escapeHtml(f.type) + '" class="vault-inline-input" id="' + escapeHtml(fid) + '" name="' + escapeHtml(f.name) + '" placeholder="' + escapeHtml(f.placeholder || '') + '"' + req + '>';
            }
            parts.push('<div class="vault-inline-field">' + label + inputHtml + hintHtml + '</div>');
        });
        parts.push('</div>');
        parts.push(
            '<div class="vault-inline-form-actions">' +
            '<button type="button" class="vault-inline-btn-cancel vault-inline-cancel">Cancel</button>' +
            '<button type="submit" class="vault-inline-btn-save">Save &amp; connect</button></div>'
        );
        parts.push('</form>');
        return parts.join('');
    }

    function renderVaultCatalogRow(entry, REG) {
        var pid = entry.providerId;
        var p = REG[pid];
        if (!p) return '';
        var tone = p.defaultCategory === 'infra' ? 'infra' : 'api';
        var iconHtml = p.icon || vaultCardIcon({ id: pid }, tone);
        var conn = escapeHtml(entry.connection != null && entry.connection !== '' ? entry.connection : '—');
        var configured = !!entry.configured;
        var detailId = entry.detailId != null && String(entry.detailId) !== '' ? String(entry.detailId) : '';
        var detailHref = '';
        if (configured) {
            detailHref = detailId
                ? 'details.html?id=' + encodeURIComponent(detailId)
                : 'index.html';
        }
        var mask = entry.masked != null ? String(entry.masked) : '••••••••••••';
        var full = entry.revealValue != null ? String(entry.revealValue) : mask;
        var expired = entry.status === 'expired';
        var trClass = 'vault-catalog-row' + (expired ? ' vault-row-expired' : '') + (!configured ? ' vault-catalog-row--inactive' : '');

        var sub = p.description || '';
        if (sub.length > 88) sub = sub.slice(0, 86) + '…';
        var nameInner;
        if (configured && detailHref) {
            nameInner =
                '<a href="' + escapeHtml(detailHref) + '" class="vault-int-name" style="color: inherit; text-decoration: none;">' + escapeHtml(p.label) + '</a><div class="vault-int-sub">' + escapeHtml(sub) + '</div>';
        } else {
            nameInner = '<span class="vault-int-name">' + escapeHtml(p.label) + '</span><div class="vault-int-sub">' + escapeHtml(sub) + '</div>';
        }

        var secretCell;
        var actionsCell;
        if (configured) {
            secretCell = '<span class="vault-secret-dots" data-mask="' + escapeHtml(mask) + '" data-full="' + escapeHtml(full) + '">' + escapeHtml(mask) + '</span>';
            actionsCell =
                '<div class="vault-row-actions">' +
                '<button type="button" class="vault-icon-btn vault-secret-reveal" aria-pressed="false" aria-label="Show secret">' + VAULT_EYE_SVG + '</button>' +
                '<a href="' + escapeHtml(detailHref) + '" class="vault-icon-btn" aria-label="Open details" title="Open details">' + VAULT_MORE_SVG + '</a>' +
                '</div>';
        } else {
            secretCell = '<span>—</span>';
            actionsCell =
                '<button type="button" class="vault-configure-btn vault-config-toggle" aria-expanded="false" aria-controls="vault-inline-panel-' +
                escapeHtml(pid) +
                '">Configure</button>';
        }

        var mainRow =
            '<tr class="' + trClass + '" data-provider="' + escapeHtml(pid) + '" data-type="' + escapeHtml(tone) + '">' +
            '<td><div class="vault-int-cell"><span class="vault-int-icon ' + tone + '">' + iconHtml + '</span><div class="vault-int-text">' + nameInner + '</div></div></td>' +
            '<td class="vault-connection-cell">' + conn + '</td>' +
            '<td class="vault-secret-cell">' + secretCell + '</td>' +
            '<td>' + actionsCell + '</td></tr>';

        if (configured) return mainRow;

        var panel =
            '<tr class="vault-catalog-config-row" id="vault-inline-panel-' +
            escapeHtml(pid) +
            '" data-provider="' +
            escapeHtml(pid) +
            '" hidden>' +
            '<td colspan="4" class="vault-catalog-config-cell">' +
            renderVaultInlineForm(pid, REG) +
            '</td></tr>';
        return mainRow + panel;
    }

    function kaidenSaveVaultInlineForm(form) {
        var pid = form.getAttribute('data-provider');
        var REG = typeof window !== 'undefined' ? window.VAULT_PROVIDER_REGISTRY : null;
        if (!pid || !REG || !REG[pid]) return;
        var meta = REG[pid];
        if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
            form.reportValidity();
            return;
        }
        var conn = vaultExtractConnectionFromForm(form, meta);
        var masked = vaultMaskedFromPasswordFields(form, meta);
        var reveal = vaultRevealFromPasswordFields(form, meta);
        var mock = readVaultInlineSessionMock();
        mock[pid] = {
            configured: true,
            connection: conn,
            masked: masked,
            revealValue: reveal
        };
        try {
            sessionStorage.setItem('kaidenVaultInlineMock', JSON.stringify(mock));
        } catch (e) {}
        window.location.reload();
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

    /**
     * Generic-secret rows for the main table when services.json cannot load (e.g. file://).
     * Kept in sync with assets/data/demo-scenario/services.json → full.tableGenericSecrets.
     */
    var VAULT_DEMO_GENERIC_TABLE_ROWS = [
        {
            configured: true,
            detailId: 'generic-payments-api',
            title: 'Payments API',
            subtitle: 'Bearer {value} · Authorization on matching requests',
            connection: 'api.payments.partner.com · /v2/*',
            masked: 'sk_live••••••••••••',
            revealValue: 'sk_live••••••••4qXp',
            status: 'active'
        },
        {
            configured: true,
            detailId: 'generic-corp-internal',
            title: 'Internal tools',
            subtitle: 'Wildcard host · internal dashboards & APIs',
            connection: '*.tools.internal.corp.example',
            masked: 'tok_••••••••••••••••',
            revealValue: 'tok_••••••••k9Lm',
            status: 'active'
        },
        {
            configured: false,
            title: 'Partner staging API',
            subtitle: 'Not configured — inject header on api.partner.io',
            connection: '—'
        }
    ];

    /** When JSON is missing or fetch failed (e.g. file://), still show every predefined provider with Configure. */
    var DEFAULT_VAULT_SERVICES_CFG = {
        subtitle: '',
        integrationCatalog: [],
        tableGenericSecrets: [],
        catalogLead: null
    };

    function renderVaultGenericSectionHeaderRow(label) {
        var text = label != null && label !== '' ? label : 'Generic secrets';
        return (
            '<tr class="vault-catalog-section-row" data-generic-section="1">' +
            '<td colspan="4" class="vault-catalog-section-cell">' + escapeHtml(text) + '</td></tr>'
        );
    }

    /** Sample / configured generic header secrets in the main catalog table (not provider registry). */
    function renderVaultGenericCatalogRow(g) {
        var configured = !!g.configured;
        var title = escapeHtml(g.title || 'Generic secret');
        var sub = escapeHtml(g.subtitle || 'Header injection');
        var conn = escapeHtml(g.connection != null && g.connection !== '' ? g.connection : '—');
        var detailId = g.detailId != null && String(g.detailId) !== '' ? String(g.detailId) : '';
        var detailHref = '';
        if (configured) {
            detailHref = detailId ? 'details.html?id=' + encodeURIComponent(detailId) : 'index.html';
        }
        var mask = g.masked != null ? String(g.masked) : '••••••••••••';
        var full = g.revealValue != null ? String(g.revealValue) : mask;
        var expired = g.status === 'expired';
        var trClass =
            'vault-catalog-row vault-catalog-row--generic' +
            (expired ? ' vault-row-expired' : '') +
            (!configured ? ' vault-catalog-row--inactive' : '');

        var nameInner;
        if (configured && detailHref) {
            nameInner =
                '<a href="' +
                escapeHtml(detailHref) +
                '" class="vault-int-name" style="color: inherit; text-decoration: none;">' +
                title +
                '</a><div class="vault-int-sub">' +
                sub +
                '</div>';
        } else {
            nameInner = '<span class="vault-int-name">' + title + '</span><div class="vault-int-sub">' + sub + '</div>';
        }

        var secretCell;
        var actionsCell;
        if (configured) {
            secretCell =
                '<span class="vault-secret-dots" data-mask="' +
                escapeHtml(mask) +
                '" data-full="' +
                escapeHtml(full) +
                '">' +
                escapeHtml(mask) +
                '</span>';
            actionsCell =
                '<div class="vault-row-actions">' +
                '<button type="button" class="vault-icon-btn vault-secret-reveal" aria-pressed="false" aria-label="Show secret">' +
                VAULT_EYE_SVG +
                '</button>' +
                '<a href="' +
                escapeHtml(detailHref) +
                '" class="vault-icon-btn" aria-label="Open details" title="Open details">' +
                VAULT_MORE_SVG +
                '</a>' +
                '</div>';
        } else {
            secretCell = '<span>—</span>';
            actionsCell = '<a href="create.html" class="vault-configure-btn">Add secret</a>';
        }

        return (
            '<tr class="' +
            trClass +
            '" data-type="generic">' +
            '<td><div class="vault-int-cell"><span class="vault-int-icon generic">' +
            GENERIC_SECRET_CARD_ICON +
            '</span><div class="vault-int-text">' +
            nameInner +
            '</div></div></td>' +
            '<td class="vault-connection-cell">' +
            conn +
            '</td>' +
            '<td class="vault-secret-cell">' +
            secretCell +
            '</td>' +
            '<td>' +
            actionsCell +
            '</td></tr>'
        );
    }

    function hydrateServices(d) {
        var sub = document.getElementById('vaultSubtitle');
        var emptyEl = document.getElementById('vaultEmptyState');
        var listEl = document.getElementById('vaultMockList');
        var tbody = document.getElementById('vaultCatalogBody');
        var catLead = document.getElementById('vaultCatalogLead');

        if (!tbody) return;

        d = d || {};
        var vk = currentDemoViewKey();
        var svcRoot = d.services && typeof d.services === 'object' ? d.services : null;
        var fetchedSlice = svcRoot ? svcRoot[vk] : null;
        var emb = typeof window.__kaidenVaultPageFallback === 'object' && window.__kaidenVaultPageFallback
            ? window.__kaidenVaultPageFallback
            : null;
        var embeddedSlice = emb ? emb[vk] : null;
        /* Prefer live fetch; use embedded mirror when fetch failed (file://) or slice missing */
        var rawCfg = fetchedSlice != null ? fetchedSlice : embeddedSlice;
        var cfg = rawCfg
            ? Object.assign({}, DEFAULT_VAULT_SERVICES_CFG, rawCfg)
            : Object.assign({}, DEFAULT_VAULT_SERVICES_CFG);
        if (!rawCfg && vk === 'full' && (!cfg.tableGenericSecrets || !cfg.tableGenericSecrets.length)) {
            cfg.tableGenericSecrets = VAULT_DEMO_GENERIC_TABLE_ROWS.slice();
        }

        if (sub) sub.textContent = cfg.subtitle || '';

        var REG = typeof window !== 'undefined' ? window.VAULT_PROVIDER_REGISTRY : null;
        var ORDER = (typeof window !== 'undefined' && window.VAULT_PROVIDERS_ORDER) || (REG ? Object.keys(REG) : []);

        if (emptyEl) emptyEl.style.display = 'none';
        if (listEl) {
            listEl.innerHTML = '';
            listEl.style.display = 'none';
        }

        if (catLead && cfg.catalogLead != null && cfg.catalogLead !== '') catLead.textContent = cfg.catalogLead;

        if (!REG) {
            tbody.innerHTML = '';
            return;
        }

        var rows = mergeIntegrationCatalog(cfg, ORDER);
        var catalogParts = rows.map(function (e) {
            return renderVaultCatalogRow(e, REG);
        });
        var genericTable = cfg.tableGenericSecrets || [];
        if (genericTable.length) {
            var gLabel = cfg.tableGenericSecretsHeading != null ? cfg.tableGenericSecretsHeading : 'Generic secrets';
            catalogParts.push(renderVaultGenericSectionHeaderRow(gLabel));
            genericTable.forEach(function (g) {
                catalogParts.push(renderVaultGenericCatalogRow(g));
            });
        }
        tbody.innerHTML = catalogParts.join('');
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
        var fillCls = pctNum < 40 ? 'low' : (pctNum < 80 ? 'medium' : 'high');
        var statusLabel = String(row.statusLabel || 'Running');
        var statusSlug = statusLabel.toLowerCase().indexOf('stop') >= 0 ? 'stopped' : 'running';
        var tags = (row.tags || []).map(function (t) {
            var c = t.class || 'skill';
            return '<span class="session-row-tag ' + escapeHtml(c) + '">' + escapeHtml(t.label) + '</span>';
        }).join('');
        var detailsHref = 'details.html?session=' + encodeURIComponent(sid);

        var sessColHead =
            '<div class="sessions-column-header">' +
            '<span class="sessions-col-h-spacer" aria-hidden="true"></span>' +
            '<span class="sessions-col-h-label">Workspace</span>' +
            '<span class="sessions-col-h-label">Context</span>' +
            '<span class="sessions-col-h-label sessions-col-h-label--time">Time</span>' +
            '<span aria-hidden="true"></span></div>';

        list.innerHTML =
            sessColHead +
            '<div class="sessions-section-header">' + escapeHtml(ccfg.sectionLabel || 'Active') + '</div>' +
            '<div class="session-row" onclick="window.location.href=\'' + detailsHref + '\'">' +
            '<div class="session-row-icon claude">C</div>' +
            '<div class="session-row-body">' +
            '<div class="session-row-title">' + escapeHtml(row.title) + '</div>' +
            '<div class="session-row-subtitle">' + escapeHtml(row.subtitle) + '</div>' +
            '<div class="session-row-tags">' + tags + '</div>' +
            '</div>' +
            '<div class="session-row-progress">' +
            '<div class="session-row-context-tooltip"><div class="tooltip-label">Context Window</div><div class="tooltip-value">' + escapeHtml(row.contextTooltip || '') + '</div></div>' +
            '<div class="session-row-progress-bar"><div class="session-row-progress-fill ' + fillCls + '" style="width: ' + pctNum + '%"></div></div>' +
            '<div class="session-row-progress-meta">' +
            '<span class="meta-pct">' + escapeHtml(pctStr) + '</span>' +
            '<span class="meta-sep" aria-hidden="true">•</span>' +
            '<span class="session-row-status-dot ' + statusSlug + '"></span>' +
            '<span class="session-row-status-label ' + statusSlug + '">' + escapeHtml(statusLabel) + '</span>' +
            '</div></div>' +
            '<span class="session-row-time">' + escapeHtml(row.timeLabel || '') + '</span>' +
            '<div class="session-row-actions" onclick="event.stopPropagation()">' +
            '<button type="button" class="session-row-action stop" onclick="stopSession(\'' + sidEsc + '\')" title="Stop">' + sessionRowSvgStop() + '</button>' +
            '<button type="button" class="session-row-action open" onclick="window.location.href=\'' + detailsHref + '\'" title="Open">' + sessionRowSvgOpen() + '</button>' +
            '</div></div>';
    }

    function run() {
        var d = window.__kaidenDemoScreenData;
        if (d) {
            if (d.projects) hydrateProjects(d);
            if (d.knowledges) hydrateKnowledges(d);
        }
        /* Secret Vault: always hydrate when the page has the catalog table (even if services.json failed). */
        hydrateServices(d || {});
        /* Agents list: post-onboarding empty state or coding-agent single row — even if JSON failed. */
        hydrateSessions(d || {});
    }

    window.kaidenHydrateDemoPages = run;
    window.kaidenSaveVaultInlineForm = kaidenSaveVaultInlineForm;
})();
