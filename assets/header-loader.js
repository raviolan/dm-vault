// header-loader.js
// Safely injects the canonical header partial into pages that lack a populated .top
(function () {
    function hasTopContent() {
        var top = document.querySelector('.top');
        if (!top) return false;
        // Consider non-empty when it has child elements or non-whitespace text
        if (top.children.length > 0) return true;
        if (top.textContent && top.textContent.trim().length > 0) return true;
        return false;
    }

    function fetchAndInsertHeader() {
        var layout = document.querySelector('.layout');
        if (!layout) return;
        fetch('/assets/partials/header.html', { cache: 'no-cache' })
            .then(function (r) { if (!r.ok) throw new Error('header fetch failed'); return r.text(); })
            .then(function (html) {
                var temp = document.createElement('div');
                temp.innerHTML = html;
                var headerNode = temp.querySelector('.top') || temp.firstElementChild;
                if (!headerNode) return;
                // If page already has .top with content, do nothing
                if (hasTopContent()) return;
                layout.insertBefore(headerNode, layout.firstChild);
            })
            .catch(function (err) { console.warn('header-loader:', err); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fetchAndInsertHeader);
    } else {
        // If DOM already ready, run after a tick to avoid clobbering in-progress scripts
        setTimeout(fetchAndInsertHeader, 0);
    }
})();
// header-loader.js
(function () {
    async function render() {
        try {
            const layout = document.querySelector('.layout');
            if (!layout) return;
            // If the page already contains a populated top bar, do nothing.
            const existing = layout.querySelector('.top');
            if (existing && existing.innerHTML.trim()) return;

            const res = await fetch('/assets/partials/header.html', { cache: 'no-store' });
            if (!res.ok) return;
            const html = await res.text();
            if (!html || !html.trim()) return;
            // Insert header at the top of the layout
            layout.insertAdjacentHTML('afterbegin', html);
        } catch (e) {
            console.debug('header-loader: failed to load partial', e);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
