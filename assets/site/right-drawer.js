// assets/site/right-drawer.js
// Handles right drawer open/pin/reveal state and UI

export function initRightDrawer() {
  const right = document.querySelector('.right');
  const toggle = document.getElementById('drawerToggle');
  const pin = document.getElementById('drawerPin');
  const reveal = document.getElementById('drawerReveal');
  const KEY_PINNED = 'drawerPinned';
  const KEY_OPEN = 'drawerOpen';

  // Restore state
  let pinned = JSON.parse(localStorage.getItem(KEY_PINNED) || 'false');
  let open = JSON.parse(localStorage.getItem(KEY_OPEN) || 'true');

  function updateUI() {
    if (!right) return;
    if (pinned) {
      right.classList.remove('collapsed');
      document.body.classList.remove('drawer-collapsed');
      pin.setAttribute('aria-pressed', 'true');
      localStorage.setItem(KEY_OPEN, 'true');
      open = true;
    } else {
      pin.setAttribute('aria-pressed', 'false');
      if (!open) {
        right.classList.add('collapsed');
        document.body.classList.add('drawer-collapsed');
      } else {
        right.classList.remove('collapsed');
        document.body.classList.remove('drawer-collapsed');
      }
    }
  }

  if (pin) {
    pin.addEventListener('click', () => {
      pinned = !pinned;
      localStorage.setItem(KEY_PINNED, JSON.stringify(pinned));
      updateUI();
    });
  }
  if (toggle) {
    toggle.addEventListener('click', () => {
      if (pinned) return; // Pin forces open
      open = !open;
      localStorage.setItem(KEY_OPEN, JSON.stringify(open));
      updateUI();
    });
  }
  if (reveal) {
    reveal.addEventListener('click', () => {
      open = true;
      localStorage.setItem(KEY_OPEN, 'true');
      updateUI();
    });
  }

  updateUI();
  // Expose for compat
  window.initRightDrawer = initRightDrawer;
}

// For non-module environments
if (typeof window !== 'undefined') {
  window.initRightDrawer = initRightDrawer;
}
