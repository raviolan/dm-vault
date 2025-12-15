# Refactor Status (Reset-Proof Tracker)

This file prevents progress loss when the AI agent is cleared or context is summarized.
Update this file **after every commit**.

---




## Current State

* Repo: dm-vault
* Branch: main
* Current phase: Phase 4C




* Current step (exact):
  - Phase 4C Header Batch 3 Fix v2: moved header injection slot above .layout (was rendering in panel) on Characters.html, NPCs.html, search.html. Verify PASS. No protected features touched.




## Last Completed


* Commit: (pending)
* Summary:
  * Phase 4C Pilot Batch 4: Footer injection on NPCs.html, 04_NPCs/Adult Imperial Dragon.html, 03_PCs/Page.html. No protected features or unrelated files touched. npm run verify: PASS.
  * Strengthened 'Pages to avoid' rule: avoid all YYYY-MM-DD.html, specific entity pages (e.g., 04_NPCs/<name>.html, individual PC/NPC sheets) unless explicitly approved, and all protected pages/features (see protected-paths.json).
* Checks run:
  * npm run verify: PASS

## Next Step (Single Action Only)

* Next step: Phase 4C — Refactor Pilot (1 small injection change)
  - Select a single repeated UI chunk for partialization (e.g., header, nav, or footer)
  - Extract into a partial/template and update one canonical HTML page to use it
  - Ensure protected features remain functional and referenced
  - Run verify/build after the change, commit only intended edits

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
