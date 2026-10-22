# RanMotion UX and accessibility audit

This audit follows a new learner from the home page to a visual introduction, a first code exercise, a recoverable error, and saved progress. It also covers returning learners, search/settings, keyboard navigation, reduced motion, and narrow screens. Findings are based on source review and browser interaction checks, rather than interviews with new users.

## Findings and changes

| Finding                                                                        | User impact                                                                    | Implemented response                                                                                                                                                                                   |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The first lesson immediately asks learners to edit JavaScript                  | A learner can reach syntax before understanding GSAP’s purpose                 | Two introductory lessons explain GSAP, HTML/CSS/JavaScript roles, tweens, targets, distance, duration, and easing. Visual controls and comprehension feedback come before the code editor.             |
| Home does not define GSAP for a visitor unfamiliar with the term               | The visitor may not know what they will learn or what the primary button opens | The hero defines the product and GSAP, names the next lesson and its duration, and identifies the introduction as requiring no coding.                                                                 |
| Error feedback is below the entire editor/canvas container                     | On mobile, an error and the code that caused it can be far apart               | Syntax and runtime diagnostics render in the editor, after the relevant line. The line is highlighted and focused. A short link returns to the problem; unknown-location errors appear after the code. |
| Runtime messages assume programming vocabulary                                 | Beginners may not know how to recover from ReferenceError or missing elements  | Known runtime failures receive an Indonesian/English explanation while retaining the original technical detail. Editing removes stale errors; Reset restores the example.                              |
| Background clicks and demo controls share playback handling                    | A demo interaction can unintentionally pause or restart transport              | Background activation and a keyboard-accessible canvas button control playback. Demo buttons, focus targets, and inputs retain their own actions.                                                      |
| Route effects run before lazy content is present                               | A challenge anchor or route focus can miss its destination                     | Navigation waits for actual content. New routes start at the top and focus main content; anchors scroll/focus their target. Changing a playground example keeps the picker context.                    |
| Search autofocus is requested while the dialog is closed                       | Keyboard users start on the close button rather than the search field          | After showModal, search explicitly focuses its input. Enter opens the first result. Escape and focus restoration are tested.                                                                           |
| Resume labels do not use the saved last lesson                                 | Returning learners can be sent to a different unfinished lesson                | Home, learning, and progress use a valid unfinished last lesson, with a first-unfinished fallback. Completed-path home navigation opens playground.                                                    |
| Header accessible names do not include their visible text                      | Speech input and screen-reader labels can disagree                             | Language controls display the destination language and include it in their accessible name. Search includes its visible keyboard hint.                                                                 |
| Some sidebar links are less than 24px high; editor text and controls are small | Harder pointer/touch targeting and reading                                     | Sidebar target sizes, editor type, feedback/help text, playback controls, and visible editor focus are improved. A native Tab path remains available through the editor.                               |
| Decorative text scrolls indefinitely                                           | Users cannot stop a competing motion source                                    | A persistent pause toggle, hover/focus pause, and reduced-motion handling control the ticker.                                                                                                          |

## Learning order and persistence

The path now contains 42 lessons: two concept studies, followed by the existing 40 practices. Concept studies and code practices have distinct types. Only practices appear in the playground and coding challenge counts. Existing IDs, draft keys, and progress keys are retained; no browser-data migration or reset is performed.

The first two lessons require no coding knowledge. Later practices benefit from basic HTML, CSS selectors, and JavaScript; prerequisite copy states this clearly. Code remains optional to read in the second introduction, under a disclosure after the visual exercise.

## Verification coverage

- Static checks: TypeScript, Oxlint, Prettier, and a production build.
- Unit checks: curriculum order and saved IDs, prediction/walkthrough consistency, resume recommendations, syntax error locations, unsupported statements, runtime line offsets, and explanations.
- Browser checks: new learner completion, all 40 real GSAP practice examples and solutions, persistence, language, recovery, iframe isolation, playback, scroll, SVG, responsive animation, and reduced motion.
- Added interaction checks: route/anchor scroll and focus, search Enter/Escape behavior, ticker pause, canvas keyboard playback, inline syntax/runtime diagnostics, and conceptual learning without an editor.
- Automated accessibility: axe WCAG A/AA rule tags across nine routes at 1440px and 390px, plus search-dialog and editor-error states. Scan results include incomplete findings for manual review.
- Responsive checks: existing 1440px, 768px, 390px, and 320px checks, extended to the introductory routes.
- Visual review: screenshots of the introduction, editor diagnostics, home, lesson, and playground. Component-only mobile captures hide fixed navigation so the component can be inspected in isolation.

These checks do not establish full WCAG conformance or replace a usability study. Physical-device testing and human testing with NVDA/VoiceOver remain outside the automated Chromium evidence. The sandbox intentionally keeps its opaque origin and restrictive CSP.

## Recorded local results

| Check                                                                                                      | Result                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| TypeScript, Oxlint, Prettier, production build, Git whitespace check                                       | Passed                                                                                                                    |
| Vitest                                                                                                     | 8 tests passed                                                                                                            |
| Full browser regression against the production preview                                                     | 75 tests passed, including all 40 practice examples and solutions                                                         |
| Final focused UX/accessibility suite after improving unknown-location error focus and search from settings | 25 tests passed, including the new long-document error case                                                               |
| Final production check after constraining mobile diagnostic width                                          | 1 combined dialog/settings/error accessibility and screenshot test passed; diagnostic bounds fit inside the mobile editor |

The current suite contains 76 distinct browser scenarios. The final two focused runs rechecked the affected behavior after the full regression. Initial implementation failures were corrected before these passing results. The local machine uses Node 23.8.0 and emits engine warnings; Node 24 LTS remains the documented supported runtime and the CI runtime. No remote CI or deployment was triggered.

## References

- [GSAP’s official getting-started guide](https://gsap.com/resources/get-started/) for the introductory concepts.
- [CodeMirror’s decoration API](https://codemirror.net/docs/ref/#view.Decoration) for editor-local feedback; implementation also follows the installed package types.
- [Deque’s official Playwright integration](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) for the automated accessibility checks.
