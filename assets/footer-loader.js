// assets/footer-loader.js
// Dynamically loads the canonical footer partial into the page.

(function() {
  fetch('/assets/partials/footer.html')
    .then(function(response) { return response.text(); })
    .then(function(html) {
      var placeholder = document.getElementById('footer-placeholder');
      if (placeholder) {
        placeholder.outerHTML = html;
      }
    });
})();
