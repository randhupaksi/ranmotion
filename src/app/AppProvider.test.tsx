import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { AppProvider, useApp } from './AppProvider'

const wrapper = ({ children }: { children: ReactNode }) => <AppProvider>{children}</AppProvider>
const saved = () => JSON.parse(localStorage.getItem('ranmotion.progress.v1') ?? 'null')

beforeAll(() => {
  // jsdom has no matchMedia; the provider only needs the reduced-motion query shape.
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  })
})

beforeEach(() => localStorage.clear())

describe('lesson and challenge progress stay separate', () => {
  it('records a passed challenge without completing its lesson or moving the resume point', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.completeChallenge('scrub'))
    expect(result.current.challenges).toEqual(['scrub'])
    expect(result.current.completed).toEqual([])
    expect(result.current.lastLesson).toBeNull()
    expect(saved()).toEqual({ completed: [], challenges: ['scrub'], lastLesson: null })
  })

  it('completes a lesson only through the lesson action, without touching challenges', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.completeLesson('to'))
    expect(result.current.completed).toEqual(['to'])
    expect(result.current.challenges).toEqual([])
  })

  it('keeps both lists free of duplicates and keeps earlier saved progress', () => {
    localStorage.setItem(
      'ranmotion.progress.v1',
      JSON.stringify({ completed: ['to'], challenges: ['to'], lastLesson: 'to' }),
    )
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => {
      result.current.completeChallenge('to')
      result.current.completeLesson('to')
      result.current.completeChallenge('from')
    })
    expect(result.current.completed).toEqual(['to'])
    expect(result.current.challenges).toEqual(['to', 'from'])
    expect(result.current.lastLesson).toBe('to')
  })
})
