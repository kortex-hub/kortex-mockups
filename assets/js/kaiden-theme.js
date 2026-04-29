/**
 * Kaiden mockup theme: toggles html.dark for dark mode.
 * Preference order: localStorage kaidenSettings.appearance.theme → kaidenTheme → default "dark".
 * When theme is "system", follows prefers-color-scheme.
 * Run in <head> before stylesheets to reduce flash.
 */
(function () {
    function readSettingsTheme() {
        try {
            var raw = localStorage.getItem('kaidenSettings');
            if (!raw) return null;
            var s = JSON.parse(raw);
            if (s && s.appearance && s.appearance.theme) return s.appearance.theme;
        } catch (e) {}
        return null;
    }

    function readStandaloneTheme() {
        try {
            var t = localStorage.getItem('kaidenTheme');
            if (t === 'light' || t === 'dark' || t === 'system') return t;
        } catch (e) {}
        return null;
    }

    function effectiveFromPreference(pref) {
        if (pref === 'light' || pref === 'dark') return pref;
        if (pref === 'system') {
            try {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            } catch (e) {
                return 'dark';
            }
        }
        return 'dark';
    }

    function resolvePreference() {
        var fromSettings = readSettingsTheme();
        if (fromSettings) return fromSettings;
        var standalone = readStandaloneTheme();
        if (standalone) return standalone;
        return 'dark';
    }

    function applyFromPreference(pref) {
        var eff = effectiveFromPreference(pref);
        if (document.documentElement) {
            document.documentElement.classList.toggle('dark', eff === 'dark');
        }
    }

    function resolveEffective() {
        return effectiveFromPreference(resolvePreference());
    }

    applyFromPreference(resolvePreference());

    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            if (resolvePreference() === 'system') applyFromPreference('system');
        });
    } catch (e) {}

    window.addEventListener('storage', function (e) {
        if (e.key === 'kaidenSettings' || e.key === 'kaidenTheme') applyFromPreference(resolvePreference());
    });

    window.kaidenTheme = {
        resolvePreference: resolvePreference,
        resolveEffective: resolveEffective,
        /** Pass "light" | "dark" | "system" from Settings theme control (before or after save). */
        applyPreference: function (pref) {
            applyFromPreference(pref);
        },
        syncFromStorage: function () {
            applyFromPreference(resolvePreference());
        }
    };
})();
