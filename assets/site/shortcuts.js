
// assets/site/shortcuts.js
// Extracted global keyboard shortcuts as idempotent module
// Exposes: window.DM = window.DM || {}; DM.shortcuts.init()

window.DM = window.DM || {};
window.DM.shortcuts = window.DM.shortcuts || {};
window.DM.shortcuts.init = function() {
  if (window.__dmShortcutsInit) return;
  window.__dmShortcutsInit = true;

  document.addEventListener('keydown', function(e) {
    // Typing guards: skip if in input, textarea, or contenteditable
    const active = document.activeElement;
    const isTyping = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );
    // Option+B: blur toggle
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.toLowerCase() === 'b') {
      if (!isTyping) {
        document.body.classList.toggle('blurred');
        e.preventDefault();
      }
    }
    // Cmd/Ctrl+S: save in edit mode only
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 's') {
      if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT' || active.isContentEditable)) {
        // Let editor handle
        return;
      }
      if (window.saveSessionSnapshot) {
        e.preventDefault();
        window.saveSessionSnapshot();
      }
    }
    // Option+C/Q: collapse logic
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key.toLowerCase() === 'c' || e.key.toLowerCase() === 'q')) {
      if (!isTyping) {
        document.body.classList.toggle('collapsed');
        e.preventDefault();
      }
    }
    // Option+D: bookmark triggers .bookmark-btn click
    if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.toLowerCase() === 'd') {
      if (!isTyping) {
        const btn = document.querySelector('.bookmark-btn');
        if (btn) { btn.click(); e.preventDefault(); }
      }
    }
  });
};
