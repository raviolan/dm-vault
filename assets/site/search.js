// assets/site/search.js
// Extracted global search logic from site.js
// Exports: initSearchUI, initGlobalSearchHotkey, fetchSearchIndex, fetchNotes, getIndex, getNotes

let _INDEX = null;
let _NOTES = null;
let _indexPromise = null;
let _notesPromise = null;

function fetchSearchIndex() {
  if (_indexPromise) return _indexPromise;
  _indexPromise = fetch('/search-index.json').then(r => r.json()).then(d => (_INDEX = d));
  return _indexPromise;
}

function fetchNotes() {
  if (_notesPromise) return _notesPromise;
  _notesPromise = fetch('/notes.json').then(r => r.json()).then(d => (_NOTES = d));
  return _notesPromise;
}

function getIndex() { return _INDEX; }
function getNotes() { return _NOTES; }

function doSearch(q) {
  if (!_INDEX) return [];
  const needle = q.toLowerCase();
  const hits = [];
  for (const note of _INDEX) {
    if (!note.id || !note.title) continue;
    let score = 0;
    let match = null;
    if (note.title.toLowerCase().includes(needle)) {
      score = 1000;
      match = note.title;
    } else if (note.tags?.some(t => t.toLowerCase().includes(needle))) {
      score = 500;
      match = note.tags.find(t => t.toLowerCase().includes(needle));
    } else if (note.summary?.toLowerCase().includes(needle)) {
      score = 200;
      const idx = note.summary.toLowerCase().indexOf(needle);
      match = note.summary.substring(idx, idx + 60);
    }
    if (score > 0) hits.push({ ...note, score, match });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, 10);
}

function initSearchUI() {
  const searchBox = document.getElementById('searchBox');
  if (!searchBox) return;
  fetchSearchIndex();
  fetchNotes();
  searchBox.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = searchBox.value && searchBox.value.trim();
      if (q) window.location.href = '/search.html?q=' + encodeURIComponent(q);
    }
  });
}

function initGlobalSearchHotkey() {
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchBox = document.getElementById('searchBox');
      if (searchBox) searchBox.focus();
    }
  });
}

export { initSearchUI, initGlobalSearchHotkey, fetchSearchIndex, fetchNotes, getIndex, getNotes, doSearch };
