import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Eye, MousePointer2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useApp } from '../app/AppProvider'
import { SectionLoadingSkeleton } from '../components/LoadingSkeleton'
import { lessons, modules, nextRecommended } from '../data/curriculum'
const HomeDemo = lazy(() => import('../components/HomeDemo'))

export default function HomePage() {
  const { c, text, completed, lastLesson, reducedMotion } = useApp()
  const next = nextRecommended(completed, lastLesson)
  const allDone = lessons.every(lesson => completed.includes(lesson.id))
  useEffect(() => {
    document.title = c('RanMotion - Pahami animasi.', 'RanMotion - Understand animation.')
  }, [c])
  return (
    <div className="home-page">
      <section className="hero page-width">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-line" />
            {c('BELAJAR ANIMASI WEBSITE', 'LEARN ANIMATION BY EXPERIENCING IT')}
          </p>
          <h1>
            {c('Pahami', 'Understand')} <br className="hero-break" />
            <span className="hero-word">
              <em>{c('Animasi', 'Animation')}</em>
              <span className="hero-period" aria-hidden="true">
                ✳
              </span>
            </span>
          </h1>
          <p className="hero-lead">
            {c(
              'RanMotion adalah ruang belajar animasi web dengan GSAP, library animasi JavaScript. Mulai dari ide dan contoh visual, lalu coba kode selangkah demi selangkah. Bangun intuisi dengan melihat, mengubah, dan membandingkan.',
              'RanMotion is an interactive space to learn web animation with GSAP, a JavaScript animation library. Start with ideas and visual examples, then explore code one step at a time. Build intuition by watching, changing, and comparing.',
            )}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to={allDone ? '/playground' : `/learn/${next.id}`}>
              {allDone
                ? c('Buat eksperimen baru', 'Make a new experiment')
                : completed.length || lastLesson
                  ? c('Lanjutkan perjalanan', 'Continue your journey')
                  : c('Masuk ke pelajaran pertama', 'Enter the first lesson')}
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <p className="hero-next-note">
            {allDone ? (
              c(
                'Seluruh jalur selesai. Saatnya mencoba idemu sendiri.',
                'You finished the path. Time to try your own idea.',
              )
            ) : (
              <>
                {c('Berikutnya: ', 'Up next: ')}
                {text(next.title)} · {next.minutes} {c('menit', 'min')}
                {next.format === 'concept'
                  ? c(' · tanpa menulis kode', ' · no coding required')
                  : ''}
              </>
            )}
          </p>
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
              01-{String(modules.length).padStart(2, '0')} / {modules.length} {c('BAB', 'CHAPTERS')}
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
              <SectionLoadingSkeleton
                variant="demo"
                label={c('Menyiapkan animasi', 'Preparing the animation')}
              />
            }
          >
            <HomeDemo />
          </Suspense>
          <p className="hero-lab-note">
            <MousePointer2 size={12} />
            {reducedMotion
              ? c(
                  'Mode kurangi animasi aktif. Tekan Lihat hasil untuk memeriksa keadaan akhirnya.',
                  'Reduced motion is on. Press Show result to inspect the final state.',
                )
              : c(
                  'Tekan Jalankan demo, lalu ubah durasi untuk merasakan bedanya.',
                  'Press Run the demo, then change the duration to feel the difference.',
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
                ' / 01-' +
                String(modules.length).padStart(2, '0')}
            </p>
            <h2>
              {c('Satu animasi', 'One animation')}
              <br />
              <em>{c('membuka banyak kemungkinan', 'opens up possibilities')}</em>
            </h2>
          </div>
          <div>
            <p>
              {c(
                'Kenali GSAP lewat dua studi visual tanpa coding. Setelah itu, coba editor, atur waktu, rangkai urutan, lalu hubungkan animasi dengan interaksi dan scroll. Di ujungnya, satukan idemu dalam proyek.',
                'Meet GSAP through two visual studies with no coding. Then try the editor, shape timing, arrange sequences, and connect animation to interaction and scroll. Finally, bring your ideas together in a project.',
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
          <strong>{c('Sekarang, buat sesuatu milikmu', 'Now, make something of your own')}</strong>
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
              {c('Jangan cuma meniru animasinya', 'Do not just copy the animation')}
              <br />
              <em>{c('Pahami cara kerjanya', 'Understand how it works')}</em>
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
          <h2>{c('Punya rasa ingin tahu? Sudah cukup', 'Curiosity is a good enough start')}</h2>
          <p>
            {c(
              'Dua pelajaran pertama bisa dicoba tanpa menulis kode. Saat masuk ke editor, sedikit HTML, selector CSS, dan JavaScript dasar akan membantu. Pengingat konsep tersedia di sepanjang jalur.',
              'Try the first two lessons without writing code. When you reach the editor, a little HTML, CSS selectors, and basic JavaScript will help. Concept reminders are available along the way.',
            )}
          </p>
          <div className="prerequisite-tags">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
          </div>
        </div>
        <Link className="button primary" to="/learn/gsap-foundations">
          {c('Belajar animasi', 'Start learning')}
          <ArrowUpRight size={17} />
        </Link>
      </section>
    </div>
  )
}
