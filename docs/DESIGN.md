# Design system and accessibility

RanMotion’s visual language is **motion fieldnotes**: an animation workshop recorded as an editorial study. Electric lime carries active motion and primary action, deep green-black surfaces create a focused studio environment, and restrained apricot marks provide contrast and orientation. Numbered studies, coordinate grids, rules, and open lists reinforce the idea that a learner is observing and testing movement.

## Foundations

Shared values live in `src/styles/app.css`. Reuse the established semantic custom properties for color, spacing, typography, borders, and focus rather than introducing isolated literal values.

| Foundation           | Intent                                                                                |
| -------------------- | ------------------------------------------------------------------------------------- |
| Deep surfaces        | Keep code, animation, and feedback visually calm and legible                          |
| Electric lime        | Identify primary actions, active states, and motion-related emphasis                  |
| Apricot markers      | Add editorial annotation and secondary contrast without competing with primary action |
| Geist and Geist Mono | Separate explanatory prose from code, numbers, and technical detail                   |
| Rules and grids      | Organize dense learning material without turning it into a generic dashboard          |

The result should feel practical, direct, and slightly experimental. Avoid ornamental motion that competes with a learner’s actual animation preview.

## Interface patterns

- **Lesson studies:** show sequence, goal, concept, example, feedback, and recap in an order a beginner can scan.
- **Lab panels:** distinguish source, preview, playback controls, timeline feedback, challenge, and diagnostics through layout and labels, not color alone.
- **Search and settings dialogs:** expose clear focus, an obvious close path, and restored focus after dismissal.
- **Progress and challenge states:** communicate what is complete, what is next, and how to continue without implying that a learner is locked out.
- **Dropdowns:** use `SelectField` (`src/components/SelectField.tsx`, built on Radix Select) instead of a native `<select>`. Use `size="sm"` when the trigger itself is compact, such as the inline demo and lab controls, so the option list stays proportionate. The list renders in place rather than in a portal so it also works inside modal dialogs. Give every dropdown an `aria-label`, since the Radix trigger is a button.
- **Error feedback:** keep it near the relevant editor line when a reliable source position exists. Pair technical details with plain-language recovery guidance.

Build on components and patterns already in `src/components/` and `src/features/lab/`; a visually similar custom control is usually a maintenance cost.

## Motion behavior

Motion demonstrates the course material, so it must remain under learner control:

- respect `prefers-reduced-motion` for the initial choice;
- allow a learner to override the preference in settings;
- provide pause, replay, reset, or manual inspection where playback communicates important information;
- keep decorative movement pausable and avoid auto-playing motion that masks active learning;
- make the static or reduced-motion result meaningful rather than merely hiding content.

## Accessibility requirements

Accessibility is part of the learning flow, not a final audit pass.

- Use native semantic controls whenever possible. Give icon-only controls a concise accessible name.
- Preserve visible focus and keyboard access for navigation, dialogs, editor controls, preview playback, challenge controls, and search.
- Support keyboard alternatives for nested scrolling or pointer-heavy interactions, such as the scroll progress slider.
- Keep readable text size and practical touch targets, especially in the sidebar and lab controls.
- Announce or focus error recovery in a way that lets a learner return to the relevant code.
- Never encode completion, error, or active state with color alone.
- Test at 1440px, 768px, 390px, and 320px. Horizontal overflow at the narrowest width is a defect unless the interaction itself requires deliberate scrolling.

Automated Axe coverage helps catch regressions but does not prove conformance. The historical evidence and manual-review limits are recorded in [quality-audit.md](quality-audit.md).

## Visual change review

For changes that affect layout or interaction, inspect the changed route in its normal context and verify:

1. the primary learner action is apparent;
2. active, disabled, error, and completed states remain distinguishable;
3. focus order follows the reading and task order;
4. localized text does not cause clipping or layout breakage;
5. reduced motion and narrow screens preserve the intended learning task.
