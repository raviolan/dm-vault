# Publishing images and releases

This project publishes container images and release artifacts when you publish a GitHub Release.

Primary publishing target (recommended): GitHub Container Registry (GHCR)

- The workflow uses the repository `GITHUB_TOKEN` to login and push images to `ghcr.io/${{ github.repository_owner }}/dm-vault`.
- Requirements:
  - Ensure Actions have `packages: write` permission (the `release.yml` sets this via `permissions`).
  - No extra secrets are required for GHCR if `GITHUB_TOKEN` is permitted to write packages.

Optional: Docker Hub push

- If you prefer Docker Hub, add the following repository secrets:
  - `DOCKERHUB_USERNAME` — your Docker Hub username
  - `DOCKERHUB_TOKEN` — a Docker Hub access token (or password)
  - `DOCKER_IMAGE` — optional, e.g. `yourdockerhubuser/dm-vault:latest` (fallback provided)
- When these secrets are present the release workflow will also push the same image to Docker Hub.

Local build and push examples

Build locally and push to GHCR (requires a personal access token, or use `gh auth login`):

```bash
# tag with a release-like tag
docker build -t ghcr.io/your-org/dm-vault:1.0.0 .
docker login ghcr.io --username YOUR_GH_USERNAME --password YOUR_PERSONAL_ACCESS_TOKEN
docker push ghcr.io/your-org/dm-vault:1.0.0
```

Build locally and push to Docker Hub:

```bash
docker build -t yourdockerhubuser/dm-vault:1.0.0 .
docker login --username yourdockerhubuser
docker push yourdockerhubuser/dm-vault:1.0.0
```

Notes
- GHCR integrates well with GitHub Actions; no extra secrets required if `GITHUB_TOKEN` has package write permissions.
- If you prefer Docker Hub only, the workflow will use your provided secrets.
- If you want the releases to also open PRs against user forks/templates, I can add a follow-up workflow that opens automated PRs when a Release is published.
