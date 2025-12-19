

// Ensure the global namespace exists
window.DM = window.DM || {};

// Import extracted modules (order matters for globals and DOM events)
import './runtime.js';
import './icons.js'; // svgIcon global
import { initPinToggle } from './tags-and-pins.js'; // togglePin global
import './modals.js';
import './shortcuts.js';
import './hovercard.js';
import { initRightDrawer } from './right-drawer.js';
import { initSidebar } from './sidebar/init.js';
import { initTopbarButtons } from './topbar.js';

// Assign compatibility globals (svgIcon, togglePin)
// svgIcon is set by icons.js
initPinToggle(); // sets window.togglePin

// Call init functions in the same order as the old site.js
// (runtime.js runs immediately)
// icons.js runs immediately
// modals.js runs immediately (auto-inits)
// shortcuts.js runs immediately (auto-inits)
// hovercard.js: needs explicit init
import { initHovercard } from './hovercard.js';
initHovercard();

// right-drawer.js: needs explicit init
initRightDrawer();

// sidebar/init.js: needs explicit init
initSidebar();

// topbar.js: needs explicit init
initTopbarButtons();
