/**
 * When demo view is "onboarding" (step 1 of 3), hide seeded UI per
 * assets/data/demo-scenario/onboarding-shell.json.
 * Loaded dynamically from sidebar-loader.js (after demo data is available).
 */
(function () {
    function hideAll(selector) {
        document.querySelectorAll(selector).forEach(function (n) {
            n.style.display = 'none';
        });
    }

    function applyOnboardingShellMock() {
        var viewKey = typeof window.getKaidenDemoViewKey === 'function' ? window.getKaidenDemoViewKey() : 'full';
        if (viewKey !== 'onboarding') {
            var old = document.getElementById('kaiden-empty-shell-notice');
            if (old) old.remove();
            return;
        }

        var d = window.__kaidenDemoScreenData;
        var shell = d && d.onboardingShell;
        var selectors = shell && Array.isArray(shell.hideSelectors) ? shell.hideSelectors : [
            '.projects-page .project-card',
            '.projects-page .projects-intro',
            '.sessions-page .session-row',
            '.sessions-page .sessions-stats',
            '.sessions-page .sessions-section-header',
            '.skills-page .skill-row',
            '.mcp-page .mcp-server-row',
            '.knowledges-page table.rag-table tbody tr',
            '.services-page .service-card',
            '.services-page .services-section-header',
            '.models-page .llm-provider-tile',
            '.models-page .model-runtime-card',
            '.sandbox-page .sb-stats',
            '.sandbox-page .sb-policy-alert',
            '.sandbox-page .sb-layer-card',
            '.tasks-page .task-item',
            '.agent-feed-page .af-panels'
        ];

        var main = document.querySelector('.main-content');
        if (main && !document.getElementById('kaiden-empty-shell-notice')) {
            var bar = document.createElement('div');
            bar.id = 'kaiden-empty-shell-notice';
            bar.className = 'kaiden-empty-shell-notice';
            var title = (shell && shell.banner && shell.banner.title) ? shell.banner.title : 'Guided onboarding';
            var bodyHtml = (shell && shell.banner && shell.banner.bodyHtml)
                ? shell.banner.bodyHtml
                : 'Open <strong>Setup</strong> to configure Kaiden, or advance the demo bar.';
            bar.innerHTML =
                '<div class="kaiden-empty-shell-notice__inner">' +
                '<strong class="kaiden-empty-shell-notice__title"></strong>' +
                '<p class="kaiden-empty-shell-notice__text"></p>' +
                '</div>';
            bar.querySelector('.kaiden-empty-shell-notice__title').textContent = title;
            bar.querySelector('.kaiden-empty-shell-notice__text').innerHTML = bodyHtml;
            main.insertBefore(bar, main.firstChild);
        }

        selectors.forEach(function (sel) {
            hideAll(sel);
        });

        var countLabel = shell && shell.projectsCountLabel;
        if (countLabel) {
            var pc = document.querySelector('.projects-page .projects-count');
            if (pc) pc.textContent = countLabel;
        }
    }

    function run() {
        var p = window.__kaidenDemoScreenDataPromise;
        if (p && typeof p.then === 'function') {
            p.then(applyOnboardingShellMock).catch(applyOnboardingShellMock);
        } else {
            applyOnboardingShellMock();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

    window.addEventListener('load', run);
})();
