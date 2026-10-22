import gsapSource from 'gsap/dist/gsap.min.js?raw'
import scrollSource from 'gsap/dist/ScrollTrigger.min.js?raw'
import type { Locale, Scene } from '../../data/types'
import { sceneCSS, sceneMarkup } from './scene'

// Runs only in an opaque-origin iframe. User code is sent after load, never interpolated into HTML.
function sandboxRuntime() {
  const config = JSON.parse(document.getElementById('ran-config')!.textContent!) as { token: string }
  const gsap = (window as unknown as { gsap: typeof import('gsap').gsap }).gsap
  const ScrollTrigger = (window as unknown as { ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }).ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
  let reduced = false
  let started = false
  let clicks = 0
  let focused = false
  let transportPaused = false
  let manualProgress: number | null = null
  const records: { target: string; method: string; tween: gsap.core.Tween | gsap.core.Timeline; vars: Record<string, string | number | boolean>; targets: number; scroll?: { start: string; end: string; scrub: boolean; pin: boolean; scroller: boolean } }[] = []
  const timelines: gsap.core.Timeline[] = []
  let top: gsap.core.Animation[] = []
  const post = (type: string, payload: Record<string, unknown> = {}) => parent.postMessage({ token: config.token, type, ...payload }, '*')
  const report = () => {
    const firstStart = timelines.length || !records.length ? 0 : Math.min(...records.map(r => r.tween.startTime()))
    const animations = records.map(r => ({ target: r.target, method: r.method, targets: r.targets, vars: r.vars, scroll: r.scroll, start: Math.max(0, r.tween.startTime() - firstStart), duration: r.tween.duration() }))
    const labels = timelines.flatMap(t => Object.entries(t.labels).map(([name, time]) => ({ name, time })))
    post('report', { report: { animations, labels, clicks, focused, duration: Math.max(0, ...animations.map(a => a.start + a.duration)) } })
  }
  const capture = (method: string, args: unknown[], tween: gsap.core.Tween | gsap.core.Timeline) => {
    if (records.length >= 150) throw new Error('Too many animations. Keep this experiment below 150 tweens.')
    const raw = (args[method === 'fromTo' ? 2 : 1] ?? {}) as Record<string, unknown>
    const inherited = tween.vars as Record<string, unknown>
    const vars: Record<string, string | number | boolean> = {}
    for (const key of ['x','y','rotation','scale','opacity','ease','delay','repeat','yoyo','stagger','paused']) {
      const value = raw[key] ?? inherited[key]
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') vars[key] = value
      if (key === 'stagger' && value && typeof value === 'object' && 'each' in value) vars.stagger = Number(value.each)
    }
    const nodes = typeof args[0] === 'string' ? document.querySelectorAll(args[0]) : gsap.utils.toArray(args[0] as object | Element | string | null)
    const s = raw.scrollTrigger as Record<string, unknown> | undefined
    const scroll = s && typeof s === 'object' ? { start: String(s.start ?? ''), end: String(s.end ?? ''), scrub: Boolean(s.scrub), pin: Boolean(s.pin), scroller: s.scroller === '.scroll-scene' } : undefined
    records.push({ target: typeof args[0] === 'string' ? args[0] : ((args[0] as HTMLElement)?.className || 'element'), method, tween, vars, targets: nodes.length, scroll })
    return tween
  }
  // Instrument public creation methods to validate actual executed values rather than source text.
  const engine = gsap as unknown as Record<string, (...args: unknown[]) => gsap.core.Tween | gsap.core.Timeline>
  for (const method of ['to','from','fromTo','set']) {
    const original = engine[method]
    engine[method] = function (...args: unknown[]) { const tween = original.apply(gsap, args); capture(method, args, tween); return tween }
  }
  const originalTimeline = gsap.timeline
  gsap.timeline = function (vars?: gsap.TimelineVars) {
    const tl = originalTimeline(vars)
    timelines.push(tl)
    const target = tl as unknown as Record<string, (...args: unknown[]) => unknown>
    for (const method of ['to','from','fromTo','set']) {
      const original = target[method]
      target[method] = function (...args: unknown[]) { original.apply(tl, args); const child = tl.recent(); if (child && typeof child !== 'function') capture(method, args, child); return tl }
    }
    return tl
  }
  const freeze = () => { top.forEach(t => t.totalProgress(1).pause()); ScrollTrigger.getAll().forEach(t => t.disable(false)); transportPaused = true; manualProgress = 1 }
  window.addEventListener('error', event => post('error', { message: String(event.message).slice(0, 400) }))
  window.addEventListener('unhandledrejection', event => post('error', { message: String(event.reason?.message ?? event.reason).slice(0, 400) }))
  document.addEventListener('pointerdown', event => { if (event.isTrusted) post('activate') }, true)
  document.addEventListener('keydown', event => { if (event.isTrusted && (event.key === 'Enter' || event.key === ' ')) post('activate') }, true)
  document.addEventListener('click', event => { if (started && event.target instanceof Element && event.target.closest('.demo-button')) { clicks++; queueMicrotask(() => { if (reduced) freeze(); if (records.length) report() }) } }, true)
  for (const event of ['pointerenter','focusin']) document.addEventListener(event, e => { if (started && e.target instanceof Element && e.target.matches('.box')) { focused = true; queueMicrotask(() => { if (reduced) freeze(); if (records.length) report() }) } }, true)
  window.addEventListener('message', event => {
    if (event.source !== parent || event.data?.token !== config.token) return
    const message = event.data
    if (message.type === 'run' && !started) {
      started = true; reduced = Boolean(message.reduced)
      try {
        new Function('gsap', 'ScrollTrigger', '"use strict";\n' + message.code)(gsap, ScrollTrigger)
        ScrollTrigger.refresh()
        top = gsap.globalTimeline.getChildren(false, true, true)
        if (reduced) freeze()
        report()
        setInterval(() => {
          const trigger = ScrollTrigger.getAll()[0]
          const animation = timelines[0] ?? top.find(t => t.duration() > 0)
          const progress = manualProgress ?? (trigger ? trigger.progress : animation ? animation.totalProgress() : 0)
          post('state', { progress: Math.max(0, Math.min(1, progress)), paused: trigger ? transportPaused : top.every(t => t.paused() || !t.isActive()) })
        }, 90)
      } catch (error) { post('error', { message: error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 400) : 'Unable to run this code.' }) }
    }
    if (message.type === 'pause') { top.forEach(t => t.pause()); ScrollTrigger.getAll().forEach(t => t.disable(false)); transportPaused = true }
    if (message.type === 'resume' && !reduced) {
      const triggers = ScrollTrigger.getAll()
      triggers.forEach(t => t.enable(false, false))
      top.filter(animation => !triggers.some(trigger => trigger.animation === animation)).forEach(animation => animation.resume())
      transportPaused = false; manualProgress = null
    }
    if (message.type === 'replay') { if (reduced) freeze(); else { manualProgress = null; transportPaused = false; top.forEach(t => t.restart(true)) } }
    if (message.type === 'seek') { const value = Math.max(0, Math.min(1, Number(message.value) || 0)); top.forEach(t => t.totalProgress(value).pause()); manualProgress = value; transportPaused = true }
    if (message.type === 'scroll') {
      const scroller = document.querySelector('.scroll-scene') as HTMLElement | null
      const trigger = ScrollTrigger.getAll()[0]
      if (scroller && trigger) {
        const value = Math.max(0, Math.min(1, Number(message.value) || 0))
        trigger.enable(false, false)
        scroller.scrollTop = trigger.start + (trigger.end - trigger.start) * value
        ScrollTrigger.update()
        if (reduced || transportPaused) { trigger.animation?.progress(value).pause(); trigger.disable(false); manualProgress = value }
        else manualProgress = null
      }
    }
  })
}
const safeScript = (code: string) => code.replace(/<\/script/gi, '<\\/script')
export function previewDocument(scene: Scene, locale: Locale, token: string, comparison: boolean) {
  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${sceneCSS}</style></head><body>${sceneMarkup(scene, locale, comparison)}<script id="ran-config" type="application/json">${JSON.stringify({token})}</script><script>${safeScript(gsapSource)}</script><script>${safeScript(scrollSource)}</script><script>(${sandboxRuntime.toString()})();</script></body></html>`
}
