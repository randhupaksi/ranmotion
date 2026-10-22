import { lazy, Suspense, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Target,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { getLesson, getModuleLessons, lessons, modules } from '../data/curriculum'
import type { Lesson } from '../data/types'
import ErrorBoundary from '../components/ErrorBoundary'
import NotFoundPage from './NotFoundPage'
import LessonCoach, { GuidedSteps } from '../components/LessonCoach'
import { learningActivity } from '../data/learningActivities'
const MotionLab = lazy(() => import('../features/lab/MotionLab'))

function LessonSidebar({ lesson }: { lesson: Lesson }) {
  const { c, text, completed } = useApp()
  const navigate = useNavigate()
  const done = lessons.filter(l => completed.includes(l.id)).length
  return (
    <aside className="lesson-sidebar">
      <Link className="sidebar-back" to={`/learn#module-${lesson.module}`}>
        <ArrowLeft size={14} />
        {c('Jalur belajar', 'Learning path')}
      </Link>
      <div className="sidebar-progress">
        <span className="eyebrow">GSAP / FROM THE GROUND UP</span>
        <div>
          <span>
            {done}/{lessons.length} {c('selesai', 'complete')}
          </span>
          <span>{Math.round((done / lessons.length) * 100)}%</span>
        </div>
        <progress
          value={done}
          max={lessons.length}
          aria-label={c('Progres jalur', 'Path progress')}
        />
      </div>
      <label className="mobile-lesson-picker">
        {c('Pindah pelajaran', 'Jump to a lesson')}
        <select value={lesson.id} onChange={e => navigate(`/learn/${e.target.value}`)}>
          {modules.map(m => (
            <optgroup key={m.number} label={`${m.number + 1}. ${text(m.title)}`}>
              {getModuleLessons(m.number).map(l => (
                <option key={l.id} value={l.id}>
                  {completed.includes(l.id) ? '✓ ' : ''}
                  {text(l.title)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <nav className="sidebar-modules" aria-label={c('Daftar pelajaran', 'Lesson navigation')}>
        {modules.map(m => (
          <details key={m.number} open={m.number === lesson.module}>
            <summary>
              <span>{String(m.number + 1).padStart(2, '0')}</span>
              {text(m.title)}
              <ChevronDown size={13} />
            </summary>
            <ol>
              {getModuleLessons(m.number).map(l => (
                <li key={l.id}>
                  <Link
                    to={`/learn/${l.id}`}
                    className={l.id === lesson.id ? 'active' : ''}
                    aria-current={l.id === lesson.id ? 'page' : undefined}
                  >
                    <span className={`sidebar-dot ${completed.includes(l.id) ? 'done' : ''}`}>
                      {completed.includes(l.id) && <Check size={10} />}
                    </span>
                    {text(l.title)}
                  </Link>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </nav>
      <Link className="sidebar-reference" to="/reference">
        {c('Butuh pengingat API?', 'Need an API reminder?')}
        <ArrowUpRight size={13} />
      </Link>
    </aside>
  )
}
function LessonContent({ lesson }: { lesson: Lesson }) {
  const { c, text, completed, completeLesson, visitLesson, storageAvailable } = useApp()
  const index = lessons.findIndex(l => l.id === lesson.id)
  const previous = lessons[index - 1]
  const next = lessons[index + 1]
  const done = completed.includes(lesson.id)
  const explanation = text(lesson.explanation)
    .split(/(?<=[.!?])\s+(?=[A-Z])/u)
    .reduce<string[]>((parts, sentence, index) => {
      if (index % 2 === 0) parts.push(sentence)
      else parts[parts.length - 1] += ` ${sentence}`
      return parts
    }, [])
  useEffect(() => {
    visitLesson(lesson.id)
  }, [lesson.id, visitLesson])
  useEffect(() => {
    document.title = `${text(lesson.title)} — RanMotion`
  }, [lesson.title, text])
  return (
    <article className="lesson-article">
      <header className="lesson-header">
        <div className="breadcrumbs">
          <Link to="/learn">{c('Belajar', 'Learn')}</Link>
          <span>/</span>
          <Link to={`/learn#module-${lesson.module}`}>{text(modules[lesson.module].title)}</Link>
        </div>
        <div className="lesson-meta">
          <span className="eyebrow">
            {c('PELAJARAN', 'LESSON')} {String(index + 1).padStart(2, '0')} / {lessons.length}
          </span>
          <span>
            <Clock3 size={13} />
            {lesson.minutes} {c('menit', 'min')}
          </span>
          {done && (
            <span className="completion-badge">
              <Check size={12} />
              {c('Selesai', 'Completed')}
            </span>
          )}
        </div>
        <h1>{text(lesson.title)}</h1>
        <p className="page-lead">{text(lesson.description)}</p>
        <nav className="lesson-section-nav" aria-label={c('Bagian pelajaran', 'Lesson sections')}>
          <a href="#understand">{c('Pahami', 'Understand')}</a>
          <a href="#experiment">{c('Eksperimen', 'Experiment')}</a>
          <a href="#challenge">{c('Tantangan', 'Challenge')}</a>
          <a href="#recap">{c('Rangkuman', 'Recap')}</a>
        </nav>
      </header>
      <div className="lesson-objective">
        <Target size={18} />
        <div>
          <strong>{c('Setelah pelajaran ini, kamu bisa…', 'After this lesson, you can…')}</strong>
          <p>{text(lesson.objective)}</p>
        </div>
      </div>
      <section className="lesson-section" id="understand">
        <p className="eyebrow">{c('01 / PAHAMI IDENYA', '01 / UNDERSTAND THE IDEA')}</p>
        <h2>{c('Cara membayangkannya', 'A useful way to think about it')}</h2>
        <p className="mental-model">{text(lesson.model)}</p>
        <div className="lesson-explanation">
          {explanation.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="concept-api">
          <span className="number-label">{c('KONSEP UTAMA', 'KEY CONCEPT')}</span>
          <code>{lesson.concept}</code>
        </div>
      </section>
      <LessonCoach lesson={lesson} />
      <section className="lesson-section experiment-guide">
        <p className="eyebrow">
          {c('02 / AMATI SEBAB DAN AKIBAT', '02 / CONNECT CAUSE AND EFFECT')}
        </p>
        <h2>{c('Coba satu perubahan setiap kali', 'Try one change at a time')}</h2>
        <GuidedSteps steps={lesson.steps} />
      </section>
      <div className="practice-heading">
        <div>
          <p className="eyebrow">{c('03 / COBA DALAM KODE', '03 / TRY IT IN CODE')}</p>
          <h2>{c('Giliranmu menganimasikan idenya.', 'Your turn to animate the idea.')}</h2>
        </div>
        <Link className="text-link" to={`/playground?example=${lesson.id}`}>
          {c('Buka di playground', 'Open in playground')}
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="lab-skeleton" role="status">
              <span>
                {c('Menyiapkan editor dan preview…', 'Getting the editor and preview ready…')}
              </span>
            </div>
          }
        >
          <MotionLab lesson={lesson} key={lesson.id} />
        </Suspense>
      </ErrorBoundary>
      <section className="lesson-section common-mistake">
        <p className="eyebrow">
          {c('JIKA HASILNYA BELUM SESUAI', 'IF THE RESULT LOOKS DIFFERENT')}
        </p>
        <h2>{c('Kesalahan yang wajar terjadi', 'A common thing to watch for')}</h2>
        <p>{text(lesson.mistake)}</p>
      </section>
      <section className="lesson-section lesson-recap" id="recap">
        <p className="eyebrow">{c('05 / BAWA IDE INI BERSAMAMU', '05 / TAKE THIS WITH YOU')}</p>
        <h2>{c('Yang perlu kamu ingat', 'What to remember')}</h2>
        <ul>
          {lesson.recap.map((item, i) => (
            <li key={i}>
              <Check size={16} />
              {text(item)}
            </li>
          ))}
        </ul>
        <div className="lesson-complete">
          <div>
            <strong>
              {done
                ? c(
                    'Satu langkah lagi sudah kamu pahami.',
                    'One more step is part of your toolkit.',
                  )
                : c('Sudah paham inti idenya?', 'Got the idea?')}
            </strong>
            <p>
              {done
                ? storageAvailable
                  ? c(
                      'Progres pelajaran tersimpan di perangkat ini.',
                      'Your lesson progress is saved on this device.',
                    )
                  : c(
                      'Progres tersedia selama sesi ini.',
                      'Progress is available for this session.',
                    )
                : c(
                    'Kamu boleh menandai pelajaran selesai dan kembali berlatih kapan saja.',
                    'You can mark the lesson complete and return to practice anytime.',
                  )}
            </p>
          </div>
          <button
            className={`button ${done ? 'secondary' : 'primary'} small`}
            onClick={() => completeLesson(lesson.id)}
            disabled={done}
          >
            <CheckCircle2 size={15} />
            {done
              ? c('Pelajaran selesai', 'Lesson completed')
              : c('Tandai selesai', 'Mark complete')}
          </button>
        </div>
      </section>
      <nav
        className="lesson-pagination"
        aria-label={c('Pelajaran sebelumnya dan berikutnya', 'Previous and next lessons')}
      >
        <div>
          {previous ? (
            <Link to={`/learn/${previous.id}`}>
              <span>
                <ArrowLeft size={13} />
                {c('Sebelumnya', 'Previous')}
              </span>
              <strong>{text(previous.title)}</strong>
            </Link>
          ) : (
            <Link to="/learn">
              <span>
                <ArrowLeft size={13} />
                {c('Kembali ke jalur', 'Back to the path')}
              </span>
            </Link>
          )}
        </div>
        <div>
          {next ? (
            <Link to={`/learn/${next.id}`}>
              <span>
                {c('Selanjutnya', 'Up next')}
                <ArrowRight size={13} />
              </span>
              <strong>{text(next.title)}</strong>
            </Link>
          ) : (
            <Link to="/playground">
              <span>
                {c('Petualangan berikutnya', 'Your next adventure')}
                <ArrowRight size={13} />
              </span>
              <strong>{c('Buat eksperimen sendiri', 'Make your own experiment')}</strong>
            </Link>
          )}
        </div>
      </nav>
    </article>
  )
}
export default function LessonPage() {
  const { lessonId } = useParams()
  const source = getLesson(lessonId)
  const lesson = useMemo(
    () => (source ? { ...source, activity: learningActivity(source) } : undefined),
    [source],
  )
  if (!lesson) return <NotFoundPage />
  return (
    <div className="lesson-layout page-width">
      <LessonSidebar lesson={lesson} />
      <LessonContent key={lesson.id} lesson={lesson} />
    </div>
  )
}
