// nav-loader.js (from site/assets)
(function(){
  async function render() {
    try {
      const res = await fetch('/assets/nav.json', {cache: 'no-store'});
      if (!res.ok) return;
      const data = await res.json();
      const root = document.getElementById('navSections');
      if (!root) return;
      const html = data.sections.map(sec => {
        const items = (sec.items || []).map(i => '<li><a class="nav-item" href="'+i.href+'"><span class="nav-icon">•</span><span class="nav-text">'+i.title+'</span></a></li>').join('');
        return '<li class="nav-group"><details class="nav-details '+(sec.cls||'')+'" open><summary class="nav-label"><span class="nav-icon">'+(sec.icon||'')+'</span><span>'+sec.label+'</span></summary>'+(items?('<ul class="nav-list">'+items+'</ul>'):'')+'</details></li>';
      }).join('');
      root.innerHTML = html || root.innerHTML;
    } catch (e) {
      console.debug('nav-loader: failed to load nav.json', e);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render); else render();
})();
