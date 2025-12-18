// assets/ui/page-actions.js
// Handles site-wide "+ New" and "Delete" dialogs via event delegation.
// Architecture: One-time event delegation, no MutationObserver, no global-ui rebinding.

(function () {
    // Modal root IDs
    const CREATE_MODAL_ID = 'createPageModal';
    const DELETE_MODAL_ID = 'deletePageModal';
    const BTN_CREATE_ID = 'btnCreatePage';
    const BTN_DELETE_ID = 'btnDeletePage';

    // Utility: open/close modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('open');
        // Focus first input
        const firstInput = modal.querySelector('input,select,textarea,button');
        if (firstInput) firstInput.focus();
        // Trap focus (basic)
        modal.addEventListener('keydown', trapTab, true);
    }
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('open');
        modal.removeEventListener('keydown', trapTab, true);
    }
    function trapTab(e) {
        if (e.key !== 'Tab') return;
        const modal = e.currentTarget;
        const focusables = modal.querySelectorAll('input,select,textarea,button');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    }
    // Close modal on overlay/cancel/Escape
    function setupModalClose(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.addEventListener('mousedown', e => {
            if (e.target === modal) closeModal(modalId);
        });
        modal.querySelectorAll('.modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => closeModal(modalId));
        });
        modal.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeModal(modalId);
        });
    }

    // One-time event delegation for main buttons
    document.addEventListener('click', function (e) {
        // + New
        if (e.target.closest(`#${BTN_CREATE_ID}`)) {
            openModal(CREATE_MODAL_ID);
        }
        // Delete
        if (e.target.closest(`#${BTN_DELETE_ID}`)) {
            openModal(DELETE_MODAL_ID);
            // Reset delete confirm input
            const modal = document.getElementById(DELETE_MODAL_ID);
            if (modal) {
                const input = modal.querySelector('input[name="deleteConfirmTitle"]');
                if (input) input.value = '';
                const confirmBtn = modal.querySelector('.modal-confirm');
                if (confirmBtn) confirmBtn.disabled = true;
                // Set expected title
                const pageTitle = document.title || '';
                const label = modal.querySelector('.delete-page-title-label');
                if (label) label.textContent = pageTitle;
            }
        }
    }, { capture: true });

    // Create Page: handle confirm
    document.addEventListener('click', function (e) {
        const btn = e.target.closest(`#${CREATE_MODAL_ID} .modal-confirm`);
        if (!btn) return;
        const modal = document.getElementById(CREATE_MODAL_ID);
        if (!modal) return;
        const type = modal.querySelector('select[name="pageType"]').value;
        const title = modal.querySelector('input[name="pageTitle"]').value;
        // Section dropdown can be stubbed
        // TODO: add section when API supports
        btn.disabled = true;
        fetch('/api/create-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, title })
        }).then(r => {
            btn.disabled = false;
            if (r.ok) {
                closeModal(CREATE_MODAL_ID);
                window.location.reload();
            } else {
                alert('Failed to create page');
            }
        }).catch(() => {
            btn.disabled = false;
            alert('Failed to create page');
        });
    }, { capture: true });

    // Delete Page: enable confirm only if title matches
    document.addEventListener('input', function (e) {
        const input = e.target.closest(`#${DELETE_MODAL_ID} input[name="deleteConfirmTitle"]`);
        if (!input) return;
        const modal = document.getElementById(DELETE_MODAL_ID);
        if (!modal) return;
        const confirmBtn = modal.querySelector('.modal-confirm');
        const expected = (document.title || '').trim();
        confirmBtn.disabled = (input.value.trim() !== expected);
    }, { capture: true });

    // Delete Page: handle confirm
    document.addEventListener('click', function (e) {
        const btn = e.target.closest(`#${DELETE_MODAL_ID} .modal-confirm`);
        if (!btn) return;
        const modal = document.getElementById(DELETE_MODAL_ID);
        if (!modal) return;
        btn.disabled = true;
        fetch('/api/delete-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: window.location.pathname })
        }).then(r => {
            btn.disabled = false;
            if (r.ok) {
                closeModal(DELETE_MODAL_ID);
                window.location.href = '/';
            } else {
                alert('Failed to delete page');
            }
        }).catch(() => {
            btn.disabled = false;
            alert('Failed to delete page');
        });
    }, { capture: true });

    // Setup close behaviors on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function () {
        setupModalClose(CREATE_MODAL_ID);
        setupModalClose(DELETE_MODAL_ID);
    });
})();
