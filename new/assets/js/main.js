(function(){
  function setupShare(btn){
    if(!btn) return;
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: location.href });
      } else {
        navigator.clipboard.writeText(location.href);
        btn.textContent = 'Link copied!';
        setTimeout(()=>btn.textContent='Share', 1400);
      }
    });
  }
  setupShare(document.getElementById('shareFab'));
  setupShare(document.getElementById('shareBtnSide'));
})();