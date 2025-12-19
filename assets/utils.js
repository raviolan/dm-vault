/**
 * utils.js - Common utility functions used across modules
 * Provides DOM helpers, string escaping, SVG icon generation, and URL encoding
 */

// Expose utilities to global scope for use across modules
window.AppUtils = {
    /**
     * Get element by ID (shorthand helper)
     * @param {string} id - Element ID
     * @returns {HTMLElement|null}
     */
    byId: (id) => document.getElementById(id),

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML-safe string
     */
    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Convert file path to URL
     * @param {string} id - File path/id
     * @returns {string} URL path
     */
    urlFor: (id) =>
        '/' + id
            .replace(/\\/g, '/')
            .replace(/\.md$/i, '.html')
            .split('/')
            .map(encodeURIComponent)
            .join('/'),

    // svgIcon moved to assets/site/icons.js

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function} Debounced function
     */
    debounce: (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Request animation frame wrapper for smooth DOM updates
     * @param {Function} callback - Callback to execute
     */
    raf: (callback) => {
        requestAnimationFrame(callback);
    },

    /**
     * Deep clone object/array
     * @param {*} obj - Object to clone
     * @returns {*} Cloned object
     */
    deepClone: (obj) => JSON.parse(JSON.stringify(obj)),

    /**
     * Generate unique ID for todos
     * @returns {string} Unique ID
     */
    genId: () => Math.random().toString(36).substr(2, 9),
};

// Shorthand exports for common functions
window.byId = window.AppUtils.byId;
window.escapeHtml = window.AppUtils.escapeHtml;
window.urlFor = window.AppUtils.urlFor;
// svgIcon is now provided by assets/site/icons.js
window.genId = window.AppUtils.genId;
