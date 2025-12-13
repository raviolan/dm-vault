// Right panel tools: tabs, pinning, notepad autosave, default home
function initRightPanel() {
    // Color theme definitions as token maps. Each theme provides semantic tokens:
    // --bg, --surface, --surface-2, --border, --text, --muted, --primary, --primary-hover, --on-primary, --accent
    // For backward compatibility we also set --theme-color1..6 (mapped to bg, surface, primary, text, muted, border).
    const COLOR_THEMES = {
        auburn: {
            '--bg': '#201216',
            '--surface': '#2A1A1E',
            '--surface-2': '#332126',
            '--border': '#4A2E35',

            '--text': '#F8F5F2',
            '--muted': '#D7CFCB',

            '--primary': '#B63A1B',
            '--primary-hover': '#C2472B',
            '--on-primary': '#FFFFFF',

            '--accent': '#B89DBB',
            '--highlight': '#F7C767'
        },
        desert: {
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
            '--bg': '#1A1017',
            '--surface': '#22161F',
            '--surface-2': '#2B1C28',
            '--border': '#473042',

            '--text': '#FFF7EC',
            '--muted': '#E3D7CB',

            '--primary': '#B63E7D',
            '--primary-hover': '#C54A88',
            '--on-primary': '#FFFFFF',

            '--accent': '#FFF0D2',
            '--olive': '#6C6A43'
        },
        pearls: {
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
        // Maintain legacy `data-theme` for light/dark CSS overrides
        if (theme === 'light' || theme === 'dark') {
            document.body.setAttribute('data-theme', theme);
        } else {
            document.body.removeAttribute('data-theme');
        }
        localStorage.setItem('colorTheme', theme);
    }

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
        const topBody = document.querySelector('.pane-body[data-pane="top"]');
        const bottomBody = document.querySelector('.pane-body[data-pane="bottom"]');
        function iconFor(tool) { return tool === 'home' ? (window.svgIcon ? svgIcon('home', 14) : 'H') : tool === 'todo' ? (window.svgIcon ? svgIcon('checklist', 14) : 'T') : (window.svgIcon ? svgIcon('note', 14) : 'N'); }
        function activatePane(pane, tool) {
            const body = pane === 'top' ? topBody : bottomBody;
            if (!body) return;
            const el = views[tool];
            if (!el) return;
            body.innerHTML = '';
            body.appendChild(el);
            // Ensure the appended element is visible (in case setActive previously hid it)
            try { el.style.display = ''; } catch (e) { }
            document.querySelectorAll('.pane-tab[data-pane="' + pane + '"]').forEach(b => {
                const t = b.getAttribute('data-tool');
                b.classList.toggle('active', t === tool);
                if (window.svgIcon) { b.innerHTML = iconFor(t); }
            });
            localStorage.setItem(pane === 'top' ? KEY_TOP : KEY_BOTTOM, tool);
            if (tool === 'home') renderHome();
        }
        // Init pane tab icons and clicks
        document.querySelectorAll('.pane-tab').forEach(b => { const t = b.getAttribute('data-tool'); if (window.svgIcon) b.innerHTML = iconFor(t); b.addEventListener('click', () => activatePane(b.getAttribute('data-pane') || 'top', t)); });
        // Ensure header Colors button also activates the top pane tab when clicked
        if (colorsBtn) {
            colorsBtn.addEventListener('click', () => activatePane('top', 'colors'));
        }
        const topSel = localStorage.getItem(KEY_TOP) || 'todo';
        const botSel = localStorage.getItem(KEY_BOTTOM) || 'note';
        activatePane('top', topSel);
        activatePane('bottom', botSel);
        // Adjustable split resizer
        (function () {
            const container = document.querySelector('.right-split');
            const res = document.querySelector('.pane-resizer-h'); if (!container || !res) return;
            const saved = localStorage.getItem(KEY_SPLIT);
            // Initialize and clamp
            function initSplit() {
                const rect = container.getBoundingClientRect();
                const minPx = 120; const maxPx = Math.max(minPx, rect.height - 120);
                // Use a smaller default top pane height so the bottom To-Do has more room
                let val = '30%';
                if (saved && /^(\d+)(px|%)$/.test(saved)) {
                    if (saved.endsWith('%')) {
                        const pct = parseFloat(saved); let px = rect.height * ((isNaN(pct) ? 50 : pct) / 100);
                        if (px < minPx) px = Math.min(rect.height / 2, minPx); if (px > maxPx) px = Math.max(rect.height / 2, maxPx);
                        val = px + 'px';
                    } else {
                        let px = parseFloat(saved); if (isNaN(px)) px = rect.height / 2;
                        if (px < minPx) px = Math.min(rect.height / 2, minPx); if (px > maxPx) px = Math.max(rect.height / 2, maxPx);
                        val = px + 'px';
                    }
                }
                container.style.setProperty('--pane-top-h', val);
            }
            initSplit();
            function onDown(e) {
                e.preventDefault(); const rect = container.getBoundingClientRect(); const startY = e.clientY; const cur = getComputedStyle(container).getPropertyValue('--pane-top-h').trim(); const startPx = cur.endsWith('%') ? rect.height * parseFloat(cur) / 100 : parseFloat(cur) || (rect.height / 2);
                function onMove(ev) { const dy = ev.clientY - startY; let h = startPx + dy; const min = 120; const max = rect.height - 120; if (h < min) h = min; if (h > max) h = max; const val = h + 'px'; container.style.setProperty('--pane-top-h', val); try { localStorage.setItem(KEY_SPLIT, val); } catch { } }
                function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
                document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
            }
            res.addEventListener('mousedown', onDown);
        })();
    }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initRightPanel); else initRightPanel();
