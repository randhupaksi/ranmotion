# Learning model and content

RanMotion teaches GSAP by pairing a mental model with visible motion and a short controlled experiment. It is designed for people who may be new to programming as well as for learners who want a focused GSAP reference.

## Curriculum shape

The curriculum has 42 bilingual lessons in nine sections:

- two no-code visual introductions;
- 40 guided practices covering core tweens, timelines, interaction, ScrollTrigger, SVG, MotionPath, responsive setup, cleanup, and small projects.

Concept lessons and practice lessons have different roles. Concept lessons establish GSAP, targets, distance, duration, and easing before the learner must edit code. Practice lessons open the editor and can participate in the playground and challenge experience.

Every practice should retain a coherent learning arc:

1. Objective and mental model.
2. Explanation, walkthrough, and a prediction with feedback.
3. A runnable example whose HTML and CSS match the code target.
4. A small variation or experiment checklist.
5. Common mistake guidance, a challenge, progressive hints, and recap.

This depth is intentional. Do not reduce a lesson to a code snippet when the explanation supports a beginner’s recovery path.

## Bilingual content contract

Indonesian is the default language. Learner-visible additions must have Indonesian and English copy of matching meaning and interaction behavior. Keep technical identifiers such as GSAP APIs or CSS property names intact where translation would make code harder to follow.

When adding or changing copy:

- use plain, concrete language before introducing programming vocabulary;
- describe what a learner can observe, then connect it to the API behavior;
- keep hints progressive: orient first, reveal specifics later;
- update accessible labels, error explanations, empty states, and control text in both locales;
- preserve the distinction between a teaching simplification and an exact API claim.

## Stable IDs and deep links

Lesson and example IDs are public application contracts. They appear in route URLs, saved completion data, last-lesson recommendations, drafts, challenge state, and links within the reference section.

Prefer adding a new ID over renaming an existing one. If a migration is unavoidable, define and test explicit compatibility behavior before changing data. A missing ID must fail safely in the route UI rather than corrupt saved learner state.

## Local learner state

The application saves the following only in the active browser:

| Data                         | Purpose                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| Completed lessons            | Shows progress and supports recommendations                         |
| Completed challenges         | Shows practice achievements                                         |
| Last lesson                  | Lets a returning learner resume a valid unfinished lesson           |
| Locale and motion preference | Preserves the learner’s interface settings                          |
| Per-example drafts           | Lets a learner continue a code experiment from lesson or playground |

Progress and settings are validated when read. Existing valid IDs are retained. Storage errors must fall back to in-memory state; drafts use the same resilient approach. Clearing browser site data removes this local state, and it does not sync across devices.

## Recommendation rules

The application uses a valid unfinished last lesson when possible. Otherwise it recommends the first unfinished lesson. If the curriculum is complete, the experience guides the learner into the playground. Keep this rule aligned across home, learning, and progress views.

## Adding a practice example

Before shipping a new practice, confirm that:

- its HTML, CSS, JavaScript, controls, and expected observation agree;
- code constants exposed by controls map predictably to the executed code;
- the challenge inspects executed animation state or interaction, rather than only matching editor text;
- the preview reports needed facts through the established validated protocol;
- both language variants, reduced-motion behavior, keyboard paths, and narrow layout remain useful;
- tests cover the new example’s essential behavior.
