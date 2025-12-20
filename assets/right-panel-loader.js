// right-panel-loader.js
(function () {
    async function render() {
        try {
            const root = document.querySelector('.right');
            if (!root) return;
            // If the right aside already contains a drawer, assume it's been provided per-page and do nothing.
            if (root.querySelector('.drawer')) return;
            const res = await fetch('/assets/partials/right-panel.html', { cache: 'no-store' });
            if (!res.ok) return;
            const html = await res.text();
            root.innerHTML = html;
            root.dataset.dmInjected = '1';
            window.dispatchEvent(new Event('dm-right-panel-injected'));
            window.dispatchEvent(new CustomEvent('dm:right-panel:ready'));
            // Loader is injection-only; no behavior binding here.
        } catch (e) {
            console.error('right-panel-loader: failed to load partial', e);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
