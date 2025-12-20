// Injects Bookmark and Save Session buttons into the topbar
// Exports: initTopbarButtons()

export function initTopbarButtons() {
  // Find the header root and anchor
  const header = document.querySelector('.top');
  if (!header) return;
  const search = header.querySelector('.search');
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
    search.insertAdjacentElement('afterend', bookmarkBtn);
  }
  // Guard against duplicate listeners
  if (!bookmarkBtn.dataset.dmBound) {
    bookmarkBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof window.addFavorite === 'function') {
        window.addFavorite();
      }
    });
    bookmarkBtn.dataset.dmBound = '1';
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
    bookmarkBtn.insertAdjacentElement('afterend', saveBtn);
  }
  if (!saveBtn.dataset.dmBound) {
    saveBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (typeof window.saveSessionSnapshot === 'function') {
        window.saveSessionSnapshot();
      }
    });
    saveBtn.dataset.dmBound = '1';
  }
}
