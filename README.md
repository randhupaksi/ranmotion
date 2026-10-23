# RanMotion

An interactive learning space for web animation with GSAP. See the movement, change the code, understand why, and make it your own.

RanMotion is an independent learning project in the Rancode family. It is not affiliated with GSAP or Webflow. Indonesian is the default language; every lesson and application control also has an English version.

## Documentation

The contributor and architecture documentation is organized in [docs/INDEX.md](docs/INDEX.md). It includes the learning model, design system, preview-runtime safety boundary, testing workflow, and the historical [UX and accessibility audit](docs/quality-audit.md).

## Run locally

Use **Node.js 24 LTS** (see `.nvmrc`) and npm. The machine used for initial setup had Node 23.8.0; switch to Node 24 for the supported dependency runtime.

```sh
npm ci
npm run dev
```

The npm configuration includes a peer-resolution workaround for npm 11.1.0. Review `.npmrc` when upgrading npm. Installation is locked in `package-lock.json`.

## Learning experience

- **42 bilingual lessons in 9 sections:** two visual introductions without coding, followed by 40 guided practices covering transforms and basic tweens; easing, delay, and repeat; timelines, overlap, labels, and stagger; interface interaction; ScrollTrigger, scrub, and pin; SVG attributes and strokes; MotionPath; responsive setup and cleanup; and two small projects.
- Start at `/learn/gsap-foundations`, then plan an animation at `/learn/animation-blueprint` using playback, progress, distance, duration, and easing controls. Both introductions include a comprehension question and can be completed without opening an editor.
- Practice lessons provide an objective, mental model, explanation, prediction with feedback, code walkthrough, chapter glossary, prerequisites, experiment checklist, code variation, common mistake, challenge with progressive hints, and recap.
- A JavaScript editor runs real GSAP code against the exact HTML and CSS shown in its read-only tabs.
- Syntax and runtime errors appear directly under the relevant code line, with a highlight, a plain-language explanation where available, and focus on the editor. Errors without a reliable source location appear after the code. Editing clears stale diagnostics; Reset restores a working example.
- Duration, distance, easing, scrub, and pin controls update the corresponding code constants. Run explicitly to apply changes.
- Playback supports pause, replay, reset, and manual progress inspection. Timeline tracks reflect actual tween start times, durations, overlap, and labels.
- Scroll examples use an independent scroller. A progress slider provides a touch and keyboard alternative to nested scrolling.
- Challenges check values from executed GSAP animations, not just strings in the editor. Interface challenges also require trying the preview interaction.
- Learning progress, challenge completion, language, motion preference, and per-example code drafts persist in the same browser. Lesson and playground views share a draft for the same example.
- Lessons can also be marked complete independently of the demo. Home, learning, and progress views resume a valid unfinished last lesson, then recommend the first unfinished lesson. Existing saved lesson IDs are preserved.
- Search (`Ctrl/Cmd + K`) focuses its input; Enter opens the first match, Tab reaches other matches, and Escape closes it. Page navigation resets scroll and focus after content loads; anchor links wait for their actual destination. Changing a playground example retains local context.
- The decorative ticker has a pause toggle. Motion preferences, keyboard playback, readable editor text, and larger interaction targets support different ways of learning.

## Routes

| Route                    | Purpose                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `/`                      | Introduction, working animation demo, prerequisites, and learning path overview |
| `/learn`                 | Complete curriculum, completion filters, and lesson search                      |
| `/learn/:lessonId`       | A complete lesson and its interactive challenge                                 |
| `/playground?example=to` | Open practice with an example selector                                          |
| `/challenges`            | All challenges, filtered by completion                                          |
| `/progress`              | Saved progress and next recommended lesson                                      |
| `/reference`             | Searchable concept reminders and links back to lessons                          |

All lessons are available without locking earlier stages. The suggested order helps beginners build on what they have learned.

## Visual direction

RanMotion has its own “motion fieldnotes” visual language: electric lime inspired by the energy of GSAP, deep green-black surfaces, and restrained apricot markers. Editorial type, numbered studies, coordinate grids, and open ruled lists make the experience feel like an animation workshop rather than a generic course dashboard. The same design system adapts across lessons, challenges, progress, and the live editor.

## Preview execution and privacy

Editor code runs in an iframe with `sandbox="allow-scripts"`, an opaque origin, and a restrictive Content Security Policy. The frame cannot access the application's DOM or browser storage. GSAP, ScrollTrigger, and MotionPathPlugin are bundled locally into the preview; the preview does not fetch executable code from a CDN. Messages are checked against the specific iframe window, a per-frame token, and a Zod report schema.

The exercise editor is deliberately focused on short GSAP experiments. It supports tweens, timelines, and event handlers, validates syntax before execution, and rejects loop statements, imports, and exports. It is not a general-purpose JavaScript execution service or a hardened environment for adversarial code. The 12,000-character source limit and 150-animation report limit keep educational examples bounded.

No account, backend, analytics, or code-upload service is configured. Browser storage failures fall back to in-memory progress with a visible notice. Draft writes also handle storage failures. Clearing site data removes locally saved progress and drafts; different browsers and devices have separate data.

Reduced motion follows the device preference on first use and can be overridden in learning settings. It shows static results with manual inspection rather than automatic playback.

## Project structure

```text
src/
  app/                 Locale, motion preference, and validated local progress
  components/          Shared layout, search/settings dialogs, home demo, boundaries
  data/                Original bilingual curriculum, example code, and content types
  features/lab/        CodeMirror, isolated GSAP runtime, challenge checks, lab styling
  pages/               Route-level learning, practice, and progress experiences
  styles/              Shared visual tokens and responsive application styles
e2e/                   Chromium tests for learning and preview behavior
```

The heavy editor and sandbox runtime load only when a learning or playground route needs them. The home page does not import CodeMirror.

## Commands and verification

```sh
npm run typecheck
npm run format
npm run format:check
npm test
npm run build
npm run preview
npm run test:e2e:install
npm run test:e2e
```

The Playwright wrapper uses the ignored workspace-local `.playwright-browsers` directory. It reuses an existing RanMotion server on port 4173 or starts and closes its own direct Vite child process, avoiding Windows process-tree teardown problems. To test production output, run a built preview on port 4173 before starting the suite. E2E coverage includes both visual introductions, every practice example and challenge solution, progress and draft persistence, language switching, inline diagnostics, parent-storage isolation, timeline and scroll controls, reduced motion, search focus, route/anchor positioning, and horizontal overflow at 1440, 768, 390, and 320 pixels. Axe scans nine representative routes at desktop/mobile sizes plus dialog and error states. Results include incomplete findings for manual review; automated scans do not establish full accessibility conformance. Screenshot artifacts are written to ignored `.artifacts/`. See [the UX and accessibility audit](docs/quality-audit.md) for findings and verification scope.

`npm run format` formats the project with Prettier; `npm run format:check` checks formatting without changing files. `npm run lint` runs Oxlint. `npm test` runs Vitest; browser behavior is covered by the E2E suite.

VS Code workspaces recommend the Prettier extension and format supported files on save.

## Static hosting

`npm run build` produces `dist/`. A host must fall back to `index.html` for client routes. `public/_redirects` supports hosts with Netlify-style redirect files; `vercel.json` declares Vite, `npm ci`, `npm run build`, the `dist/` output, and the SPA fallback for Vercel.

## CI/CD

GitHub Actions runs the quality workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) for pull requests targeting `main`, pushes to `main`, and manual dispatch. It installs the lockfile dependencies with `npm ci`, checks Prettier formatting, runs Oxlint and curriculum integrity tests, type-checks and builds the production site, installs Chromium with its Linux dependencies, and runs the Playwright browser suite. The workflow uses read-only repository permission, cancels superseded runs, and retains browser diagnostics for seven days when E2E fails. It requires no GitHub secrets and does not deploy the site.

For continuous deployment, connect `randhupaksi/ranmotion` to a Vercel project through Vercel Git Integration and set `main` as the production branch. Vercel can then create preview deployments for pull requests and deploy production from the configured production branch. This provider connection and branch setting live in the Vercel dashboard; repository files cannot create them. To ensure production promotion waits for CI, enable Vercel Deployment Checks or require the CI status before merging to `main`. See [Vercel Git deployments](https://vercel.com/docs/git) and [Vercel Deployment Checks](https://vercel.com/docs/deployment-checks).

## References and third-party code

Lesson explanations and examples are original to RanMotion. API behavior follows the [GSAP documentation](https://gsap.com/docs/v3/), [timeline documentation](https://gsap.com/docs/v3/GSAP/Timeline/), [ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [MotionPath documentation](https://gsap.com/docs/v3/Plugins/MotionPathPlugin/), and [matchMedia documentation](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>). The editor follows [CodeMirror's basic setup](https://codemirror.net/examples/basic/).

GSAP's bundled copyright and license notices are preserved in the iframe source. GSAP is subject to its [standard license](https://gsap.com/standard-license); it should not be described as MIT-licensed. Dependencies retain their own licenses. MotionPath and introductory SVG lessons are included. Flip, DrawSVGPlugin, and framework-specific integration remain beyond the current curriculum; the SVG stroke exercise uses native stroke properties.
