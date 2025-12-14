(function(){
  const qs = (k)=>{const m = window.location.search.match(new RegExp('[?&]'+k+'=([^&]+)')); return m?decodeURIComponent(m[1].replace(/\+/g,' ')):''};
  const escapeHtml = (s)=> String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function urlFor(id){ return '/' + id.replace(/\\/g,'/').replace(/\.md$/i,'.html').split('/').map(encodeURIComponent).join('/'); }

  function renderPreview(note, container){
    if(!container) return;
    if(!note){ container.innerHTML = '<div class="empty">No preview</div>'; return }
    const title = escapeHtml(note.title||'');
    const summary = escapeHtml((note.summary||'').substring(0,100));
    const headings = (note.headings||[]).slice(0,5).map(h=>'<li>'+escapeHtml(h)+'</li>').join('');
    const tags = (note.tags||[]).map(t=>' <span class="tag">'+escapeHtml(t)+'</span>').join('');
    container.innerHTML = `
      <div class="preview-card">
        <h3 class="preview-title"><a href="${urlFor(note.id)}">${title}</a></h3>
        <div class="preview-meta">${tags}</div>
        ${summary?('<div class="preview-summary">'+summary+(note.summary && note.summary.length>100? '...' : '')+'</div>'):''}
        ${headings?('<ul class="preview-headings">'+headings+'</ul>'):''}
        <div class="preview-actions"><a href="${urlFor(note.id)}" class="btn">Open</a></div>
      </div>
    `;
  }

  function doPageSearch(q){
    q = (q||'').trim().toLowerCase();
    const out = [];
    if(!q) return out;
    const isTag = q.startsWith('#');
    const term = isTag? q.slice(1) : q;
    for(const it of (window.INDEX||[])){
      if(!it || !it.title) continue;
      const titleMatch = it.title.toLowerCase().includes(term);
      const tagMatch = (it.tags||[]).some(t=>t.toLowerCase().includes(term));
      const headingMatch = (it.headings||[]).some(h=>h.toLowerCase().includes(term));
      const summaryMatch = (it.summary||'').toLowerCase().includes(term);
      if(isTag? tagMatch : (titleMatch || headingMatch || summaryMatch)){
        out.push(it);
      }
      if(out.length>200) break;
    }
    return out;
  }

  function renderResults(results, listEl, previewEl){
    if(!listEl) return;
    if(!results.length){ listEl.innerHTML = '<div class="no-results">No results</div>'; renderPreview(null, previewEl); return }
    listEl.innerHTML = results.map(r=>{
      const tags = (r.tags||[]).map(t=>'<span class="tag">'+escapeHtml(t)+'</span>').join(' ');
      const preview = (r.headings||[])[0] || (r.summary||'');
      const previewShort = escapeHtml((preview||'').substring(0,120));
      return '<div class="search-row" data-id="'+escapeHtml(r.id)+'">'
        + '<div class="row-title"><a href="'+urlFor(r.id)+'">'+escapeHtml(r.title)+'</a></div>'
        + '<div class="row-meta">'+tags+'</div>'
        + (previewShort? '<div class="row-preview">'+previewShort+'</div>' : '')
        + '</div>';
    }).join('');

    // attach click handlers
    Array.from(listEl.querySelectorAll('.search-row')).forEach((el, idx)=>{
      el.addEventListener('click', (e)=>{
        const id = el.getAttribute('data-id');
        const note = (window.NOTES||[]).find(n=>n.id===id) || (window.INDEX||[]).find(n=>n.id===id);
        renderPreview(note, previewEl);
      });
      el.addEventListener('mouseenter', ()=>{
        const id = el.getAttribute('data-id');
        const note = (window.NOTES||[]).find(n=>n.id===id) || (window.INDEX||[]).find(n=>n.id===id);
        renderPreview(note, previewEl);
      });
    });

    // Auto-preview first
    const first = results[0];
    const firstNote = (window.NOTES||[]).find(n=>n.id===first.id) || first;
    renderPreview(firstNote, previewEl);
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const input = document.getElementById('searchPageInput');
    const listEl = document.getElementById('searchPageResults');
    const previewEl = document.getElementById('searchPreview');
    const stats = document.getElementById('searchStats');
    if(!input || !listEl) return;

    function run(q){
      const results = doPageSearch(q);
      renderResults(results, listEl, previewEl);
      if(stats) stats.textContent = results.length + ' result' + (results.length===1? '':'s');
    }

    // If query provided in URL, populate and run
    const q = qs('q') || '';
    if(q){ input.value = q; run(q); }

    // Enter executes a search (keeps on page and previews)
    input.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        e.preventDefault(); const v = input.value.trim(); if(v) run(v);
      }
    });

    // Debounced typing
    let t;
    input.addEventListener('input', ()=>{
      clearTimeout(t); t = setTimeout(()=>{ run(input.value); }, 180);
    });
  });
})();
