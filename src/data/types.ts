export type Locale = 'id' | 'en'
export type Copy = { id: string; en: string }
export const b = (id: string, en: string): Copy => ({ id, en })
export type Scene =
  | 'box'
  | 'items'
  | 'timeline'
  | 'interaction'
  | 'scroll'
  | 'project'
  | 'cards'
  | 'cards-action'
  | 'svg'
  | 'path'
export interface LearningActivity {
  question: Copy
  choices: Copy[]
  answer: number
  explanation: Copy
  walkthrough: { match: string; explanation: Copy }[]
  variation: { title: Copy; observation: Copy; code: string }
  prerequisites: string[]
}
export interface Lesson {
  id: string
  module: number
  title: Copy
  description: Copy
  minutes: number
  concept: string
  objective: Copy
  model: Copy
  explanation: Copy
  steps: Copy[]
  mistake: Copy
  recap: Copy[]
  challenge: { title: Copy; task: Copy; hints: Copy[]; rule: string }
  scene: Scene
  code: string
  solution: string
  activity?: LearningActivity
}
