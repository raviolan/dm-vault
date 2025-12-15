# Header Placement Audit — Phase 4C

Date: 2025-12-15

## Tracked HTML files with HEADER-PARTIAL-INJECTED

- Arcs.html — BAD (header slot is INSIDE <div class="layout">)
- Characters.html — OK (header slot is ABOVE <div class="layout">)
- Locations.html — BAD (header slot is INSIDE <div class="layout">)
- NPCs.html — OK (header slot is ABOVE <div class="layout">)
- Tools.html — BAD (header slot is INSIDE <div class="layout">)
- index.html — OK (header slot is ABOVE <div class="layout">)
- search.html — OK (header slot is ABOVE <div class="layout">)

BAD = header slot is INSIDE <div class="layout"> (should be moved)
OK = header slot is ABOVE <div class="layout"> (correct)

First 3 BAD pages to fix:
- Arcs.html
- Locations.html
- Tools.html

(Protected/user-private pages excluded from fix list.)
