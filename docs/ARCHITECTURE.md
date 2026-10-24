# Architecture

RanMotion is a static React application. A learner can read lessons, run small GSAP experiments, and save progress without creating an account or calling an application backend.

## Runtime shape

```text
Browser
  React Router routes
    AppProvider ── locale, motion preference, progress, drafts
    SiteLayout ── navigation, search, settings, shared accessibility behavior
    Route page ── curriculum, challenge, reference, or progress composition
      Lab feature (when needed)
        CodeMirror editor
        sandboxed iframe ── locally bundled GSAP preview runtime
```

`src/App.tsx` defines the route tree and wraps it with the application provider, error boundary, and suspense boundary. The home page remains light; learning, playground, and their editor dependencies load only when a learner enters those routes.

| Area               | Responsibility                                                                   | Main location            |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------ |
| Application state  | Locale, user motion setting, validated progress, and browser-storage fallback    | `src/app/`               |
| Shared UI          | Shell, navigation, dialogs, search, settings, home demo, error boundary          | `src/components/`        |
| Curriculum         | Bilingual lesson copy, examples, lesson types, reference data                    | `src/data/`              |
| Learning lab       | Editor, preview frame, generated preview document, diagnostics, challenge checks | `src/features/lab/`      |
| Route composition  | Home, learning list/detail, playground, challenges, progress, reference          | `src/pages/`             |
| Presentation       | Global tokens, responsive layouts, component and lab styles                      | `src/styles/`            |
| Browser confidence | End-to-end behavior, accessibility scans, visual artifacts                       | `e2e/` and `.artifacts/` |

## Routes

| Route                    | Responsibility                                                            |
| ------------------------ | ------------------------------------------------------------------------- |
| `/`                      | Product introduction, visual demo, prerequisites, and entry into learning |
| `/learn`                 | Curriculum browse, filtering, and lesson search                           |
| `/learn/:lessonId`       | One concept or practice lesson and its learning activity                  |
| `/playground?example=to` | Editable practice environment with example selection                      |
| `/challenges`            | Challenge board, filters kept in the URL, and completion state            |
| `/challenges/:lessonId`  | Standalone challenge that records challenge progress only                 |
| `/progress`              | Saved progress and next recommended lesson                                |
| `/reference`             | Searchable concept reminders linked back to lessons                       |

All lessons are directly reachable. Suggested sequence guides a beginner but is not an authorization system.

## State and data flow

The curriculum is static TypeScript data. A page looks up its lesson or example by a stable ID, renders localized copy, and requests or updates learner state through `AppProvider`.

```text
curriculum data + route parameter
              ↓
           route page
              ↓
    AppProvider actions/state
              ↓
validated localStorage value ⇄ in-memory fallback
```

The provider validates persisted values before use. If `localStorage` is unavailable or fails, the application continues with temporary in-memory state and tells the learner. Do not bypass this boundary with direct storage access in a page or component.

## Lab execution flow

The live editor is deliberately separated from the application document:

1. A lesson or playground route supplies a known example and learner draft to the lab.
2. `PreviewFrame` creates a fresh iframe with an opaque sandbox origin and a per-frame token.
3. `previewDocument` loads local GSAP sources and receives learner code after the frame is ready.
4. The preview reports animation facts, runtime errors, and challenge-relevant state to the host.
5. The host accepts a message only when its source is the active iframe, its token matches, its origin is expected for the opaque sandbox, and its shape passes Zod validation.
6. The lab uses the validated report for diagnostics, timeline display, and challenge evaluation.

Keep DOM ownership one-way: host UI controls the iframe; preview code cannot directly control host DOM or read host storage.

## Extension guidance

| Change                             | Preferred location                                                                     |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| Add a lesson or practice           | `src/data/`, then reuse existing route and lab contracts                               |
| Change persisted learning behavior | `src/app/`, with validation and compatibility consideration                            |
| Add a shared interaction pattern   | `src/components/` plus token-based styles                                              |
| Change editor or preview behavior  | `src/features/lab/` and its focused tests                                              |
| Add a route                        | `src/App.tsx` and a route-level page module, preserving lazy loading where appropriate |

Avoid coupling data modules to React components, duplicating route state in local component state, and treating preview messages as trusted application data.
