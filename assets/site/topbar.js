// Injects Bookmark and Save Session buttons into the topbar
// Exports: initTopbarButtons()

export function initTopbarButtons() {
  // Prevent duplicate injection
  if (window.__dmTopbarButtonsInit) return;
  window.__dmTopbarButtonsInit = true;

  // Find the topbar search element
  const search = document.querySelector('.top .search');
  if (!search) return;

  // Bookmark button
  let bookmarkBtn = document.getElementById('bookmarkPage');
  if (!bookmarkBtn) {
    bookmarkBtn = document.createElement('button');
    bookmarkBtn.id = 'bookmarkPage';
    bookmarkBtn.className = 'bookmark-btn';
    bookmarkBtn.type = 'button';
    bookmarkBtn.title = 'Bookmark this page';
    bookmarkBtn.innerHTML = '☆';
    bookmarkBtn.setAttribute('data-rel', decodeURIComponent(location.pathname.replace(/^\//, '')).replace(/\.html$/i, '.md'));
    bookmarkBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof window.addFavorite === 'function') {
        window.addFavorite();
      }
    });
    search.insertAdjacentElement('afterend', bookmarkBtn);
  }

  // Save Session button
  let saveBtn = document.getElementById('saveSession');
  if (!saveBtn) {
    saveBtn = document.createElement('button');
    saveBtn.id = 'saveSession';
    saveBtn.className = 'save-session-btn';
    saveBtn.type = 'button';
    saveBtn.title = 'Save session notes snapshot';
    saveBtn.innerHTML = '💾';
    saveBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof window.saveSessionSnapshot === 'function') {
        window.saveSessionSnapshot();
      }
    });
    bookmarkBtn.insertAdjacentElement('afterend', saveBtn);
  }
}
