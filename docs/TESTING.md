# Testing and verification

RanMotion combines static curriculum data, React interaction, persisted browser state, and a sandboxed code preview. Match the validation layer to the boundary changed.

## Commands

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run test:e2e:install
npm run test:e2e
```

`npm run format` writes formatting changes; use it intentionally. `npm run test:e2e:install` installs Chromium into the ignored workspace-local `.playwright-browsers` directory. The E2E wrapper reuses a compatible server on port 4173 or starts a direct Vite child process and cleans it up.

## Verification layers

| Layer                | What it catches                                                                         | When it is most relevant                                             |
| -------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Prettier and Oxlint  | Formatting and lightweight source issues                                                | Any code or content-module edit                                      |
| TypeScript and build | Broken imports, type contracts, route composition, production bundle failures           | Any TypeScript or route edit                                         |
| Vitest               | Curriculum integrity and focused logic contracts                                        | Lesson data, recommendation, validation, parsing, or utility changes |
| Playwright           | Real routing, storage, iframe interaction, playback, challenge, and responsive behavior | User-flow, preview, persistence, navigation, or layout changes       |
| Axe in Playwright    | Detectable accessibility regressions                                                    | Semantic, dialog, focus, control, or layout changes                  |
| Manual review        | Meaning, motion comfort, editor recovery, and visual hierarchy                          | Any learner-facing change                                            |

## Focused change matrix

| Change                                | Minimum useful evidence                                                                          |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Lesson copy or metadata               | Content consistency review, typecheck, relevant curriculum tests                                 |
| Lesson/example ID                     | Compatibility review, curriculum tests, deep-link and saved-progress browser check               |
| Draft or progress persistence         | Unit coverage plus browser reload and storage-failure behavior                                   |
| Editor/preview protocol               | Focused unit tests and browser checks for execution, errors, reset, and parent isolation         |
| Challenge rule                        | Browser test proving an executed animation or interaction satisfies and fails the rule correctly |
| Navigation, dialog, or focus behavior | Keyboard browser check and relevant Axe scan                                                     |
| CSS or responsive layout              | Visual inspection at 1440, 768, 390, and 320 pixels; browser overflow coverage when applicable   |

## Browser-suite expectations

The suite exercises visual introductions, practice examples, challenge solutions, progress and draft persistence, locale switching, inline diagnostics, parent-storage isolation, playback, scroll controls, reduced motion, search focus, route/anchor behavior, and narrow layouts. Axe scans representative desktop/mobile routes and selected dialog/error states.

Artifacts are written to ignored `.artifacts/`; Playwright results belong in ignored test-result directories. Automated accessibility scans can report incomplete findings and do not replace keyboard, screen-reader, or physical-device review.

## CI

The GitHub Actions workflow runs on pull requests to `main`, pushes to `main`, and manual dispatch. It uses `npm ci`, checks formatting and linting, runs curriculum/unit checks, type-checks, builds, installs Chromium, and runs the browser suite. It requires no repository secrets and does not deploy the site.

For a change that changes the supported runtime, test commands, CI behavior, or browser prerequisites, update [README.md](../README.md), [AGENTS.md](../AGENTS.md), and this document together.
