# DM-vault Refactor Runbook (Authoritative + Reset-Proof)

This document is the ONLY authoritative plan for the DM-vault refactor agent.
If the agent is cleared or context is lost, the agent must rebuild state by reading:
- `docs/agent/REFRACTOR-RUNBOOK.md` (this file)
- `docs/agent/STATUS.md`
- `docs/agent/refactor-log.md` (append-only)

## Non-negotiable safety rules (read first)

### R0 — Stop if working tree is not clean
Before any phase work:
- Run `git status --porcelain`.
- If output is not empty: STOP and report what is dirty/untracked.
  - Allowed remediation: `git restore .` (discard), or `git stash push -m "<reason>"` (park).
  - Do NOT proceed until clean.

### R1 — Protected features must never break
Protected features include:
- Weather mini-app (entry script: `assets/weather.js`)
- Any files/paths listed in `docs/agent/protected-paths.json` (this file is authoritative once it exists)

The agent must never delete, move, rename, or silently rewrite protected files.
If a change would affect a protected file, the agent must STOP and ask for approval.

### R2 — Do not touch user-private content
Never modify user-private notes/content folders unless the runbook phase explicitly allows it.
Default rule: treat campaign content pages as user content; code/partials/scripts as maintainer content.

### R3 — Commit policy (avoid “HTML rewrite spam”)
Many scripts/build steps can rewrite lots of HTML formatting/ordering.
Unless a phase explicitly says to commit regenerated HTML:
- **Do not commit** large “unrelated HTML rewrites”.
- If a build step rewrites many files: confirm build passes, then `git restore .` to discard those rewrites before committing the intended changes.
- Always commit in small batches with clear messages.

### R4 — Archive policy (preferred over deletion)
When removing duplicates/obsolete files:
- Move to `archive/` preserving relative structure when possible.
- Do not delete unless explicitly instructed.
- If something still references a file you want to archive, you must keep it or add a redirect/pointer (phase dependent).

### R5 — Stash policy (if user has a stash)
If a stash exists (check `git stash list`):
- Do NOT apply/pop a stash unless the runbook phase explicitly tells you to.
- Never “clean up stashes” without instruction.

---

## Standard startup routine (mandatory every time)

1) Read this runbook.
2) Read `docs/agent/STATUS.md`.
3) Read the last ~80 lines of `docs/agent/refactor-log.md`.
4) Run `git status --porcelain` and confirm clean. If not clean: STOP.
5) If `docs/agent/protected-paths.json` exists:
   - Read it.
   - Treat it as a hard “do-not-touch” boundary.
6) Run `npm run verify` (if the script exists). If verify fails: STOP and fix only what verify requires.

Log all of the above in `docs/agent/refactor-log.md`.

---

## Repo invariants and key commands

### Invariants
- `npm run verify` must pass at all times after Phase 1 is complete.
- `npm run build` must pass at all times after Phase 0 is complete.
- Protected feature entry points must remain present and referenced by their HTML pages.

### Key commands
- Verify: `npm run verify`
- Build: `npm run build`
- Serve: `npm run serve` (only when requested by a phase)
- Clean accidental rewrites: `git restore .`
- Park accidental rewrites: `git stash push -m "temp: <reason>"`

---

## Phase 0 — Bootstrap (already completed in your timeline)
### Goal
Create reset-proof agent docs and scaffolding.

### Outputs
- `docs/agent/REFRACTOR-RUNBOOK.md`
- `docs/agent/STATUS.md`
- `docs/agent/refactor-log.md`
- `docs/agent/reports/.gitkeep`
- `archive/.gitkeep`
- `.gitignore` updated to ignore `.DS_Store`

### Completion criteria
- Build + serve smoke passes (optional but recommended early)
- No user-private content touched

---

## Phase 1 — Register Protected Features + Verification (already completed in your timeline)
### Goal
Make protected features “fail-fast” if broken.

### Outputs
- `docs/agent/protected-paths.json` containing:
  - `assets/weather.js`
  - the HTML pages that reference them
  - backend endpoints for enemy saving (if present) and any files required for that
- `scripts/tools/verify-protected-paths.cjs`
- `package.json` adds: `"verify": "node scripts/tools/verify-protected-paths.cjs"`

### Completion criteria
- `npm run verify` PASS
- `npm run build` PASS

---

## Phase 2 — Inventory & Reports (already completed in your timeline)
### Goal
Create reports to drive safe cleanup without changing behavior.

### Outputs (committed)
- `docs/agent/reports/duplicates.md`
- `docs/agent/reports/suspected-generated.md`

### Rules
- Reports only; NO moving/renaming/deleting in Phase 2.

### Completion criteria
- Reports committed
- `npm run verify` PASS
- `npm run build` PASS (discard build rewrites before commit if needed)

---

## Phase 3 — Cleanup in Batches (you are here)
### Goal
Archive duplicates/obsolete/generated outputs safely in small batches.

### Inputs
- `docs/agent/reports/duplicates.md`
- `docs/agent/reports/suspected-generated.md`
- `docs/agent/protected-paths.json` (hard boundary)

### Batch size
Max 5 files per batch.

### Pre-move safety checks (MANDATORY PER FILE)
For each candidate file `X` to archive:
1) Confirm `X` is NOT in protected paths.
2) Confirm there is an authoritative “Keep” counterpart when archiving duplicates.
3) Reference scan (must be clean outside archive):
   - `grep -RIn "<X filename>" . | grep -v '^./archive/'`
   - If any references exist outside `archive/`, DO NOT move it in this batch.
4) Only then move to `archive/` (preserve structure when feasible).

### Post-batch checks (MANDATORY)
After each batch:
- `npm run verify` PASS
- `npm run build` PASS
- If build rewrites many HTML files: `git restore .` before committing (unless the batch explicitly intended regeneration)
- Update `docs/agent/STATUS.md` + `docs/agent/refactor-log.md`
- Commit only intended archive moves + logs/status

### Completion criteria
- Major duplicates archived
- Generated artifacts either:
  - clearly rebuilt on demand, or
  - explicitly kept and documented why

---

## Phase 4 — Refactor for Injection/Partials (future)
### Goal
Reduce inline-coded components by moving repeated UI chunks into partials/templates and rebuilding pages from canonical sources.

### Rules
- Protected apps must remain functional and referenced.
- Refactor one component at a time.
- After each component refactor:
  - `npm run verify` PASS
  - `npm run build` PASS
  - optional `npm run serve` smoke

### Suggested order
1) Identify “authoritative” HTML sources (single canonical pages) vs generated copies.
2) Extract shared UI elements into partials (header/nav/sidebar/footer).
3) Ensure rebuild script generates consistent output.
4) Only then consider committing regenerated HTML as part of refactor (this is where large HTML changes become “intended”).

---

## Phase 5 — User-content Separation + Upgrade Path (future)
### Goal
Make it easy for end-users to update the template without overwriting their notes.

### Target model
- Maintainer code/templates live in repo.
- User content lives in a separate folder (e.g., `data/` or a user repo), ignored or excluded from updates.
- Provide migration scripts and documented workflow:
  - “Pull updates safely”
  - “Keep personal content isolated”

---

## Phase 6 — Release & Distribution (future)
### Goal
Support non-developer users with stable update channels.

### Options (choose later)
- Git template / GitHub template repo workflow
- Docker image releases
- Desktop app packaging (if ever)

---

## Incident response checklist (when something goes wrong)
If anything breaks:
1) STOP.
2) Paste `npm run verify` and/or `npm run build` output into `docs/agent/refactor-log.md`.
3) Revert last change:
   - `git restore .` (uncommitted)
   - or `git revert <commit>` (committed)
4) Re-run verify/build.
5) Only proceed once green.

---

## Current Phase Pointer
The single source of truth for “where we are now” is `docs/agent/STATUS.md`.
The agent must update STATUS at the end of every batch/phase.

END.
