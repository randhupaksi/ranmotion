import { describe, expect, it } from 'vitest'
import {
  challengeNumber,
  lessons,
  modules,
  nextChallenge,
  nextRecommended,
  practiceLessons,
} from './curriculum'
import { introStudies } from './introCurriculum'
import { learningActivity } from './learningActivities'

describe('curriculum integrity for a returning or new learner', () => {
  it('keeps unique addressable lessons, valid chapter order, and earlier prerequisites', () => {
    expect(lessons).toHaveLength(42)
    expect(practiceLessons).toHaveLength(40)
    expect(new Set(lessons.map(lesson => lesson.id)).size).toBe(lessons.length)
    for (const [index, lesson] of lessons.entries()) {
      expect(modules[lesson.module]?.number).toBe(lesson.module)
      if (lesson.format !== 'concept') {
        expect(lesson.code.trim()).not.toBe('')
        expect(lesson.solution).not.toBe(lesson.code)
      }
      for (const id of lesson.format === 'concept' ? [] : learningActivity(lesson).prerequisites)
        expect(
          lessons.slice(0, index).some(item => item.id === id),
          `${lesson.id}: prerequisite ${id}`,
        ).toBe(true)
    }
  })
  it('keeps prediction answers and highlighted explanations aligned with the real starting code', () => {
    for (const lesson of practiceLessons) {
      const activity = learningActivity(lesson)
      expect(activity.choices[activity.answer]?.id, lesson.id).toBeTruthy()
      expect(activity.variation.code, lesson.id).not.toBe(lesson.code)
      for (const line of activity.walkthrough)
        expect(lesson.code.includes(line.match), `${lesson.id}: ${line.match}`).toBe(true)
    }
  })
  it('recognizes saved lesson IDs and recommends the next unfinished concept', () => {
    const oldIds = [
      'orientation',
      'selectors',
      'properties',
      'to',
      'from',
      'set',
      'easing',
      'delay',
      'repeat',
      'timeline',
      'overlap',
      'labels',
      'stagger',
      'click',
      'hover',
      'trigger',
      'scrub',
      'pin',
      'project',
    ]
    expect(oldIds.every(id => lessons.some(lesson => lesson.id === id))).toBe(true)
    expect(nextRecommended([...oldIds, 'gsap-foundations', 'animation-blueprint']).id).toBe(
      'coordinates',
    )
    expect(nextRecommended([]).id).toBe('gsap-foundations')
    expect(nextRecommended(oldIds, 'motion-path').id).toBe('motion-path')
    expect(nextRecommended(oldIds, 'to').id).toBe('gsap-foundations')
    expect(nextRecommended([], 'removed-lesson').id).toBe('gsap-foundations')
  })
  it('numbers challenges in curriculum order and recommends the first unfinished one', () => {
    expect(challengeNumber('orientation')).toBe(1)
    expect(challengeNumber(practiceLessons[39].id)).toBe(40)
    expect(challengeNumber('gsap-foundations')).toBe(0)
    expect(nextChallenge([])?.id).toBe('orientation')
    expect(nextChallenge(['orientation'])?.id).toBe(practiceLessons[1].id)
    expect(nextChallenge(practiceLessons.map(lesson => lesson.id))).toBeNull()
  })
  it('starts with two visual studies and keeps coding challenges out of the concept introduction', () => {
    expect(lessons.slice(0, 2).every(lesson => lesson.format === 'concept')).toBe(true)
    expect(practiceLessons[0].id).toBe('orientation')
    for (const lesson of lessons.filter(item => item.format === 'concept')) {
      const study = introStudies[lesson.id]
      expect(study.choices[study.answer].id).toBeTruthy()
      expect(study.terms).toHaveLength(3)
      expect(practiceLessons.some(item => item.id === lesson.id)).toBe(false)
    }
  })
})
