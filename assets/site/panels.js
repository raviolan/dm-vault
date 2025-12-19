// assets/site/panels.js
// Panel resizer logic extracted from right-panel.js
// Exports: initPanelResizers()

function initPanelResizers() {
    // Right panel split resizer logic
    const container = document.querySelector('.right-split');
    const res = document.querySelector('.pane-resizer-h');
    const KEY_SPLIT = 'rightPaneSplit';
    if (!container || !res) return;
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
}

// Export for ES modules and expose for legacy global usage
try { window.initPanelResizers = initPanelResizers; } catch (e) {}
export { initPanelResizers };
