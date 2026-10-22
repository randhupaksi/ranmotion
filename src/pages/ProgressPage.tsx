import { useEffect } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Check, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import FeedbackState from '../components/FeedbackState'
import {
  lessons,
  practiceLessons,
  modules,
  getModuleLessons,
  nextRecommended,
} from '../data/curriculum'
export default function ProgressPage() {
  const { c, text, completed, challenges, lastLesson, storageAvailable } = useApp()
  const done = lessons.filter(l => completed.includes(l.id))
  const next = nextRecommended(completed, lastLesson)
  useEffect(() => {
    document.title = `${c('Progres belajarmu', 'Your progress')} — RanMotion`
  }, [c])
  return (
    <div className="page-width standard-page">
      <header className="page-header">
        <p className="eyebrow">{c('PERJALANANMU SENDIRI', 'YOUR OWN JOURNEY')}</p>
        <h1>
          {c('Setiap langkah,', 'Every step,')}
          <br />
          <em>{c('tetap berarti.', 'counts for something.')}</em>
        </h1>
        <p className="page-lead">
          {c(
            'Tidak ada tenggat. Tidak ada peringkat. Hanya kamu dan hal baru yang mulai kamu pahami.',
            'No deadline. No leaderboard. Just you and something new starting to make sense.',
          )}
        </p>
      </header>
      <div className="progress-summary">
        <div>
          <strong>
            {done.length}
            <span>/{lessons.length}</span>
          </strong>
          <span>{c('pelajaran selesai', 'lessons completed')}</span>
        </div>
        <div>
          <strong>
            {challenges.filter(id => practiceLessons.some(l => l.id === id)).length}
            <span>/{practiceLessons.length}</span>
          </strong>
          <span>{c('tantangan dituntaskan', 'challenges completed')}</span>
        </div>
        <div>
          <strong>
            {Math.round((done.length / lessons.length) * 100)}
            <span>%</span>
          </strong>
          <span>{c('dari seluruh perjalanan', 'of the full journey')}</span>
        </div>
      </div>
      <section className="continue-panel">
        <div>
          <p className="eyebrow">
            {done.length === lessons.length
              ? c('SELURUH JALUR SELESAI', 'PATH COMPLETED')
              : c('LANGKAH BERIKUTNYA', 'YOUR NEXT STEP')}
          </p>
          <h2>
            {done.length === lessons.length
              ? c('Kamu sudah membangun fondasinya.', 'You have built your foundation.')
              : text(next.title)}
          </h2>
          <p>
            {done.length === lessons.length
              ? c(
                  'Kunjungi playground dan coba ide baru dengan semua konsep yang kamu pelajari.',
                  'Visit the playground and try a new idea using everything you have learned.',
                )
              : text(next.description)}
          </p>
        </div>
        <Link
          className="button primary"
          to={done.length === lessons.length ? '/playground' : `/learn/${next.id}`}
        >
          {done.length === lessons.length
            ? c('Buka playground', 'Open playground')
            : lastLesson
              ? c('Lanjutkan belajar', 'Continue learning')
              : c('Mulai belajar', 'Start learning')}
          <ArrowRight size={16} />
        </Link>
      </section>
      <section className="progress-modules">
        <h2>{c('Peta pemahamanmu', 'Your learning map')}</h2>
        {modules.map(m => {
          const all = getModuleLessons(m.number)
          const count = all.filter(l => completed.includes(l.id)).length
          return (
            <Link key={m.number} to={`/learn#module-${m.number}`}>
              <span className="module-number">{String(m.number + 1).padStart(2, '0')}</span>
              <strong>{text(m.title)}</strong>
              <progress value={count} max={all.length} aria-label={text(m.title)} />
              <span>
                {count}/{all.length}
              </span>
              {count === all.length ? <Check size={16} /> : <ArrowUpRight size={16} />}
            </Link>
          )
        })}
      </section>
      <section className="recent-lessons">
        <h2>{c('Yang sudah kamu pelajari', 'What you have learned')}</h2>
        {done.length ? (
          <div className="completed-links">
            {done.map(l => (
              <Link key={l.id} to={`/learn/${l.id}`}>
                <Check size={15} />
                {text(l.title)}
                <ArrowUpRight size={14} />
              </Link>
            ))}
          </div>
        ) : (
          <FeedbackState
            icon={BookOpen}
            eyebrow={c('LANGKAH PERTAMA', 'YOUR FIRST STEP')}
            title={c('Perjalananmu dimulai di sini.', 'Your journey starts here.')}
            description={c(
              'Pelajaran pertama hanya butuh beberapa menit dan tidak memerlukan coding.',
              'The first lesson takes just a few minutes and needs no coding.',
            )}
            action={
              <Link className="button primary" to="/learn/gsap-foundations">
                {c('Kenalan dengan GSAP', 'Meet GSAP')}
                <ArrowRight size={14} />
              </Link>
            }
          />
        )}
      </section>
      <p className="privacy-note">
        <ShieldCheck size={17} />
        {storageAvailable
          ? c(
              'Progres tersimpan di browser ini, tanpa akun atau pengiriman kode ke server. Perangkat lain memiliki progres terpisah.',
              'Progress is saved in this browser, without an account or sending code to a server. Other devices have their own progress.',
            )
          : c(
              'Penyimpanan browser tidak tersedia. Progres ini hanya berlaku selama sesi berjalan.',
              'Browser storage is unavailable. This progress only lasts for the current session.',
            )}
      </p>
    </div>
  )
}
