/**
 * OpenShift AI Connection Manager
 * Handles connection state, UI updates, and internal asset visibility
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'openshiftAIConnection';

    // Get connection state from localStorage
    function getConnectionState() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : { connected: false };
        } catch (e) {
            return { connected: false };
        }
    }

    // Save connection state to localStorage
    function saveConnectionState(state) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    // Update UI based on connection state
    function updateUI() {
        const state = getConnectionState();
        const statusItem = document.getElementById('openshiftStatusItem');
        const statusText = document.getElementById('openshiftStatusText');
        const statusDot = document.getElementById('openshiftStatusDot');

        if (!statusItem) return;

        if (state.connected) {
            statusItem.classList.add('connected');
            document.body.classList.add('openshift-connected');
            statusText.textContent = `OpenShift AI: ${state.username || 'Connected'}`;
            statusItem.title = `Connected to ${state.url}\nClick to disconnect`;
            statusItem.onclick = function() {
                if (confirm('Disconnect from OpenShift AI?')) {
                    window.disconnectFromOpenshiftAI();
                }
            };
        } else {
            statusItem.classList.remove('connected');
            document.body.classList.remove('openshift-connected');
            statusText.textContent = 'OpenShift AI: Not connected';
            statusItem.title = 'Click to connect to OpenShift AI';
            statusItem.onclick = function() {
                window.openOpenshiftAIModal();
            };
        }

        // Trigger custom event for pages to handle
        document.dispatchEvent(new CustomEvent('openshiftAIStateChanged', { detail: state }));
    }

    // Open the connection modal
    window.openOpenshiftAIModal = function() {
        const modal = document.getElementById('openshiftModalOverlay');
        if (modal) {
            modal.classList.add('show');
        }
    };

    // Close the connection modal
    window.closeOpenshiftAIModal = function() {
        const modal = document.getElementById('openshiftModalOverlay');
        if (modal) {
            modal.classList.remove('show');
        }
    };

    // Connect to OpenShift AI
    window.connectToOpenshiftAI = function() {
        const url = document.getElementById('openshiftUrl')?.value || '';
        const username = document.getElementById('openshiftUsername')?.value || '';
        const submitBtn = document.getElementById('openshiftSubmitBtn');

        if (!url || !username) {
            alert('Please enter the OpenShift AI URL and username.');
            return;
        }

        // Show loading state
        if (submitBtn) {
            submitBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                </svg>
                Connecting...
            `;
            submitBtn.disabled = true;
        }

        // Simulate connection delay
        setTimeout(function() {
            // Save connection state
            saveConnectionState({
                connected: true,
                url: url,
                username: username,
                connectedAt: new Date().toISOString()
            });

            // Close modal and update UI
            window.closeOpenshiftAIModal();
            updateUI();

            // Reset button state
            if (submitBtn) {
                submitBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                        <polyline points="10 17 15 12 10 7"/>
                        <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                    Connect
                `;
                submitBtn.disabled = false;
            }
        }, 1200);
    };

    // Disconnect from OpenShift AI
    window.disconnectFromOpenshiftAI = function() {
        saveConnectionState({ connected: false });
        updateUI();
    };

    // Reset OpenShift AI connection (for demo purposes)
    window.resetOpenshiftAI = function() {
        localStorage.removeItem(STORAGE_KEY);
        updateUI();
    };

    // Check if connected
    window.isOpenshiftAIConnected = function() {
        return getConnectionState().connected;
    };

    // Get connection info
    window.getOpenshiftAIConnection = function() {
        return getConnectionState();
    };

    // Initialize on DOM ready
    function init() {
        updateUI();

        // Close modal on backdrop click
        const modal = document.getElementById('openshiftModalOverlay');
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    window.closeOpenshiftAIModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                window.closeOpenshiftAIModal();
            }
        });
    }

    // Run init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also run after sidebar is loaded (for dynamic loading)
    document.addEventListener('sidebarLoaded', init);
})();
