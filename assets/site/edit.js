// assets/site/edit.js
// Exports: initEditButton()

export function initEditButton() {
  // Remove any previous click listeners to avoid duplicates
  const btn = document.getElementById('btnEditPage');
  if (!btn) return;
  // Remove previous listener if any (by replacing node)
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);

  newBtn.addEventListener('click', async function (e) {
    e.preventDefault();
    // If editor already open, focus it
    const existing = document.querySelector('.inplace-wysiwyg-editor');
    if (existing) {
      existing.focus();
      return;
    }
    // Find main content area: main.main > article > body
    let main = document.querySelector('main.main') || document.querySelector('article') || document.body;
    // Prefer window.createInplaceEditor if available
    if (window.createInplaceEditor) {
      const ed = window.createInplaceEditor(main, { noReload: false });
      if (ed) {
        ed.focus && ed.focus();
        return;
      }
    }
    // Fallback: open modal
    const modal = document.getElementById('editPageModal');
    const content = document.getElementById('editPageContent');
    if (modal && content) {
      content.value = main.innerText || '';
      modal.style.display = 'block';
      content.focus();
    }
  });
}
