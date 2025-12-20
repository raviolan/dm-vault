// header-loader.js
// Safely injects the canonical header partial into pages that lack a populated .top

// header-loader.js
(function () {
    function hasTopContent() {
        var top = document.querySelector('.top');
        if (!top) return false;
        // Consider non-empty when it has child elements or non-whitespace text
        if (top.children.length > 0) return true;
        if (top.textContent && top.textContent.trim().length > 0) return true;
        return false;
    }

    function injectHeader() {
        var layout = document.querySelector('.layout');
        if (!layout) return;
        // If page already has .top with content, do nothing
        if (hasTopContent()) return;
        fetch('/assets/partials/header.html', { cache: 'no-cache' })
            .then(function (r) { if (!r.ok) throw new Error('header fetch failed'); return r.text(); })
            .then(function (html) {
                var temp = document.createElement('div');
                temp.innerHTML = html;
                var headerNode = temp.querySelector('.top') || temp.firstElementChild;
                if (!headerNode) return;
                layout.insertBefore(headerNode, layout.firstChild);
                window.dispatchEvent(new Event('dm-header-injected'));
            })
            .catch(function (err) { console.warn('header-loader:', err); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectHeader);
    } else {
        setTimeout(injectHeader, 0);
    }
})();
