// Minimal theme helper
window.applyTheme = window.applyTheme || function (name) {
  try { document.body.setAttribute('data-theme', name); localStorage.setItem('theme', name); } catch (e) { }
};

// Attach to #themeToggle if present
(function(){
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cur = localStorage.getItem('theme') || document.body.getAttribute('data-theme') || 'dark';
    const next = cur === 'dark' ? 'light' : 'dark';
    window.applyTheme(next);
  });
})();
