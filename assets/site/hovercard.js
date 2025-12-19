
// assets/site/hovercard.js
// Exports: initHovercard()
// Requires: window.NOTES (populated by search.js or site.js)

export function initHovercard() {
  if (window.__dmHovercardInit) return;
  window.__dmHovercardInit = true;

  let hover = document.getElementById('__hovercard');
  if (!hover) {
    hover = document.createElement('div');
    hover.id = '__hovercard';
    hover.className = 'hovercard';
    document.body.appendChild(hover);
  }

  document.body.addEventListener('mousemove', (e) => {
    hover.style.left = (e.pageX + 12) + 'px';
    hover.style.top = (e.pageY + 12) + 'px';
  });

  document.body.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a');
    if (!a || !a.href || !a.pathname.endsWith('.html')) {
      hover.style.display = 'none';
      return;
    }
    // Exclude links inside .left (sidebar)
    let parent = a.parentElement;
    while (parent) {
      if (parent.classList && parent.classList.contains('left')) {
        hover.style.display = 'none';
        return;
      }
      parent = parent.parentElement;
    }
    const id = a.pathname.replace(/^\//, '').replace(/\.html$/i, '.md');
    const notes = window.NOTES || (window.getNotes && window.getNotes());
    const n = notes && notes.find(n => n.id === id);
    if (n) {
      hover.innerHTML = '<strong>' + n.title + '</strong><div class="meta">' + (n.tags || []).map(t => '#' + t).join(' ') + '</div>';
      hover.style.display = 'block';
    } else {
      hover.style.display = 'none';
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    hover.style.display = 'none';
  });
}
