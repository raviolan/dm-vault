console.log('[EG-debug] external debug script loaded');
(function(){
    console.log('[EG-debug] locating generate button');
    const btn = document.getElementById('enemy-generate-btn');
    console.log('[EG-debug] generate button found:', !!btn);
    if (btn) btn.addEventListener('click', ()=> console.log('[EG-debug] generate button clicked (external)'));
})();
