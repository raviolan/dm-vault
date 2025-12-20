// assets/site/binders.js
// Binders for header, sidebar, and right panel. Each is idempotent.


import { initTopbarButtons } from './topbar.js';
import { initHovercard } from './hovercard.js';
import { initSidebar } from './sidebar/init.js';
import { initRightDrawer } from './right-drawer.js';
import { initPanelResizers } from './panels.js';

// Bind header: always call initTopbarButtons and initHovercard, set marker but do not block re-init
export function bindHeader() {
  const header = document.querySelector('.top');
  if (!header) return;
  header.dataset.dmBound = '1';
  initTopbarButtons();
  initHovercard();
}

// Bind sidebar: always call initSidebar(leftRoot), set marker but do not block re-init
export function bindSidebar() {
  const leftRoot = document.querySelector('.left, .sidebar, #leftDrawer');
  if (!leftRoot) return;
  leftRoot.dataset.dmBound = '1';
  initSidebar(leftRoot);
}

// Bind right panel: always call initRightDrawer and initPanelResizers, set marker but do not block re-init
export function bindRightPanel() {
  const rightRoot = document.querySelector('aside.right, .right');
  if (!rightRoot) return;
  rightRoot.dataset.dmBound = '1';
  initRightDrawer();
  if (typeof initPanelResizers === 'function') initPanelResizers();
}

