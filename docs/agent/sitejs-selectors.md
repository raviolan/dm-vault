# sitejs-selectors.md

This document lists every selector and ID used by site.js, grouped by feature. Use this as the single source of truth for selectors before centralizing them in code.

---

## Sidebar / Navigation
- `.left` — Sidebar root
- `#navSections` — Main navigation sections container
- `.nav` — Fallback navigation container
- `.nav-details` — Navigation section (expandable/collapsible)
- `.nav-label` — Section label (usually a <summary>)
- `.nav-label span:last-child` — Section label text
- `.nav-item` — Navigation link
- `.nav-group` — Navigation group container
- `#navRecents` — Recent pages list
- `#navQuick` — Quick filter input
- `.nav-list` — List of navigation items
- `.nav-mini-input` — Per-section mini filter input
- `.nav-only` — "Show only this section" toggle button

## Header
- `.header`, `header`, `.entity-header` — Header root(s)

## Main Content
- `main.main` — Main content area
- `article` — Fallback content area

## Modals & Forms
- `#createPageForm` — Create page form
- `#createPageStatus` — Status message for create page
- `#deletePageForm` — Delete page form
- `#deletePageConfirm` — Confirmation input for delete
- `#deletePageStatus` — Status message for delete page
- `#editPageModal` — Edit page modal
- `#editPageContent` — Edit page textarea
- `button[type="submit"]` — Submit buttons in forms

## Buttons & Controls
- `.btn-primary` — Primary action button (e.g., save)
- `.bookmark-btn` — Bookmark button
- `.chip` — UI chip/button
- `#btnEditPage` — Open editor button
- `#saveSession` — Save session button
- `#bookmarkPage` — Bookmark page button

## Panels & Drawers
- `.resizer-left` — Left panel resizer
- `.resizer-right` — Right panel resizer
- `.right` — Right panel root
- `#drawerToggle` — Right drawer toggle button
- `#drawerReveal` — Right drawer reveal button
- `#drawerPin` — Right drawer pin button
- `.drawer-collapsed` (body class) — Right drawer collapsed state
- `.left-collapsed` (body class) — Left drawer collapsed state
- `#leftDrawerToggle` — Left drawer toggle button
- `#leftDrawerPin` — Left drawer pin button
- `#leftCollapseExpand` — Collapse/expand all button
- `#leftDrawerReveal` — Left drawer reveal button

## Right Panel Tools (legacy/commented)
- `.tool-tab` — Tool tab button
- `.tool-pin` — Tool pin button
- `#toolHome` — Home tool view
- `#toolTodo` — To-Do tool view
- `#toolNote` — Notepad tool view
- `#toolHomePins` — Home tool pins container
- `.pane-body[data-pane="top"]` — Top pane body
- `.pane-body[data-pane="bottom"]` — Bottom pane body
- `.pane-tab[data-pane]` — Pane tab button
- `.right-split` — Right panel split container
- `.pane-resizer-h` — Horizontal resizer for split
- `#toolNotepad` — Notepad textarea

## Miscellaneous
- `.top` — Top bar
- `.top .search` — Search box container
- `#searchBox` — Search input
- `#searchResults` — Search results container
- `.hovercard` — Hover preview card
- `[data-pin]` — Pin/bookmark icon
- `#breadcrumbText` — Breadcrumb display
- `#localGraph` — Local graph element

## Debug/Dev (commented)
- `*` — All elements (for outline/debug)

---

**Note:** Some selectors are used in commented-out (legacy) code and are marked as such. This list is comprehensive for site.js as of 2025-12-18.