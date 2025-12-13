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

            // After inserting the header, ensure the search UI is wired up.
            (function attachSearchBindings() {
                try {
                    var searchBox = document.getElementById('searchBox');
                    var results = document.getElementById('searchResults');
                    if (!searchBox) return;

                    // If a dedicated SearchModule is present, initialize it.
                    if (window.SearchModule && typeof window.SearchModule.init === 'function') {
                        try { window.SearchModule.init(); } catch (e) { console.warn('SearchModule.init failed', e); }
                        return;
                    }

                    // Fallback: wire up global doSearch (legacy in-site implementation)
                    if (typeof window.doSearch === 'function') {
                        // avoid duplicate listeners
                        if (!searchBox._hasHeaderLoaderSearch) {
                            searchBox.addEventListener('input', function (e) { window.doSearch(e.target.value); });
                            searchBox.addEventListener('keydown', function (e) {
                                if (e.key === 'Enter') {
                                    var q = searchBox.value && searchBox.value.trim();
                                    if (q) window.location.href = '/search.html?q=' + encodeURIComponent(q);
                                }
                            });
                            // Cmd/Ctrl+K focuses the search box
                            document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchBox.focus(); } });
                            searchBox._hasHeaderLoaderSearch = true;
                        }
                    }
                } catch (e) {
                    console.debug('header-loader attachSearchBindings error', e);
                }
            })();
        } catch (e) {
            console.debug('header-loader: failed to load partial', e);
        }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
