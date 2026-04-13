/**
 * Optional projects (Settings → General): sync <html class="kaiden-optional-projects"> from localStorage
 * so CSS can hide project UI before/without waiting for sidebar-loader. Default is on (projects hidden)
 * unless modules.optionalProjectsMode === false. Call window.kaidenRefreshOptionalProjectsClass() after
 * changing kaidenSettings in the same tab.
 */
(function () {
    function readKaidenSettings() {
        try {
            var raw = localStorage.getItem('kaidenSettings');
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function isOptionalProjectsMode() {
        var p = readKaidenSettings();
        if (!p || !p.modules) return true;
        var v = p.modules.optionalProjectsMode;
        if (v === false) return false;
        return true;
    }

    function applyOptionalProjectsClass() {
        if (!document.documentElement) return;
        document.documentElement.classList.toggle('kaiden-optional-projects', isOptionalProjectsMode());
    }

    window.kaidenIsOptionalProjectsMode = isOptionalProjectsMode;
    window.kaidenRefreshOptionalProjectsClass = applyOptionalProjectsClass;

    applyOptionalProjectsClass();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyOptionalProjectsClass);
    }
    window.addEventListener('storage', function (e) {
        if (e.key === 'kaidenSettings') applyOptionalProjectsClass();
    });
})();

/**
 * Kaiden sprint demo: fixed top bar always visible on pages that load this script.
 * Injects demo-bar.css. Idle = not running scenario; active = shell matches step.
 *
 * State: localStorage `kaidenDemoState` → { active: boolean, step: number }
 * URL: ?demo=onboarding | ?demo=empty (legacy step 0) | ?demo=full | ?demo=reset
 *
 * Four steps when active: (0) onboarding shell; (1) post-onboarding — `postOnboarding` JSON;
 * (2) coding-agent session — workspace details (quadlet + OpenShift); (3) full workspace — rich mocks.
 * `kaidenOnboardingComplete` is cleared whenever the demo restarts or exits so Restart
 * / Exit / ?demo=reset stay predictable.
 */
(function () {
    var STORAGE_KEY = 'kaidenDemoState';
    var LEGACY_KEY = 'kaidenDemoScenario';
    var ONBOARDING_DONE_KEY = 'kaidenOnboardingComplete';
    /** Persisted with state; bump when demo step semantics change (e.g. 2-step → 3-step). */
    var DEMO_STATE_VERSION = 3;

    function clearPostOnboardingMockState() {
        try {
            localStorage.removeItem(ONBOARDING_DONE_KEY);
        } catch (e) { /* ignore */ }
    }

    var STEPS = [
        {
            id: 'onboarding',
            title: 'Onboarding',
            subtitle: 'Open Setup to walk through providers, assets, agents, and project — or advance to simulate completion'
        },
        {
            id: 'post-onboarding',
            title: 'After setup',
            subtitle: 'Workspaces list — empty until you create one; slim projects and vault until the coding-agent step'
        },
        {
            id: 'coding-agent',
            title: 'Coding agent',
            subtitle: 'Live workspace: RHEL Quadlet (Podman) and OpenShift Kubernetes manifests'
        },
        {
            id: 'full',
            title: 'Full workspace',
            subtitle: 'Full navigation and rich mock data for a mature deployment'
        }
    ];

    var IDLE_TITLE = 'Sprint demo';
    var IDLE_SUBTITLE = 'Four steps: onboarding → post-setup → coding agent session → full workspace';

    function ensureDemoBarStyles() {
        if (document.getElementById('kaiden-demo-bar-css')) return;
        var href = 'assets/css/demo-bar.css';
        var scripts = document.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            var src = scripts[i].src || '';
            if (src.indexOf('demo-scenario.js') !== -1) {
                try {
                    href = new URL('../css/demo-bar.css', src).href;
                } catch (e) { /* keep fallback */ }
                break;
            }
        }
        var link = document.createElement('link');
        link.id = 'kaiden-demo-bar-css';
        link.rel = 'stylesheet';
        link.href = href;
        (document.head || document.documentElement).appendChild(link);
    }

    ensureDemoBarStyles();

    function readRawState() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var o = JSON.parse(raw);
                if (o && typeof o.active === 'boolean' && typeof o.step === 'number') {
                    var step = Math.min(Math.max(0, o.step), STEPS.length - 1);
                    /* v2→v3: old index 2 was "full"; it is now index 3 */
                    if (o.v === 2 && o.step === 2) {
                        step = 3;
                    } else if ((o.v === undefined || o.v === null) && o.step === 2) {
                        /* Legacy 3-step demo stored no v — step 2 meant full workspace */
                        step = 3;
                    }
                    /* Stamp v without rewriting step: step 1 is valid (post-onboarding). Old migration
                       that mapped step 1→2 broke empty Agents / post-onboarding data. */
                    if (!o.v || o.v < DEMO_STATE_VERSION) {
                        try {
                            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                                active: o.active,
                                step: step,
                                v: DEMO_STATE_VERSION
                            }));
                        } catch (e3) { /* ignore */ }
                    }
                    return { active: o.active, step: step };
                }
            }
        } catch (e) { /* ignore */ }
        try {
            var leg = localStorage.getItem(LEGACY_KEY);
            if (leg === 'empty' || leg === 'onboarding') {
                return { active: true, step: 0 };
            }
        } catch (e2) { /* ignore */ }
        return { active: false, step: 0 };
    }

    function writeState(state) {
        try {
            if (state.active) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    active: true,
                    step: Math.min(Math.max(0, state.step), STEPS.length - 1),
                    v: DEMO_STATE_VERSION
                }));
                if (state.step === 0) {
                    localStorage.setItem(LEGACY_KEY, 'onboarding');
                } else {
                    localStorage.removeItem(LEGACY_KEY);
                }
            } else {
                clearPostOnboardingMockState();
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(LEGACY_KEY);
            }
        } catch (e) { /* ignore */ }
    }

    function getKaidenDemoState() {
        return readRawState();
    }

    function setKaidenDemoState(next) {
        writeState(next);
    }

    function syncKaidenDemoFromURL() {
        try {
            var d = new URLSearchParams(window.location.search).get('demo');
            if (d === 'empty' || d === 'onboarding') {
                clearPostOnboardingMockState();
                writeState({ active: true, step: 0 });
            } else if (d === 'full' || d === 'reset') {
                writeState({ active: false, step: 0 });
            }
        } catch (e) { /* ignore */ }
    }

    function migrateLegacyDemoKey() {
        try {
            if (localStorage.getItem(STORAGE_KEY)) return;
            var leg = localStorage.getItem(LEGACY_KEY);
            if (leg === 'empty' || leg === 'onboarding') {
                writeState({ active: true, step: 0 });
            }
        } catch (e) { /* ignore */ }
    }

    /** True during demo step 1 of 4 — onboarding shell (index 0). Alias for older call sites. */
    function isKaidenDemoEmpty() {
        var s = readRawState();
        return s.active && s.step === 0;
    }

    function isKaidenDemoActive() {
        return readRawState().active;
    }

    function getKaidenDemoStep() {
        return readRawState().step;
    }

    /** Resolves mock data slice: onboarding | postOnboarding | codingAgent | full */
    function getKaidenDemoViewKey() {
        var s = readRawState();
        if (s.active) {
            if (s.step === 0) return 'onboarding';
            if (s.step === 1) return 'postOnboarding';
            if (s.step === 2) return 'codingAgent';
            return 'full';
        }
        try {
            if (localStorage.getItem(ONBOARDING_DONE_KEY) === '1') return 'postOnboarding';
        } catch (e) { /* ignore */ }
        return 'full';
    }

    syncKaidenDemoFromURL();
    migrateLegacyDemoKey();

    if (typeof window !== 'undefined') {
        window.isKaidenDemoEmpty = isKaidenDemoEmpty;
        window.isKaidenDemoOnboardingStep = isKaidenDemoEmpty;
        window.getKaidenDemoState = getKaidenDemoState;
        window.getKaidenDemoSteps = function () { return STEPS.slice(); };
        window.clearKaidenPostOnboardingMockState = clearPostOnboardingMockState;
        window.getKaidenDemoViewKey = getKaidenDemoViewKey;
    }

    var playTimer = null;

    function clearPlayTimer() {
        if (playTimer) {
            clearInterval(playTimer);
            playTimer = null;
        }
    }

    /** Same default as sidebar-loader: parent of folder pages is repo root. */
    function getNavRootForDemo() {
        var explicit = document.body && document.body.getAttribute('data-nav-root');
        if (explicit !== null && explicit !== '') {
            return explicit.replace(/\/$/, '');
        }
        return '..';
    }

    function isOnboardingWelcomePage() {
        var p = (window.location.pathname || '').replace(/\/+/g, '/').toLowerCase();
        return p.indexOf('/onboarding/') !== -1 || /\/onboarding$/i.test(p);
    }

    function isAgentsSessionsListPage() {
        var p = (window.location.pathname || '').replace(/\/+/g, '/').toLowerCase();
        return /\/sessions\/(index\.html)?$/i.test(p) || p.endsWith('/sessions');
    }

    /** Step 1 (index 0) always opens the Setup wizard page. */
    function navigateToOnboardingWelcome() {
        clearPlayTimer();
        clearPostOnboardingMockState();
        writeState({ active: true, step: 0 });
        if (isOnboardingWelcomePage()) {
            window.location.reload();
            return;
        }
        window.location.href = getNavRootForDemo() + '/onboarding/index.html';
    }

    /** Step 2 (index 1) opens Agents (sessions list); list is empty until the coding-agent step. */
    function navigateToAgentsPage() {
        clearPlayTimer();
        clearPostOnboardingMockState();
        writeState({ active: true, step: 1 });
        if (isAgentsSessionsListPage()) {
            window.location.reload();
            return;
        }
        window.location.href = getNavRootForDemo() + '/sessions/index.html';
    }

    var CODING_AGENT_SESSION_ID = 'quadlet-openshift-demo';

    function isCodingAgentSessionDetailsPage() {
        var p = (window.location.pathname || '').replace(/\/+/g, '/').toLowerCase();
        if (!/\/sessions\/details\.html$/i.test(p)) return false;
        try {
            return new URLSearchParams(window.location.search).get('session') === CODING_AGENT_SESSION_ID;
        } catch (e) {
            return false;
        }
    }

    /** Step 3 (index 2): session details — coding agent on quadlet + OpenShift manifests. */
    function navigateToCodingAgentSession() {
        clearPlayTimer();
        clearPostOnboardingMockState();
        writeState({ active: true, step: 2 });
        if (isCodingAgentSessionDetailsPage()) {
            window.location.reload();
            return;
        }
        window.location.href = getNavRootForDemo() + '/sessions/details.html?session=' + encodeURIComponent(CODING_AGENT_SESSION_ID);
    }

    function startDemoAtStep(index) {
        var next = Math.min(Math.max(0, index), STEPS.length - 1);
        clearPlayTimer();
        if (next === 0) {
            navigateToOnboardingWelcome();
            return;
        }
        if (next === 1) {
            navigateToAgentsPage();
            return;
        }
        if (next === 2) {
            navigateToCodingAgentSession();
            return;
        }
        clearPostOnboardingMockState();
        writeState({ active: true, step: next });
        window.location.reload();
    }

    function goToStep(index) {
        var s = readRawState();
        if (!s.active) return;
        var next = Math.min(Math.max(0, index), STEPS.length - 1);
        if (next === s.step) return;
        clearPlayTimer();
        if (next === 0) {
            navigateToOnboardingWelcome();
            return;
        }
        if (next === 1) {
            navigateToAgentsPage();
            return;
        }
        if (next === 2) {
            navigateToCodingAgentSession();
            return;
        }
        clearPostOnboardingMockState();
        writeState({ active: true, step: next });
        window.location.reload();
    }

    function stepRelative(delta) {
        var s = readRawState();
        goToStep(s.step + delta);
    }

    function exitDemo() {
        clearPlayTimer();
        writeState({ active: false, step: 0 });
        window.location.reload();
    }

    /** Remove sprint demo state only; keep kaidenOnboardingComplete so the next page uses postOnboarding (full sidebar). */
    function exitDemoPreserveOnboarding() {
        clearPlayTimer();
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(LEGACY_KEY);
        } catch (e) { /* ignore */ }
    }

    if (typeof window !== 'undefined') {
        window.kaidenExitDemoPreserveOnboarding = exitDemoPreserveOnboarding;
    }

    function updatePlayButton(btn, playing) {
        if (!btn) return;
        btn.setAttribute('aria-pressed', playing ? 'true' : 'false');
        btn.classList.toggle('kaiden-demo-bar__play--active', playing);
        btn.innerHTML = playing
            ? '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        btn.title = playing ? 'Pause auto-advance' : 'Play — auto-advance steps';
    }

    function escapeHtml(s) {
        var d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }

    function renderDemoBar() {
        document.body.classList.add('kaiden-demo-bar-open');

        var state = readRawState();
        var active = state.active;
        var step = active ? state.step : 0;
        var meta = active ? STEPS[step] : null;
        var pct = active ? ((step + 1) / STEPS.length) * 100 : 0;

        var existing = document.getElementById('kaidenDemoBar');
        if (existing) existing.remove();

        var bar = document.createElement('div');
        bar.id = 'kaidenDemoBar';
        bar.className = 'kaiden-demo-bar' + (active ? '' : ' kaiden-demo-bar--idle');
        bar.setAttribute('role', 'region');
        bar.setAttribute('aria-label', 'Sprint demo');

        var segmentsHtml = STEPS.map(function (_, i) {
            var done = active && i < step;
            var current = active && i === step;
            var cls = 'kaiden-demo-bar__segment';
            if (!active) {
                cls += ' kaiden-demo-bar__segment--pending';
            } else {
                if (done) cls += ' kaiden-demo-bar__segment--done';
                if (current) cls += ' kaiden-demo-bar__segment--current';
            }
            var segLabel;
            if (i === 0) {
                segLabel = (active ? 'Go to step ' : 'Start demo at step ') + '1: ' + STEPS[i].title + ' — open Setup';
            } else if (i === 1) {
                segLabel = (active ? 'Go to step ' : 'Start demo at step ') + '2: ' + STEPS[i].title + ' — open Workspaces';
            } else if (i === 2) {
                segLabel = (active ? 'Go to step ' : 'Start demo at step ') + '3: ' + STEPS[i].title + ' — open workspace session';
            } else {
                segLabel = (active ? 'Go to step ' : 'Start demo at step ') + (i + 1) + ': ' + STEPS[i].title;
            }
            return '<button type="button" class="' + cls + '" data-demo-step="' + i + '" aria-label="' + escapeHtml(segLabel) + '"' + (current ? ' aria-current="step"' : '') + '><span class="kaiden-demo-bar__segment-dot"></span></button>';
        }).join('');

        var titleHtml = escapeHtml(active ? meta.title : IDLE_TITLE);
        var subHtml = escapeHtml(active ? meta.subtitle : IDLE_SUBTITLE);

        var controlsHtml;
        if (active) {
            controlsHtml =
                '<button type="button" class="kaiden-demo-bar__btn" id="kaidenDemoPrev" aria-label="Previous step"' + (step <= 0 ? ' disabled' : '') + '>' +
                '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>' +
                '</button>' +
                '<button type="button" class="kaiden-demo-bar__btn kaiden-demo-bar__play" id="kaidenDemoPlay" aria-label="Play or pause auto-advance" title="Play — auto-advance steps"></button>' +
                '<button type="button" class="kaiden-demo-bar__btn" id="kaidenDemoNext" aria-label="Next step"' + (step >= STEPS.length - 1 ? ' disabled' : '') + '>' +
                '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>' +
                '</button>' +
                '<button type="button" class="kaiden-demo-bar__btn kaiden-demo-bar__btn--restart" id="kaidenDemoRestart" aria-label="Restart demo from the beginning" title="Back to step 1 — Onboarding">Restart</button>' +
                '<button type="button" class="kaiden-demo-bar__btn kaiden-demo-bar__btn--exit" id="kaidenDemoExit" aria-label="Exit demo">Exit</button>';
        } else {
            controlsHtml =
                '<button type="button" class="kaiden-demo-bar__btn" id="kaidenDemoPrev" disabled aria-label="Previous step">' +
                '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>' +
                '</button>' +
                '<button type="button" class="kaiden-demo-bar__btn kaiden-demo-bar__play" id="kaidenDemoPlay" disabled aria-label="Play"></button>' +
                '<button type="button" class="kaiden-demo-bar__btn" id="kaidenDemoNext" disabled aria-label="Next step">' +
                '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><polyline points="9 18 15 12 9 6"/></svg>' +
                '</button>' +
                '<button type="button" class="kaiden-demo-bar__btn kaiden-demo-bar__btn--start" id="kaidenDemoStart" aria-label="Start sprint demo">Start</button>';
        }

        bar.innerHTML =
            '<div class="kaiden-demo-bar__inner">' +
            '  <div class="kaiden-demo-bar__label">Demo</div>' +
            '  <div class="kaiden-demo-bar__progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + STEPS.length + '" aria-valuenow="' + (active ? step + 1 : 0) + '" aria-label="Demo progress">' +
            '    <div class="kaiden-demo-bar__progress-track">' +
            '      <div class="kaiden-demo-bar__progress-fill" style="width:' + pct + '%"></div>' +
            '    </div>' +
            '    <div class="kaiden-demo-bar__segments">' + segmentsHtml + '</div>' +
            '  </div>' +
            '  <div class="kaiden-demo-bar__text">' +
            '    <span class="kaiden-demo-bar__title">' + titleHtml + '</span>' +
            '    <span class="kaiden-demo-bar__subtitle">' + subHtml + '</span>' +
            '  </div>' +
            '  <div class="kaiden-demo-bar__controls">' + controlsHtml + '</div>' +
            '</div>';

        document.body.insertBefore(bar, document.body.firstChild);

        var playBtn = document.getElementById('kaidenDemoPlay');
        updatePlayButton(playBtn, false);

        bar.querySelectorAll('[data-demo-step]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var i = parseInt(btn.getAttribute('data-demo-step'), 10);
                if (isNaN(i)) return;
                clearPlayTimer();
                if (active) {
                    updatePlayButton(playBtn, false);
                    goToStep(i);
                } else {
                    startDemoAtStep(i);
                }
            });
        });

        if (active) {
            document.getElementById('kaidenDemoPrev').addEventListener('click', function () {
                clearPlayTimer();
                updatePlayButton(playBtn, false);
                stepRelative(-1);
            });

            document.getElementById('kaidenDemoNext').addEventListener('click', function () {
                clearPlayTimer();
                updatePlayButton(playBtn, false);
                stepRelative(1);
            });

            playBtn.addEventListener('click', function () {
                if (playTimer) {
                    clearPlayTimer();
                    updatePlayButton(playBtn, false);
                    return;
                }
                updatePlayButton(playBtn, true);
                playTimer = setInterval(function () {
                    var st = readRawState();
                    if (st.step >= STEPS.length - 1) {
                        clearPlayTimer();
                        updatePlayButton(playBtn, false);
                        return;
                    }
                    goToStep(st.step + 1);
                }, 5000);
            });

            document.getElementById('kaidenDemoRestart').addEventListener('click', function () {
                clearPlayTimer();
                updatePlayButton(playBtn, false);
                startDemoAtStep(0);
            });

            document.getElementById('kaidenDemoExit').addEventListener('click', function () {
                exitDemo();
            });
        } else {
            document.getElementById('kaidenDemoStart').addEventListener('click', function () {
                startDemoAtStep(0);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderDemoBar();
    });

    window.addEventListener('storage', function (ev) {
        if (ev.key === STORAGE_KEY || ev.key === LEGACY_KEY) {
            renderDemoBar();
        }
    });
})();
