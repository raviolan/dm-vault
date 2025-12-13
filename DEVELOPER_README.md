# Developer README — DM Vault

This document explains how to work on the project as a maintainer.

Key principles
- User content must never be committed to the repository. All user content lives under `data/` which is ignored by `.gitignore`.
- Code, templates, and default assets are part of the repo and can be updated and released.

Important files and scripts
- `.gitignore` — ensures `data/` is not committed.
- `scripts/migrate-user-content-to-data.js` — safe migration script to move existing local content into `data/`. Dry-run by default. Re-run with `--confirm` to apply.
- `scripts/first-run-seed.js` — seeds `data/` with base folders on first-run (no overwrite).
- `scripts/migrate-upgrade.js` — non-destructive migration helper; creates a backup before making changes.
- `Dockerfile` / `docker-compose.yml` — containerized deployment.
- `.github/workflows/*` — CI and release automation (publishes GHCR images and release artifacts).

Local workflow
1. Before committing the repo to a public remote, ensure `data/` does not contain any personal content. Use `node scripts/migrate-user-content-to-data.js --confirm` to move your content locally into `data/` and then keep `data/` out of the repo.
2. Use `npm run seed-data` to create an empty `data/` layout for new users (safe to run; it only acts if `data/` is empty).
3. Run `npm run build` to generate the site and `npm run serve` to preview.

Releases and updates
- Publish GitHub Releases and the release workflow will build artifacts and push container images to GHCR (and optionally Docker Hub if secrets are set).
- For user-installed instances (forks/templates), prefer non-destructive migration scripts and document manual steps in `PUBLISHING.md`.

Testing migrations
- Always run migration scripts with `--dry-run` first.
- The `migrate-upgrade` script will create a timestamped backup named like `data-backup-YYYY-MM-DDTHH-MM-SS-sss`.

If you want, I can add automatic migration recipes for known schema changes — tell me what data format you want for user content (JSON, HTML files per entity, etc.).
