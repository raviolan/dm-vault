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
            // Find and execute all <script> tags in the injected HTML
            const scripts = Array.from(container.querySelectorAll('script'));
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                // Copy attributes (e.g., src, type)
                for (const attr of oldScript.attributes) {
                    newScript.setAttribute(attr.name, attr.value);
                }
                if (oldScript.src) {
                    // External script: re-insert to trigger loading
                    newScript.async = false; // preserve order
                    document.head.appendChild(newScript);
                } else {
                    // Inline script: copy code and execute
                    newScript.textContent = oldScript.textContent;
                    document.head.appendChild(newScript);
                }
            });
            window.__dm_sidebar_injected = true;
            window.dispatchEvent(new Event('dm-sidebar-injected'));
        })
        .catch(err => {
            console.error('sidebar-loader.js: Failed to load sidebar partial:', err);
        });
})();
