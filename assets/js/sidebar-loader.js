/**
 * Sidebar Component Loader
 * Loads the sidebar component and handles active state management
 *
 * Repo root `index.html` redirects to Welcome. Subpages omit data-nav-root (default "..").
 *
 * Demo scenario: load `demo-scenario.js` and `demo-screen-data.js` before this script.
 * Sidebar visibility uses `assets/data/demo-scenario/sidebar.json` by view key.
 * `kaiden-empty-mock.js` applies onboarding-shell selectors when view is `onboarding`.
 *
 * Optional projects: Settings → General → "Optional projects" saves `modules.optionalProjectsMode`.
 * Default is on (hide sidebar Projects) unless explicitly set to false.
 * When true, the Projects nav item is hidden (create-agent project picker is hidden on sessions/create.html).
 */

function getNavRoot() {
    const explicit = document.body.getAttribute('data-nav-root');
    if (explicit !== null && explicit !== '') {
        return explicit.replace(/\/$/, '');
    }
    return '..';
}

function buildSidebarHTML() {
    const R = getNavRoot();
    return `
<nav class="sidebar">
    <a href="${R}/sessions/index.html" class="nav-item" data-section="sessions">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
        </svg>
        <span>Workspaces</span>
    </a>

    <a href="${R}/coding-agent/index.html" class="nav-item" data-section="coding-agent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="4 17 10 11 4 5"/>
            <line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
        <span>Coding agents</span>
    </a>

    <a href="${R}/projects/index.html" class="nav-item" data-section="projects">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Projects</span>
    </a>

    <a href="${R}/models/index.html" class="nav-item" data-section="models">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
        </svg>
        <span>Models</span>
    </a>

    <a href="${R}/services/index.html" class="nav-item" data-section="services">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>Secret Vault</span>
    </a>

    <a href="${R}/knowledges/index.html" class="nav-item" data-section="knowledges">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
        </svg>
        <span>Knowledges</span>
    </a>

    <a href="${R}/mcp/index.html" class="nav-item" data-section="mcp" id="mcp-nav-item">
        <svg class="nav-item-icon--mcp" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M13.85 0a4.16 4.16 0 0 0-2.95 1.217L1.456 10.66a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l9.442-9.442a2.49 2.49 0 0 1 3.541 0 2.49 2.49 0 0 1 0 3.541L8.59 12.97l-.1.1a.835.835 0 0 0 0 1.18.835.835 0 0 0 1.18 0l.1-.098 7.03-7.034a2.49 2.49 0 0 1 3.542 0l.049.05a2.49 2.49 0 0 1 0 3.54l-8.54 8.54a1.96 1.96 0 0 0 0 2.755l1.753 1.753a.835.835 0 0 0 1.18 0 .835.835 0 0 0 0-1.18l-1.753-1.753a.266.266 0 0 1 0-.394l8.54-8.54a4.185 4.185 0 0 0 0-5.9l-.05-.05a4.16 4.16 0 0 0-2.95-1.218c-.2 0-.401.02-.6.048a4.17 4.17 0 0 0-1.17-3.552A4.16 4.16 0 0 0 13.85 0m0 3.333a.84.84 0 0 0-.59.245L6.275 10.56a4.186 4.186 0 0 0 0 5.902 4.186 4.186 0 0 0 5.902 0L19.16 9.48a.835.835 0 0 0 0-1.18.835.835 0 0 0-1.18 0l-6.985 6.984a2.49 2.49 0 0 1-3.54 0 2.49 2.49 0 0 1 0-3.54l6.983-6.985a.835.835 0 0 0 0-1.18.84.84 0 0 0-.59-.245"/>
        </svg>
        <span>MCP</span>
    </a>

    <a href="${R}/skills/index.html" class="nav-item" data-section="skills" id="skills-nav-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
        <span>Skills</span>
    </a>

    <a href="${R}/extensions/index.html" class="nav-item" data-section="extensions">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/>
            <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"/>
            <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/>
            <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"/>
        </svg>
        <span>Extensions</span>
    </a>

    <div class="nav-spacer"></div>

    <a href="${R}/settings/index.html" class="nav-item" data-section="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.07a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>Settings</span>
    </a>
</nav>

<div class="global-status-bar" id="globalStatusBar">
    <div class="status-bar-left">
        <div class="status-bar-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Ready</span>
        </div>
        <div class="status-bar-item agents-status" onclick="window.location.href='${R}/sandbox/index.html'" style="cursor: pointer; padding: 4px 10px; background: rgba(79, 195, 247, 0.1); border-radius: 4px; border: 1px solid rgba(79, 195, 247, 0.2);" title="Sandbox active — host and network isolated">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6dd6ff" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style="color: #6dd6ff;">Sandbox active</span>
        </div>
        <div class="status-bar-item status-bar-cli" onclick="window.location.href='${R}/cli/index.html'" style="cursor: pointer; padding: 4px 10px; background: rgba(103, 232, 249, 0.1); border-radius: 4px; border: 1px solid rgba(103, 232, 249, 0.2);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                <polyline points="4 17 10 11 4 5"/>
                <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            <span style="color: #67e8f9;">kdn CLI</span>
        </div>
    </div>
    <div class="status-bar-right">
        <div class="status-bar-item openshift-status" id="openshiftStatusItem" onclick="window.openOpenshiftAIModal()">
            <div class="status-bar-dot" id="openshiftStatusDot"></div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
            </svg>
            <span id="openshiftStatusText">OpenShift AI: Not connected</span>
        </div>
    </div>
</div>

<div class="openshift-modal-overlay" id="openshiftModalOverlay">
    <div class="openshift-modal">
        <div class="openshift-modal-header">
            <div class="openshift-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                </svg>
            </div>
            <div class="openshift-modal-header-info">
                <h2>Connect to OpenShift AI</h2>
                <p>Sign in to access your organization's AI assets</p>
            </div>
            <button class="openshift-modal-close" onclick="window.closeOpenshiftAIModal()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
        <div class="openshift-modal-body">
            <div class="openshift-form-group">
                <label class="openshift-form-label">OpenShift AI URL</label>
                <input type="url" class="openshift-form-input" id="openshiftUrl" placeholder="https://ai.openshift.example.com" value="https://ai.openshift.corp.example.com">
            </div>
            <div class="openshift-form-group">
                <label class="openshift-form-label">Username</label>
                <input type="text" class="openshift-form-input" id="openshiftUsername" placeholder="your.username" value="john.doe">
            </div>
            <div class="openshift-form-group">
                <label class="openshift-form-label">Password or Token</label>
                <input type="password" class="openshift-form-input" id="openshiftPassword" placeholder="••••••••••••" value="mock-token-12345">
            </div>
        </div>
        <div class="openshift-modal-footer">
            <button class="openshift-modal-cancel" onclick="window.closeOpenshiftAIModal()">Cancel</button>
            <button class="openshift-modal-submit" id="openshiftSubmitBtn" onclick="window.connectToOpenshiftAI()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Connect
            </button>
        </div>
    </div>
</div>
`;
}

function isSkillsModuleEnabled() {
    try {
        const saved = localStorage.getItem('kaidenSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.modules && settings.modules.skillsEnabled === false) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return true;
    }
}

function isMcpModuleEnabled() {
    try {
        const saved = localStorage.getItem('kaidenSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.modules && settings.modules.mcpEnabled === false) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return true;
    }
}

// Check if OpenShift AI module is enabled
function isOpenshiftAIModuleEnabled() {
    try {
        const saved = localStorage.getItem('kaidenSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.modules && settings.modules.openshiftAIEnabled === false) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return true;
    }
}

function isOptionalProjectsMode() {
    if (typeof window.kaidenIsOptionalProjectsMode === 'function') {
        return window.kaidenIsOptionalProjectsMode();
    }
    try {
        const saved = localStorage.getItem('kaidenSettings');
        if (!saved) return true;
        const settings = JSON.parse(saved);
        if (settings.modules && settings.modules.optionalProjectsMode === false) {
            return false;
        }
        return true;
    } catch (e) {
        return true;
    }
}

// Load sidebar component
function loadSidebar(activeSection) {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
        console.error('Sidebar container not found');
        return;
    }

    sidebarContainer.innerHTML = buildSidebarHTML();

    const skillsNavItem = document.getElementById('skills-nav-item');
    if (skillsNavItem && !isSkillsModuleEnabled()) {
        skillsNavItem.style.display = 'none';
    }

    const mcpNavItem = document.getElementById('mcp-nav-item');
    if (mcpNavItem && !isMcpModuleEnabled()) {
        mcpNavItem.style.display = 'none';
    }

    const openshiftStatusItem = document.getElementById('openshiftStatusItem');
    if (openshiftStatusItem && !isOpenshiftAIModuleEnabled()) {
        openshiftStatusItem.style.display = 'none';
    }

    const viewKey = typeof window.getKaidenDemoViewKey === 'function' ? window.getKaidenDemoViewKey() : 'full';
    const sidebarCfg = window.__kaidenDemoScreenData && window.__kaidenDemoScreenData.sidebar
        ? window.__kaidenDemoScreenData.sidebar[viewKey]
        : null;
    const demoOnboarding = viewKey === 'onboarding';

    if (demoOnboarding) {
        document.body.classList.add('kaiden-demo-empty');
    } else {
        document.body.classList.remove('kaiden-demo-empty');
    }

    const hideSections = sidebarCfg && Array.isArray(sidebarCfg.hiddenNavSections)
        ? sidebarCfg.hiddenNavSections
        : (demoOnboarding ? ['sessions', 'coding-agent', 'projects', 'models', 'services', 'knowledges', 'mcp', 'skills'] : []);

    document.querySelectorAll('.nav-item[data-section]').forEach((el) => {
        const sec = el.getAttribute('data-section');
        if (!sec) return;
        const hide = hideSections.indexOf(sec) !== -1;
        el.style.display = hide ? 'none' : '';
    });

    const projectsNavItem = document.querySelector('.nav-item[data-section="projects"]');
    if (projectsNavItem && isOptionalProjectsMode()) {
        projectsNavItem.style.display = 'none';
    }

    const hiddenStatus = sidebarCfg && Array.isArray(sidebarCfg.hiddenStatusItems)
        ? sidebarCfg.hiddenStatusItems
        : (demoOnboarding ? ['sandbox', 'cli', 'openshift'] : []);

    const sandboxChip = document.querySelector('.global-status-bar .agents-status');
    if (sandboxChip) {
        sandboxChip.style.display = hiddenStatus.indexOf('sandbox') !== -1 ? 'none' : '';
    }
    const cliChip = document.querySelector('.global-status-bar .status-bar-cli');
    if (cliChip) {
        cliChip.style.display = hiddenStatus.indexOf('cli') !== -1 ? 'none' : '';
    }
    if (openshiftStatusItem) {
        if (!isOpenshiftAIModuleEnabled()) {
            openshiftStatusItem.style.display = 'none';
        } else {
            openshiftStatusItem.style.display = hiddenStatus.indexOf('openshift') !== -1 ? 'none' : '';
        }
    }

    if (skillsNavItem && !isSkillsModuleEnabled()) {
        skillsNavItem.style.display = 'none';
    }
    if (mcpNavItem && !isMcpModuleEnabled()) {
        mcpNavItem.style.display = 'none';
    }

    if (activeSection) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection) {
                item.classList.add('active');
            }
        });
    }

    if (typeof window.kaidenRefreshOptionalProjectsClass === 'function') {
        window.kaidenRefreshOptionalProjectsClass();
    }

    document.dispatchEvent(new CustomEvent('sidebarLoaded'));
}

document.addEventListener('DOMContentLoaded', async () => {
    if (window.__kaidenDemoScreenDataPromise) {
        try {
            await window.__kaidenDemoScreenDataPromise;
        } catch (e) { /* ignore */ }
    }
    if (typeof window.kaidenHydrateDemoPages === 'function') {
        window.kaidenHydrateDemoPages();
    }

    /* Workspace settings shown inside details.html iframe — parent already has app chrome. */
    if (document.documentElement.classList.contains('settings-embed')) {
        return;
    }

    const bodyClass = document.body.className;
    let activeSection = bodyClass.split(' ').find(c => c.endsWith('-page'))?.replace('-page', '');

    const sectionMap = {
        'tasks': 'projects'
    };

    if (activeSection && sectionMap[activeSection]) {
        activeSection = sectionMap[activeSection];
    }

    loadSidebar(activeSection);

    const loaderEl = document.querySelector('script[src*="sidebar-loader.js"]');
    const openshiftSrc = loaderEl && loaderEl.src
        ? loaderEl.src.replace(/sidebar-loader\.js/i, 'openshift-ai.js')
        : new URL('../assets/js/openshift-ai.js', document.baseURI).href;

    const script = document.createElement('script');
    script.src = openshiftSrc;
    document.body.appendChild(script);

    const mockSrc = loaderEl && loaderEl.src
        ? loaderEl.src.replace(/sidebar-loader\.js/i, 'kaiden-empty-mock.js')
        : new URL('../assets/js/kaiden-empty-mock.js', document.baseURI).href;
    const mockScript = document.createElement('script');
    mockScript.src = mockSrc;
    document.body.appendChild(mockScript);
});
