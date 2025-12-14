// Right-click rename for section headings — stores per-user local overrides
(function () {
  const KEY = 'sectionRenames_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }
  function save(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch { }
  }

  function headingIdFor(el) {
    const tag = (el.tagName || '').toLowerCase();
    const orig = (el.getAttribute('data-original') || el.textContent || '').trim();
    // count index among same-tag headings with same original text for stability
    const all = Array.from(document.querySelectorAll('main.main ' + tag));
    let idx = 0; for (const h of all) {
      const t = (h.getAttribute('data-original') || h.textContent || '').trim();
      if (t === orig) {
        if (h === el) break; idx++; }
    }
    return `${location.pathname}::${tag}::${orig}::${idx}`;
  }

  function ensureOriginal(el) {
    if (!el.hasAttribute('data-original')) el.setAttribute('data-original', (el.textContent || '').trim());
  }

  // Apply stored renames to headings on the page
  let __rename_applying = false;
  function applyRenames() {
    if (__rename_applying) return;
    __rename_applying = true;
    try {
      const map = load();
      const headings = document.querySelectorAll('main.main h1, main.main h2, main.main h3, main.main h4, main.main h5, main.main h6');
      headings.forEach(h => {
        ensureOriginal(h);
        const id = headingIdFor(h);
        const custom = map[id];
        if (custom) {
          h.dataset._renamed = '1';
          h.textContent = custom;
        } else {
          if (h.dataset._renamed) {
            // restore original
            h.textContent = h.getAttribute('data-original') || h.textContent;
            delete h.dataset._renamed;
          }
        }
      });
    } finally {
      __rename_applying = false;
    }
  }

  // Simple context menu UI
  let menuEl = null;
  function makeMenu() {
    menuEl = document.createElement('div');
    menuEl.className = 'rename-section-menu';
    menuEl.style.position = 'absolute';
    menuEl.style.zIndex = 99999;
    menuEl.style.minWidth = '160px';
    menuEl.style.background = 'var(--panel-bg, #fff)';
    menuEl.style.border = '1px solid rgba(0,0,0,0.12)';
    menuEl.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    menuEl.style.padding = '6px 0';
    menuEl.style.borderRadius = '6px';
    menuEl.style.fontSize = '14px';
    menuEl.style.display = 'none';
    document.body.appendChild(menuEl);
    document.addEventListener('click', () => hideMenu());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideMenu(); });
  }

  function showMenu(x, y, headingEl) {
    if (!menuEl) makeMenu();
    menuEl.innerHTML = '';
    const rename = document.createElement('div');
    rename.textContent = 'Rename section…';
    rename.style.padding = '8px 12px'; rename.style.cursor = 'pointer';
    rename.addEventListener('click', (e) => {
      e.stopPropagation(); hideMenu(); doRename(headingEl);
    });
    const reset = document.createElement('div');
    reset.textContent = 'Reset name';
    reset.style.padding = '8px 12px'; reset.style.cursor = 'pointer';
    reset.addEventListener('click', (e) => { e.stopPropagation(); hideMenu(); doReset(headingEl); });
    menuEl.appendChild(rename); menuEl.appendChild(reset);
    menuEl.style.left = x + 'px'; menuEl.style.top = y + 'px'; menuEl.style.display = 'block';
  }
  function hideMenu() { if (menuEl) menuEl.style.display = 'none'; }

  function doRename(el) {
    ensureOriginal(el);
    const id = headingIdFor(el);
    const current = load()[id] || el.getAttribute('data-original') || '';
    const inp = window.prompt('Rename section (leave empty to clear):', current);
    if (inp === null) return; // cancelled
    const map = load();
    if (String(inp).trim() === '') {
      delete map[id];
    } else {
      map[id] = String(inp);
    }
    save(map);
    applyRenames();
  }

  function doReset(el) {
    const id = headingIdFor(el);
    const map = load(); delete map[id]; save(map); applyRenames();
  }

  function attach() {
    const container = document.querySelector('main.main') || document.body;
    if (!container) return;
    container.addEventListener('contextmenu', (e) => {
      const h = e.target.closest && e.target.closest('h1, h2, h3, h4, h5, h6');
      if (!h) return; // not a heading
      e.preventDefault(); e.stopPropagation(); const x = e.pageX; const y = e.pageY; showMenu(x, y, h);
    });
  }

  // When DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    try { applyRenames(); attach(); } catch (e) { console.error('rename-sections init failed', e); }
  });

  // Re-apply when content changes (very simple observer)
  const obs = new MutationObserver((mutations) => { if (!__rename_applying) applyRenames(); });
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });

})();
