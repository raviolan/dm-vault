# User README — Getting started with your personal DM Vault

Welcome! This project is designed so every user keeps their own private copy of their campaign notes.

Principles
- Your notes (characters, NPCs, locations, sessions) live in the `data/` folder on your machine — this folder is not part of the shared repository and will not be published upstream.
- The repository contains the application code and templates only.

Quick start

1. Seed an empty data folder (only needed once):

```bash
npm run seed-data
```

2. Run the preview site:

```bash
npm ci
npm run build
npm run serve
```

3. If you had existing notes in the repository and want to move them into `data/`, run (dry-run first):

```bash
node scripts/migrate-user-content-to-data.js --dry-run
# inspect output, then
node scripts/migrate-user-content-to-data.js --confirm
```

Safety & upgrades
- The project intentionally ignores the `data/` folder so your content remains private and under your control.
- When the maintainer releases updates, they will update the application files only — your `data/` will not be overwritten.
- Before running any major upgrade, export a backup of `data/` (copy the folder somewhere safe) or use the migration helper which creates a backup automatically:

```bash
node scripts/migrate-upgrade.js --dry-run
# to apply
node scripts/migrate-upgrade.js --confirm
```

Backing up and restoring
- To export your content, copy the `data/` folder somewhere safe. To restore, copy files back into `data/` and restart the app.

Need help?
- Open an Issue in the project repository (don't paste private data). For targeted help, describe your install method (local, docker) and attach logs.
