export const expandedExamples: Record<string, string> = {
  coordinates: `const duration = 1.2;

gsap.to(".box", {
  xPercent: 100,
  yPercent: -30,
  duration,
  ease: "power2.out"
});`,
  'from-to': `const duration = 1.2;

gsap.fromTo(".box",
  { x: 0, opacity: 0.2 },
  { x: 180, opacity: 1, duration }
);`,
  relative: `const duration = 1.2;

gsap.to(".box", {
  x: "+=80",
  rotation: "+=45",
  duration,
  repeat: 1
});`,
  origin: `const duration = 1.2;

gsap.to(".box", {
  transformOrigin: "50% 50%",
  rotation: 90,
  duration,
  ease: "power2.inOut"
});`,
  'auto-alpha': `const duration = 1;

gsap.from(".card", {
  autoAlpha: 0.35,
  y: 25,
  stagger: 0.12,
  duration
});`,
  'repeat-delay': `const duration = 0.6;

gsap.to(".box", {
  x: 180,
  duration,
  repeat: 1,
  repeatDelay: 0.2,
  yoyo: true
});`,
  keyframes: `gsap.to(".box", {
  keyframes: [
    { x: 100, duration: 0.5 },
    { y: -50, duration: 0.5 },
    { x: 0, y: 0, duration: 0.5 }
  ],
  ease: "none"
});`,
  defaults: `const duration = 0.6;

const tl = gsap.timeline({
  defaults: { duration, ease: "power2.out" }
});
tl.to(".item-1", { x: 100 })
  .to(".item-2", { x: 140 })
  .to(".item-3", { x: 180 });`,
  'stagger-order': `const duration = 1;

gsap.from(".item", {
  y: 50,
  opacity: 0,
  duration,
  stagger: { each: 0.12, from: "start" }
});`,
  speed: `const tl = gsap.timeline();
tl.to(".item-1", { x: 180, duration: 1 })
  .to(".item-2", { x: 180, duration: 1 })
  .to(".item-3", { x: 180, duration: 1 });

tl.timeScale(1);`,
  callbacks: `const duration = 0.8;
const status = document.querySelector(".status");

gsap.from(".card", {
  y: 35,
  opacity: 0,
  stagger: 0.1,
  duration,
  onComplete: () => {
    status.textContent = "Ready";
  }
});`,
  overwrite: `const duration = 0.7;
const button = document.querySelector(".demo-button");

gsap.to(".box", { x: 80, duration, paused: true });

button.addEventListener("click", () => {
  gsap.to(".box", {
    x: 180, duration, overwrite: "auto"
  });
});`,
  utils: `const duration = 1.2;
const limitedX = gsap.utils.clamp(0, 180, 360);

gsap.to(".box", {
  x: limitedX,
  duration,
  ease: "none"
});`,
  'scroll-timeline': `const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scroll-zone",
    scroller: ".scroll-scene",
    start: "top center",
    end: "+=350",
    scrub: true
  }
});

tl.to(".box", { x: 180, rotation: 90, duration: 1, ease: "none" })
  .from(".scroll-caption", { y: 20, opacity: 0, duration: 0.5 });`,
  'svg-attributes': `const duration = 1.2;

gsap.to(".shape", {
  attr: { r: 40, cx: 110 },
  duration,
  ease: "power2.inOut"
});`,
  'svg-stroke': `const duration = 1.5;
const outline = document.querySelector(".outline");
const length = outline.getTotalLength();

gsap.fromTo(outline,
  { strokeDasharray: length, strokeDashoffset: length },
  { strokeDashoffset: 60, duration, ease: "none" }
);`,
  'motion-path': `const duration = 2;

gsap.to(".traveler", {
  motionPath: {
    path: ".route",
    align: ".route",
    alignOrigin: [0.5, 0.5],
    autoRotate: true,
    end: 0.65
  },
  duration,
  ease: "none"
});`,
  context: `const duration = 1;
const scope = document.querySelector(".cards-scene");
const ctx = gsap.context(() => {
  gsap.from(".card", { y: 35, opacity: 0, duration, stagger: 0.1 });
}, scope);

document.querySelector(".demo-button").addEventListener("click", () => {
  ctx.revert();
  document.querySelector(".status").textContent = "Reverted";
});`,
  'match-media': `const duration = 1;
const mm = gsap.matchMedia();

mm.add({
  wide: "(min-width: 480px)",
  compact: "(max-width: 479px)"
}, (context) => {
  const y = context.conditions.wide ? 60 : 25;
  gsap.from(".item", { y, opacity: 0, duration, stagger: 0.1 });
});`,
  'reduced-motion': `const mm = gsap.matchMedia();

mm.add({
  reduce: "(prefers-reduced-motion: reduce)",
  full: "(prefers-reduced-motion: no-preference)"
}, (context) => {
  const reduce = context.conditions.reduce;
  gsap.from(".card", {
    y: reduce ? 0 : 35,
    opacity: 0,
    duration: reduce ? 0 : 1,
    stagger: reduce ? 0 : 0.1
  });
});`,
  'project-menu': `const tl = gsap.timeline({ paused: true });

tl.from(".card", {
  x: -35,
  opacity: 0,
  stagger: 0.1,
  duration: 0.5
});

document.querySelector(".demo-button").addEventListener("click", () => {
  tl.restart();
});`,
}

export const expandedSolutions: Record<string, string> = {
  coordinates: expandedExamples.coordinates
    .replace('xPercent: 100', 'xPercent: 200')
    .replace('yPercent: -30', 'yPercent: -100'),
  'from-to': expandedExamples['from-to']
    .replace('x: 0, opacity: 0.2', 'x: -30, opacity: 0')
    .replace('x: 180', 'x: 240'),
  relative: expandedExamples.relative.replace('+=80', '+=120').replace('+=45', '+=90'),
  origin: expandedExamples.origin.replace('50% 50%', '0% 100%'),
  'auto-alpha': expandedExamples['auto-alpha'].replace('autoAlpha: 0.35', 'autoAlpha: 0'),
  'repeat-delay': expandedExamples['repeat-delay']
    .replace('repeat: 1', 'repeat: 2')
    .replace('repeatDelay: 0.2', 'repeatDelay: 0.8'),
  keyframes: expandedExamples.keyframes.replace(
    '{ x: 0, y: 0, duration: 0.5 }',
    '{ x: 0, y: 0, duration: 0.5 },\n    { rotation: 90, duration: 0.5 }',
  ),
  defaults: expandedExamples.defaults.replace('duration = 0.6', 'duration = 1.5'),
  'stagger-order': expandedExamples['stagger-order'].replace(
    'each: 0.12, from: "start"',
    'each: 0.2, from: "end"',
  ),
  speed: expandedExamples.speed.replace('timeScale(1)', 'timeScale(0.5)'),
  callbacks: expandedExamples.callbacks.replace('"Ready"', '"Complete"'),
  overwrite: expandedExamples.overwrite.replace('x: 180', 'x: 240'),
  utils: expandedExamples.utils.replace('clamp(0, 180, 360)', 'clamp(0, 240, 360)'),
  'scroll-timeline': expandedExamples['scroll-timeline'].replace('rotation: 90', 'rotation: 180'),
  'svg-attributes': expandedExamples['svg-attributes'].replace('r: 40, cx: 110', 'r: 50, cx: 120'),
  'svg-stroke': expandedExamples['svg-stroke'].replace(
    'strokeDashoffset: 60',
    'strokeDashoffset: 0',
  ),
  'motion-path': expandedExamples['motion-path'].replace('end: 0.65', 'end: 1'),
  context: expandedExamples.context.replace('y: 35, opacity: 0,', 'y: 35, opacity: 0, scale: 0.8,'),
  'match-media': expandedExamples['match-media'].replace('duration = 1;', 'duration = 2;'),
  'reduced-motion': expandedExamples['reduced-motion'].replace(
    'opacity: 0,',
    'opacity: 0,\n    scale: reduce ? 1 : 0.9,',
  ),
  'project-menu': expandedExamples['project-menu'].replace('stagger: 0.1', 'stagger: 0.25'),
}
