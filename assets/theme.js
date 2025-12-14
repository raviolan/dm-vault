// Minimal theme helper with persistence and swatch support
window.applyTheme = window.applyTheme || function (name) {
  try {
    if (name) {
      document.body.setAttribute('data-theme', name);
      localStorage.setItem('theme', name);
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.removeItem('theme');
    }
  } catch (e) { }
};

// Restore stored theme and attach controls
(function(){
  try {
    // Prefer the dedicated colorTheme key (used by right-panel)
    const colorStored = localStorage.getItem('colorTheme');
    const stored = colorStored || localStorage.getItem('theme');
    if (stored) {
      if (stored === 'light' || stored === 'dark') {
        document.body.setAttribute('data-theme', stored);
      } else if (window.applyColorTheme) {
        try { window.applyColorTheme(stored); } catch (e) { document.body.removeAttribute('data-theme'); }
      }
    }
  } catch (e) { }

  // Attach to #themeToggle if present
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = localStorage.getItem('theme') || localStorage.getItem('colorTheme') || document.body.getAttribute('data-theme') || 'dark';
      const next = cur === 'dark' ? 'light' : 'dark';
      try { window.applyTheme(next); } catch (e) { }
      try { localStorage.setItem('colorTheme', next); } catch (e) { }
      try { localStorage.setItem('theme', next); } catch (e) { }
      if (window.applyColorTheme) try { window.applyColorTheme(next); } catch (e) { }
    });
  }

  // Theme swatches (buttons with .theme-swatch and data-theme)
  try {
    document.querySelectorAll('.theme-swatch').forEach(s => {
      s.addEventListener('click', () => {
        const t = s.getAttribute('data-theme') || s.dataset.theme;
        if (!t) return;
        // Prefer the right-panel color theme API if present
        try {
          if (window.applyColorTheme) return window.applyColorTheme(t);
        } catch (e) { }
        // Fallback: set both colorTheme and theme for compatibility
        try { localStorage.setItem('colorTheme', t); } catch (e) { }
        if (t === 'light' || t === 'dark') {
          window.applyTheme(t);
        } else {
          try { document.body.setAttribute('data-color-theme', t); } catch (e) { }
        }
      });
    });
  } catch (e) { }
})();
