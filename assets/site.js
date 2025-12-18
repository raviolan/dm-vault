// --- Delegated modals: survives DOM replacement/injection ---
// --- Delegated modals: survives DOM replacement/injection ---
(function () {
  if (window.__dmDelegatedModalsInit) return;
  window.__dmDelegatedModalsInit = true;

  document.addEventListener('submit', async function (e) {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;

    // Create
    if (form.id === 'createPageForm') {
      e.preventDefault();

      const status = $('createPageStatus');
      const submitBtn = form.querySelector('button[type="submit"]');
      showStatus(status, 'Creating page...', 'loading');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch('/api/create-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: form.elements['title']?.value,
            parent: form.elements['parent']?.value
          })
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.url) {
          showStatus(status, 'Page created! Redirecting...', 'success');
          setTimeout(() => { window.location.href = data.url; }, 500);
        } else {
          showStatus(status, data.error || 'Failed to create page', 'error');
          if (submitBtn) submitBtn.disabled = false;
        }
      } catch (err) {
        showStatus(status, 'Network error: ' + err.message, 'error');
        if (submitBtn) submitBtn.disabled = false;
      }
    }

    // Delete
    if (form.id === 'deletePageForm') {
      e.preventDefault();

      const confirmInput = $('deletePageConfirm');
      const status = $('deletePageStatus');
      const submitBtn = form.querySelector('button[type="submit"]');

      const expectedTitle = confirmInput?.dataset.expectedTitle || '';
      const enteredTitle = (confirmInput?.value || '').trim();

      if (enteredTitle !== expectedTitle) {
        showStatus(status, 'Title does not match. Please type the exact title to confirm deletion.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (confirmInput) confirmInput.disabled = true;
      showStatus(status, 'Deleting page...', 'loading');

      try {
        const res = await fetch('/api/delete-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: window.location.pathname })
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          showStatus(status, 'Page deleted! Redirecting to dashboard...', 'success');
          setTimeout(() => { window.location.href = '/index.html'; }, 800);
        } else {
          showStatus(status, data.error || 'Failed to delete page', 'error');
          if (submitBtn) submitBtn.disabled = false;
          if (confirmInput) confirmInput.disabled = false;
        }
      } catch (err) {
        showStatus(status, 'Network error: ' + err.message, 'error');
        if (submitBtn) submitBtn.disabled = false;
        if (confirmInput) confirmInput.disabled = false;
      }
    }
  }, true);
})();
// Sidebar now ships in-page via partials. Initialize behaviors on DOM ready and after partial injection events.
function dmSidebarInit() {
  // Find the sidebar root (injected container)
  const root = document.querySelector('.left');
  if (!root) return;
  if (root.dataset.dmSidebarBound === "1") return;
  root.dataset.dmSidebarBound = "1";
  try { bindRecents(root); } catch { }
  try { bindNavQuickFilter(root); } catch { }
  try { bindSectionMiniFilters(root); } catch { }
  try { bindOnlySectionToggle(root); } catch { }
  try { bindLeftDrawer(root); } catch { }
  try { window.initializeFavorites && window.initializeFavorites(); } catch { }
  try { window.initializeSidebar && window.initializeSidebar(); } catch { }
  try { window.initializeNavSectionState && window.initializeNavSectionState(); } catch { }
  try { window.addKeyboardShortcuts && window.addKeyboardShortcuts(); } catch { }
  try { bindSplitClickNavigation && bindSplitClickNavigation(root); } catch { }
}
function dmHeaderInit() {
  // Find the header root (injected container)
  const root = document.querySelector('.header, header, .entity-header');
  if (!root) return;
  if (root.dataset.dmHeaderBound === "1") return;
  root.dataset.dmHeaderBound = "1";
  // Only bind header-related actions (Edit/New/Delete/etc)
  try { window.addKeyboardShortcuts && window.addKeyboardShortcuts(); } catch { }
  // Add more header-specific initializers if needed
}

document.addEventListener('DOMContentLoaded', () => {
  dmSidebarInit();
  dmHeaderInit();
});
window.addEventListener('dm-sidebar-injected', dmSidebarInit);
window.addEventListener('dm-header-injected', dmHeaderInit);

// --- Split-Click Navigation for Category Landing Pages ---
function bindSplitClickNavigation(leftRoot) {
  if (!leftRoot) return;
  const container = leftRoot.querySelector('#navSections') || leftRoot.querySelector('.nav');
  if (!container) return;
  if (container.dataset.dmSplitClickBound === "1") return;
  container.dataset.dmSplitClickBound = "1";
  const categoryMapping = {
    'Characters': '/Characters.html',
    'NPCs': '/NPCs.html',
    'Locations': '/Locations.html',
    // support nav label 'World' (some nav.json uses 'World' instead of 'Locations')
    'World': '/Locations.html',
    'Arcs': '/Arcs.html',
    '03_Sessions': '/03_Sessions.html',
    'Campaign': '/03_Sessions.html',
    'Tools': '/Tools.html'
  };
  container.addEventListener('click', (e) => {
    const summary = e.target.closest && e.target.closest('summary.nav-label');
    if (!summary) return;
    const labelSpan = summary.querySelector('span:last-child');
    const labelText = labelSpan ? labelSpan.textContent.trim() : '';
    const landingPage = categoryMapping[labelText];
    if (!landingPage) return;
    const rect = summary.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width || 1;
    const clickedRightHalf = clickX > width / 2;
    if (clickedRightHalf) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = landingPage;
    }
    // left half: allow default toggle behavior
  });
}

// WYSIWYG editor moved to assets/wysiwyg.js
const byId = (id) => document.getElementById(id);
// Inline SVG icons for client-side rendering
function svgIcon(name, size = 16) {
  const p = (d) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
  switch (name) {
    case 'home': return p('M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z');
    case 'clock': return p('M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3V7z');
    case 'star': return p('M12 2l3.1 6.3 7 .9-5.1 4.9 1.3 6.9L12 17.8 5.7 21l1.3-6.9L2 9.2l7-.9L12 2z');
    case 'star-fill': return p('M12 2l3.1 6.3 7 .9-5.1 4.9 1.3 6.9L12 17.8 5.7 21l1.3-6.9L2 9.2l7-.9L12 2z');
    case 'pin': return p('M12 2a6 6 0 016 6c0 4-6 12-6 12S6 12 6 8a6 6 0 016-6zm0 8a2 2 0 110-4 2 2 0 010 4z');
    case 'checklist': return p('M4 6h9v2H4V6zm0 6h9v2H4v-2zm11-7l3 3-1.5 1.5L14.5 7.5 13 9l-1.5-1.5L14.5 4z');
    case 'note': return p('M6 3h9a2 2 0 012 2v14l-4-3-4 3V5a2 2 0 00-2-2z');
    case 'bookmark': return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4h12v18l-6-4-6 4V4z"/></svg>`;
    case 'bookmark-fill': return p('M6 4h12v18l-6-4-6 4V4z');
    default: return p('');
  }
}
window.svgIcon = svgIcon;
const searchBox = byId('searchBox'); const results = byId('searchResults');
const urlFor = (id) => '/' + id.replace(/\\/g, '/').replace(/\.md$/i, '.html').split('/').map(encodeURIComponent).join('/');
let INDEX = []; let NOTES = [];
fetch('/search-index.json').then(r => r.json()).then(d => INDEX = d);
fetch('/notes.json').then(r => r.json()).then(d => NOTES = d);

function doSearch(q) {
  q = q.trim().toLowerCase(); if (!q) { results.style.display = 'none'; return }
  const isTag = q.startsWith('#'); const term = isTag ? q.slice(1) : q; const out = [];
  for (const it of INDEX) {
    const hit = isTag ? (it.tags || []).some(t => t.toLowerCase().includes(term)) : (it.title.toLowerCase().includes(term) || (it.headings || []).some(h => h.toLowerCase().includes(term)));
    if (hit) out.push(it); if (out.length > 20) break;
  }
  if (!out.length) { results.style.display = 'none'; return }
  results.innerHTML = out.map(function (it) {
    const preview = (it.headings || [])[0] || ''; // First heading as preview
    const previewHtml = preview ? '<div class="search-preview">' + preview.slice(0, 100) + (preview.length > 100 ? '...' : '') + '</div>' : '';
    return '<div class="search-result"><a href="' + ('/' + it.id.replace(/\\/g, '/').replace(/\.md$/i, '.html').split('/').map(encodeURIComponent).join('/')) + '\">' + it.title + '</a> <span class="meta">' + ((it.tags || []).map(function (t) { return '#' + t }).join(' ')) + '</span>' + previewHtml + '</div>';
  }).join('');
  results.style.display = 'block';
}
if (searchBox) {
  searchBox.addEventListener('input', () => doSearch(searchBox.value));
  searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchBox.value.trim();
      if (query) {
        window.location.href = '/search.html?q=' + encodeURIComponent(query);
      }
    }
  });
}
document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchBox && searchBox.focus(); } });

// Global keyboard shortcuts
let blurred = false;

console.log('[Shortcuts] Initializing global keyboard shortcuts');

document.addEventListener('keydown', (e) => {
  // Skip if typing in input/textarea (except for Cmd+S and blur)
  const isTyping = e.target && /input|textarea/i.test(e.target.tagName) && !e.target.classList.contains('inplace-wysiwyg-editor');
  const isEditMode = document.querySelector('.inplace-wysiwyg-editor');

  // Debug logging
  if (e.altKey || (e.metaKey && e.key.toLowerCase() === 's')) {
    console.log('[Shortcuts] Key pressed:', {
      key: e.key,
      code: e.code,
      altKey: e.altKey,
      metaKey: e.metaKey,
      ctrlKey: e.ctrlKey,
      isTyping,
      isEditMode: !!isEditMode
    });
  }

  // Option+B: Blur/unblur screen (works everywhere)
  if (e.altKey && e.code === 'KeyB') {
    console.log('[Shortcuts] Blur/unblur triggered');
    e.preventDefault();
    blurred = !blurred;
    if (blurred) {
      document.body.style.filter = 'blur(8px)';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.filter = '';
      document.body.style.userSelect = '';
    }
    return;
  }

  // Skip other shortcuts if typing (except blur)
  if (isTyping && !(e.metaKey || e.ctrlKey)) return;

  // Cmd+S: Save and exit edit mode (only in edit mode)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' && isEditMode) {
    console.log('[Shortcuts] Save triggered');
    e.preventDefault();
    const saveBtn = document.querySelector('.btn-primary');
    if (saveBtn && !saveBtn.disabled) {
      saveBtn.click();
    }
    return;
  }

  // Skip remaining shortcuts if typing
  if (isTyping) return;

  // Option+C: Collapse all nav sections except current
  if (e.altKey && e.code === 'KeyC') {
    console.log('[Shortcuts] Collapse except current triggered');
    e.preventDefault();
    const currentPath = window.location.pathname;
    const allDetails = document.querySelectorAll('.left .nav-details');

    console.log('[Shortcuts] Found details elements:', allDetails.length);

    allDetails.forEach(det => {
      const links = det.querySelectorAll('a.nav-item');
      const isCurrentSection = [...links].some(link => link.getAttribute('href') === currentPath);

      if (!isCurrentSection) {
        det.open = false;
      } else {
        det.open = true;
      }
    });
    return;
  }

  // Option+Q: Collapse ALL nav sections
  if (e.altKey && e.code === 'KeyQ') {
    console.log('[Shortcuts] Collapse all triggered');
    e.preventDefault();
    const allDetails = document.querySelectorAll('.left .nav-details');
    console.log('[Shortcuts] Found details elements:', allDetails.length);
    allDetails.forEach(det => {
      det.open = false;
    });
    return;
  }

  // Option+D: Toggle bookmark for current page
  if (e.altKey && e.code === 'KeyD') {
    console.log('[Shortcuts] Bookmark toggle triggered');
    e.preventDefault();
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    console.log('[Shortcuts] Bookmark button:', bookmarkBtn);
    if (bookmarkBtn) {
      bookmarkBtn.click();
    }
    return;
  }
});

const hover = document.createElement('div'); hover.className = 'hovercard'; document.body.appendChild(hover);
document.body.addEventListener('mousemove', (e) => { hover.style.left = (e.pageX + 12) + 'px'; hover.style.top = (e.pageY + 12) + 'px'; });
document.body.addEventListener('mouseover', (e) => { const a = e.target.closest('a'); if (!a || !a.href || !a.pathname.endsWith('.html')) { hover.style.display = 'none'; return } if (a.closest('.left')) { hover.style.display = 'none'; return; } const id = decodeURIComponent(a.pathname.replace(/^\//, '')).replace(/\.html$/i, '.md'); const n = NOTES.find(n => n.id === id); if (n) { hover.innerHTML = '<strong>' + n.title + '</strong><div class="meta">' + ((n.tags || []).map(t => '#' + t).join(' ')) + '</div>'; hover.style.display = 'block'; } });
document.body.addEventListener('mouseout', () => { hover.style.display = 'none' });

window.togglePin = function (rel) { const pins = JSON.parse(localStorage.getItem('pins') || '[]'); const i = pins.indexOf(rel); if (i >= 0) pins.splice(i, 1); else pins.push(rel); localStorage.setItem('pins', JSON.stringify(pins)); const el = document.querySelector('[data-pin]'); if (el) el.innerHTML = pins.includes(rel) ? svgIcon('star-fill') : svgIcon('star'); }

// Color-code tags to match node colors
(function () {
  const map = (name) => {
    if (name === 'pc') return 'tag-pc';
    if (name === 'npc') return 'tag-npc';
    if (name === 'location') return 'tag-location';
    if (name === 'arc' || name === 'planning') return 'tag-arc';
    return null;
  };
  document.querySelectorAll('.tag').forEach(a => {
    const txt = (a.textContent || '').trim();
    const name = txt.startsWith('#') ? txt.slice(1) : txt;
    const cls = map(name);
    if (cls) a.classList.add(cls);
  });
})();

// Integrated Edit (inplace) — use createInplaceEditor when available
(function () {
  const btnOpen = document.getElementById('btnEditPage');
  if (!btnOpen) return;

  btnOpen.addEventListener('click', () => {
    // If an editor is already open, focus it
    const existing = document.querySelector('.inplace-wysiwyg-editor');
    if (existing) { existing.focus(); return; }

    const main = document.querySelector('main.main') || document.querySelector('article') || document.body;
    if (!main) return;

    if (window.createInplaceEditor) {
      window.createInplaceEditor(main, { noReload: false });
      return;
    }

    // Fallback: open modal-based editor if WYSIWYG not available
    const modal = document.getElementById('editPageModal');
    const ta = document.getElementById('editPageContent');
    if (!modal || !ta) return;
    ta.value = main.innerHTML;
    modal.style.display = 'flex';
  });
})();
// Resizable side panels (drag to adjust --left-w and --right-w)
(function () {
  const left = document.querySelector('.resizer-left');
  const right = document.querySelector('.resizer-right');
  if (!left || !right) return;
  const root = document.documentElement;
  const KEY_L = 'panelLeftW'; const KEY_R = 'panelRightW';
  // Restore saved widths
  try { const lw = parseInt(localStorage.getItem(KEY_L) || '0', 10); if (lw) root.style.setProperty('--left-w', lw + 'px'); } catch { }
  try { const rw = parseInt(localStorage.getItem(KEY_R) || '0', 10); if (rw) root.style.setProperty('--right-w', rw + 'px'); } catch { }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function onDrag(which, ev) {
    ev.preventDefault(); function move(e) { if (which === 'left') { const x = e.clientX; const min = 180; const max = window.innerWidth - (parseInt(getComputedStyle(root).getPropertyValue('--right-w')) || 340) - 300; const w = clamp(x, min, max); root.style.setProperty('--left-w', w + 'px'); try { localStorage.setItem(KEY_L, String(w)); } catch { } } else { const x = e.clientX; const min = 220; const max = window.innerWidth - (parseInt(getComputedStyle(root).getPropertyValue('--left-w')) || 300) - 300; const w = clamp(window.innerWidth - x, min, max); root.style.setProperty('--right-w', w + 'px'); try { localStorage.setItem(KEY_R, String(w)); } catch { } } }
    function up() { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); }
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  }
  left.addEventListener('mousedown', onDrag.bind(null, 'left'));
  right.addEventListener('mousedown', onDrag.bind(null, 'right'));
})();

// Inject Save Session button at the end of the top bar (to the right of search)
(function () {
  const topBar = document.querySelector('.top');
  if (!topBar) return;
  if (document.getElementById('saveSession')) return;
  const frag = document.createDocumentFragment();
  const btnSave = document.createElement('button');
  btnSave.id = 'saveSession'; btnSave.className = 'chip primary'; btnSave.textContent = 'Save Session'; btnSave.title = 'Save Session';
  btnSave.addEventListener('click', () => window.saveSessionSnapshot && window.saveSessionSnapshot());
  const btnFav = document.createElement('button');
  btnFav.id = 'bookmarkPage'; btnFav.className = 'chip'; btnFav.textContent = 'Bookmark'; btnFav.title = 'Bookmark this page';
  btnFav.addEventListener('click', () => addFavorite());
  frag.appendChild(btnFav); frag.appendChild(btnSave);
  const searchWrap = document.querySelector('.top .search');
  if (searchWrap && searchWrap.nextSibling) { topBar.insertBefore(frag, searchWrap.nextSibling); } else { topBar.appendChild(frag); }
})();

// Global Drawer (toggle + pin + adaptive layout)
(function () {
  const right = document.querySelector('.right');
  if (!right) return;
  const toggle = document.getElementById('drawerToggle');
  const reveal = document.getElementById('drawerReveal');
  const pin = document.getElementById('drawerPin');
  const KEY_PIN = 'drawerPinned';
  const KEY_OPEN = 'drawerOpen';
  function applyState() {
    const pinned = JSON.parse(localStorage.getItem(KEY_PIN) || 'false');
    const open = JSON.parse(localStorage.getItem(KEY_OPEN) || 'true');
    if (pin) { pin.innerHTML = window.svgIcon && window.svgIcon('pin', 16) || 'Pin'; pin.setAttribute('aria-pressed', String(pinned)); pin.classList.toggle('active', pinned); }
    const shouldOpen = pinned ? true : open;
    document.body.classList.toggle('drawer-collapsed', !shouldOpen);
  }
  toggle?.addEventListener('click', () => { const cur = JSON.parse(localStorage.getItem(KEY_OPEN) || 'true'); localStorage.setItem(KEY_OPEN, JSON.stringify(!cur)); applyState(); });
  pin?.addEventListener('click', () => { const cur = JSON.parse(localStorage.getItem(KEY_PIN) || 'false'); const next = !cur; localStorage.setItem(KEY_PIN, JSON.stringify(next)); if (next) { localStorage.setItem(KEY_OPEN, 'true'); } applyState(); });
  reveal?.addEventListener('click', () => { localStorage.setItem(KEY_OPEN, 'true'); applyState(); });
  applyState();
})();

// Right panel tools: tabs, pinning, notepad autosave, default home
// Moved to assets/right-panel.js
/* (function () {
  const tabs = document.querySelectorAll('.tool-tab');
  const views = {
    home: document.getElementById('toolHome'),
    todo: document.getElementById('toolTodo'),
    note: document.getElementById('toolNote')
  };
  const KEY_TOOL = 'rightActiveTool';
  const SPLIT = true; // split mode: two panes visible
  const KEY_PINS = 'rightPinnedTools';
  const KEY_TOP = 'rightPaneTop';
  const KEY_BOTTOM = 'rightPaneBottom';
  const KEY_SPLIT = 'rightPaneSplit';
  function getPins() { try { return JSON.parse(localStorage.getItem(KEY_PINS) || '[]'); } catch { return [] } }
  function setPins(list) { localStorage.setItem(KEY_PINS, JSON.stringify(list)); }
  function isPinned(id) { return getPins().includes(id); }
  function togglePin(id) { const arr = getPins(); const i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id); setPins(arr); renderPins(); renderHome(); renderPinButtons(); }
  function setActive(name) {
    localStorage.setItem(KEY_TOOL, name); for (const b of tabs) { b.classList.toggle('active', b.getAttribute('data-tool') === name); if (window.svgIcon) { const t = b.getAttribute('data-tool'); b.innerHTML = t === 'home' ? svgIcon('home') : t === 'todo' ? svgIcon('checklist') : svgIcon('note'); } }
    if (SPLIT) { // always show todo + note in split mode
      views.home && views.home.classList.remove('active');
      views.todo && views.todo.classList.add('active');
      views.note && views.note.classList.add('active');
      renderHome();
    } else {
      for (const k in views) { if (views[k]) views[k].classList.toggle('active', k === name); }
      if (name === 'home') renderHome();
    }
  }
  function renderPins() { document.querySelectorAll('.tool-pin').forEach(btn => { const id = btn.getAttribute('data-tool'); btn.classList.toggle('active', isPinned(id)); if (window.svgIcon) btn.innerHTML = svgIcon('pin', 14); }); }
  function renderHome() {
    const home = document.getElementById('toolHomePins'); if (!home) return; const pins = getPins(); const map = { todo: { icon: 'checklist', label: 'To-Do' }, note: { icon: 'note', label: 'Notepad' } };
    home.innerHTML = pins.length ? pins.map(id => `<button class="chip" data-open="${id}">${window.svgIcon ? svgIcon(map[id]?.icon || 'dot', 16) : ''} ${map[id]?.label || id}</button>`).join('') : '<div class="meta">No tools pinned. Open a tool and click its pin.</div>';
    home.querySelectorAll('button[data-open]').forEach(b => b.addEventListener('click', () => setActive(b.getAttribute('data-open') || 'home')));
  }
  // Initialize icons and clicks
  tabs.forEach(b => {
    const t = b.getAttribute('data-tool'); if (window.svgIcon) { b.innerHTML = t === 'home' ? svgIcon('home') : t === 'todo' ? svgIcon('checklist') : svgIcon('note'); }
    b.addEventListener('click', () => setActive(b.getAttribute('data-tool') || 'home'));
  });
  // Pin buttons
  document.querySelectorAll('.tool-pin').forEach(btn => btn.addEventListener('click', () => togglePin(btn.getAttribute('data-tool') || '')));
  renderPins();
  // Notepad autosave
  (function () { const ta = document.getElementById('toolNotepad'); if (!ta) return; const KEY = 'sessionNotes'; try { ta.value = localStorage.getItem(KEY) || ''; } catch { } ta.addEventListener('input', () => { try { localStorage.setItem(KEY, ta.value); } catch { } }); })();
  setActive(localStorage.getItem(KEY_TOOL) || 'home');

  // Per-pane selection and adjustable split (split mode)
  if (SPLIT) {
    const topBody = document.querySelector('.pane-body[data-pane="top"]');
    const bottomBody = document.querySelector('.pane-body[data-pane="bottom"]');
    function iconFor(tool) { return tool === 'home' ? (window.svgIcon ? svgIcon('home', 14) : 'H') : tool === 'todo' ? (window.svgIcon ? svgIcon('checklist', 14) : 'T') : (window.svgIcon ? svgIcon('note', 14) : 'N'); }
    function activatePane(pane, tool) { const body = pane === 'top' ? topBody : bottomBody; if (!body) return; const el = views[tool]; if (!el) return; body.innerHTML = ''; body.appendChild(el); document.querySelectorAll('.pane-tab[data-pane="' + pane + '"]').forEach(b => { const t = b.getAttribute('data-tool'); b.classList.toggle('active', t === tool); if (window.svgIcon) { b.innerHTML = iconFor(t); } }); localStorage.setItem(pane === 'top' ? KEY_TOP : KEY_BOTTOM, tool); if (tool === 'home') renderHome(); }
    // Init pane tab icons and clicks
    document.querySelectorAll('.pane-tab').forEach(b => { const t = b.getAttribute('data-tool'); if (window.svgIcon) b.innerHTML = iconFor(t); b.addEventListener('click', () => activatePane(b.getAttribute('data-pane') || 'top', t)); });
    const topSel = localStorage.getItem(KEY_TOP) || 'todo';
    const botSel = localStorage.getItem(KEY_BOTTOM) || 'note';
    activatePane('top', topSel);
    activatePane('bottom', botSel);
    // Adjustable split resizer
    (function () {
      const container = document.querySelector('.right-split');
      const res = document.querySelector('.pane-resizer-h'); if (!container || !res) return;
      const saved = localStorage.getItem(KEY_SPLIT);
      // Initialize and clamp
      (function initSplit() {
        const rect = container.getBoundingClientRect();
        const minPx = 120; const maxPx = Math.max(minPx, rect.height - 120);
        let val = '50%';
        if (saved && /^(\d+)(px|%)$/.test(saved)) {
          if (saved.endsWith('%')) {
            const pct = parseFloat(saved); let px = rect.height * ((isNaN(pct) ? 50 : pct) / 100);
            if (px < minPx) px = Math.min(rect.height / 2, minPx); if (px > maxPx) px = Math.max(rect.height / 2, maxPx);
            val = px + 'px';
          } else {
            let px = parseFloat(saved); if (isNaN(px)) px = rect.height / 2;
            if (px < minPx) px = Math.min(rect.height / 2, minPx); if (px > maxPx) px = Math.max(rect.height / 2, maxPx);
            val = px + 'px';
          }
        }
        container.style.setProperty('--pane-top-h', val);
      })();
      function onDown(e) {
        e.preventDefault(); const rect = container.getBoundingClientRect(); const startY = e.clientY; const cur = getComputedStyle(container).getPropertyValue('--pane-top-h').trim(); const startPx = cur.endsWith('%') ? rect.height * parseFloat(cur) / 100 : parseFloat(cur) || (rect.height / 2);
        function onMove(ev) { const dy = ev.clientY - startY; let h = startPx + dy; const min = 120; const max = rect.height - 120; if (h < min) h = min; if (h > max) h = max; const val = h + 'px'; container.style.setProperty('--pane-top-h', val); try { localStorage.setItem(KEY_SPLIT, val); } catch { } }
        function onUp() { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); }
        document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
      }
      res.addEventListener('mousedown', onDown);
    })();
  }
})();
*/

// Left Drawer (toggle + pin + collapse/expand all)
function bindLeftDrawer(leftRoot) {
  if (!leftRoot) return;
  if (leftRoot.dataset.dmLeftDrawerBound === "1") return;
  leftRoot.dataset.dmLeftDrawerBound = "1";
  const left = leftRoot;
  const toggle = document.getElementById('leftDrawerToggle');
  const pin = document.getElementById('leftDrawerPin');
  const btnCollapse = document.getElementById('leftCollapseExpand');
  let reveal = document.getElementById('leftDrawerReveal');
  if (!reveal) {
    const b = document.createElement('button');
    b.id = 'leftDrawerReveal';
    b.className = 'left-drawer-tab';
    b.textContent = 'Nav';
    b.title = 'Show navigation';
    document.body.appendChild(b);
    reveal = b;
  }
  const KEY_PIN = 'leftDrawerPinned';
  const KEY_OPEN = 'leftDrawerOpen';
  function applyState() {
    const pinned = JSON.parse(localStorage.getItem(KEY_PIN) || 'false');
    const open = JSON.parse(localStorage.getItem(KEY_OPEN) || 'true');
    pin && (pin.textContent = pinned ? 'Unpin' : 'Pin', pin.setAttribute('aria-pressed', String(pinned)));
    const shouldOpen = pinned ? true : open;
    document.body.classList.toggle('left-collapsed', !shouldOpen);
  }
  toggle?.addEventListener('click', () => {
    const cur = JSON.parse(localStorage.getItem(KEY_OPEN) || 'true');
    localStorage.setItem(KEY_OPEN, JSON.stringify(!cur));
    applyState();
  });
  pin?.addEventListener('click', () => {
    const cur = JSON.parse(localStorage.getItem(KEY_PIN) || 'false');
    const next = !cur;
    localStorage.setItem(KEY_PIN, JSON.stringify(next));
    if (next) {
      localStorage.setItem(KEY_OPEN, 'true');
    }
    applyState();
  });
  reveal?.addEventListener('click', () => {
    localStorage.setItem(KEY_OPEN, 'true');
    applyState();
  });

  function collapseAll(keepCurrent) {
    const details = Array.from(left.querySelectorAll('details'));
    details.forEach(d => d.open = false);
    if (!keepCurrent) return;
    const currentLink = (function () {
      const lg = document.getElementById('localGraph');
      if (!lg) return null;
      const rel = lg.dataset.rel; if (!rel) return null;
      const href = '/' + rel.replace(/\\/g, '/').replace(/\.md$/i, '.html').split('/').map(encodeURIComponent).join('/');
      return [...left.querySelectorAll('a')].find(a => { try { return new URL(a.href, location.origin).pathname === href; } catch { return false; } });
    })();
    if (currentLink) {
      let el = currentLink.parentElement;
      while (el && !el.classList.contains('left')) {
        if (el.tagName === 'DETAILS') el.open = true;
        el = el.parentElement;
      }
    }
  }
  let collapsed = true;
  btnCollapse?.addEventListener('click', () => {
    const KEY_SEC = 'navOpenSections';
    if (collapsed) {
      left.querySelectorAll('details').forEach(d => d.open = true);
      btnCollapse.textContent = 'Collapse all';
      // Save all sections as open
      const opens = [...left.querySelectorAll('details.nav-details')]
        .map(d => d.querySelector('.nav-label span:last-child')?.textContent || '')
        .filter(Boolean);
      try { localStorage.setItem(KEY_SEC, JSON.stringify(opens)); } catch (e) { }
    } else {
      collapseAll(true);
      btnCollapse.textContent = 'Expand all';
      // Save current state after collapsing
      const opens = [...left.querySelectorAll('details.nav-details')]
        .filter(d => d.open)
        .map(d => d.querySelector('.nav-label span:last-child')?.textContent || '')
        .filter(Boolean);
      try { localStorage.setItem(KEY_SEC, JSON.stringify(opens)); } catch (e) { }
    }
    collapsed = !collapsed;
  });
  if (btnCollapse) btnCollapse.textContent = 'Collapse all';
  applyState();
}

// Initialize nav section state - called after sidebar is loaded
window.initializeNavSectionState = function () {
  const leftRoot = document.querySelector('.left');
  if (!leftRoot) return;
  if (leftRoot.dataset.dmNavStateBound === "1") return;
  leftRoot.dataset.dmNavStateBound = "1";
  const KEY_SEC = 'navOpenSections';

  function saveSections() {
    const opens = [...document.querySelectorAll('.left details.nav-details')]
      .filter(d => d.open)
      .map(d => d.querySelector('.nav-label span:last-child')?.textContent || '')
      .filter(Boolean);
    try {
      localStorage.setItem(KEY_SEC, JSON.stringify(opens));
      console.log('[NavState] Saved sections:', opens);
    } catch (e) {
      console.error('Failed to save nav section state:', e);
    }
  }

  function loadSections() {
    try {
      return JSON.parse(localStorage.getItem(KEY_SEC) || 'null');
    } catch {
      return null;
    }
  }

  // Mark active nav item first (before restoring state)
  const path = location.pathname;
  const activeLink = [...document.querySelectorAll('.left a.nav-item')].find(el => {
    try {
      return new URL(el.href, location.origin).pathname === path;
    } catch {
      return false;
    }
  });

  if (activeLink) {
    activeLink.classList.add('active');
    activeLink.scrollIntoView({ block: 'center' });
  }

  // Restore saved state if available
  const savedSections = loadSections();
  if (savedSections !== null) {
    console.log('[NavState] Restoring sections:', savedSections);
    const opens = new Set(savedSections);
    document.querySelectorAll('.left details.nav-details').forEach(d => {
      const n = d.querySelector('.nav-label span:last-child')?.textContent || '';
      if (n) {
        d.open = opens.has(n);
      }
    });

    // Always ensure active link's parents are open
    if (activeLink) {
      let el = activeLink.parentElement;
      while (el && !el.classList.contains('left')) {
        if (el.tagName === 'DETAILS') el.open = true;
        el = el.parentElement;
      }
    }
  }

  // Attach toggle listeners to save state
  document.querySelectorAll('.left details.nav-details').forEach(d => {
    d.addEventListener('toggle', saveSections);
  });

  // Breadcrumb
  const bc = document.getElementById('breadcrumbText');
  if (bc && activeLink) {
    const sec = activeLink.closest('.nav-group')?.querySelector('.nav-label span:last-child')?.textContent || '';
    const title = document.title || activeLink.textContent;
    bc.textContent = `You Are Here: ${sec} > ${title}`;
  }
};

// Recents: store and render
function bindRecents(leftRoot) {
  if (!leftRoot) return;
  const ul = leftRoot.querySelector('#navRecents');
  if (!ul) return;
  if (ul.dataset.dmRecentsBound === "1") return;
  ul.dataset.dmRecentsBound = "1";
  const KEY = 'recents';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  function save(v) { localStorage.setItem(KEY, JSON.stringify(v)); }
  const id = decodeURIComponent(location.pathname.replace(/^\//, ''))
    .replace(/\.html$/i, '.md');
  let list = load().filter(x => x.id !== id);
  const title = document.title || id;
  list.unshift({ id, title });
  list = list.slice(0, 12);
  save(list);
  ul.innerHTML = list.map(r =>
    '<li><a class="nav-item" href="' + urlFor(r.id) + '"><span class="nav-icon">' + svgIcon('clock') + '</span><span class="nav-text">' + r.title + '</span></a></li>'
  ).join('') || '<li class="meta">No recents</li>';
}

// Quick Nav filter (binder)
function bindNavQuickFilter(leftRoot) {
  if (!leftRoot) return;
  const q = leftRoot.querySelector('#navQuick');
  if (!q) return;
  if (q.dataset.dmNavQuickBound === "1") return;
  q.dataset.dmNavQuickBound = "1";
  q.addEventListener('input', () => {
    const term = q.value.trim().toLowerCase();
    const items = [...leftRoot.querySelectorAll('.nav-list a.nav-item')];
    items.forEach(a => {
      const t = a.textContent.toLowerCase();
      const show = !term || t.includes(term);
      a.parentElement.style.display = show ? '' : 'none';
    });
    // Hide empty groups
    leftRoot.querySelectorAll('.nav-group').forEach(g => {
      const any = [...g.querySelectorAll('.nav-list li')].some(li => li.style.display !== 'none');
      g.style.display = any ? '' : 'none';
    });
  });
}

// Per-section mini filters
function bindSectionMiniFilters(leftRoot) {
  if (!leftRoot) return;
  const inputs = leftRoot.querySelectorAll('.nav-mini-input');
  if (!inputs.length) return;
  inputs.forEach(inp => {
    if (inp.dataset.dmMiniFilterBound === "1") return;
    inp.dataset.dmMiniFilterBound = "1";
    inp.addEventListener('input', () => {
      const term = (inp.value || '').trim().toLowerCase();
      const details = inp.closest('details.nav-details');
      if (!details) return;
      const items = details.querySelectorAll('ul.nav-list > li');
      items.forEach(li => {
        const t = (li.textContent || '').toLowerCase();
        li.style.display = !term || t.includes(term) ? '' : 'none';
      });
    });
  });
}

// "Show only this section" toggle
function bindOnlySectionToggle(leftRoot) {
  if (!leftRoot) return;
  if (leftRoot.dataset.dmOnlySectionBound === "1") return;
  leftRoot.dataset.dmOnlySectionBound = "1";
  const KEY = 'navOnlySection';
  function applyOnly(sectionLabel) {
    const groups = [...leftRoot.querySelectorAll('.nav-group')];
    groups.forEach(g => {
      const label = g.querySelector('.nav-label span:last-child')?.textContent || '';
      const show = !sectionLabel || label === sectionLabel;
      g.style.display = show ? '' : 'none';
    });
    // reflect active button state
    leftRoot.querySelectorAll('.nav-only').forEach(btn => {
      const lab = btn.getAttribute('data-section');
      btn.setAttribute('aria-pressed', sectionLabel && lab === sectionLabel ? 'true' : 'false');
    });
  }
  const saved = (function () { try { return localStorage.getItem(KEY) || '' } catch { return '' } })();
  if (saved) applyOnly(saved);
  leftRoot.querySelectorAll('.nav-only').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const label = btn.getAttribute('data-section') || '';
      const cur = (function () { try { return localStorage.getItem(KEY) || '' } catch { return '' } })();
      const next = (cur === label) ? '' : label;
      try { if (next) localStorage.setItem(KEY, next); else localStorage.removeItem(KEY); } catch { }
      applyOnly(next);
    });
  });
}

// --- Debugging and Development Helpers ---
// (function devHelpers() {
//   // Show all elements (for debugging)
//   document.querySelectorAll('*').forEach(el => el.style.outline = '1px solid red');

//   // Log all fetch requests and responses
//   const originalFetch = window.fetch;
//   window.fetch = async (...args) => {
//     const response = await originalFetch(...args);
//     const clonedResponse = response.clone();
//     clonedResponse
//       .text()
//       .then(body => console.log('Fetch URL:', args[0], 'Response:', body))
//       .catch(err => console.error('Fetch error:', err));
//     return response;
//   };

//   // Intercept and log XHR requests
//   const originalXhrOpen = XMLHttpRequest.prototype.open;
//   XMLHttpRequest.prototype.open = function (...args) {
//     this.addEventListener('load', function () {
//       console.log('XHR Request:', args[1], 'Response:', this.responseText);
//     });
//     return originalXhrOpen.apply(this, args);
//   };

//   // Log all form submissions
//   document.addEventListener('submit', (e) => {
//     const form = e.target.closest('form');
//     if (form) {
//       const formData = new FormData(form);
//       const data = {};
//       formData.forEach((value, key) => { data[key] = value });
//       console.log('Form submitted:', data);
//     }
//   });
// })();
