// assets/site/binders.js
// Binders for header, sidebar, and right panel. Each is idempotent.

export function bindHeader() {
  const header = document.querySelector('.top');
  if (!header || header.dataset.dmBound) return;
  header.dataset.dmBound = '1';
  // Add header-specific event listeners here if needed
}

export function bindSidebar() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar || sidebar.dataset.dmBound) return;
  sidebar.dataset.dmBound = '1';
  // Add sidebar-specific event listeners here if needed
}

export function bindRightPanel() {
  const rightPanel = document.querySelector('aside.right');
  if (!rightPanel || rightPanel.dataset.dmBound) return;
  rightPanel.dataset.dmBound = '1';
  // Add right panel-specific event listeners here if needed
}
