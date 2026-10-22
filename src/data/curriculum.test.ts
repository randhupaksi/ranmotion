import { describe, expect, it } from 'vitest'
import { lessons, modules, nextRecommended } from './curriculum'
import { learningActivity } from './learningActivities'

describe('curriculum integrity for a returning or new learner', () => {
  it('keeps unique addressable lessons, valid chapter order, and earlier prerequisites', () => {
    expect(lessons).toHaveLength(40)
    expect(new Set(lessons.map(lesson => lesson.id)).size).toBe(lessons.length)
    for (const [index, lesson] of lessons.entries()) {
      expect(modules[lesson.module]?.number).toBe(lesson.module)
      expect(lesson.code.trim()).not.toBe('')
      expect(lesson.solution).not.toBe(lesson.code)
      for (const id of learningActivity(lesson).prerequisites) expect(lessons.slice(0,index).some(item=>item.id===id), `${lesson.id}: prerequisite ${id}`).toBe(true)
    }
  })
  it('keeps prediction answers and highlighted explanations aligned with the real starting code', () => {
    for (const lesson of lessons) {
      const activity = learningActivity(lesson)
      expect(activity.choices[activity.answer]?.id, lesson.id).toBeTruthy()
      expect(activity.variation.code, lesson.id).not.toBe(lesson.code)
      for (const line of activity.walkthrough) expect(lesson.code.includes(line.match), `${lesson.id}: ${line.match}`).toBe(true)
    }
  })
  it('recognizes saved lesson IDs and recommends the next unfinished concept', () => {
    const oldIds = ['orientation','selectors','properties','to','from','set','easing','delay','repeat','timeline','overlap','labels','stagger','click','hover','trigger','scrub','pin','project']
    expect(oldIds.every(id=>lessons.some(lesson=>lesson.id===id))).toBe(true)
    expect(nextRecommended(oldIds).id).toBe('coordinates')
    expect(nextRecommended([]).id).toBe('orientation')
  })
})
