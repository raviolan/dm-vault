// Sidebar Recents Binder
// Exports: bindRecents(leftRoot)

/**
 * Binds recents tracking and rendering to the given sidebar root.
 * @param {Element} leftRoot - The sidebar root element.
 */
export function bindRecents(leftRoot) {
  if (!leftRoot || leftRoot.dataset.dmRecentsBound) return;
  leftRoot.dataset.dmRecentsBound = "1";
  // Render and update recents list in the sidebar
  const RECENTS_KEY = 'dmRecents';
  const recentsList = leftRoot.querySelector('#navRecents, #navFav');
  if (!recentsList) return;
  function getRecents() {
    try {
      return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
    } catch { return []; }
  }
  function saveRecents(list) {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
  }
  function renderRecents() {
    const recents = getRecents();
    recentsList.innerHTML = recents.map(r => `<li><a href="${r.href}">${r.title}</a></li>`).join('');
  }
  // Add current page to recents on load
  const page = { href: location.pathname, title: document.title };
  let recents = getRecents();
  if (!recents.find(r => r.href === page.href)) {
    recents.unshift(page);
    if (recents.length > 10) recents = recents.slice(0, 10);
    saveRecents(recents);
  }
  renderRecents();
}
