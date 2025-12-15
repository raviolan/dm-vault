# Phase 4 Decision Report

## graph.html
- Is this an active user-facing feature/page? **YES**
- What breaks if it’s removed? 
  - Navigation links in many HTML pages, partials, and data files will break.
  - The "Graph" page will be inaccessible from the UI.
- Classification proposal: **KEEP** (not an archiving target)
- If KEEP: Marked as not an archiving target.
- Should it be protected? **Recommended: YES** (since it is a user-facing feature linked from navigation and many pages)

## graph.json
- Is this an active user-facing feature/page? **NO** (data file, not a direct page)
- What breaks if it’s removed?
  - JS modules (assets/graph.js, assets/site-note.js) will fail to load graph data, breaking graph visualizations/features.
- Classification proposal: **GENERATED** (rebuildable, but must ensure all consumers are updated before archiving)
- If ARCHIVE-LATER: References in assets/graph.js and assets/site-note.js must be redirected/removed first.
- Should it be protected? **Recommended: NO** (but must be present for graph features to work)

## session.html
- Is this an active user-facing feature/page? **YES**
- What breaks if it’s removed?
  - Navigation links in many HTML pages, partials, and data files will break.
  - The "Session" page will be inaccessible from the UI.
- Classification proposal: **KEEP** (not an archiving target)
- If KEEP: Marked as not an archiving target.
- Should it be protected? **Recommended: YES** (since it is a user-facing feature linked from navigation and many pages)
