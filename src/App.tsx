import { lazy, Suspense, useEffect } from 'react'
import type { ComponentType } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppProvider } from './app/AppProvider'
import SiteLayout from './components/SiteLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { RouteSkeleton } from './components/LoadingSkeleton'
import HomePage from './pages/HomePage'
const MINIMUM_LOADING_MS = 2000

function lazyPage<T extends { default: ComponentType }>(load: () => Promise<T>) {
  return lazy(async () => {
    const startedAt = performance.now()
    const page = await load()
    const remaining = MINIMUM_LOADING_MS - (performance.now() - startedAt)
    if (remaining > 0) await new Promise<void>(resolve => window.setTimeout(resolve, remaining))
    return page
  })
}

const LearnPage = lazyPage(() => import('./pages/LearnPage'))
const LessonPage = lazyPage(() => import('./pages/LessonPage'))
const PlaygroundPage = lazyPage(() => import('./pages/PlaygroundPage'))
const ChallengesPage = lazyPage(() => import('./pages/ChallengesPage'))
const ProgressPage = lazyPage(() => import('./pages/ProgressPage'))
const ReferencePage = lazyPage(() => import('./pages/ReferencePage'))
const NotFoundPage = lazyPage(() => import('./pages/NotFoundPage'))

function DismissInitialLoader() {
  useEffect(() => {
    const loader = document.getElementById('initial-loader')
    if (!loader) return

    const startedAt = Number(loader.getAttribute('data-started-at'))
    const elapsed = Number.isFinite(startedAt) ? performance.now() - startedAt : 0
    const wait = Math.max(0, MINIMUM_LOADING_MS - elapsed)
    let removeTimeout = 0
    const readyTimeout = window.setTimeout(() => {
      loader.classList.add('is-ready')
      removeTimeout = window.setTimeout(() => loader.remove(), 260)
    }, wait)

    return () => {
      window.clearTimeout(readyTimeout)
      window.clearTimeout(removeTimeout)
    }
  }, [])

  return null
}

export default function App() {
  return (
    <AppProvider>
      <DismissInitialLoader />
      <ErrorBoundary fullScreen>
        <Suspense fallback={<RouteSkeleton />}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="learn" element={<LearnPage />} />
              <Route path="learn/:lessonId" element={<LessonPage />} />
              <Route path="playground" element={<PlaygroundPage />} />
              <Route path="challenges" element={<ChallengesPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="reference" element={<ReferencePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppProvider>
  )
}
