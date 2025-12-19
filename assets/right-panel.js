// Right panel tools: tabs, pinning, notepad autosave, default home
function initRightPanel() {
    // Color theme definitions as token maps. Each theme provides semantic tokens:
    // --bg, --surface, --surface-2, --border, --text, --muted, --primary, --primary-hover, --on-primary, --accent
    // For backward compatibility we also set --theme-color1..6 (mapped to bg, surface, primary, text, muted, border).
    const COLOR_THEMES = {
        auburn: {
            mode: 'light',
            '--bg': '#FBF5F0',
            '--surface': '#FFFFFF',
            '--surface-2': '#F6EDEA',
            '--border': '#E7D4D0',

            '--text': '#1E1416',
            '--muted': '#5C4B4F',

            '--primary': '#8F2D1B',
            '--primary-hover': '#A63621',
            '--on-primary': '#FFFFFF',

            '--accent': '#6C4A78',
            '--highlight': '#F2D2A5'
        },
        desert: {
            mode: 'dark',
            '--bg': '#1E1A13',
            '--surface': '#272116',
            '--surface-2': '#312A1C',
            '--border': '#433825',

            '--text': '#FBF6EE',
            '--muted': '#D9D0C4',

            '--primary': '#A24D31',
            '--primary-hover': '#B35A3B',
            '--on-primary': '#FFFFFF',

            '--accent': '#ECC481',
            '--highlight': '#9E895F'
        },
        mother: {
            mode: 'dark',
            '--bg': '#070A14',
            '--surface': '#0E1326',
            '--surface-2': '#141B33',
            '--border': '#242E55',

            '--text': '#FDF3EB',
            '--muted': '#D3C9C6',

            '--primary': '#5B2A63',
            '--primary-hover': '#6B3475',
            '--on-primary': '#FFFFFF',

            '--accent': '#932549'
        },
        orchid: {
            mode: 'light',
            '--bg': '#FFF7FB',
            '--surface': '#FFFFFF',
            '--surface-2': '#F3EAF2',
            '--border': '#E6D3E2',

            '--text': '#1B1218',
            '--muted': '#5A4B55',

            '--primary': '#7E2A62',
            '--primary-hover': '#8E3270',
            '--on-primary': '#FFFFFF',

            '--accent': '#C34A8A',
            '--highlight': '#FFE3F1'
        },
        pearls: {
            mode: 'dark',
            '--bg': '#111424',
            '--surface': '#171A2F',
            '--surface-2': '#1D2140',
            '--border': '#2E3470',

            '--text': '#F6F3FF',
            '--muted': '#D8D4E8',

            '--primary': '#4A55B3',
            '--primary-hover': '#5A64C4',
            '--on-primary': '#FFFFFF',

            '--accent': '#AA74A0',
            '--highlight': '#E2C99E'
        },
        light: {
            mode: 'light',
            '--bg': '#ffffff',
            '--surface': '#f6f7f8',
            '--surface-2': '#ffffff',
            '--border': '#d1d5db',
            '--text': '#111827',
            '--muted': '#6b7280',
            '--primary': '#0ea5ff',
            '--primary-hover': '#0b8ad6',
            '--on-primary': '#ffffff',
            '--accent': '#2563eb'
        },
        dark: {
            mode: 'dark',
            '--bg': '#0b1220',
            '--surface': '#0f1724',
            '--surface-2': '#111827',
            '--border': '#0b0f16',
            '--text': '#e5e7eb',
            '--muted': '#9aa3b2',
            '--primary': '#8b5cf6',
            '--primary-hover': '#6f3ee8',
            '--on-primary': '#ffffff',
            '--accent': '#8b5cf6'
        }
    };

    function applyColorTheme(theme) {
        const def = COLOR_THEMES[theme];
        if (!def) return;
        try { console.info('Applying theme:', theme); } catch (e) { }
        document.body.setAttribute('data-color-theme', theme);
        // Apply semantic token variables
        Object.entries(def).forEach(([k, v]) => {
            try { document.documentElement.style.setProperty(k, v); } catch (e) { }
        });
        // Backwards compatibility: set --theme-color1..6 to a sensible mapping
        const legacyMap = ['--bg', '--surface', '--primary', '--text', '--muted', '--border'];
        for (let i = 0; i < legacyMap.length; i++) {
            const val = def[legacyMap[i]] || '#000000';
            document.documentElement.style.setProperty(`--theme-color${i + 1}`, val);
        }
                // Maintain legacy `data-theme` only for the canonical 'light' or 'dark' themes
                try {
                    if (theme === 'light' || theme === 'dark') {
                        document.body.setAttribute('data-theme', theme);
                    } else {
                        document.body.removeAttribute('data-theme');
                    }
                } catch (e) { }
        localStorage.setItem('colorTheme', theme);
    }

        // Expose API for other scripts (theme.js) to call
        try { window.applyColorTheme = applyColorTheme; } catch (e) { }

    // Restore theme on load
    const savedTheme = localStorage.getItem('colorTheme');
    if (savedTheme && COLOR_THEMES[savedTheme]) {
        applyColorTheme(savedTheme);
    }

    // Listen for theme picker clicks
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.theme-swatch');
        if (btn) {
            const theme = btn.getAttribute('data-theme');
            applyColorTheme(theme);
        }
    });
    const tabs = document.querySelectorAll('.tool-tab');
    const views = {
        home: document.getElementById('toolHome'),
        todo: document.getElementById('toolTodo'),
        note: document.getElementById('toolNote'),
        colors: document.getElementById('toolColors')
    };
    const KEY_TOOL = 'rightActiveTool';
    const SPLIT = true; // split mode: two panes visible
    const KEY_PINS = 'rightPinnedTools';
    const KEY_TOP = 'rightPaneTop';
    const KEY_BOTTOM = 'rightPaneBottom';
    const KEY_SPLIT = 'rightPaneSplit';
    function getPins() { try { return JSON.parse(localStorage.getItem(KEY_PINS) || '[]'); } catch { return [] } }
    function setPins(list) { localStorage.setItem(KEY_PINS, JSON.stringify(list)); }
    function isPinned(id) { return getPins().includes(id); }
    function togglePin(id) { const arr = getPins(); const i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id); setPins(arr); renderPins(); renderHome(); renderPinButtons(); }
    function setActive(name) {
        localStorage.setItem(KEY_TOOL, name);
        for (const b of tabs) {
            b.classList.toggle('active', b.getAttribute('data-tool') === name);
            if (window.svgIcon) {
                const t = b.getAttribute('data-tool');
                b.innerHTML = t === 'home' ? svgIcon('home') : t === 'todo' ? svgIcon('checklist') : t === 'note' ? svgIcon('note') : t === 'colors' ? svgIcon('palette') : '';
            }
        }
        // Show/hide panels
        if (views.colors) {
            views.colors.style.display = (name === 'colors') ? '' : 'none';
            // If the color tool panel contains only text, replace it with parsed HTML
            if (name === 'colors' && views.colors.textContent.trim().startsWith('<div')) {
                const temp = document.createElement('div');
                temp.innerHTML = views.colors.textContent;
                views.colors.innerHTML = '';
                while (temp.firstChild) views.colors.appendChild(temp.firstChild);
            }
        }
        if (views.note) views.note.style.display = (name === 'note') ? '' : 'none';
        if (views.todo) views.todo.style.display = (name === 'todo') ? '' : 'none';
        if (views.home) views.home.style.display = (name === 'home') ? '' : 'none';
        if (name === 'home') renderHome();
    }
    function renderPins() { document.querySelectorAll('.tool-pin').forEach(btn => { const id = btn.getAttribute('data-tool'); btn.classList.toggle('active', isPinned(id)); if (window.svgIcon) btn.innerHTML = svgIcon('pin', 14); }); }
    function renderHome() {
        const home = document.getElementById('toolHomePins'); if (!home) return; const pins = getPins(); const map = { todo: { icon: 'checklist', label: 'To-Do' }, note: { icon: 'note', label: 'Notepad' } };
        home.innerHTML = pins.length ? pins.map(id => `<button class="chip" data-open="${id}">${window.svgIcon ? svgIcon(map[id]?.icon || 'dot', 16) : ''} ${map[id]?.label || id}</button>`).join('') : '<div class="meta">No tools pinned. Open a tool and click its pin.</div>';
        home.querySelectorAll('button[data-open]').forEach(b => b.addEventListener('click', () => setActive(b.getAttribute('data-open') || 'home')));
    }
    // Initialize icons and clicks
    tabs.forEach(b => {
        const t = b.getAttribute('data-tool');
        if (window.svgIcon) {
            b.innerHTML = t === 'home' ? svgIcon('home') : t === 'todo' ? svgIcon('checklist') : t === 'note' ? svgIcon('note') : t === 'colors' ? svgIcon('palette') : '';
        }
        b.addEventListener('click', () => setActive(b.getAttribute('data-tool') || 'home'));
    });

    // Colors button logic
    const colorsBtn = document.getElementById('colorsToggle');
    if (colorsBtn) {
        colorsBtn.addEventListener('click', function () {
            setActive('colors');
        });
    }
    // Pin buttons
    document.querySelectorAll('.tool-pin').forEach(btn => btn.addEventListener('click', () => togglePin(btn.getAttribute('data-tool') || '')));
    renderPins();
    // Notepad autosave
    (function () { const ta = document.getElementById('toolNotepad'); if (!ta) return; const KEY = 'sessionNotes'; try { ta.value = localStorage.getItem(KEY) || ''; } catch { } ta.addEventListener('input', () => { try { localStorage.setItem(KEY, ta.value); } catch { } }); })();
    setActive(localStorage.getItem(KEY_TOOL) || 'home');

    // Per-pane selection and adjustable split (split mode)
    if (SPLIT) {
        // Import and initialize the right panel split resizer
        try {
            if (window.initPanelResizers) {
                window.initPanelResizers();
            } else if (typeof require === 'function') {
                require('./site/panels.js').initPanelResizers();
            }
        } catch (e) {
            // Fallback: do nothing if import fails
        }
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initRightPanel); else initRightPanel();
