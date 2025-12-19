// Sidebar Split-Click Navigation Binder
// Exports: bindSplitClickNavigation(leftRoot)

/**
 * Binds split-click navigation for category landing to the given sidebar root.
 * @param {Element} leftRoot - The sidebar root element.
 */
export function bindSplitClickNavigation(leftRoot) {
  if (!leftRoot || leftRoot.dataset.dmSplitClickBound) return;
  leftRoot.dataset.dmSplitClickBound = "1";
  // Enable split-click on section summaries for category landing
  leftRoot.querySelectorAll('.nav-details > summary').forEach(summary => {
    if (summary.dataset.dmSplitClickBound) return;
    summary.dataset.dmSplitClickBound = '1';
    summary.addEventListener('mousedown', e => {
      if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
        // Middle click or ctrl+click: open landing in new tab
        const link = summary.querySelector('a, .nav-item');
        if (link && link.href) window.open(link.href, '_blank');
        e.preventDefault();
      } else if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
        // Left click: go to landing if not already there
        const link = summary.querySelector('a, .nav-item');
        if (link && link.href && !summary.classList.contains('active')) {
          window.location.href = link.href;
        }
      }
    });
  });
}
