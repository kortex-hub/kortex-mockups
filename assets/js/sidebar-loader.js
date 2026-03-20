/**
 * Sidebar Component Loader
 * Loads the sidebar component and handles active state management
 */

const sidebarHTML = `
<nav class="sidebar">
    <!-- Agents -->
    <a href="../tasks/index.html" class="nav-item" data-section="tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
            <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
        </svg>
        <span>Agents</span>
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

    <!-- Flows -->
    <a href="../flows/index.html" class="nav-item" data-section="flows">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
        <span>Flows</span>
    </a>

    <!-- Extensions -->
    <a href="../extensions/index.html" class="nav-item" data-section="extensions">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v6.5l5.5-3.25"/>
            <path d="M17.5 5.25L12 8.5l5.5 3.25"/>
            <path d="M17.5 11.75L12 8.5V15"/>
            <path d="M12 15l-5.5-3.25"/>
            <path d="M6.5 11.75L12 8.5 6.5 5.25"/>
            <path d="M6.5 5.25L12 8.5V2"/>
            <path d="M12 15v7"/>
            <path d="M5 17.5L12 22l7-4.5"/>
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
        <div class="status-bar-item" style="cursor: pointer; padding: 4px 10px; background: rgba(52, 211, 153, 0.1); border-radius: 4px; border: 1px solid rgba(52, 211, 153, 0.2);">
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

    // Dynamically load the OpenShift AI script
    const script = document.createElement('script');
    script.src = '../assets/js/openshift-ai.js';
    document.body.appendChild(script);
});
