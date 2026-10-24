import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppProvider } from './app/AppProvider'
import SiteLayout from './components/SiteLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { RouteSkeleton } from './components/LoadingSkeleton'
import HomePage from './pages/HomePage'
// The branded loader on first load stays up for at least this long. Route changes after that
// show their skeleton only for as long as the page chunk actually takes to load.
const BOOT_LOADER_MIN_MS = 2000

const LearnPage = lazy(() => import('./pages/LearnPage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'))
const ChallengesPage = lazy(() => import('./pages/ChallengesPage'))
const ChallengePage = lazy(() => import('./pages/ChallengePage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const ReferencePage = lazy(() => import('./pages/ReferencePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function DismissInitialLoader() {
  useEffect(() => {
    const loader = document.getElementById('initial-loader')
    if (!loader) return

    const startedAt = Number(loader.getAttribute('data-started-at'))
    const elapsed = Number.isFinite(startedAt) ? performance.now() - startedAt : 0
    const wait = Math.max(0, BOOT_LOADER_MIN_MS - elapsed)
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
              <Route path="challenges/:lessonId" element={<ChallengePage />} />
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
