// sidebar-loader.js
// Loads the shared sidebar partial into #site-sidebar

(function() {
  const container = document.getElementById('site-sidebar');
  if (!container) {
    console.error('sidebar-loader.js: #site-sidebar container not found');
    return;
  }
  const base = (window.SITE_BASE || "/");
  const paths = [
    base + 'sidebar.html',
    base + 'assets/partials/sidebar.html'
  ];
  function tryNext(i) {
    if (i >= paths.length) {
      console.error('sidebar-loader.js: Failed to load sidebar partial from any known path.');
      return;
    }
    fetch(paths[i])
      .then(response => {
        if (!response.ok) throw new Error('Failed to load sidebar partial: ' + response.status);
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
      })
      .catch(() => {
        tryNext(i + 1);
      });
  }
  tryNext(0);
})();
