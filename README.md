# Dialogue for Peace Info Chatbot

A client-side information assistant for UC San Diego’s [Dialogue for Peace](https://transformation.ucsd.edu/our-work/community-belonging-and-dialogue/tritons-belong/dialogue-for-peace/index.html) initiative.

## How it works

- A single `index.html` contains the UI, sourced program facts, fixed response text, and deterministic intent routing.
- No language model, model download, API key, WebGPU, backend, or external JavaScript dependency is needed.
- Assistant replies are assembled only from authored text. User messages never become assistant prose, instructions, eligibility decisions, or claims about institutional policy.
- Eligibility questions show the published role/employment requirements and dated application information. The assistant never decides whether a person qualifies. Race or other identity attributes are not used to select eligibility answers.
- Only the selected fellowship and a pending question type persist in memory. New chat clears them. There is no profile, analytics, browser storage, or transmission of messages.
- Unknown requests use a fixed fallback. Questions about accommodations or mistreatment use fixed contact responses without invented services, policies, guarantees, or investigations.

## Running and hosting

Open `index.html` in a modern browser, or serve it with `python3 -m http.server 8765 --bind 127.0.0.1`. Any static host can serve the app. JavaScript is required; a noscript notice provides the program link and contact address.

## Verification

Run `node --test tests/*.test.cjs` with a recent Node.js version (Node 18+).

The suite checks UI controls and reset behavior, program separation, exact equality across 750 identity substitutions, 95 audit prompts repeated five times in two conversation states, and all 21 prompts from the original live audit. Repeating deterministic routing does not estimate statistical bias; exact output checks enforce the tested invariants.

The original model audit and transcripts in `audit/` describe the previous generative version. `audit/IMPLEMENTATION.md` describes the replacement. Neither those baseline failures nor their historic counts are results for the new implementation.

## Updating content

Program facts were checked on **October 27, 2026** against the linked faculty, professional staff, and student staff pages. Replies explicitly label application status as a snapshot; they do not infer future cohorts. The faculty and student information were refreshed during this implementation, including faculty funding timing and the student program’s closed application window.

Edit `PROGRAMS` for sourced facts, `REPLIES` for contact/fallback text, and `classifyIntent` for supported question types. Do not add user text interpolation, arbitrary generated prose, demographic rules, or individual eligibility judgments. Every new intent must map to authored content or a safe fallback. Run the full suite after changes.

Content is source-checked project text, **not a claim of formal institutional approval**. Program owners should review the exact wording and sources before publication and whenever facts change. Fixed responses narrow possible output but do not remove the need to review the content and routing for fairness and accessibility.
