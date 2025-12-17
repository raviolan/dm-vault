// global-ui-loader.js
// Injects the global-ui partial and dispatches a custom event for modal rebinding
(function () {
    async function render() {
        try {
            const layout = document.querySelector('.layout');
            if (!layout) return;
            // If the page already contains a populated global-ui, do nothing.
            const existing = document.getElementById('site-global-ui');
            if (existing && existing.innerHTML.trim()) return;

            const res = await fetch('/assets/partials/global-ui.html', { cache: 'no-store' });
            if (!res.ok) return;
            const html = await res.text();
            if (!html || !html.trim()) return;
            // Insert global-ui at the correct slot
            let slot = document.getElementById('site-global-ui');
            if (!slot) {
                slot = document.createElement('div');
                slot.id = 'site-global-ui';
                layout.appendChild(slot);
            }
            slot.innerHTML = html;
            // Dispatch event for modal rebinding
            window.dispatchEvent(new CustomEvent('dm-global-ui-injected'));
        } catch (e) {
            console.debug('global-ui-loader: failed to load partial', e);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
