# Phase 4C — Sidebar Injection Plan (PLAN-ONLY)

## Pre-checks
- git status --porcelain: clean
- git stash list: 3 stashes present (none to be popped/applied)
- npm run verify: PASS
- Protected features to avoid: Weather app, Enemy Generator, Session page, Graph page

---

## A) Ranked List of 5 “Best First” Sidebar Candidates (smallest blast radius first)

1. **index.html**
   - Central dashboard, not a protected feature, minimal user content risk, already uses sidebar partial markup.
2. **Arcs.html**
   - Story arc overview, not protected, similar sidebar structure as index.html.
3. **Locations.html**
   - World/locations overview, not protected, sidebar structure matches index.html.
4. **Tools.html**
   - General tools page, not protected, sidebar structure matches index.html.
5. **Characters.html**
   - PC list, not protected, sidebar structure matches index.html.

## B) SINGLE #1 Candidate for Pilot Batch 1

**index.html**
- Safest, most central, minimal risk, and already a template for others.

## C) Pilot Batch 1 Constraints
- At most 5 files changed (will only change 1: index.html)
- At most ONE component (sidebar only)
- No protected pages/features touched
- No mass HTML rewrites required

## D) #1 Candidate Details

- **File to edit:**
  - index.html
- **Sidebar markup to replace:**
  - Replace the entire block:
    ```html
    <aside class="left"><!-- Sidebar Partial: Navigation drawer and sections -->
    ... (drawer/sidebar/nav markup) ...
    </aside>
    ```
  - With a placeholder:
    ```html
    <!-- SIDEBAR-PARTIAL-INJECTED -->
    <div id="site-sidebar"></div>
    <script src="sidebar-loader.js"></script>
    ```
- **Partial existence:**
  - Yes: assets/partials/sidebar.html
- **Loader needed:**
  - Yes: sidebar-loader.js (to be created in /assets/)
- **Injection marker comment:**
  - <!-- SIDEBAR-PARTIAL-INJECTED -->

---

**STOP: Awaiting approval before any edits.**
