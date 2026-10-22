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
  Target,
} from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { lessons, modules } from '../data/curriculum'
import Brand from './Brand'
import Dialog from './Dialog'

const navigation = [
  { href: '/', id: 'Beranda', en: 'Home', icon: House },
  { href: '/learn', id: 'Belajar', en: 'Learn', icon: BookOpen },
  { href: '/playground', id: 'Playground', en: 'Playground', icon: FlaskConical },
  { href: '/challenges', id: 'Tantangan', en: 'Challenges', icon: Target },
  { href: '/progress', id: 'Progres', en: 'Progress', icon: ChartNoAxesColumnIncreasing },
]
export default function SiteLayout() {
  const app = useApp()
  const { c, text, locale, setLocale, storageAvailable, reducedMotion, toggleMotion } = app
  const { pathname, hash } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [confirm, setConfirm] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(open => !open)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      mainRef.current?.focus({ preventScroll: true })
    } else {
      const timer = window.setTimeout(
        () => document.getElementById(hash.slice(1))?.scrollIntoView(),
        120,
      )
      return () => clearTimeout(timer)
    }
  }, [pathname, hash])
  const matching = lessons
    .filter(l =>
      `${text(l.title)} ${l.title.en} ${l.concept} ${text(l.description)}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
    )
    .slice(0, 8)
  return (
    <>
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
              MOTION FIELDNOTES <i>№ 01—{String(modules.length).padStart(2, '0')}</i>
            </span>
          </div>
          <nav className="desktop-nav" aria-label={c('Navigasi utama', 'Main navigation')}>
            {navigation.map(item => (
              <NavLink key={item.href} to={item.href} end={item.href === '/'}>
                {c(item.id, item.en)}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="search-trigger"
              onClick={() => setSearchOpen(true)}
              aria-label={c('Cari pelajaran (Ctrl K)', 'Search lessons (Ctrl K)')}
            >
              <Search size={16} />
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="locale-button"
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              aria-label={locale === 'id' ? 'Switch to English' : 'Ganti ke bahasa Indonesia'}
            >
              <Languages size={15} />
              {locale.toUpperCase()}
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
      <div className="motion-ticker" aria-hidden="true">
        <div className="ticker-track">
          {Array.from({ length: 4 }, (_, i) => (
            <span key={i}>
              LEARN BY MOVING <b>✳</b> GSAP / EXPERIMENT / REPEAT <b>↗</b> MAKE THE INVISIBLE
              VISIBLE <b>✳</b>
            </span>
          ))}
        </div>
      </div>
      {!storageAvailable && (
        <div className="storage-notice" role="status">
          {c(
            'Penyimpanan browser tidak tersedia. Progres hanya bertahan selama sesi ini.',
            'Browser storage is unavailable. Your progress will last for this session only.',
          )}
        </div>
      )}
      <main id="main-content" tabIndex={-1} ref={mainRef}>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              {c('Menyiapkan ruang belajarmu…', 'Getting your learning space ready…')}
            </div>
          }
        >
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
          </div>
          <div className="footer-next">
            <span className="eyebrow">{c('IDE BERIKUTNYA', 'THE NEXT IDEA')}</span>
            <Link to="/playground">
              {c('Buat animasimu sendiri.', 'Make an animation of your own.')}
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="footer-links">
            <Link to="/reference">{c('Referensi singkat', 'Quick reference')}</Link>
            <a href="https://gsap.com/docs/v3/" target="_blank" rel="noreferrer">
              {c('Dokumentasi GSAP', 'GSAP documentation')} ↗
            </a>
            <a href="https://github.com/randhupaksi/ranmotion" target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
        <p className="footer-note">
          <span>
            RanMotion by Rancode ·{' '}
            {c(
              'Proyek belajar independen, tidak berafiliasi dengan GSAP atau Webflow.',
              'An independent learning project, not affiliated with GSAP or Webflow.',
            )}
          </span>
          <span>
            <ShieldCheck size={13} />
            {c('Progres di perangkatmu', 'Progress on your device')}
          </span>
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
            autoFocus
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={c('Cari tween, easing, scroll…', 'Search tween, easing, scroll…')}
            aria-label={c('Cari materi', 'Search lessons')}
          />
        </label>
        <p className="eyebrow search-label">
          {query ? c('HASIL PENCARIAN', 'SEARCH RESULTS') : c('MULAI DARI SINI', 'START EXPLORING')}
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
            <div className="empty-state">
              <p>{c('Belum ada materi yang cocok.', 'No matching lessons.')}</p>
              <small>
                {c(
                  'Coba “easing”, “timeline”, atau kata yang lebih pendek.',
                  'Try “easing”, “timeline”, or a shorter search.',
                )}
              </small>
            </div>
          )}
        </div>
        <p className="quiet-note">
          {c(
            'Gunakan Tab untuk memilih hasil. Esc untuk menutup.',
            'Use Tab to choose a result. Esc to close.',
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
          <select
            className="compact-select"
            value={locale}
            onChange={e => setLocale(e.target.value as 'id' | 'en')}
            aria-label={c('Bahasa materi', 'Learning language')}
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
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
                  'Hapus status pelajaran dan tantangan? Draf kode tetap tersimpan.',
                  'Clear lesson and challenge completion? Code drafts will be kept.',
                )}
              </p>
              <div className="button-row">
                <button
                  className="button danger"
                  onClick={() => {
                    app.resetProgress()
                    setConfirm(false)
                  }}
                >
                  {c('Ya, hapus progres', 'Yes, clear progress')}
                </button>
                <button className="button secondary" onClick={() => setConfirm(false)}>
                  {c('Batal', 'Cancel')}
                </button>
              </div>
            </>
          ) : (
            <button className="text-button muted" onClick={() => setConfirm(true)}>
              {c('Mulai ulang progres belajar', 'Reset learning progress')}
            </button>
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
