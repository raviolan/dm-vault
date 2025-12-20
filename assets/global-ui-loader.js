// global-ui-loader.js
// Injects the global-ui partial and dispatches a custom event for modal rebinding
(function () {
    async function render() {
        try {
            const layout = document.querySelector('.layout');
            if (!layout) return;

            // If the page already contains populated sidebars, do nothing.
            const leftSidebar = document.getElementById('site-left-sidebar');
            const rightSidebar = document.getElementById('site-right-sidebar');
            if (leftSidebar && leftSidebar.innerHTML.trim() && rightSidebar && rightSidebar.innerHTML.trim()) return;

            const res = await fetch('/assets/partials/global-ui.html', { cache: 'no-store' });
            if (!res.ok) return;
            const html = await res.text();
            if (!html || !html.trim()) return;
            // Parse the fetched HTML into a DOM
            const temp = document.createElement('div');
            temp.innerHTML = html;

            // Extract left and right sidebars
            const left = temp.querySelector('aside.left');
            const right = temp.querySelector('aside.right');
            if (leftSidebar && left) leftSidebar.innerHTML = left.innerHTML;
            if (rightSidebar && right) rightSidebar.innerHTML = right.innerHTML;

            // Optionally inject overlays/modals/footer if needed
            // (Assume overlays are everything except .left and .right)
            let overlays = temp.cloneNode(true);
            const leftEl = overlays.querySelector('aside.left');
            if (leftEl) leftEl.remove();
            const rightEl = overlays.querySelector('aside.right');
            if (rightEl) rightEl.remove();
            // Place overlays in a global overlays div if needed
            let overlaysDiv = document.getElementById('site-global-overlays');
            if (!overlaysDiv) {
                overlaysDiv = document.createElement('div');
                overlaysDiv.id = 'site-global-overlays';
                document.body.appendChild(overlaysDiv);
            }
            overlaysDiv.innerHTML = overlays.innerHTML;
            // Dispatch event for modal rebinding
            window.dispatchEvent(new CustomEvent('dm-global-ui-injected'));
        } catch (e) {
            console.debug('global-ui-loader: failed to load partial', e);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
