import { describe, expect, it } from 'vitest'
import { explainRuntimeError, userCodeLocation, validateCode } from './diagnostics'

describe('actionable editor diagnostics', () => {
  it('accepts valid GSAP and maps a syntax error to the actual editor line', async () => {
    expect(await validateCode('gsap.to(".box", { x: 120 });', false)).toBeNull()
    const problem = await validateCode('const x = 120;\ngsap.to(".box", { x: );', false)
    expect(problem?.line).toBe(2)
    expect(problem?.message).toContain('Periksa sintaks')
  })
  it('locates unsupported imports and loops without blocking text in strings or comments', async () => {
    expect((await validateCode('// intro\nimport gsap from "gsap"', true))?.line).toBe(2)
    expect((await validateCode('for (;;) {}', true))?.message).toContain('Loops and imports')
    expect(await validateCode('const note = "for and import"; // while', true)).toBeNull()
  })
  it('provides recovery for empty code and normalizes runtime wrapper offsets', async () => {
    expect((await validateCode('', true))?.message).toContain('Reset')
    expect(userCodeLocation('ReferenceError\n at eval (ranmotion-user-code.js:6:12)')).toEqual({
      line: 3,
      column: 12,
    })
    expect(userCodeLocation('at some-framework.js:10:2')).toEqual({})
    expect(userCodeLocation('at ranmotion-user-code.js:2:1')).toEqual({})
  })
  it('explains runtime failures without losing the original detail or location', () => {
    const result = explainRuntimeError(
      { message: 'ReferenceError: distance is not defined', line: 3 },
      false,
    )
    expect(result.message).toContain('Periksa ejaannya')
    expect(result.message).toContain('distance is not defined')
    expect(result.line).toBe(3)
  })
})
