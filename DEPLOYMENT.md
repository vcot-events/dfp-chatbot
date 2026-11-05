# Current Sites deployment

Site: https://dialogue-for-peace-chatbot.famedguide2.chatgpt.site
Repository: https://github.com/vcot-events/dfp-chatbot

Published November 5, 2026 through Sites with owner-only access. The deployed
static assets contain only `index.html`; audit materials are excluded. All 16
tests passed before deployment. The separate local `hosted-site/` checkout is
ignored by this repository. GitHub pushes do not automatically redeploy Sites.

# Previous GitHub Pages deployment

Site: https://akshetha.github.io/dfp-chatbot/
Repository: https://github.com/akshetha/dfp-chatbot
Publishing branch: `codex/github-pages`, root directory `/`, branch-based Pages build.

The deployment branch contains only `index.html` and `.nojekyll`. Audit transcripts, test fixtures, and local tooling are not in its published file tree. Repository visibility was not changed.

The October 27, 2026 deployment includes the fixed-response implementation, eligibility-first routing for incidental accessibility descriptions, problem-report routing, and application-status questions phrased as “open now.” Sixteen regression tests passed before the latest publication. The latest deployment also recognizes discrimination/antisemitism and related incident wording, interpreter requests, and the spelling “eligble.”

Previously verified deployment commit: `84565e431af56eee2d173270c64d2110e41c0275` (use the publishing branch head for the current deployment)
App SHA-256: `935072d348a0e5f8cc5252d65995c4ec2e47faa2317cf67e995e86dc1253174a`

For future updates, **commit and push `main` first, then update the live site**:

1. Run `node --test tests/*.test.cjs` and commit the intended changes on `main`.
2. Push `main` to GitHub and verify the remote commit.
3. Fetch the pushed source and copy `origin/main:index.html` into the publishing branch, keeping only `index.html` and `.nojekyll` in its file tree.
4. Commit and push the publishing branch with the source commit recorded in the commit message.
5. Verify the Pages build, the live HTML hash, and the relevant browser behavior.

Do not deploy directly from uncommitted local files. Do not publish the development repository root: it includes audit materials.

Routine program answers no longer append the program contact line. Explicit contact requests, accommodation questions, mistreatment concerns, and unsupported-question fallbacks retain human-help details.
