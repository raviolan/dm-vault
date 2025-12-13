// nav-loader.js (from site/assets)
(function () {
  async function render() {
    const root = document.getElementById('navSections');
    if (!root) return;

    // Prefer dynamic server-generated sidebar so data/ changes appear immediately.
    try {
      const res = await fetch('/api/sidebar', { cache: 'no-store' });
      if (res.ok) {
        const html = await res.text();
        if (html && html.trim()) {
          root.innerHTML = html;
          return;
        }
      }
    } catch (err) {
      console.debug('nav-loader: /api/sidebar failed, falling back to nav.json', err);
    }

    // Fallback to static nav.json (build output)
    try {
      const res2 = await fetch('/assets/nav.json', { cache: 'no-store' });
      if (!res2.ok) return;
      const data = await res2.json();
      if (data && Array.isArray(data.sections) && data.sections.length) {
        const html = data.sections.map(sec => {
          const items = (sec.items || []).map(i => '<li><a class="nav-item" href="' + i.href + '"><span class="nav-icon">•</span><span class="nav-text">' + i.title + '</span></a></li>').join('');
          return '<li class="nav-group"><details class="nav-details ' + (sec.cls || '') + '" open><summary class="nav-label"><span class="nav-icon">' + (sec.icon || '') + '</span><span>' + sec.label + '</span></summary>' + (items ? ('<ul class="nav-list">' + items + '</ul>') : '') + '</details></li>';
        }).join('');
        root.innerHTML = html || root.innerHTML;
      }
    } catch (e) {
      console.debug('nav-loader: failed to load nav.json', e);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
