import { lazy, Suspense, useEffect, useMemo } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, Target } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import {
  challengeNumber,
  getLesson,
  getPracticeLesson,
  modules,
  practiceLessons,
} from '../data/curriculum'
import { learningActivity } from '../data/learningActivities'
import ErrorBoundary from '../components/ErrorBoundary'
import FeedbackState from '../components/FeedbackState'
import { SectionLoadingSkeleton } from '../components/LoadingSkeleton'
const MotionLab = lazy(() => import('../features/lab/MotionLab'))

/**
 * A challenge on its own track. It reuses the lesson's example, draft, and grading, but it never
 * records lesson completion or moves the "continue" recommendation (no visitLesson here).
 */
export default function ChallengePage() {
  const { lessonId = '' } = useParams()
  const { c, text, challenges, completed } = useApp()
  const source = getPracticeLesson(lessonId)
  const lesson = useMemo(
    () => (source ? { ...source, activity: learningActivity(source) } : null),
    [source],
  )
  useEffect(() => {
    document.title = `${
      source ? text(source.challenge.title) : c('Tantangan tidak ditemukan', 'Challenge not found')
    } - RanMotion`
  }, [source, text, c])

  if (!lesson)
    return (
      <div className="page-width standard-page">
        <FeedbackState
          kind="not-found"
          icon={Target}
          headingLevel="h1"
          eyebrow={c('PAPAN TANTANGAN', 'CHALLENGE BOARD')}
          title={c('Tantangan ini tidak ditemukan', 'We could not find this challenge')}
          description={c(
            'Alamatnya mungkin berubah atau bukan tantangan kode. Pilih tantangan lain dari daftar.',
            'The link may have changed or does not point to a coding challenge. Pick another one from the list.',
          )}
          action={
            <Link className="button primary" to="/challenges">
              {c('Lihat semua tantangan', 'See all challenges')}
            </Link>
          }
        />
      </div>
    )

  const number = challengeNumber(lesson.id)
  const previous = practiceLessons[number - 2]
  const next = practiceLessons[number]
  const moduleLabel = `${c('Modul', 'Module')} ${String(lesson.module + 1).padStart(2, '0')}`
  const lessonDone = completed.includes(lesson.id)
  const suggested = lesson.activity.prerequisites
    .filter(id => !completed.includes(id))
    .map(id => getLesson(id))
    .filter(item => item !== undefined)

  return (
    <article className="page-width standard-page challenge-page">
      <header className="lesson-header">
        <nav className="breadcrumbs" aria-label={c('Lokasi', 'Breadcrumb')}>
          <Link to="/challenges">{c('Tantangan', 'Challenges')}</Link>
          <span aria-hidden="true">/</span>
          <span>
            {moduleLabel} · {text(modules[lesson.module].title)}
          </span>
        </nav>
        <div className="lesson-meta">
          <span className="eyebrow">
            {c('TANTANGAN', 'CHALLENGE')} {String(number).padStart(2, '0')} /{' '}
            {practiceLessons.length}
          </span>
          {challenges.includes(lesson.id) && (
            <span className="completion-badge">
              <Check size={12} />
              {c('Tuntas', 'Completed')}
            </span>
          )}
        </div>
        <h1>{text(lesson.challenge.title)}</h1>
        <p className="page-lead">{text(lesson.challenge.task)}</p>
        <p className="challenge-page-concept">
          <code>{lesson.concept}</code>
          <Link className="text-link" to={`/learn/${lesson.id}`}>
            {c('Pelajari konsepnya', 'Learn the concept')}
            <ArrowUpRight size={14} />
          </Link>
        </p>
      </header>
      {!lessonDone && (
        <aside className="lesson-objective challenge-page-prereq">
          <BookOpen size={18} />
          <div>
            <strong>
              {c('Tantangan ini memakai konsep ', 'This challenge uses the idea from ')}“
              {text(lesson.title)}”.
            </strong>
            <p>
              {c(
                'Kamu bebas langsung mencoba. Kalau terasa asing, pelajarannya menjelaskan idenya selangkah demi selangkah. ',
                'You are free to try it right away. If it feels unfamiliar, the lesson explains the idea step by step. ',
              )}
              <Link className="text-link" to={`/learn/${lesson.id}`}>
                {c('Buka pelajarannya', 'Open the lesson')}
              </Link>
            </p>
            {suggested.length > 0 && (
              <p>
                {c('Disarankan dulu: ', 'Helpful first: ')}
                {suggested.map((item, index) => (
                  <span key={item.id}>
                    {index > 0 && ', '}
                    <Link className="text-link" to={`/learn/${item.id}`}>
                      {text(item.title)}
                    </Link>
                  </span>
                ))}
              </p>
            )}
          </div>
        </aside>
      )}
      <ErrorBoundary>
        <Suspense
          fallback={
            <SectionLoadingSkeleton
              variant="lab"
              label={c(
                'Menyiapkan lembar kerja tantangan',
                'Getting the challenge workspace ready',
              )}
            />
          }
        >
          <MotionLab
            lesson={lesson}
            mode="challenge"
            namespace="challenge"
            key={lesson.id}
            passAction={
              next ? (
                <Link className="button primary small" to={`/challenges/${next.id}`}>
                  {c('Tantangan berikutnya', 'Next challenge')}
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link className="button primary small" to="/challenges">
                  {c('Kembali ke semua tantangan', 'Back to all challenges')}
                </Link>
              )
            }
          />
        </Suspense>
      </ErrorBoundary>
      <nav
        className="lesson-pagination"
        aria-label={c('Tantangan sebelumnya dan berikutnya', 'Previous and next challenges')}
      >
        <div>
          {previous && (
            <Link to={`/challenges/${previous.id}`}>
              <span>
                <ArrowLeft size={13} />
                {c('Tantangan sebelumnya', 'Previous challenge')}
              </span>
              <strong>{text(previous.challenge.title)}</strong>
            </Link>
          )}
        </div>
        <div>
          {next && (
            <Link to={`/challenges/${next.id}`}>
              <span>
                {c('Tantangan berikutnya', 'Next challenge')}
                <ArrowRight size={13} />
              </span>
              <strong>{text(next.challenge.title)}</strong>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}
