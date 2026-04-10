/**
 * Loads assets/data/demo-scenario/*.json for the current demo view key.
 * Requires demo-scenario.js (getKaidenDemoViewKey). Consumed by sidebar-loader,
 * kaiden-empty-mock (onboarding shell), and demo-page-hydrate.
 */
(function () {
    function dataBaseUrl() {
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].src || '';
            if (src.indexOf('demo-screen-data.js') !== -1) {
                try {
                    return new URL('../data/demo-scenario/', src).href;
                } catch (e) { /* fall through */ }
            }
        }
        try {
            return new URL('assets/data/demo-scenario/', document.baseURI).href;
        } catch (e2) {
            return 'assets/data/demo-scenario/';
        }
    }

    function viewKey() {
        if (typeof window.getKaidenDemoViewKey === 'function') {
            return window.getKaidenDemoViewKey();
        }
        return 'full';
    }

    /** Never rejects — one bad file (or file:// fetch) must not wipe the whole pack. */
    function fetchJsonAllowNull(url) {
        return fetch(url, { credentials: 'same-origin' })
            .then(function (r) {
                if (!r.ok) return null;
                return r.json();
            })
            .catch(function (err) {
                console.warn('kaiden demo-screen-data (optional fetch):', url, err);
                return null;
            });
    }

    var base = dataBaseUrl();
    var vk = viewKey();
    window.__kaidenDemoViewKey = vk;

    window.__kaidenDemoScreenDataPromise = Promise.all([
        fetchJsonAllowNull(base + 'sidebar.json'),
        fetchJsonAllowNull(base + 'onboarding-shell.json'),
        fetchJsonAllowNull(base + 'projects.json'),
        fetchJsonAllowNull(base + 'services.json'),
        fetchJsonAllowNull(base + 'knowledges.json'),
        fetchJsonAllowNull(base + 'sessions.json')
    ]).then(function (arr) {
        var vkLive = typeof window.getKaidenDemoViewKey === 'function' ? window.getKaidenDemoViewKey() : vk;
        window.__kaidenDemoViewKey = vkLive;
        window.__kaidenDemoScreenData = {
            viewKey: vkLive,
            sidebar: arr[0],
            onboardingShell: arr[1],
            projects: arr[2],
            services: arr[3],
            knowledges: arr[4],
            sessions: arr[5]
        };
        return window.__kaidenDemoScreenData;
    });
})();
