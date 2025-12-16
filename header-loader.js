// header-loader.js
// Loads the shared header partial into #site-header


// Inject header.html into #site-header
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
    // After header, inject global-ui.html into #site-global-ui
    fetch('assets/partials/global-ui.html')
      .then(resp => {
        if (!resp.ok) throw new Error('Failed to load global-ui partial: ' + resp.status);
        return resp.text();
      })
      .then(globalHtml => {
        const globalUiContainer = document.getElementById('site-global-ui');
        if (globalUiContainer) {
          globalUiContainer.innerHTML = globalHtml;
          window.__dm_global_ui_injected = true;
          window.dispatchEvent(new Event('dm-global-ui-injected'));
        } else {
          // Not all pages may have this container
        }
      })
      .catch(err => {
        console.error('Global UI injection failed:', err);
      });
  })
  .catch(err => {
    console.error('Header injection failed:', err);
  });
