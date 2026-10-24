import { Suspense, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChartNoAxesColumnIncreasing,
  Check,
  FlaskConical,
  House,
  Languages,
  Search,
  Settings2,
  ShieldCheck,
  Pause,
  Play,
  Target,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { lessons, modules, nextRecommended } from '../data/curriculum'
import Brand from './Brand'
import { RouteSkeleton } from './LoadingSkeleton'
import Dialog from './Dialog'
import FeedbackState from './FeedbackState'
import RouteExperience from './RouteExperience'
import SelectField from './SelectField'

const navigation = [
  { href: '/', id: 'Beranda', en: 'Home', icon: House },
  { href: '/learn', id: 'Belajar', en: 'Learn', icon: BookOpen },
  { href: '/playground', id: 'Playground', en: 'Playground', icon: FlaskConical },
  { href: '/challenges', id: 'Tantangan', en: 'Challenges', icon: Target },
  { href: '/progress', id: 'Progres', en: 'Progress', icon: ChartNoAxesColumnIncreasing },
]
const tickerMessages = [
  'LEARN BY MOVING',
  'GSAP / EXPERIMENT / REPEAT',
  'TWEEN / TIMELINE / SCROLLTRIGGER',
  'ONE IDEA, MANY MOTIONS',
  'CODE / PREVIEW / PLAY',
  'MAKE THE INVISIBLE VISIBLE',
  'MOTION HAS A LOGIC',
  'START SMALL / BUILD YOUR EYE',
  'TARGET / PROPERTY / EASING',
  'DESIGN THE MOMENT',
]
export default function SiteLayout() {
  const app = useApp()
  const {
    c,
    text,
    locale,
    setLocale,
    storageAvailable,
    reducedMotion,
    toggleMotion,
    completed,
    lastLesson,
  } = app
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const resetTrigger = useRef<HTMLButtonElement>(null)
  const resetCancel = useRef<HTMLButtonElement>(null)
  const wasConfirming = useRef(false)
  const [tickerPaused, setTickerPaused] = useState(false)
  useEffect(() => {
    if (settingsOpen) {
      if (confirm) resetCancel.current?.focus()
      else if (wasConfirming.current) resetTrigger.current?.focus()
    }
    wasConfirming.current = confirm
  }, [confirm, settingsOpen])
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSettingsOpen(false)
        setSearchOpen(open => !open)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  const matching = lessons
    .filter(l =>
      `${text(l.title)} ${l.title.en} ${l.concept} ${text(l.description)}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
    )
    .slice(0, 8)
  const doneCount = lessons.filter(lesson => completed.includes(lesson.id)).length
  const progressPercent = Math.round((doneCount / lessons.length) * 100)
  const allLessonsDone = doneCount === lessons.length
  const nextLesson = nextRecommended(completed, lastLesson)
  const nextLessonIndex = lessons.findIndex(lesson => lesson.id === nextLesson.id)
  const nextLessonTitle = text(nextLesson.title)
  return (
    <>
      <RouteExperience />
      <a href="#main-content" className="skip-link">
        {c('Lewati ke konten', 'Skip to content')}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-cluster">
            <Link to="/" aria-label={c('Beranda RanMotion', 'RanMotion home')}>
              <Brand />
            </Link>
            <span className="brand-caption">
              MOTION FIELDNOTES <i>№ 01-{String(modules.length).padStart(2, '0')}</i>
            </span>
          </div>
          <nav className="desktop-nav" aria-label={c('Navigasi utama', 'Main navigation')}>
            {navigation.map(item => (
              <NavLink key={item.href} to={item.href} end={item.href === '/'}>
                <span>{c(item.id, item.en)}</span>
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label={c('Cari pelajaran ⌘ K, atau Ctrl K', 'Search lessons ⌘ K, or Ctrl K')}
            >
              <Search size={16} />
              <span className="search-placeholder" aria-hidden="true">
                {c('Cari pelajaran', 'Search lessons')}
              </span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="locale-button"
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              aria-label={
                locale === 'id' ? 'EN · Switch to English' : 'ID · Ganti ke bahasa Indonesia'
              }
              title={locale === 'id' ? 'Switch to English' : 'Ganti ke bahasa Indonesia'}
            >
              <Languages size={15} />
              {locale === 'id' ? 'EN' : 'ID'}
            </button>
            <button
              className="icon-button settings-trigger"
              onClick={() => {
                setConfirm(false)
                setSettingsOpen(true)
              }}
              aria-label={c('Pengaturan belajar', 'Learning settings')}
            >
              <Settings2 size={17} />
            </button>
          </div>
        </div>
      </header>
      <div className="motion-ticker">
        <div
          className="ticker-track"
          aria-hidden="true"
          style={{ animationPlayState: tickerPaused ? 'paused' : 'running' }}
        >
          {[0, 1].map(copy => (
            <div className="ticker-group" key={copy}>
              {tickerMessages.map((message, index) => (
                <span className="ticker-item" key={message}>
                  {message} <b>{index % 3 === 1 ? '↗' : '✳'}</b>
                </span>
              ))}
            </div>
          ))}
        </div>
        {!reducedMotion && (
          <button
            className="ticker-toggle"
            onClick={() => setTickerPaused(paused => !paused)}
            aria-pressed={tickerPaused}
            aria-label={
              tickerPaused
                ? c('Lanjutkan teks berjalan', 'Resume the scrolling text')
                : c('Jeda teks berjalan', 'Pause the scrolling text')
            }
          >
            {tickerPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        )}
      </div>
      {!storageAvailable && (
        <div className="storage-notice" role="status">
          {c(
            'Penyimpanan browser tidak tersedia. Progres hanya bertahan selama sesi ini.',
            'Browser storage is unavailable. Your progress will last for this session only.',
          )}
        </div>
      )}
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<RouteSkeleton />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="site-footer page-width">
        <div className="footer-main">
          <div className="footer-identity">
            <Link to="/">
              <Brand small />
            </Link>
            <p>
              {c(
                'Lihat animasinya. Pahami idenya. Buat versimu.',
                'See the animation. Understand why. Make it yours.',
              )}
            </p>
            <span className="footer-identity__signature">
              <span aria-hidden="true" />
              {c('LAB ANIMASI INTERAKTIF', 'INTERACTIVE MOTION LAB')}
            </span>
          </div>
          <section className="footer-next" aria-labelledby="footer-next-title">
            <div className="footer-next__topline">
              <p className="eyebrow">
                {allLessonsDone
                  ? c('JALUR TUNTAS', 'LEARNING PATH COMPLETE')
                  : lastLesson === nextLesson.id
                    ? c('LANJUTKAN BELAJAR', 'PICK UP WHERE YOU LEFT OFF')
                    : c('LANGKAH BERIKUTNYA', 'YOUR NEXT STEP')}
              </p>
              <span className="footer-next__count">
                {String(doneCount).padStart(2, '0')} / {lessons.length}
              </span>
            </div>
            <div
              className="footer-progress"
              role="progressbar"
              aria-label={c('Kemajuan belajar', 'Learning progress')}
              aria-valuemin={0}
              aria-valuemax={lessons.length}
              aria-valuenow={doneCount}
              aria-valuetext={c(
                `${doneCount} dari ${lessons.length} pelajaran selesai`,
                `${doneCount} of ${lessons.length} lessons complete`,
              )}
            >
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="footer-next__context">
              {allLessonsDone
                ? c('RUANG EKSPERIMEN / BEBAS', 'PLAYGROUND / OPEN ENDED')
                : `${c('BAB', 'CHAPTER')} ${String(nextLesson.module + 1).padStart(2, '0')} · ${text(modules[nextLesson.module].title)} · ${nextLesson.minutes} ${c('MENIT', 'MIN')}`}
            </p>
            <h2 id="footer-next-title" className="footer-next__title">
              {allLessonsDone
                ? c('Sekarang, buat animasimu sendiri', 'Now make an animation of your own')
                : lastLesson === nextLesson.id
                  ? `${c('Lanjutkan:', 'Continue:')} ${nextLessonTitle}`
                  : nextLessonTitle}
            </h2>
            <p className="footer-next__description">
              {allLessonsDone
                ? c(
                    'Kamu sudah menuntaskan semua materi. Gabungkan ide-idenya di ruang eksperimen.',
                    'You finished the full course. Bring the ideas together in the playground.',
                  )
                : c(
                    'Satu langkah kecil lagi untuk memahami logika di balik animasi.',
                    'One small step closer to understanding the logic behind motion.',
                  )}
            </p>
            <Link
              className="footer-next__action"
              to={allLessonsDone ? '/playground' : `/learn/${nextLesson.id}`}
            >
              <span>
                {allLessonsDone
                  ? c('Buka playground', 'Open the playground')
                  : lastLesson === nextLesson.id
                    ? c('Lanjutkan pelajaran', 'Continue lesson')
                    : c('Mulai pelajaran', 'Start this lesson')}
              </span>
              <ArrowRight size={16} />
            </Link>
            <span className="footer-next__index" aria-hidden="true">
              {String(allLessonsDone ? lessons.length : Math.max(nextLessonIndex + 1, 1)).padStart(
                2,
                '0',
              )}
            </span>
          </section>
          <nav className="footer-nav" aria-label={c('Jelajahi RanMotion', 'Explore RanMotion')}>
            <h2 className="footer-group-title">{c('JELAJAHI', 'EXPLORE')}</h2>
            <Link to="/learn">{c('Jalur belajar', 'Learning path')}</Link>
            <Link to="/playground">{c('Ruang eksperimen', 'Playground')}</Link>
            <Link to="/challenges">{c('Tantangan', 'Challenges')}</Link>
            <Link to="/progress">{c('Progresku', 'My progress')}</Link>
            <Link to="/reference">{c('Referensi singkat', 'Quick reference')}</Link>
          </nav>
          <div className="footer-resources">
            <h2 className="footer-group-title">{c('SUMBER', 'RESOURCES')}</h2>
            <a href="https://gsap.com/docs/v3/" target="_blank" rel="noreferrer">
              {c('Dokumentasi GSAP', 'GSAP documentation')} <span aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/randhupaksi/ranmotion" target="_blank" rel="noreferrer">
              RanMotion GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <p className="footer-note">
          © {new Date().getFullYear()} RanMotion by Randhu. All rights reserved.
        </p>
      </footer>
      <nav className="mobile-nav" aria-label={c('Navigasi mobile', 'Mobile navigation')}>
        {navigation.map(item => (
          <NavLink key={item.href} to={item.href} end={item.href === '/'}>
            <item.icon size={19} />
            <span>{c(item.id, item.en)}</span>
          </NavLink>
        ))}
      </nav>
      <Dialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title={c('Apa yang ingin kamu pelajari?', 'What would you like to learn?')}
        className="search-dialog"
      >
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={c('Cari tween, easing, scroll…', 'Search tween, easing, scroll…')}
            aria-label={c('Cari materi', 'Search lessons')}
            onKeyDown={event => {
              if (event.key === 'Enter' && !event.nativeEvent.isComposing && matching[0]) {
                event.preventDefault()
                setSearchOpen(false)
                navigate(`/learn/${matching[0].id}`)
              }
            }}
          />
        </label>
        <p className="eyebrow search-label" role="status">
          {query ? c('HASIL PENCARIAN', 'SEARCH RESULTS') : c('MULAI DARI SINI', 'START EXPLORING')}
          <span className="sr-only">
            {' '}
            · {matching.length} {c('hasil teratas', 'top results')}
            {query ? ` · ${query}` : ''}
          </span>
        </p>
        <div className="search-results">
          {matching.length ? (
            matching.map(l => (
              <Link key={l.id} to={`/learn/${l.id}`} onClick={() => setSearchOpen(false)}>
                <span>
                  <strong>{text(l.title)}</strong>
                  <small>
                    {l.concept} · {l.minutes} {c('menit', 'min')}
                  </small>
                </span>
                <ArrowRight size={16} />
              </Link>
            ))
          ) : (
            <FeedbackState
              compact
              icon={Search}
              eyebrow={c('PENCARIAN MATERI', 'LESSON SEARCH')}
              title={c('Belum ada materi yang cocok', 'No matching lessons')}
              description={c(
                'Coba “easing”, “timeline”, atau kata yang lebih pendek.',
                'Try “easing”, “timeline”, or a shorter search.',
              )}
              action={
                <button className="button secondary" onClick={() => setQuery('')}>
                  {c('Hapus pencarian', 'Clear search')}
                </button>
              }
            />
          )}
        </div>
        <p className="quiet-note">
          {c(
            'Enter membuka hasil pertama. Tab memilih hasil lain. Esc untuk menutup.',
            'Enter opens the first result. Tab chooses another. Esc closes search.',
          )}
        </p>
      </Dialog>
      <Dialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={c('Nyaman belajar, dengan caramu', 'Make yourself comfortable')}
      >
        <div className="setting-row">
          <div>
            <strong>{c('Kurangi animasi', 'Reduce motion')}</strong>
            <p>
              {c(
                'Tampilkan hasil akhir dan periksa progres secara manual.',
                'Show the final state and inspect progress manually.',
              )}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={reducedMotion}
            className={`switch ${reducedMotion ? 'on' : ''}`}
            onClick={toggleMotion}
            aria-label={c('Kurangi animasi', 'Reduce motion')}
          >
            <span />
          </button>
        </div>
        <div className="setting-row">
          <div>
            <strong>{c('Bahasa materi', 'Learning language')}</strong>
            <p>
              {c(
                'Berpindah bahasa tanpa kehilangan posisi.',
                'Switch languages without losing your place.',
              )}
            </p>
          </div>
          <SelectField
            value={locale}
            onValueChange={value => setLocale(value as 'id' | 'en')}
            label={c('Bahasa materi', 'Learning language')}
            align="end"
            options={[
              { value: 'id', label: 'Indonesia' },
              { value: 'en', label: 'English' },
            ]}
          />
        </div>
        <div className="settings-progress">
          <ShieldCheck size={20} />
          <div>
            <strong>{c('Belajar tanpa akun', 'Learn without an account')}</strong>
            <p>
              {c(
                'Progres dan draf disimpan di browser ini. Menghapus data situs akan menghapusnya.',
                'Progress and drafts are saved in this browser. Clearing site data removes them.',
              )}
            </p>
          </div>
        </div>
        <div className="reset-section">
          {confirm ? (
            <>
              <p>
                {c(
                  'Hapus progres pelajaran, tantangan, dan pelajaran terakhir dari penyimpanan browser ini? Draf kode dan pengaturan tetap tersimpan.',
                  'Clear lesson and challenge progress and the last lesson from this browser? Code drafts and settings will be kept.',
                )}
              </p>
              <div className="button-row">
                <button
                  className="button danger"
                  onClick={() => {
                    app.resetProgress()
                    setConfirm(false)
                    setResetComplete(true)
                  }}
                >
                  {c('Hapus progres lokal', 'Clear local progress')}
                </button>
                <button
                  ref={resetCancel}
                  className="button secondary"
                  onClick={() => setConfirm(false)}
                >
                  {c('Batal', 'Cancel')}
                </button>
              </div>
            </>
          ) : (
            <button
              ref={resetTrigger}
              className="text-button muted"
              onClick={() => {
                setResetComplete(false)
                setConfirm(true)
              }}
            >
              {c('Reset progres belajar', 'Reset learning progress')}
            </button>
          )}
          {resetComplete && (
            <p className="reset-success" role="status">
              {c(
                'Progres belajar lokal sudah direset. Draf kode dan pengaturan tetap tersimpan.',
                'Local learning progress has been reset. Code drafts and settings are still saved.',
              )}
            </p>
          )}
        </div>
        <p className="quiet-note">
          <Check size={13} />
          {c(
            'RanMotion mengikuti preferensi pengurangan animasi perangkat sejak kunjungan pertama.',
            'RanMotion respects the reduced-motion preference set on your device from your first visit.',
          )}
        </p>
      </Dialog>
    </>
  )
}
