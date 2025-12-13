// Minimal markdown shim — intentionally light to avoid 404s
// Real implementation can be restored if needed.
window.renderMarkdown = window.renderMarkdown || function(html){ return html; };
