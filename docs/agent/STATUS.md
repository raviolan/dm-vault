# Refactor Status (Reset-Proof Tracker)

This file prevents progress loss when the AI agent is cleared or context is summarized.
Update this file **after every commit**.

---




## Current State

* Repo: dm-vault
* Branch: main
* Current phase: Phase 4C




* Current step (exact):

  - Phase 4C: Sidebar/Header injection stabilization complete. Sidebar injection now requires the wrapper <aside class="left" id="site-sidebar"></aside>. Loader scripts dispatch dm-sidebar-injected / dm-header-injected so UI wiring runs after injection. Verify PASS.




## Last Completed


* Commit: (pending)
* Summary:
  * Phase 4C Pilot Batch 4: Footer injection on NPCs.html, 04_NPCs/Adult Imperial Dragon.html, 03_PCs/Page.html. No protected features or unrelated files touched. npm run verify: PASS.
  * Strengthened 'Pages to avoid' rule: avoid all YYYY-MM-DD.html, specific entity pages (e.g., 04_NPCs/<name>.html, individual PC/NPC sheets) unless explicitly approved, and all protected pages/features (see protected-paths.json).
* Checks run:
  * npm run verify: PASS

## Next Step (Single Action Only)

* Last completed: Phase 4C: sidebar loader bugfix (absolute path, script src); verify PASS.

* Next step: Resume Phase 4C injection batches using the corrected pattern (sidebar/header partials, loader, and handshake events). Ensure all new sidebar/header injections use the wrapper and event handshake. Verify/build after each batch, commit only intended edits.

## Protected Features Snapshot (Must Stay Green)


* Enemy Generator
  * Entry JS path (repo): assets/enemy-generator.js
  * HTML entry page(s):
    - index.html
    - Locations.html
    - Arcs.html
    - 03_PCs/Characters.html
    - 03_PCs/Page.html
    - 01_Arcs/Arcs.html
    - 2025-12-04.html
    - test-sections.html
    - search.html
    - session.html
    - 000_today's tools/Madryck.html
    - data/05_Tools & Tables/Enemy Generator.html
    - assets/partials/layout.html
  * Backend endpoints present? yes (server/index.js)
  * Status: ✅ protected
* Weather app
  * Entry JS path (repo): assets/weather.js
  * HTML entry page(s): (same as above)
  * Backend endpoints present? no
  * Status: ✅ protected
