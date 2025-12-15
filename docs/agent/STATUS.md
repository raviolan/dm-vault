# Refactor Status (Reset-Proof Tracker)

This file prevents progress loss when the AI agent is cleared or context is summarized.
Update this file **after every commit**.

---

## Current State

* Repo: dm-vault
* Branch: main
* Current phase: Phase 3 (complete)
* Current step (exact): Phase 3 complete. Batch 1 and Batch 2 done. Remaining candidates (graph.html, graph.json, session.html) are still referenced outside archive and are BLOCKED. No further archiving possible in Phase 3.

## Last Completed






* Commit: (pending)
* Summary: (1–3 bullets)
  * Phase 3 complete: Batch 1 and Batch 2 done
  * Remaining candidates blocked by references: graph.html, graph.json, session.html
  * No further archiving possible in Phase 3
  * No user-private content touched; no protected files moved/renamed/deleted
* Checks run:
  * npm run verify: PASS
  * npm run build: PASS

## Next Step (Single Action Only)

* Next step: Phase 4 — Refactor for injection/partials to resolve references and enable further archiving

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
