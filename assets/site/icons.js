// assets/site/icons.js
// Icon module extracted from utils.js

(function () {
    // Namespace for icons
    window.DM = window.DM || {};
    window.DM.icons = window.DM.icons || {};

    /**
     * Generate SVG icon HTML
     * @param {string} name - Icon name (from icon enum)
     * @param {number} size - Icon size in pixels (default 16)
     * @returns {string} SVG HTML string
     */
    function svgIcon(name, size = 16) {
        const icons = {
            search: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
            close: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">
        <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" stroke-width="2"/>
        <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" stroke-width="2"/>
      </svg>`,
            link: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1v14M1 8h14"/>
      </svg>`,
        };
        return icons[name] || '';
    }

    window.DM.icons.svgIcon = svgIcon;
    window.svgIcon = svgIcon; // Compatibility global
})();
