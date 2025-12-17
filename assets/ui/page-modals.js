

// Delegated modal handler for Create/Delete Page modals (pilot: Locations.html)
// Injection-safe: works if modals are injected after load

// Delegated click handler (document-level, event delegation)
document.addEventListener('click', function (e) {
    // Open Create Page Modal
    if (e.target.closest && e.target.closest('#btnCreatePage')) {
        const modal = document.getElementById('createPageModal');
        if (modal) {
            modal.style.display = 'flex';
            const title = document.getElementById('pageTitle');
            if (title) title.focus();
        }
        return;
    }
    // Open Delete Page Modal
    if (e.target.closest && e.target.closest('#btnDeletePage')) {
        const modal = document.getElementById('deletePageModal');
        const titleDisplay = document.getElementById('deletePageTitle');
        const confirmInput = document.getElementById('deletePageConfirm');
        if (modal && titleDisplay && confirmInput) {
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
        const modal = document.getElementById('createPageModal');
        if (modal) {
            modal.style.display = 'none';
            const form = document.getElementById('createPageForm');
            const statusDiv = document.getElementById('createPageStatus');
            if (form) form.reset();
            if (statusDiv) { statusDiv.style.display = 'none'; statusDiv.className = ''; }
        }
        return;
    }
    // Cancel Delete
    if (e.target.closest && e.target.closest('#btnCancelDelete')) {
        const modal = document.getElementById('deletePageModal');
        if (modal) {
            modal.style.display = 'none';
            const form = document.getElementById('deletePageForm');
            const statusDiv = document.getElementById('deletePageStatus');
            if (form) form.reset();
            if (statusDiv) { statusDiv.style.display = 'none'; statusDiv.className = ''; }
        }
        return;
    }
    // Overlay click (Create/Delete)
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

// Delegated Escape key handler (document-level)
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modals = [document.getElementById('createPageModal'), document.getElementById('deletePageModal')];
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

// Delegated form submit handler (document-level)
document.addEventListener('submit', async function (e) {
    if (e.target && e.target.id === 'createPageForm') {
        e.preventDefault();
        const type = document.getElementById('pageType') ? document.getElementById('pageType').value : '';
        const title = document.getElementById('pageTitle') ? document.getElementById('pageTitle').value.trim() : '';
        const statusDiv = document.getElementById('createPageStatus');
        if (!title) {
            if (statusDiv) {
                statusDiv.textContent = 'Please enter a page title';
                statusDiv.className = 'error';
                statusDiv.style.display = 'block';
            }
            return;
        }
        const submitBtn = e.target.querySelector('button[type="submit"]');
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
        return;
    }
    if (e.target && e.target.id === 'deletePageForm') {
        e.preventDefault();
        const confirmInput = document.getElementById('deletePageConfirm');
        const expectedTitle = confirmInput ? confirmInput.dataset.expectedTitle : '';
        const enteredTitle = confirmInput ? confirmInput.value.trim() : '';
        const statusDiv = document.getElementById('deletePageStatus');
        if (enteredTitle !== expectedTitle) {
            if (statusDiv) {
                statusDiv.textContent = 'Title does not match. Please type the exact title to confirm deletion.';
                statusDiv.className = 'error';
                statusDiv.style.display = 'block';
            }
            return;
        }
        const submitBtn = e.target.querySelector('button[type="submit"]');
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
        return;
    }
});
});
