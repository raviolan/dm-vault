// Delegated modal handler for Create/Delete Page modals (pilot: Locations.html)
// Injection-safe: works if modals are injected after load
(function () {
    // Helper: find modal and form by id
    function $(id) { return document.getElementById(id); }

    // Delegated click handler
    document.addEventListener('click', function (e) {
        // Open Create Page Modal
        if (e.target.closest && e.target.closest('#btnCreatePage')) {
            const modal = $('createPageModal');
            if (modal) {
                modal.style.display = 'flex';
                const title = $('pageTitle');
                if (title) title.focus();
            }
            return;
        }
        // Open Delete Page Modal
        if (e.target.closest && e.target.closest('#btnDeletePage')) {
            const modal = $('deletePageModal');
            const titleDisplay = $('deletePageTitle');
            const confirmInput = $('deletePageConfirm');
            if (modal && titleDisplay && confirmInput) {
                // Extract page title from h1 or document.title
                let pageTitle = '';
                const h1 = document.querySelector('main.main h1');
                if (h1) pageTitle = h1.textContent.trim();
                else pageTitle = document.title.split('|')[0].trim();
                titleDisplay.textContent = pageTitle;
                confirmInput.dataset.expectedTitle = pageTitle;
                confirmInput.value = '';
                modal.style.display = 'flex';
                confirmInput.focus();
            }
            return;
        }
        // Cancel Create
        if (e.target.closest && e.target.closest('#btnCancelCreate')) {
            const modal = $('createPageModal');
            if (modal) {
                modal.style.display = 'none';
                const form = $('createPageForm');
                const statusDiv = $('createPageStatus');
                if (form) form.reset();
                if (statusDiv) { statusDiv.style.display = 'none'; statusDiv.className = ''; }
            }
            return;
        }
        // Cancel Delete
        if (e.target.closest && e.target.closest('#btnCancelDelete')) {
            const modal = $('deletePageModal');
            if (modal) {
                modal.style.display = 'none';
                const form = $('deletePageForm');
                const statusDiv = $('deletePageStatus');
                if (form) form.reset();
                if (statusDiv) { statusDiv.style.display = 'none'; statusDiv.className = ''; }
            }
            return;
        }
        // Overlay click (Create)
        if (e.target.classList && e.target.classList.contains('modal-overlay')) {
            const modal = e.target.closest('.modal');
            if (modal && (modal.id === 'createPageModal' || modal.id === 'deletePageModal')) {
                modal.style.display = 'none';
                const form = modal.querySelector('form');
                const statusDiv = modal.querySelector('.modal-status');
                if (form) form.reset();
                if (statusDiv) { statusDiv.style.display = 'none'; statusDiv.className = ''; }
            }
            return;
        }
    });

    // Delegated Escape key handler
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const modals = [$('createPageModal'), $('deletePageModal')];
            modals.forEach(modal => {
                if (modal && modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    const form = modal.querySelector('form');
                    const statusDiv = modal.querySelector('.modal-status');
                    if (form) form.reset();
                    if (statusDiv) { statusDiv.style.display = 'none'; statusDiv.className = ''; }
                }
            });
        }
    });

    // Create Page Form submit
    document.addEventListener('submit', async function (e) {
        const form = e.target.closest('#createPageForm');
        if (!form) return;
        e.preventDefault();
        const type = $('pageType') ? $('pageType').value : '';
        const title = $('pageTitle') ? $('pageTitle').value.trim() : '';
        const statusDiv = $('createPageStatus');
        if (!title) {
            if (statusDiv) {
                statusDiv.textContent = 'Please enter a page title';
                statusDiv.className = 'error';
                statusDiv.style.display = 'block';
            }
            return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (statusDiv) {
            statusDiv.textContent = 'Creating page...';
            statusDiv.className = 'loading';
            statusDiv.style.display = 'block';
        }
        try {
            const response = await fetch('/api/create-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, title })
            });
            const data = await response.json();
            if (response.ok) {
                if (statusDiv) {
                    statusDiv.textContent = 'Page created! Redirecting...';
                    statusDiv.className = 'success';
                }
                setTimeout(() => { window.location.href = data.url; }, 1000);
            } else {
                if (statusDiv) {
                    statusDiv.textContent = data.error || 'Failed to create page';
                    statusDiv.className = 'error';
                }
                if (submitBtn) submitBtn.disabled = false;
            }
        } catch (err) {
            if (statusDiv) {
                statusDiv.textContent = 'Network error: ' + err.message;
                statusDiv.className = 'error';
            }
            if (submitBtn) submitBtn.disabled = false;
        }
    });

    // Delete Page Form submit
    document.addEventListener('submit', async function (e) {
        const form = e.target.closest('#deletePageForm');
        if (!form) return;
        e.preventDefault();
        const confirmInput = $('deletePageConfirm');
        const expectedTitle = confirmInput ? confirmInput.dataset.expectedTitle : '';
        const enteredTitle = confirmInput ? confirmInput.value.trim() : '';
        const statusDiv = $('deletePageStatus');
        if (enteredTitle !== expectedTitle) {
            if (statusDiv) {
                statusDiv.textContent = 'Title does not match. Please type the exact title to confirm deletion.';
                statusDiv.className = 'error';
                statusDiv.style.display = 'block';
            }
            return;
        }
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        if (confirmInput) confirmInput.disabled = true;
        if (statusDiv) {
            statusDiv.textContent = 'Deleting page...';
            statusDiv.className = 'loading';
            statusDiv.style.display = 'block';
        }
        try {
            const response = await fetch('/api/delete-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: window.location.pathname })
            });
            const data = await response.json();
            if (response.ok) {
                if (statusDiv) {
                    statusDiv.textContent = 'Page deleted! Redirecting to dashboard...';
                    statusDiv.className = 'success';
                }
                setTimeout(() => { window.location.href = '/index.html'; }, 1500);
            } else {
                if (statusDiv) {
                    statusDiv.textContent = data.error || 'Failed to delete page';
                    statusDiv.className = 'error';
                }
                if (submitBtn) submitBtn.disabled = false;
                if (confirmInput) confirmInput.disabled = false;
            }
        } catch (err) {
            if (statusDiv) {
                statusDiv.textContent = 'Network error: ' + err.message;
                statusDiv.className = 'error';
            }
            if (submitBtn) submitBtn.disabled = false;
            if (confirmInput) confirmInput.disabled = false;
        }
    });
})();
