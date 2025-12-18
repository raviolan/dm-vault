# site.js Behavior Contract and Invariants

## Behavior contract: what MUST keep working
- Sidebar (left nav):
  - Navigation expand/collapse, split-click landing, recents, quick filter, per-section filters, only-section toggle
- Header (top bar):
  - Edit button, ctrl/cmd+k search, Save Session/Bookmark buttons
- Right panel/drawer:
  - Toggle, pin, reveal, adaptive layout, state persistence
- Search:
  - Dropdown renders results, hides properly, search page redirect
- Hovercard:
  - Appears on main content links, not in left nav
- Session snapshot:
  - Export session notes, todos, pins as files
- Todo tool:
  - Add/edit/drag/collapse/hide completed, persists
- Lightbox:
  - Image lightbox for avatars and headers
- Delegated modals:
  - Create/delete page forms work after DOM replacement
- Resizable panels:
  - Left/right panel resizers, width persistence
- Inplace editor:
  - Edit button opens editor/modal

## Explicit invariants
- Do NOT rename or remove any localStorage keys
- Do NOT change or remove any window globals (svgIcon, togglePin, saveSessionSnapshot, initializeNavSectionState)
- Do NOT change event names or event delegation patterns
- All injected UI must be re-bindable after DOM replacement
- All binder functions must be idempotent and element-scoped
- No global "init once" flags for injected DOM (use per-element dataset guards)
- No loss of functionality or regression in any feature above
