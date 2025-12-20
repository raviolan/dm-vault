


// Ensure the global namespace exists
window.DM = window.DM || {};

// Import extracted modules (order matters for globals and DOM events)
import './runtime.js';
import './icons.js'; // svgIcon global

import { initPinToggle } from './tags-and-pins.js'; // togglePin global
import './modals.js';
import './shortcuts.js';
import { bindHeader, bindSidebar, bindRightPanel } from './binders.js';


export function boot() {
	const g = globalThis;
	if (g.__dm_booted) return;
	g.__dm_booted = true;
	g.__dm_boot = boot;
	g.__dm_entry_version = "boot-01d";
	console.log("[dm] boot ran", g.__dm_entry_version);

	// Assign compatibility globals (svgIcon, togglePin)
	// svgIcon is set by icons.js
	initPinToggle(); // sets window.togglePin


	// All global UI inits now handled by binders


	// --- Event listeners for injection events ---
	window.addEventListener('dm-header-injected', bindHeader);
	window.addEventListener('dm-nav-inited', bindSidebar);
	window.addEventListener('dm-right-panel-injected', bindRightPanel);

	// Fallback: also bind on DOMContentLoaded or immediately if DOM is ready
	const fallbackBind = () => {
		bindHeader();
		bindSidebar();
		bindRightPanel();
	};
	if (document.readyState !== "loading") {
		fallbackBind();
	} else {
		document.addEventListener('DOMContentLoaded', fallbackBind, { once: true });
	}
}

// Always boot immediately (deterministic)
boot();
