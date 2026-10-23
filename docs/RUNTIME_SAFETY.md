# Preview runtime, privacy, and safety

RanMotion lets a learner run small GSAP examples. That convenience depends on a strict separation between the application and the executed learner code. This document describes the boundary accurately so future changes do not accidentally weaken it or overstate its protection.

## What stays local

The app is a client-side learning product. It does not configure an account system, application backend, analytics pipeline, or code-upload service. Curriculum content and preview GSAP sources are shipped with the application.

Progress, challenge completion, locale, motion preference, and example drafts stay in browser storage for that browser and device. Storage failure falls back to memory with a visible notice. Clearing site data clears those local values.

Do not introduce telemetry, remote executable assets, account sync, or data collection as a maintenance change. Such a product decision needs explicit approval, a privacy review, and documentation updates.

## Iframe boundary

The editor executes code in an iframe with:

- `sandbox="allow-scripts"`, which gives the frame an opaque origin;
- a restrictive Content Security Policy;
- locally bundled GSAP, ScrollTrigger, and MotionPathPlugin sources;
- no direct access to the host document or the host’s browser storage;
- learner code delivered after the frame is ready instead of interpolated into host HTML.

The host generates a fresh random token for each frame. When the iframe posts a report, the host checks all of the following before using it:

1. the event came from the active iframe window;
2. the opaque-origin value is the expected one for this sandbox configuration;
3. the report includes the frame’s matching token;
4. the report passes the Zod schema.

Maintain every check when touching `PreviewFrame`, `previewDocument`, or the message schema. A message that fails any check is untrusted and must be ignored.

## Deliberate scope limits

The preview supports guided GSAP experimentation, not arbitrary adversarial execution. It validates syntax and rejects imports, exports, and loop statements. The source is capped at 12,000 characters and the reported animation count is capped at 150. These constraints keep ordinary lessons responsive and bounded; they do not turn JavaScript execution into a hardened multi-tenant sandbox.

Do not describe RanMotion as secure for untrusted hostile code. If stronger isolation is required, stop and redesign the product boundary rather than weakening this implementation incrementally.

## Safe changes to preview behavior

When changing a preview feature:

- keep the host and iframe protocols explicit and schema-validated;
- only expose facts the host needs for feedback, timeline display, or challenge evaluation;
- avoid adding host privileges to the frame;
- preserve local bundled runtime sources unless a reviewed product decision changes the network model;
- verify that a learner’s code cannot read parent storage or manipulate parent DOM;
- test runtime error reporting, reset behavior, and challenge evaluation alongside the new behavior.

## Disclosure language

For learner-facing or contributor documentation, use precise language: the iframe is sandboxed and separated from the app’s DOM and storage; it is not a general-purpose secure execution service. Clear limits build trust better than a broad security promise.
