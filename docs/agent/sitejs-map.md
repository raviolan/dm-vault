# site.js Responsibility Map

## Responsibilities (grouped by feature)

- **Sidebar (left nav):**
  - Sidebar init (dmSidebarInit)
  - Split-click navigation for category landing
  - Nav section state (expand/collapse, active, breadcrumb)
  - Recents tracking and rendering
  - Quick filter and per-section mini filters
  - "Show only this section" toggle
  - Left drawer (toggle, pin, collapse/expand all)
- **Header (top bar):**
  - Header init (dmHeaderInit)
  - Inject Save Session and Bookmark buttons
  - Keyboard shortcuts (global, ctrl/cmd+k, blur, collapse, bookmark, save)
- **Right panel/drawer:**
  - Drawer toggle, pin, reveal, adaptive layout
  - (Some right panel tools moved to right-panel.js)
- **Search:**
  - Search box, results rendering, search page redirect
- **Hovercard:**
  - Hovercard preview for main content links (not left nav)
- **Session snapshot:**
  - Export session notes, todos, pins as files
- **Todo tool:**
  - Global todo list (add, edit, drag, collapse, hide completed)
- **Lightbox:**
  - Image lightbox for avatars and headers
- **Delegated modals:**
  - Create/delete page forms (delegated event)
- **Resizable panels:**
  - Left/right panel resizers, width persistence
- **Misc:**
  - Color-coded tags
  - Inplace editor (edit button)

## Globals exported to window
- svgIcon
- togglePin
- saveSessionSnapshot
- initializeNavSectionState

## localStorage keys used
- pins
- sessionNotes
- graphTodos
- drawerPinned
- drawerOpen
- rightActiveTool (commented)
- rightPinnedTools (commented)
- rightPaneTop (commented)
- rightPaneBottom (commented)
- rightPaneSplit (commented)
- leftDrawerPinned
- leftDrawerOpen
- navOpenSections
- recents
- collapsedSections
- navOnlySection
- todoHideCompleted
- todoIdSeq

## Selectors targeting injected UI
- .left (sidebar root)
- .right (right panel root)
- .top (header root)
- #navSections, .nav
- #drawerToggle, #drawerPin, #drawerReveal (right panel)
- #leftDrawerToggle, #leftDrawerPin, #leftCollapseExpand, #leftDrawerReveal (left panel)
- .top .search (header search)
- #saveSession, #bookmarkPage (header buttons)

## IIFEs that will fail if injection happens after load
- Delegated modals (safe: event delegation)
- Sidebar/left drawer (safe: event delegation, but some selectors run at load)
- Header button injection (runs at load, will not inject if .top missing)
- Right drawer (runs at load, will not bind if .right missing)
- Lightbox (runs at load, will not bind if avatars/headers missing)
- Todo tool (runs at load, will not bind if todo elements missing)
- Recents, quick filter, section filters, only-section (run at load, will not bind if elements missing)
- Inplace editor (runs at load, will not bind if edit button missing)
- Resizers (runs at load, will not bind if resizer elements missing)
- Color-coded tags (runs at load, will not bind if .tag elements missing)
