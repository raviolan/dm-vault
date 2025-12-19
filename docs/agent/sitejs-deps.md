# site.js Dependency Map

## Runtime/Dependency Note (2025-12-18)

served root = ./site

script tag path(s) = /assets/site.js?v={{VERSION}} (see assets/partials/layout.html and all main HTML pages)

actual runtime site.js file = ./site/assets/site.js

- The build pipeline uses esbuild to bundle assets/site/entry.js and all modules under assets/site/ into a single classic JS file at assets/site.js.
- The server (scripts/serve.js) serves ./site as the web root, so /assets/site.js resolves to ./site/assets/site.js.
- There is no /web/assets/site.js in the repo; all script tags and runtime references point to /assets/site.js.
- This file must remain classic (no ESM imports/exports) for compatibility with all HTML pages and partials.

Acceptance: All HTML pages and partials load /assets/site.js, which is built and served from ./site/assets/site.js.

## Script Load Points

**site.js** is loaded by the following files (directly or via partials):
- assets/partials/layout.html (main partial for all pages)
- Locations.html
- 2025-12-04.html
- Arcs.html
- Characters.html
- session.html
- search.html
- Tools.html
- NPCs.html
- 03_Sessions.html
- 01_Arcs/Arcs.html
- 03_PCs/Characters.html
- 03_PCs/Page.html
- 000_today's tools/Madryck.html
- graph.html
- test-sections.html
- tags/index.html
- backup/pre-sections-fix/*.html (legacy/backup)

**Script tag example:**
```html
<script src="/assets/site.js?v={{VERSION}}"></script>
```

## Required Globals (and where they come from)

- `window.svgIcon` — defined in assets/site.js and assets/utils.js, used for rendering inline SVG icons in UI elements (sidebar, right panel, bookmarks, etc).
- `window.togglePin` — defined in assets/site.js and assets/right-panel.js, used for pinning/unpinning tools in the right panel and updating UI.
- `window.initializeNavSectionState` — defined in assets/site.js, used to initialize/restore sidebar navigation state (expand/collapse, active section, etc).
- `window.saveSessionSnapshot` — (not shown in code above, but referenced in docs/agent/sitejs-map.md and Master-Protector.agent.md) — must be present for session save button to work.
- `window.addFavorite` — defined in assets/favorites.js, used for bookmark button in header.
- `window.createInplaceEditor` — expected to be present for inline editing (WYSIWYG), provided by assets/wysiwyg.js.

## Usage/Definition Map
- `$` — shorthand for getElementById, defined in utils.js as `window.byId`.
- `showStatus` — status message display, defined in site.js.
- `addFavorite` — defined in favorites.js, used in site.js and header.
- `saveSessionSnapshot` — must be present for session save button (see Master-Protector.agent.md).
- `createInplaceEditor` — provided by wysiwyg.js, used for inline editing.

## Duplicates/Overlaps
- `addKeyboardShortcuts` — defined as a noop in keyboard-nav.js, real implementation in shortcuts-guide.js.
- `initializeSidebar` — called in site.js, may be defined elsewhere for custom sidebar logic.
- `initializeFavorites` — defined in favorites.js, called in site.js.
- `right-panel.js` — handles right panel logic, also defines `togglePin` and uses `svgIcon`.
- `wysiwyg.js` — provides `createInplaceEditor` for inline editing.

## Build/Bundling Strategy
- We are introducing a bundling step using [esbuild](https://esbuild.github.io/) to output `assets/site.js` from a new entry point at `assets/site/entry.js`. This allows us to split the code into modules under `assets/site/` while keeping the public script path stable for all templates and users.
- **Recommendation:** Keep /assets/site.js as a built output, loaded via a single script tag in layout.html and all main pages. Avoid splitting into multiple script tags unless refactoring for true module boundaries.

## What Would Break If...
- **window.svgIcon**: All UI icons (sidebar, right panel, bookmarks, etc) would disappear or show as blank/missing. Buttons relying on icons would lose visual cues.
- **window.togglePin**: Pin/unpin functionality in the right panel and toolbars would stop working. UI would not update to reflect pin state.
- **window.initializeNavSectionState**: Sidebar navigation state (expanded/collapsed sections, active section) would not initialize or restore, leading to broken or confusing navigation for users.

---

# Bundling strategy for assets/site.js

## Approach

We are introducing a bundling step using [esbuild](https://esbuild.github.io/) to output `assets/site.js` from a new entry point at `assets/site/entry.js`. This allows us to split the code into modules under `assets/site/` while keeping the public script path stable for all templates and users.

## Steps

1. **Source Split**: Move code from `assets/site.js` into logically separated modules under `assets/site/` (e.g., `runtime.js`, `modals.js`, `shortcuts.js`, `hovercard.js`, etc.).
2. **Entry Point**: Create `assets/site/entry.js` that imports all modules in the correct order.
3. **Bundling**: Use esbuild to bundle `assets/site/entry.js` into `assets/site.js`.
4. **Build Script**: Add an npm script to run the bundler.
5. **No Template Changes**: The public script path `/assets/site.js` remains unchanged, so no HTML or template updates are needed.

## Why esbuild?
- Fast, zero-config, and works with plain JS.
- No dependencies required for simple bundling.

## Usage
- Run `npm run build` to generate the final `assets/site.js`.
- During development, edit files in `assets/site/` and re-bundle as needed.

## Acceptance
- Site loads with the same URL (`/assets/site.js`).
- `npm run build` and `npm run serve` still work.

---

_Last updated: 2025-12-18_
