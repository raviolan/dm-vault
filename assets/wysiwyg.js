// Minimal inplace WYSIWYG editor used for integrated editing inside the content area.
window.initializeWysiwyg = window.initializeWysiwyg || function () { /* no-op */ };

window.createInplaceEditor = window.createInplaceEditor || function (target, opts = {}) {
	const main = (typeof target === 'string') ? document.querySelector(target) : (target || document.querySelector('main.main') || document.querySelector('article') || document.body);
	if (!main) return null;

	// Prevent multiple editors
	if (document.querySelector('.inplace-wysiwyg-editor')) return null;

	const wrapper = document.createElement('div'); wrapper.className = 'inplace-wysiwyg-wrap';
	const toolbar = document.createElement('div'); toolbar.className = 'wysiwyg-toolbar';

	function btn(label, cb, title) {
		const b = document.createElement('button'); b.type = 'button'; b.className = 'wysiwyg-btn'; b.textContent = label; if (title) b.title = title; b.addEventListener('click', cb); return b;
	}

	// Basic formatting controls
	toolbar.appendChild(btn('B', () => document.execCommand('bold'), 'Bold (Cmd/Ctrl+B'));
	toolbar.appendChild(btn('I', () => document.execCommand('italic'), 'Italic (Cmd/Ctrl+I'));
	toolbar.appendChild(btn('H2', () => document.execCommand('formatBlock', false, 'h2'), 'Heading 2'));
	toolbar.appendChild(btn('H3', () => document.execCommand('formatBlock', false, 'h3'), 'Heading 3'));

	const saveBtn = btn('Save', () => save(), 'Save changes'); saveBtn.classList.add('primary');
	const cancelBtn = btn('Cancel', () => cancel(), 'Cancel editing');
	toolbar.appendChild(saveBtn); toolbar.appendChild(cancelBtn);

	const editor = document.createElement('div'); editor.className = 'inplace-wysiwyg-editor wysiwyg'; editor.contentEditable = 'true'; editor.spellcheck = false; editor.innerHTML = main.innerHTML;

	wrapper.appendChild(toolbar); wrapper.appendChild(editor);

	// Replace main's content with the editor so it stays integrated in the content area
	const originalHTML = main.innerHTML;
	main.innerHTML = '';
	main.appendChild(wrapper);

	function cleanup() {
		try { if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper); } catch (e) { }
		document.removeEventListener('keydown', onKey);
	}

	async function save() {
		saveBtn.disabled = true; saveBtn.textContent = 'Saving...';
		try {
			const payload = { url: window.location.pathname, html: editor.innerHTML };
			const r = await fetch('/api/edit-page', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
			if (!r.ok) {
				const j = await r.json().catch(() => ({}));
				alert('Save failed: ' + (j.error || r.statusText));
				saveBtn.disabled = false; saveBtn.textContent = 'Save';
				return;
			}
			// Replace original content in-place and cleanup
			main.innerHTML = editor.innerHTML;
			cleanup();
			// Optionally reload to ensure all scripts/styles re-run
			if (!opts.noReload) setTimeout(() => location.reload(), 200);
		} catch (err) {
			alert('Network error: ' + (err && err.message));
			saveBtn.disabled = false; saveBtn.textContent = 'Save';
		}
	}

	function cancel() {
		if (!confirm('Discard changes?')) return;
		// Restore original content
		main.innerHTML = originalHTML;
		cleanup();
	}

	function onKey(e) {
		// Cmd/Ctrl+S save
		if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
			e.preventDefault(); save();
		}
		// Esc cancel
		if (e.key === 'Escape') { e.preventDefault(); cancel(); }
	}

	document.addEventListener('keydown', onKey);

	// Focus editor
	setTimeout(() => { editor.focus(); }, 30);

	return { save, cancel, editor, toolbar, wrapper };
};
