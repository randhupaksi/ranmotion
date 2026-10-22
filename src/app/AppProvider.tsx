import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { z } from 'zod'
import type { Copy, Locale } from '../data/types'

const PROGRESS_KEY = 'ranmotion.progress.v1'
const SETTINGS_KEY = 'ranmotion.settings.v1'
const progressSchema = z.object({
  completed: z.array(z.string()).max(100),
  challenges: z.array(z.string()).max(100),
  lastLesson: z.string().nullable(),
})
const settingsSchema = z.object({ locale: z.enum(['id', 'en']), motion: z.boolean().nullable() })
type Progress = z.infer<typeof progressSchema>
const empty: Progress = { completed: [], challenges: [], lastLesson: null }
function read<T>(key: string, schema: z.ZodType<T>, fallback: T) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { data: fallback, available: true }
    const result = schema.safeParse(JSON.parse(raw))
    return { data: result.success ? result.data : fallback, available: result.success }
  } catch {
    return { data: fallback, available: false }
  }
}
interface AppState extends Progress {
  locale: Locale
  c: (id: string, en: string) => string
  text: (copy: Copy) => string
  setLocale: (locale: Locale) => void
  reducedMotion: boolean
  toggleMotion: () => void
  storageAvailable: boolean
  completeLesson: (id: string, challenge?: boolean) => void
  visitLesson: (id: string) => void
  resetProgress: () => void
}
const Context = createContext<AppState | null>(null)
export function AppProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => read(PROGRESS_KEY, progressSchema, empty))
  const [initialSettings] = useState(() =>
    read(SETTINGS_KEY, settingsSchema, { locale: 'id', motion: null }),
  )
  const [progress, setProgress] = useState(initial.data)
  const [settings, setSettings] = useState(initialSettings.data)
  const [storageAvailable, setStorageAvailable] = useState(
    initial.available && initialSettings.available,
  )
  const [systemMotion, setSystemMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const reducedMotion = settings.motion ?? systemMotion
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemMotion(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    document.documentElement.lang = settings.locale
    document.documentElement.dataset.motion = reducedMotion ? 'reduce' : 'full'
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      setStorageAvailable(true)
    } catch {
      setStorageAvailable(false)
    }
  }, [progress, settings, reducedMotion])
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === PROGRESS_KEY || event.key === null)
        setProgress(read(PROGRESS_KEY, progressSchema, empty).data)
      if (event.key === SETTINGS_KEY || event.key === null)
        setSettings(read(SETTINGS_KEY, settingsSchema, { locale: 'id', motion: null }).data)
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  const completeLesson = useCallback(
    (id: string, challenge = false) =>
      setProgress(p => ({
        ...p,
        completed: p.completed.includes(id) ? p.completed : [...p.completed, id],
        challenges: challenge && !p.challenges.includes(id) ? [...p.challenges, id] : p.challenges,
      })),
    [],
  )
  const visitLesson = useCallback(
    (id: string) => setProgress(p => (p.lastLesson === id ? p : { ...p, lastLesson: id })),
    [],
  )
  const resetProgress = useCallback(() => {
    setProgress(empty)
    try {
      localStorage.removeItem(PROGRESS_KEY)
      setStorageAvailable(true)
    } catch {
      setStorageAvailable(false)
    }
  }, [])
  const setLocale = useCallback((locale: Locale) => setSettings(s => ({ ...s, locale })), [])
  const toggleMotion = useCallback(
    () => setSettings(s => ({ ...s, motion: !(s.motion ?? systemMotion) })),
    [systemMotion],
  )
  const c = useCallback(
    (id: string, en: string) => (settings.locale === 'id' ? id : en),
    [settings.locale],
  )
  const text = useCallback((copy: Copy) => copy[settings.locale], [settings.locale])
  const value = useMemo(
    () => ({
      ...progress,
      locale: settings.locale,
      c,
      text,
      setLocale,
      reducedMotion,
      toggleMotion,
      storageAvailable,
      completeLesson,
      visitLesson,
      resetProgress,
    }),
    [
      progress,
      settings.locale,
      c,
      text,
      setLocale,
      reducedMotion,
      toggleMotion,
      storageAvailable,
      completeLesson,
      visitLesson,
      resetProgress,
    ],
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useApp() {
  const value = useContext(Context)
  if (!value) throw new Error('AppProvider is missing')
  return value
}
