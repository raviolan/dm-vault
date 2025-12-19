# sitejs-storage.md

This document lists every localStorage key referenced in site.js, including legacy (commented-out) keys. Use this as the single source of truth for storage keys before centralizing them in code.

---

## Active Storage Keys

### panelLeftW
- **Purpose:** Width (in px) of the left sidebar panel.
- **Type:** Number (as string)
- **Usage:** Remembers user’s preferred left sidebar width.

### panelRightW
- **Purpose:** Width (in px) of the right sidebar panel.
- **Type:** Number (as string)
- **Usage:** Remembers user’s preferred right sidebar width.

### drawerPinned
- **Purpose:** Whether the right drawer is pinned open.
- **Type:** Boolean (as JSON string)
- **Usage:** Persists right drawer pin state.

### drawerOpen
- **Purpose:** Whether the right drawer is open.
- **Type:** Boolean (as JSON string)
- **Usage:** Persists right drawer open/closed state.

### leftDrawerPinned
- **Purpose:** Whether the left drawer is pinned open.
- **Type:** Boolean (as JSON string)
- **Usage:** Persists left drawer pin state.

### leftDrawerOpen
- **Purpose:** Whether the left drawer is open.
- **Type:** Boolean (as JSON string)
- **Usage:** Persists left drawer open/closed state.

### navOpenSections
- **Purpose:** List of open navigation sections.
- **Type:** Array of strings (as JSON)
- **Usage:** Remembers which nav sections are expanded.

### recents
- **Purpose:** List of recently visited pages.
- **Type:** Array of objects (as JSON)
- **Usage:** Stores recent page visits for sidebar display.

### navOnlySection
- **Purpose:** Label of the currently-only visible nav section.
- **Type:** String
- **Usage:** Persists "Show only this section" toggle.

### pins
- **Purpose:** List of user-pinned/bookmarked pages.
- **Type:** Array of strings (as JSON)
- **Usage:** Stores bookmarks for quick access.

---

## Legacy/Commented-Out Keys

### rightActiveTool
- **Purpose:** Name of the active right panel tool (e.g., "home", "todo", "note").
- **Type:** String
- **Usage:** (Legacy) Remembers last active tool in right panel.

### rightPinnedTools
- **Purpose:** List of pinned right panel tools.
- **Type:** Array of strings (as JSON)
- **Usage:** (Legacy) Stores which right panel tools are pinned.

### rightPaneTop
- **Purpose:** Name of the tool in the top pane (split mode).
- **Type:** String
- **Usage:** (Legacy) Remembers top pane tool in split mode.

### rightPaneBottom
- **Purpose:** Name of the tool in the bottom pane (split mode).
- **Type:** String
- **Usage:** (Legacy) Remembers bottom pane tool in split mode.

### rightPaneSplit
- **Purpose:** Split position between top/bottom panes.
- **Type:** String (e.g., "50%")
- **Usage:** (Legacy) Remembers split position in right panel.

### sessionNotes
- **Purpose:** Contents of the notepad tool for session notes.
- **Type:** String
- **Usage:** (Legacy) Autosaves notepad content in right panel.

---

**Note:** This list is comprehensive for site.js as of 2025-12-18. Legacy keys are marked and may be referenced only in commented-out code.