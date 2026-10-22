import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppProvider } from './app/AppProvider'
import SiteLayout from './components/SiteLayout'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
const LearnPage = lazy(() => import('./pages/LearnPage'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'))
const ChallengesPage = lazy(() => import('./pages/ChallengesPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const ReferencePage = lazy(() => import('./pages/ReferencePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary fullScreen>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              RanMotion · Memuat / Loading…
            </div>
          }
        >
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
