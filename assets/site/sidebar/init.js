// Sidebar initialization: calls all sidebar binders on the injected sidebar root
import { bindSplitClickNavigation } from './split-click.js';
import { bindRecents } from './recents.js';
import { bindNavQuickFilter, bindSectionMiniFilters, bindOnlySectionToggle } from './filters.js';

export function initSidebar(leftRoot) {
  if (!leftRoot) leftRoot = document.querySelector('.left, .sidebar, #leftDrawer');
  if (!leftRoot) return;
  bindSplitClickNavigation(leftRoot);
  bindRecents(leftRoot);
  bindNavQuickFilter(leftRoot);
  bindSectionMiniFilters(leftRoot);
  bindOnlySectionToggle(leftRoot);
}


