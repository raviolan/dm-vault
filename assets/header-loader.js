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
