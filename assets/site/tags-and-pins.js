// tags-and-pins.js
// Exports: initPinToggle, initTagColorization, and window.togglePin (compat)

// Pin toggle logic (star button, localStorage 'pins', [data-pin] update)
export function initPinToggle() {
  window.togglePin = function(rel) {
    const pins = JSON.parse(localStorage.getItem('pins') || '[]');
    const i = pins.indexOf(rel);
    if (i >= 0) pins.splice(i, 1);
    else pins.push(rel);
    localStorage.setItem('pins', JSON.stringify(pins));
    // Update all [data-pin] elements for this rel
    document.querySelectorAll('[data-pin]').forEach(el => {
      // If rel is provided, only update matching
      if (el.dataset.rel && el.dataset.rel !== rel) return;
      if (window.svgIcon) {
        el.innerHTML = pins.includes(rel) ? window.svgIcon('star-fill', 18) : window.svgIcon('star', 18);
      } else {
        el.textContent = pins.includes(rel) ? '★' : '☆';
      }
    });
  };
}

// Tag colorization logic (.tag → class mapping)
const TAG_CLASS_MAP = {
  pc: 'tag-pc',
  npc: 'tag-npc',
  location: 'tag-location',
  arc: 'tag-arc',
  planning: 'tag-planning',
};

export function initTagColorization() {
  // Find all .tag elements and apply mapped class
  document.querySelectorAll('.tag').forEach(el => {
    for (const tag in TAG_CLASS_MAP) {
      if (el.textContent && el.textContent.match(new RegExp(`#?${tag}\b`, 'i'))) {
        el.classList.add(TAG_CLASS_MAP[tag]);
      }
    }
  });
}

// Optionally, export the class map for use elsewhere
export { TAG_CLASS_MAP };
