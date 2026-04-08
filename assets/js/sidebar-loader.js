/**
 * Sidebar Component Loader
 * Loads the sidebar component and handles active state management
 */

const sidebarHTML = `
<nav class="sidebar">
    <!-- Overview -->
    <a href="../index.html" class="nav-item" data-section="dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1"/>
            <rect x="14" y="3" width="7" height="5" rx="1"/>
            <rect x="14" y="12" width="7" height="9" rx="1"/>
            <rect x="3" y="16" width="7" height="5" rx="1"/>
        </svg>
        <span>Overview</span>
    </a>

    <!-- Agents -->
    <a href="../tasks/index.html" class="nav-item" data-section="tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
        </svg>
        <span>Agents</span>
    </a>

    <!-- Agent Feed -->
    <a href="../agent-feed/index.html" class="nav-item" data-section="agent-feed">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4a9 9 0 0 0 12 0"/>
            <path d="M9 7a4.5 4.5 0 0 0 6 0"/>
            <line x1="12" y1="10" x2="12" y2="8"/>
            <rect x="3" y="10" width="18" height="12" rx="3"/>
            <circle cx="8.5" cy="16" r="1.5" fill="currentColor"/>
            <circle cx="15.5" cy="16" r="1.5" fill="currentColor"/>
        </svg>
        <span>Agent Feed</span>
    </a>

    <!-- Projects -->
    <a href="../projects/index.html" class="nav-item" data-section="projects">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Projects</span>
    </a>

    <!-- AI Assets -->
    <a href="../ai-assets/index.html" class="nav-item" data-section="ai-assets">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span>AI Assets</span>
    </a>

    <!-- Services -->
    <a href="../services/index.html" class="nav-item" data-section="services">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <span>Services</span>
    </a>

    <!-- Extensions -->
    <a href="../extensions/index.html" class="nav-item" data-section="extensions">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5.5 8.5 9 12l-3.5 3.5L2 12l3.5-3.5Z"/>
            <path d="m12 2 3.5 3.5L12 9 8.5 5.5 12 2Z"/>
            <path d="M18.5 8.5 22 12l-3.5 3.5L15 12l3.5-3.5Z"/>
            <path d="m12 15 3.5 3.5L12 22l-3.5-3.5L12 15Z"/>
        </svg>
        <span>Extensions</span>
    </a>

    <div class="nav-spacer"></div>

    <!-- Settings -->
    <a href="../settings/index.html" class="nav-item" data-section="settings">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.07a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>Settings</span>
    </a>
</nav>

<!-- Global Status Bar -->
<div class="global-status-bar" id="globalStatusBar">
    <div class="status-bar-left">
        <div class="status-bar-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Ready</span>
        </div>
        <div class="status-bar-item agents-status" onclick="window.location.href='../agent-feed/index.html'" style="cursor: pointer; padding: 4px 10px; background: rgba(52, 211, 153, 0.1); border-radius: 4px; border: 1px solid rgba(52, 211, 153, 0.2);" title="Open Agent Feed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
            </svg>
            <span style="color: #34d399;">3 agents running</span>
        </div>
        <div class="status-bar-item status-bar-cli" onclick="window.location.href='../cli/index.html'" style="cursor: pointer; padding: 4px 10px; background: rgba(103, 232, 249, 0.1); border-radius: 4px; border: 1px solid rgba(103, 232, 249, 0.2);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" stroke-width="2">
                <polyline points="4 17 10 11 4 5"/>
                <line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
            <span style="color: #67e8f9;">CLI</span>
        </div>
        <div class="status-bar-item status-bar-sandbox" onclick="window.location.href='../sandbox/index.html'" style="cursor: pointer; padding: 4px 10px; background: rgba(139, 92, 246, 0.1); border-radius: 4px; border: 1px solid rgba(139, 92, 246, 0.2);" title="Open Sandbox Activities">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style="color: #a78bfa;">Sandbox</span>
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

<!-- OpenShift AI Connection Modal -->
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

// Check if OpenShift AI module is enabled
function isOpenshiftAIModuleEnabled() {
    try {
        const saved = localStorage.getItem('kortexSettings');
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

// Load sidebar component
function loadSidebar(activeSection) {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
        console.error('Sidebar container not found');
        return;
    }

    sidebarContainer.innerHTML = sidebarHTML;

    // Hide OpenShift AI status bar item if module is disabled
    const openshiftStatusItem = document.getElementById('openshiftStatusItem');
    if (openshiftStatusItem && !isOpenshiftAIModuleEnabled()) {
        openshiftStatusItem.style.display = 'none';
    }

    // Set active section
    if (activeSection) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === activeSection) {
                item.classList.add('active');
            }
        });
    }

    document.dispatchEvent(new CustomEvent('sidebarLoaded'));
}

// Auto-load sidebar on page load
document.addEventListener('DOMContentLoaded', () => {
    const bodyClass = document.body.className;
    let activeSection = bodyClass.split(' ').find(c => c.endsWith('-page'))?.replace('-page', '');

    // Map legacy section names to new ones
    const sectionMap = {
        'chat': 'tasks',
        'sessions': 'tasks',
        'profiles': 'ai-assets',
        'knowledges': 'ai-assets',
        'mcp': 'ai-assets',
        'skills': 'ai-assets',
        'bridge': 'settings'
    };

    if (activeSection && sectionMap[activeSection]) {
        activeSection = sectionMap[activeSection];
    }

    loadSidebar(activeSection);

    // Resolve next to this loader so it works from file:// or http(s) at any page depth
    const loaderEl = document.querySelector('script[src*="sidebar-loader.js"]');
    const openshiftSrc = loaderEl && loaderEl.src
        ? loaderEl.src.replace(/sidebar-loader\.js/i, 'openshift-ai.js')
        : new URL('../assets/js/openshift-ai.js', document.baseURI).href;

    const script = document.createElement('script');
    script.src = openshiftSrc;
    document.body.appendChild(script);

});
