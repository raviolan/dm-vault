// Sidebar Filters Binders
// Exports: bindNavQuickFilter, bindSectionMiniFilters, bindOnlySectionToggle

/**
 * Binds the quick nav filter to the given sidebar root.
 * @param {Element} leftRoot - The sidebar root element.
 */
export function bindNavQuickFilter(leftRoot) {
  if (!leftRoot || leftRoot.dataset.dmQuickFilterBound) return;
  leftRoot.dataset.dmQuickFilterBound = "1";
  // Quick filter for sidebar navigation
  const input = leftRoot.querySelector('#navQuick');
  const navSections = leftRoot.querySelectorAll('.nav-list, .nav-sections');
  if (!input || !navSections.length) return;
  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    navSections.forEach(list => {
      list.querySelectorAll('li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = val && !text.includes(val) ? 'none' : '';
      });
    });
  });
}

/**
 * Binds the per-section mini filters to the given sidebar root.
 * @param {Element} leftRoot - The sidebar root element.
 */
export function bindSectionMiniFilters(leftRoot) {
  if (!leftRoot || leftRoot.dataset.dmMiniFiltersBound) return;
  leftRoot.dataset.dmMiniFiltersBound = "1";
  // Per-section mini filters
  leftRoot.querySelectorAll('.nav-mini-input').forEach(input => {
    if (input.dataset.dmMiniFilterBound) return;
    input.dataset.dmMiniFilterBound = '1';
    input.addEventListener('input', () => {
      const val = input.value.trim().toLowerCase();
      const section = input.closest('details');
      if (!section) return;
      section.querySelectorAll('.nav-list li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = val && !text.includes(val) ? 'none' : '';
      });
    });
  });
}

/**
 * Binds the "Show only this section" toggle to the given sidebar root.
 * @param {Element} leftRoot - The sidebar root element.
 */
export function bindOnlySectionToggle(leftRoot) {
  if (!leftRoot || leftRoot.dataset.dmOnlySectionBound) return;
  leftRoot.dataset.dmOnlySectionBound = "1";
  // "Show only this section" toggle
  leftRoot.querySelectorAll('.nav-only').forEach(btn => {
    if (btn.dataset.dmOnlySectionBound) return;
    btn.dataset.dmOnlySectionBound = '1';
    btn.addEventListener('click', e => {
      const section = btn.closest('details');
      if (!section) return;
      // Hide all other sections
      leftRoot.querySelectorAll('.nav-details').forEach(d => {
        d.style.display = d === section ? '' : 'none';
      });
      // Add a reset button if not present
      if (!leftRoot.querySelector('.nav-only-reset')) {
        const reset = document.createElement('button');
        reset.textContent = 'Show all';
        reset.className = 'chip nav-only-reset';
        reset.addEventListener('click', () => {
          leftRoot.querySelectorAll('.nav-details').forEach(d => { d.style.display = ''; });
          reset.remove();
        });
        section.parentNode.insertBefore(reset, section.nextSibling);
      }
    });
  });
}
