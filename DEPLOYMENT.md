# GitHub Pages deployment

Site: https://akshetha.github.io/dfp-chatbot/
Repository: https://github.com/akshetha/dfp-chatbot
Publishing branch: `codex/github-pages`, root directory `/`, branch-based Pages build.

The deployment branch contains only `index.html` and `.nojekyll`. Audit transcripts, test fixtures, and local tooling are not in its published file tree. Repository visibility was not changed.

The October 27, 2026 deployment includes the fixed-response implementation, eligibility-first routing for incidental accessibility descriptions, problem-report routing, and application-status questions phrased as “open now.” Fifteen regression tests passed before publication.

Deployment commit: `6b45b13eaa46f73239737a5ccf4347395909ca52`
App SHA-256: `839a9cabb7336b5ddbfd99769babd5e8c049eb48b1c604777b551248908f7485`

For future updates, run `node --test tests/*.test.cjs`, copy the current root `index.html` to the publishing branch, commit and push that branch, and check the Pages build and live site. Do not publish the repository root from the development branch: it includes audit materials. The publishing branch is separate from the local development checkout, whose uncommitted work has been preserved.
