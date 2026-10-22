import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Eye, MousePointer2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useApp } from '../app/AppProvider'
import { lessons, modules, nextRecommended } from '../data/curriculum'
const HomeDemo = lazy(() => import('../components/HomeDemo'))

export default function HomePage() {
  const { c, text, completed } = useApp()
  const next = nextRecommended(completed)
  useEffect(() => {
    document.title = c('RanMotion — Pahami animasi.', 'RanMotion — Understand animation.')
  }, [c])
  return (
    <div className="home-page">
      <section className="hero page-width">
        <div className="hero-rail" aria-hidden="true">
          <span>
            FIELD STUDY
            <br />
            001 / GSAP
          </span>
          <i />
          <span>
            01
            <br />
            {String(modules.length).padStart(2, '0')}
          </span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" />
            {c('BELAJAR ANIMASI DENGAN CARA MENGALAMINYA', 'LEARN ANIMATION BY EXPERIENCING IT')}
          </p>
          <h1>
            {c('Pahami', 'Understand')}
            <br />
            <span className="hero-word">
              <em>{c('animasi', 'animation')}</em>
              <span className="hero-period" aria-hidden="true">
                ✳
              </span>
            </span>
          </h1>
          <p className="hero-lead">
            {c(
              'RanMotion mengubah GSAP dari baris kode menjadi sesuatu yang bisa kamu lihat, utak-atik, dan pahami. Mulai dari animasi sederhana. Bangun intuisi yang bisa kamu bawa ke mana saja.',
              'RanMotion turns GSAP from lines of code into something you can see, tweak, and understand. Start with a simple animation. Build intuition you can take anywhere.',
            )}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={`/learn/${next.id}`}>
              {completed.length
                ? c('Lanjutkan perjalanan', 'Continue your journey')
                : c('Masuk ke pelajaran pertama', 'Enter the first lesson')}
              <ArrowUpRight size={16} />
            </Link>
            <Link className="button ghost" to="/playground">
              {c('Buka ruang eksperimen', 'Open the experiment room')}
              <ArrowRight size={15} />
            </Link>
          </div>
          <p className="hero-footnote">
            <Check size={13} />
            {c(
              'Gratis · Tanpa akun · Progres tersimpan di perangkatmu',
              'Free · No account · Progress stays on your device',
            )}
          </p>
          <div className="hero-index-strip">
            <span>
              <i className="status-dot" /> GSAP / INTERACTIVE COURSE
            </span>
            <span>
              01—{String(modules.length).padStart(2, '0')} / {modules.length} {c('BAB', 'CHAPTERS')}
            </span>
          </div>
        </div>
        <div className="hero-lab">
          <div className="hero-lab-label">
            <span className="number-label">MOTION STUDY / 001</span>
            <span className="handwritten">
              {c('tonton, lalu utak-atik', 'watch, then mess with it')} ↘
            </span>
          </div>
          <Suspense
            fallback={
              <div className="home-demo home-demo-loading" role="status">
                {c('Menyiapkan animasi…', 'Preparing the animation…')}
              </div>
            }
          >
            <HomeDemo />
          </Suspense>
          <p className="hero-lab-note">
            <MousePointer2 size={12} />
            {c(
              'Animasi ini berjalan langsung. Kamu memegang kendalinya.',
              'This animation is running live. You are in control.',
            )}
          </p>
        </div>
        <a className="hero-scroll" href="#learning-path">
          <span>{c('GULIR UNTUK MENJELAJAH', 'SCROLL TO EXPLORE')}</span>
          <ArrowDown size={14} />
        </a>
      </section>

      <div className="home-facts page-width">
        <span className="facts-kicker">
          {c('CATATAN LAPANGAN', 'FIELD NOTES')}
          <ArrowDown size={13} />
        </span>
        <div>
          <strong>
            {lessons.length}
            <i>×</i>
          </strong>
          <span>{c('eksperimen terpandu', 'guided experiments')}</span>
        </div>
        <div>
          <strong>{String(modules.length).padStart(2, '0')}</strong>
          <span>{c('bab dari dasar ke proyek', 'chapters from basics to project')}</span>
        </div>
        <div>
          <strong>∞</strong>
          <span>{c('cara untuk mengeksplorasi', 'ways to explore')}</span>
        </div>
      </div>

      <section className="home-path page-width" id="learning-path">
        <div className="section-intro">
          <div>
            <p className="eyebrow">
              {c('JALUR BELAJAR', 'LEARNING PATH') +
                ' / 01—' +
                String(modules.length).padStart(2, '0')}
            </p>
            <h2>
              {c('Satu animasi', 'One animation')}
              <br />
              <em>{c('membuka banyak kemungkinan.', 'opens up possibilities.')}</em>
            </h2>
          </div>
          <div>
            <p>
              {c(
                'Mulai dengan cara GSAP memilih elemen. Lanjutkan ke waktu, urutan, interaksi, dan scroll. Di ujungnya, semua konsep bekerja bersama dalam satu proyek.',
                'Start with how GSAP finds elements. Continue through timing, sequencing, interaction, and scroll. At the end, every idea works together in one project.',
              )}
            </p>
            <Link className="text-link" to="/learn">
              {c('Jelajahi seluruh kurikulum', 'Explore the full curriculum')}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="home-module-list">
          {modules.map(m => (
            <Link key={m.number} to={`/learn#module-${m.number}`} className="home-module">
              <span className="module-number">{String(m.number + 1).padStart(2, '0')}</span>
              <div>
                <h3>{text(m.title)}</h3>
                <p>{m.topics}</p>
              </div>
              <span className="module-count">
                {lessons.filter(l => l.module === m.number).length} {c('STUDI', 'STUDIES')}
              </span>
              <ArrowUpRight size={17} />
            </Link>
          ))}
        </div>
        <Link className="project-teaser" to="/learn/project">
          <span className="number-label">
            {String(modules.length).padStart(2, '0')} / CAPSTONE EXPERIMENT
          </span>
          <strong>
            {c('Sekarang, buat sesuatu milikmu.', 'Now, make something of your own.')}
          </strong>
          <span>
            {c('Satukan semua yang kamu pelajari', 'Bring everything you have learned together')}
            <ArrowRight size={16} />
          </span>
        </Link>
      </section>

      <section className="learning-method page-width">
        <div className="section-intro">
          <div>
            <p className="eyebrow">
              {c('METODE / LIHAT → UBAH → PAHAMI', 'METHOD / SEE → CHANGE → UNDERSTAND')}
            </p>
            <h2>
              {c('Jangan cuma meniru animasinya.', 'Do not just copy the animation.')}
              <br />
              <em>{c('Pahami cara kerjanya.', 'Understand how it works.')}</em>
            </h2>
          </div>
          <p>
            {c(
              'Kode dan animasi tampil berdampingan. Kamu mengubah satu hal, melihat hasilnya, lalu menghubungkan keduanya.',
              'Code and animation sit side by side. Change one thing, see what happens, then connect the two.',
            )}
          </p>
        </div>
        <div className="method-columns">
          {[
            {
              icon: Eye,
              n: '01',
              t: c('Amati', 'Observe'),
              d: c(
                'Mulai dengan contoh nyata. Putar ulang, jeda, dan amati animasinya.',
                'Start with a real example. Replay, pause, and inspect the animation.',
              ),
            },
            {
              icon: Code2,
              n: '02',
              t: c('Ubah', 'Change'),
              d: c(
                'Atur nilai di kode. Jalankan lagi dan lihat dampaknya secara langsung.',
                'Adjust a value in the code. Run it again and see the effect immediately.',
              ),
            },
            {
              icon: MousePointer2,
              n: '03',
              t: c('Rangkai', 'Compose'),
              d: c(
                'Gunakan pemahamanmu dalam tantangan dan proyek yang lebih utuh.',
                'Put what you learned to work in challenges and a complete project.',
              ),
            },
          ].map(item => (
            <div key={item.n}>
              <div className="method-top">
                <item.icon size={20} />
                <span>{item.n}</span>
              </div>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="prerequisites page-width">
        <div>
          <span className="eyebrow">{c('TITIK MULAI', 'YOUR STARTING POINT')}</span>
          <h2>{c('Punya rasa ingin tahu? Sudah cukup.', 'Curiosity is a good enough start.')}</h2>
          <p>
            {c(
              'Sedikit HTML, selector CSS, dan JavaScript dasar akan membantu. Kami mengingatkan konsep yang dibutuhkan sambil berjalan.',
              'A little HTML, CSS selectors, and basic JavaScript will help. We will revisit concepts when you need them.',
            )}
          </p>
          <div className="prerequisite-tags">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
          </div>
        </div>
        <Link className="button primary" to="/learn/orientation">
          {c('Belajar animasi', 'Start learning')}
          <ArrowUpRight size={17} />
        </Link>
      </section>
    </div>
  )
}
