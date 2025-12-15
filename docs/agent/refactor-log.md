




# Refactor Log (Append-Only)

This file records every change made by the DM-vault Guardian agent during the refactor process.

- 2025-12-15: Phase 4C Pilot Batch 2 — Footer injection applied to Arcs.html, Locations.html, and Characters.html. Replaced inline footer with placeholder and loader script. No protected features or unrelated files touched. Ran npm run verify: PASS.


		* scripts/convert-right-panel.js → archive/scripts/convert-right-panel.js
		* 04_NPCs/NPCs.html → archive/04_NPCs/NPCs.html
		* backup-index.html → archive/backup-index.html
		* 02_World/Locations.html → archive/02_World/Locations.html
		* scripts/archive/lib/io.js → archive/scripts/archive/lib/io.js
	Attempted to move generated files (notes.json, search-index.json, build-warnings.txt) but they were already absent.
	Ran npm run verify: PASS
	Ran npm run build: PASS
	No user-private content touched; no protected files moved/renamed/deleted.

- 2025-12-15: Phase 3 (batch 2) — Moved scripts/convert-right-panel.cjs → archive/scripts/convert-right-panel.cjs
  Ran npm run verify: PASS
  Ran npm run build: PASS
  No user-private content touched; no protected files moved/renamed/deleted.

- 2025-12-15: Protection update — Added graph.html, session.html, and their required dependencies to protected-paths.json. Updated verify script. Ran verify: PASS. No user-private content touched; no unrelated files changed.

- 2025-12-14: Phase 0 initialized. Created docs/agent/, reports/, and archive/ directories.
- 2025-12-14: Ensured .gitignore includes .DS_Store. Phase 0 complete. Ready for Phase 1.

- 2025-12-15: Phase 1 complete. Registered canonical protected paths for weather.js, enemy-generator.js, and all referencing HTML pages. Created verify-protected-paths.cjs and npm run verify script. Ran verify, build, and serve: all pass, no errors. No user-private content touched.

- 2025-12-15: Phase 2 complete. Generated docs/agent/reports/duplicates.md and docs/agent/reports/suspected-generated.md. Labeled all groups/items. Ran npm run verify and npm run build: all pass, no errors. Discarded build HTML rewrites per runbook. No user-private content touched; no files moved/renamed/deleted.
