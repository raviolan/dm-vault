# Footer Injection Rollout Audit

**Date:** 2025-12-15

## Injected pages so far
- index.html
- Arcs.html
- Locations.html
- Characters.html
- 03_Sessions.html
- Tools.html
- NPCs.html (Batch 4)
- 04_NPCs/Adult Imperial Dragon.html (Batch 4)
- 03_PCs/Page.html (Batch 4)

## Reverted
- 2025-12-04.html (footer injection reverted; avoid dated/user-like pages)

## Pages to avoid (strengthened rule)
- All YYYY-MM-DD.html (dated/user-private)
- Specific entity pages (e.g., 04_NPCs/<name>.html, individual PC/NPC sheets) unless explicitly approved
- All protected pages/features (see protected-paths.json):
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
  - graph.html
  - session.html

## Safe next candidates (top 10)
- NPCs.html
- Tools.html (already injected)
- test-sections.html (protected, skip)
- 03_PCs/Page.html (protected, skip)
- 03_PCs/Characters.html (protected, skip)
- 01_Arcs/Arcs.html (protected, skip)
- 000_today's tools/Madryck.html (protected, skip)
- search.html (protected, skip)
- session.html (protected, skip)
- graph.html (protected, skip)
- test-sections.html (protected, skip)
- Madryck.html (protected, skip)
- Adult Imperial Dragon.html
- NPCs.html
- test-sections.html
- Page.html

**Recommended for Batch 4:**
- NPCs.html
- Adult Imperial Dragon.html
- Page.html

**Rule:**
- Avoid all YYYY-MM-DD.html (dated/user-private)
- Avoid specific entity pages (e.g., 04_NPCs/<name>.html, individual PC/NPC sheets) unless explicitly approved
- Avoid all protected pages/features (see protected-paths.json)

**Note:** Only non-protected, non-dated, non-user-private pages are listed as safe. Confirm with latest repo state before proceeding.
