// header-loader.js
// Loads the shared header partial into #site-header

fetch('assets/partials/header.html')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load header partial: ' + response.status);
    return response.text();
  })
  .then(html => {
    const container = document.getElementById('site-header');
    if (container) {
      container.innerHTML = html;
      window.__dm_header_injected = true;
      window.dispatchEvent(new Event('dm-header-injected'));
    } else {
      console.error('site-header container not found');
    }
  })
  .catch(err => {
    console.error('Header injection failed:', err);
  });
