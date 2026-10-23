# RanMotion contributor guide

RanMotion is a bilingual, browser-only learning environment for web animation with GSAP. It helps a learner understand motion through short explanations, editable examples, and verifiable challenges. Keep the experience approachable for a beginner while preserving the accuracy of real GSAP behavior.

Start with [README.md](README.md) for installation and the product overview. The documentation map is in [docs/INDEX.md](docs/INDEX.md).

## Commands

Use Node.js 24 LTS and npm. The lockfile is authoritative.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
```

Run `npm run format` only when deliberately formatting project files. Browser verification needs a Chromium install and uses the local wrapper:

```sh
npm run test:e2e:install
npm run test:e2e
```

## Architecture boundaries

- `src/app/` owns locale, motion preference, and validated persisted learning progress.
- `src/data/` is the source of truth for bilingual curriculum content, examples, and types. Preserve stable lesson and example IDs because browser storage and deep links depend on them.
- `src/pages/` composes route-level experiences; `src/components/` contains reusable application shell and shared interface pieces.
- `src/features/lab/` owns CodeMirror, the isolated preview, challenge evaluation, and lab-specific styling. Do not move preview execution into the host application.
- `src/styles/` holds shared visual tokens and application styles. Reuse tokens and existing components before adding one-off values or patterns.
- `e2e/` covers real browser behavior. Keep focused unit tests close to logic where the project already does so.

Route-level code is intentionally lazy outside the home page. Do not eagerly import CodeMirror or the preview runtime into a route that does not need it.

## Product rules

- Indonesian is the default locale; visible learner-facing copy and curriculum additions require Indonesian and English versions.
- A lesson must remain understandable in its intended order. Preserve prerequisites, objectives, predictions, feedback, recaps, and challenge hints when editing curriculum.
- Progress, challenge completion, settings, and drafts live only in the current browser. Storage can fail, so retain the in-memory fallback and its visible notice.
- Reduced motion defaults from the device setting and can be overridden by the learner. New motion needs a usable paused, manual, or static path.
- Keyboard focus, readable error recovery, responsive layouts down to 320px, and plain-language explanations are product requirements.

## Preview and privacy boundaries

- Learner code executes only inside the sandboxed iframe. Preserve its opaque origin, restrictive CSP, local GSAP sources, source-size limit, and animation-report limit.
- Parent/iframe communication must continue to verify the iframe window, per-frame token, and Zod schema. Treat browser messages as untrusted input.
- User code is an educational experiment surface, not a hardened execution service. Do not claim stronger isolation than the implementation provides.
- The app has no account, backend, analytics, or code-upload service. Do not add network collection, telemetry, or remote code loading without explicit product approval and documentation updates.

## Before finishing a change

1. Check the affected route at desktop and narrow widths, including keyboard interaction when controls changed.
2. Run the smallest relevant static or unit check, then broader checks when the changed boundary warrants it.
3. Run the focused browser test for preview, persistence, navigation, or accessibility behavior when that behavior changes.
4. Update the relevant documentation if routes, curriculum structure, storage, sandbox behavior, or verification commands change.

Do not change deployment settings, dependency policy, storage keys, lesson IDs, or the preview security boundary as incidental cleanup.
