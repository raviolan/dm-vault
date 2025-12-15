// sidebar-loader.js
// Loads the shared sidebar partial into #site-sidebar

(function () {
    const container = document.getElementById('site-sidebar');
    if (!container) {
        console.error('sidebar-loader.js: #site-sidebar container not found');
        return;
    }
    // Always use absolute path for sidebar partial
    const sidebarPath = '/assets/partials/sidebar.html';
    fetch(sidebarPath)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load sidebar partial: ' + response.status);
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
        })
        .catch(err => {
            console.error('sidebar-loader.js: Failed to load sidebar partial:', err);
        });
})();
