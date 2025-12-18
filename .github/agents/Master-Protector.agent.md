---
name: Master-Protector
description: "Refactor assets/site.js safely into injected-UI binders + small modules. Preserve ALL current behavior and storage keys."
target: vscode
tools: ["read", "search", "edit", "execute"]
---

# DM Vault Refactor Guardrails (site.js focus)

## Mission
Refactor `assets/site.js` (currently monolithic) into a maintainable structure that supports injected global UI:
- Left navigation panel
- Right panel/drawer
- Header strip
- Footer

**Goal architecture:** injected HTML provides markup; JS provides *binders* that attach behavior to injected roots.
Binders must be safe to call multiple times and must survive DOM replacement.

## Non-negotiables (do not violate)
1) **No functionality loss.** All current behaviors must remain working.
2) **No storage key changes** unless explicitly instructed and migrated safely.
3) **No rename/removal of global APIs** that pages rely on (examples currently used: `window.svgIcon`, `window.togglePin`, `window.saveSessionSnapshot`).
4) **No “init once” global flags for injected DOM.**
   - Do NOT use `window.__dm_sidebar_inited` / `window.__dm_header_inited` as the sole guard.
   - Use per-element guards like `root.dataset.dmBound = "1"` so replacement triggers re-bind.
5) **Binders are idempotent and element-scoped.**
   - Example: `bindSidebar(leftRoot)` checks `leftRoot.dataset.dmSidebarBound`.
6) **Prefer event delegation** on injected containers to avoid rebinding many listeners.
7) **Keep diffs small and reversible.** No large rewrites in one pass.

## Required workflow (every single step)
- Read `docs/agent/STATUS.md` first.
- Do exactly ONE step from STATUS “Next step”.
- Update `docs/agent/STATUS.md` at the end:
  - what changed
  - files touched
  - smoke tests performed (pass/fail)
  - next step (one step only)

## Refactor phases (execute in order)
### Phase 0 — Spec + map (NO behavior changes)
Create:
- `docs/agent/sitejs-map.md` (responsibility map + dependencies)
- `docs/agent/sitejs-spec.md` (behavior contract + invariants)
- `docs/agent/STATUS.md` (tracking)

### Phase 1 — Make injected behavior reliable (still mostly in site.js)
Convert injected-DOM logic to binder functions:
- `dmSidebarInit()` becomes a wrapper that finds the injected root and calls binder(s)
- Same for header (and right panel if injected)
Replace global init flags with per-element `dataset` guards.

### Phase 2 — Extract binder functions into separate files
Move binder code out of `site.js` into small files (non-module scripts unless build supports ESM).
Update the shared injected partial(s) so scripts load in a stable order.

### Phase 3 — Extract feature modules
Split into focused scripts:
- search dropdown + ctrl/cmd+k
- hovercard previews
- shortcuts
- session snapshot export
- global todo
- drawers/panels/resizers
Only after Phase 1–2 are stable.

### Phase 4 — Cleanup
- Remove duplicates (ex: multiple `window.saveSessionSnapshot` definitions)
- Remove dead/commented legacy blocks (move to `/archive/` if needed)

## Smoke test checklist (run manually)
After each step, verify at least:
- Sidebar injected: nav expands/collapses, split-click landing works, recents renders, quick filter works
- Header injected: edit button works (if present), ctrl/cmd+k focuses search, Save Session / Bookmark buttons behave
- Right drawer: toggle/pin/reveal states persist
- Search dropdown renders results and hides properly
- Hovercard does not appear in left nav, appears on main content links
- Todo tool works on pages with todo elements
- No console errors on load

## “Stop” conditions
If a change would require touching many files or risks behavior drift:
- STOP
- write a short note in STATUS with the risk
- propose a smaller next step instead
