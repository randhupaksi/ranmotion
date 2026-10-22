const base = 'const distance = 180;\nconst duration = 1.2;\nconst ease = "power2.out";\n\n'
export const examples: Record<string, string> = {
  orientation: base + 'gsap.to(".box", {\n  x: distance,\n  duration: duration,\n  ease: ease\n});',
  selectors:
    base +
    'gsap.to(".item", {\n  y: -40,\n  duration: duration,\n  stagger: 0.15,\n  ease: ease\n});',
  properties:
    base +
    'gsap.to(".box", {\n  x: distance,\n  rotation: 90,\n  scale: 0.8,\n  duration: duration,\n  ease: ease\n});',
  to: base + 'gsap.to(".box", {\n  x: distance,\n  duration: duration,\n  ease: ease\n});',
  from:
    base + 'gsap.from(".box", {\n  y: 70,\n  opacity: 0,\n  duration: duration,\n  ease: ease\n});',
  set:
    base +
    'gsap.set(".box", { scale: 0.7, rotation: -15 });\n\ngsap.to(".box", {\n  x: distance,\n  scale: 1,\n  rotation: 0,\n  duration: duration,\n  ease: ease\n});',
  easing:
    base.replace('"power2.out"', '"none"') +
    'gsap.to(".box", { x: distance, duration, ease });\ngsap.to(".comparison", {\n  x: distance,\n  duration,\n  ease: "none"\n});',
  delay: base + 'gsap.to(".box", {\n  x: distance,\n  delay: 0.5,\n  duration,\n  ease\n});',
  repeat:
    base +
    'gsap.to(".box", {\n  x: distance,\n  duration,\n  repeat: 1,\n  yoyo: true,\n  ease\n});',
  timeline:
    base +
    'const tl = gsap.timeline({ defaults: { duration, ease } });\ntl.to(".item-1", { x: distance })\n  .to(".item-2", { x: distance })\n  .to(".item-3", { x: distance });',
  overlap:
    base +
    'const tl = gsap.timeline({ defaults: { duration, ease } });\ntl.to(".item-1", { x: distance })\n  .to(".item-2", { x: distance }, "-=0.5")\n  .to(".item-3", { x: distance }, "<");',
  labels:
    base +
    'const tl = gsap.timeline({ defaults: { duration, ease } });\ntl.addLabel("intro")\n  .to(".item-1", { x: distance }, "intro")\n  .to(".item-2", { x: distance }, "intro+=0.3")\n  .addLabel("outro")\n  .to(".item-3", { x: distance }, "outro");',
  stagger:
    base +
    'gsap.from(".item", {\n  y: 60,\n  opacity: 0,\n  stagger: 0.15,\n  duration,\n  ease\n});',
  click:
    base +
    'const button = document.querySelector(".demo-button");\nconst tween = gsap.to(".box", {\n  x: distance, duration, ease, paused: true\n});\n\nbutton.addEventListener("click", () => {\n  tween.restart();\n});',
  hover:
    base +
    'const target = document.querySelector(".box");\nconst tween = gsap.to(target, {\n  scale: 1.2, rotation: 8, duration: 0.3,\n  ease, paused: true\n});\n\ntarget.addEventListener("pointerenter", () => tween.play());\ntarget.addEventListener("pointerleave", () => tween.reverse());\ntarget.addEventListener("focus", () => tween.play());\ntarget.addEventListener("blur", () => tween.reverse());',
  trigger:
    base +
    'const scrub = false;\nconst pin = false;\n\ngsap.to(".box", {\n  x: distance, duration, ease,\n  scrollTrigger: {\n    trigger: ".scroll-zone",\n    scroller: ".scroll-scene",\n    start: "top center",\n    end: "+=260",\n    scrub, pin: pin ? ".pin-area" : false,\n    toggleActions: "play reverse play reverse",\n    markers: true\n  }\n});',
  scrub: '',
  pin: '',
  project:
    base +
    'const tl = gsap.timeline({ defaults: { duration: 0.7, ease } });\ntl.from(".project-kicker", { y: 20, opacity: 0 })\n  .from(".project-title", { y: 35, opacity: 0 }, "-=0.3")\n  .from(".project-card", { y: 50, opacity: 0, stagger: 0.15 }, "-=0.3");\n\nconst button = document.querySelector(".demo-button");\nbutton.addEventListener("click", () => tl.restart());\n\ngsap.to(".project-orb", {\n  rotation: 180,\n  scrollTrigger: {\n    trigger: ".project-zone",\n    scroller: ".scroll-scene",\n    start: "top bottom", end: "bottom top",\n    scrub: true\n  }\n});',
}
examples.scrub = examples.trigger
  .replace('const scrub = false', 'const scrub = true')
  .replace('duration, ease,', 'duration, ease: "none",')
examples.pin = examples.scrub.replace('const pin = false', 'const pin = true')
for (const id of ['selectors', 'from', 'stagger', 'hover', 'project'])
  examples[id] = examples[id].replace('const distance = 180;\n', '')
examples.hover = examples.hover
  .replace('const duration = 1.2;', 'const duration = 0.3;')
  .replace('duration: 0.3,', 'duration,')
examples.project = examples.project
  .replace('const duration = 1.2;', 'const duration = 0.7;')
  .replace('duration: 0.7,', 'duration,')

export function replaceConstant(code: string, name: string, value: string | number | boolean) {
  const literal = typeof value === 'string' ? JSON.stringify(value) : String(value)
  return code.replace(
    new RegExp(`(const\\s+${name}\\s*=\\s*)(?:"[^"\\n]*"|'[^'\\n]*'|[\\w.\\-]+)(\\s*;)`),
    (_match, before: string, after: string) => `${before}${literal}${after}`,
  )
}
export function readConstant(code: string, name: string): string | undefined {
  return new RegExp(`const\\s+${name}\\s*=\\s*["']?([^;"'\\n]+)`).exec(code)?.[1].trim()
}
