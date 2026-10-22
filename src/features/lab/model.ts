import { z } from 'zod'
export const animationSchema = z.object({
  target: z.string().max(200), method: z.string().max(20), start: z.number(), duration: z.number(), targets: z.number(),
  vars: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  scroll: z.object({ start: z.string(), end: z.string(), scrub: z.boolean(), pin: z.boolean(), scroller: z.boolean() }).optional(),
})
export const reportSchema = z.object({ animations: z.array(animationSchema).max(150), labels: z.array(z.object({ name: z.string().max(80), time: z.number() })).max(80), clicks: z.number(), focused: z.boolean(), duration: z.number() })
export type AnimationReport = z.infer<typeof animationSchema>
export type LabReport = z.infer<typeof reportSchema>
export function checkChallenge(rule: string, report: LabReport): boolean {
  const a = report.animations
  const has = (test: (t: AnimationReport) => boolean) => a.some(test)
  const x = (t: AnimationReport) => typeof t.vars.x === 'number' ? t.vars.x : 0
  switch (rule) {
    case 'distance': return has(t => x(t) >= 240)
    case 'selectors': return has(t => t.targets >= 3 && Number(t.vars.rotation) >= 45)
    case 'properties': return has(t => Math.abs(Number(t.vars.scale) - 0.7) < 0.001 && Number(t.vars.opacity) === 0.5)
    case 'to': return has(t => t.method === 'to' && x(t) >= 240 && t.duration >= 2)
    case 'from': return has(t => t.method === 'from' && Number(t.vars.y) < 0 && t.vars.opacity === 0)
    case 'set': return has(t => t.method === 'set' && t.vars.scale === 0.5) && has(t => t.method === 'to' && t.vars.scale === 1)
    case 'easing': return has(t => String(t.vars.ease).startsWith('back.out')) && has(t => t.target.includes('comparison') && t.vars.ease === 'none')
    case 'delay': return has(t => Number(t.vars.delay) >= 1)
    case 'repeat': return has(t => t.vars.repeat === 2 && t.vars.yoyo === true)
    case 'timeline': return a.length >= 3 && has(t => t.target.includes('item-3') && Number(t.vars.rotation) >= 180) && a[1].start >= a[0].start + a[0].duration - 0.01 && a[2].start >= a[1].start + a[1].duration - 0.01
    case 'overlap': return a.length >= 2 && a[0].start + a[0].duration - a[1].start >= 0.69
    case 'labels': return report.labels.some(l => l.name === 'reveal') && a.length >= 2 && Math.abs(a[0].start - report.labels.find(l => l.name === 'reveal')!.time) < 0.01 && Math.abs(a[1].start - a[0].start - 0.3) < 0.01
    case 'stagger': return has(t => t.targets >= 3 && Number(t.vars.stagger) >= 0.3)
    case 'click': return report.clicks > 0 && has(t => x(t) >= 240)
    case 'hover': return report.focused && has(t => Number(t.vars.scale) >= 1.35)
    case 'trigger': return has(t => t.scroll?.start === 'top 75%' && !t.scroll.scrub && t.scroll.scroller)
    case 'scrub': return has(t => Boolean(t.scroll?.scrub && t.scroll.scroller) && Number(t.vars.rotation) >= 180)
    case 'pin': return has(t => Boolean(t.scroll?.pin && t.scroll.scroller) && Number(t.scroll!.end.replace('+=', '')) >= 400)
    case 'project': return report.clicks > 0 && a.length >= 4 && has(t => t.method === 'from' && t.target.includes('project-card') && t.vars.scale === 0.8) && has(t => Boolean(t.scroll?.scrub))
    default: return false
  }
}
