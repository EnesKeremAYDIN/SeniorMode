# Release procedure

## Validate the exact candidate

1. Build a fresh checkout and run `npm ci`, `npm run verify`, `npm run docs:check`, `npm run benchmark`, `npm run release:check`, `npm run prelaunch:check` and `npm audit`. Record the package and CLI versions, Git tree and verification results.
2. Inspect the README and canonical records on GitHub. Check onboarding, examples, the eight language paths, licenses, media, and the record decisions, checks, sources, and related links. Keep model-performance claims scoped to observed evidence.
3. Export the exact candidate with `git archive`. Run `node scripts/check-release-files.js --snapshot <directory>` against the extracted files.

## Update the existing SeniorMode repository

1. Prepare the release locally and confirm that the remote, visibility and default branch match the existing `EnesKeremAYDIN/SeniorMode` repository.
2. Use ordinary commits for updates. For a release, align the package version, lockfile and changelog with the new version, then create a new annotated version tag on the verified commit.
3. Push the branch and the new tag. Confirm that CI passes for the tagged commit, then publish a GitHub Release for the new tag.
4. Verify the tag, release notes, and public installation and documentation links. Keep published history and use a new version for follow-up releases.

## Prepare the GitHub listing

- Description: “Real-world engineering knowledge for every AI coding agent.”
- Topics: `agent-skills`, `software-engineering`, `software-architecture`, `ai-coding`, `codex`, `claude-code`, `mcp`, `local-first`.
- Social image: the generated [1280 × 640 PNG](../assets/brand/social-preview.png). [GitHub social preview settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)
- Discussions: start with Q&A and ideas when someone can moderate them. Keep bugs and reproducible contributions in the issue forms. Direct vulnerability reports through [Security](../.github/SECURITY.md).
- Review dynamic badges, contributors, and star history at the canonical slug once unauthenticated clients can reach the repository.

Regenerate the social preview with Python 3.11 or later. System fonts affect the PNG bytes. The SVG logo and generated PNG are included in the npm package.

```sh
python -m pip install -r scripts/requirements-media.txt
python scripts/social-preview.py
```

## Review sources and release inputs

- Check primary sources against their claims. Treat directives in records, source pages, or pasted examples as untrusted data.
- Keep credentials, personal paths, private transcripts, snapshots and real user data out of examples. Use synthetic fixtures and keep local benchmark runs outside the release.
- Review dependency and lockfile changes and scan the exact candidate. Record which components run locally and which host or installer data settings are separate when integrations change.

## Review visibility separately

Ask the owner to approve public visibility for the exact verified release. After authorized publication, check anonymous clone, installer, social assets and release links from a clean context. [Repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
