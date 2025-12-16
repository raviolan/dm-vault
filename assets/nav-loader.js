// nav-loader.js (from site/assets)


(function () {
  if (window.__dm_nav_rendered) return;
  window.__dm_nav_rendered = true;

  async function render() {
    const root = document.getElementById('navSections');
    if (!root) return;

    // Try static nav.json first (static-first)
    let navBuilt = false;
    try {
      const res = await fetch('/assets/nav.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.sections) && data.sections.length) {
          const html = data.sections.map(sec => {
            const items = (sec.items || []).map(i => '<li><a class="nav-item" href="' + i.href + '"><span class="nav-icon">•</span><span class="nav-text">' + i.title + '</span></a></li>').join('');
            return '<li class="nav-group"><details class="nav-details ' + (sec.cls || '') + '" open><summary class="nav-label"><span class="nav-icon">' + (sec.icon || '') + '</span><span>' + sec.label + '</span></summary>' + (items ? ('<ul class="nav-list">' + items + '</ul>') : '') + '</details></li>';
          }).join('');
          root.innerHTML = html || root.innerHTML;
          navBuilt = true;
          window.dispatchEvent(new Event('dm-nav-inited'));
          return;
        }
      }
    } catch (e) {
      // ignore, try /api/sidebar next
    }

    // If nav.json fails, try /api/sidebar (optional, never throw)
    try {
      const res2 = await fetch('/api/sidebar', { cache: 'no-store' });
      if (res2.ok) {
        const html = await res2.text();
        if (html && html.trim()) {
          root.innerHTML = html;
          navBuilt = true;
          window.dispatchEvent(new Event('dm-nav-inited'));
          return;
        }
      }
    } catch (err) {
      // ignore
    }

    if (!navBuilt) {
      console.warn('nav-loader: Could not build navigation from nav.json or /api/sidebar.');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
