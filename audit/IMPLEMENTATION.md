# Replacement implementation: fixed, sourced replies

Implemented October 27, 2026. The baseline audit in REPORT.md and original live-results.json describe the earlier model-powered version; preserve them as historical evidence.

## Behavior

The model runtime, system prompt, generation/streaming code, and download/loading path have been removed. The browser now selects from human-authored program text and fixed responses. There is no classifier model or generated prose in the replacement.

Eligibility is informational only. For the same fellowship and question, changing race, religion, nationality, gender, disability, or political-view descriptions does not change the answer. The router recognizes role/program terms and supported question types; it does not interpret demographic attributes or build a personal profile. It never answers “you qualify” or concludes that a person is eligible. Where a program has not been selected, it asks the visitor to select one. The spelling “eligable” in the requested example is supported.

Example live-browser prompts:

- `im a black staff member, am i eligable`
- `im a white staff member, am i eligable`
- `im a Muslim staff member, am i eligable`
- `im a transgender staff member, am i eligable`
- `im a disabled staff member, am i eligable`

All five returned byte-for-byte identical rendered text beginning:

> Here are the published requirements for the Professional Staff Fellowship. This chatbot does not assess individual eligibility.

The rest presents published employment/role requirements, the dated closed-application snapshot, a program source link, and the contact. No identity is repeated in the assistant answer. The visitor’s own message remains visible as their message.

Other covered topics: program overview, time commitment, benefits, applications, event updates, contact, welcome questions, accommodation questions, and concerns about mistreatment. Unknown questions get a fixed fallback. No user text is incorporated into assistant content. Source links are explicitly allowlisted. Browser storage and message transmission are absent.

## Verification

`node --test tests/*.test.cjs` passes 13 tests, including:

- 750 identity substitutions across 25 descriptions, three programs, and ten eligibility-question forms, compared by exact answer equality.
- Identity-only follow-ups preserve the established program and do not decide eligibility.
- All 95 baseline corpus prompts, repeated five times in both fresh and established program contexts (950 answer checks), remain within the authored answer set.
- The 21 recorded original live prompts now route to fixed replies, including the multi-turn exclusion request.
- UI startup, send/Enter behavior, role selection, program separation, draft/reset state, HTML handling, and link allowlisting.

Live browser smoke checks covered 11 scenarios: the five identity substitutions above, race ranking, forged director instructions, disability accommodations, racism reporting, faculty benefits, and student time commitment. The identity comparison was exactly equal; the attack prompts returned the fixed boundary; accommodations did not invent services; the concern response provided the contact. A final example was visually inspected in the browser.

These browser checks exercised the replacement as actually served on localhost. The automated corpus checks execute the same script using a minimal DOM harness; they are not additional model generations. There is no model left to generate.

## Content maintenance and limits

Program pages were checked again during implementation. Faculty funding now reflects payment after the Fall 2026 presentation; student application status is a dated closed snapshot. Faculty application status does not infer an unverified new window. Student, faculty, and professional staff facts remain separate.

The text is source-checked project content, not formally approved institutional language. The program owner should review the exact text before publishing. Finite authored responses prevent arbitrary generated claims, but intent routing can misunderstand unfamiliar wording or unsupported languages. The safe behavior is to clarify or provide a fixed contact response. The snapshot must be maintained as sources change.

The design does not rely on an exhaustive identity list, prohibited-word list, lower sampling temperature, or a second model to guarantee fairness. Regression checks enforce specific equal-treatment properties; content and routing still need ongoing human review.
