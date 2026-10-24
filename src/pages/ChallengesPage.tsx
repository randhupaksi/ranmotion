import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { practiceLessons, modules } from '../data/curriculum'
import FeedbackState from '../components/FeedbackState'
export default function ChallengesPage() {
  const { c, text, challenges } = useApp()
  const [filter, setFilter] = useState('all')
  useEffect(() => {
    document.title = `${c('Tantangan', 'Challenges')} - RanMotion`
  }, [c])
  const visible = practiceLessons.filter(
    l =>
      filter === 'all' ||
      (filter === 'done' ? challenges.includes(l.id) : !challenges.includes(l.id)),
  )
  return (
    <div className="page-width standard-page challenges-page">
      <header className="page-header">
        <p className="eyebrow">{c('BELAJAR DENGAN MEMBUAT', 'LEARN BY MAKING')}</p>
        <h1>
          {c('Uji idenya', 'Test the idea')}
          <br />
          <em>{c('Lihat animasinya', 'See what moves')}</em>
        </h1>
        <p className="page-lead">
          {c(
            'Setiap tantangan meminta satu perubahan yang bermakna. Jalankan kode, amati animasinya, lalu gunakan petunjuk saat kamu membutuhkannya.',
            'Each challenge asks for one meaningful change. Run the code, inspect the movement, and use a hint whenever you need one.',
          )}
        </p>
      </header>
      <div className="challenge-overview">
        <Target size={20} />
        <p>
          <strong>
            {challenges.filter(id => practiceLessons.some(l => l.id === id)).length} /{' '}
            {practiceLessons.length}
          </strong>{' '}
          {c('tantangan dituntaskan', 'challenges completed')}
        </p>
        <progress
          value={challenges.filter(id => practiceLessons.some(l => l.id === id)).length}
          max={practiceLessons.length}
          aria-label={c('Progres tantangan', 'Challenge progress')}
        />
        <Link to="/learn" className="text-link">
          {c('Lihat jalur konsep', 'Explore the learning path')}
          <ArrowUpRight size={14} />
        </Link>
      </div>
      <p className="challenge-start-note">
        {c('Baru mengenal GSAP? ', 'New to GSAP? ')}
        <Link to="/learn/gsap-foundations" className="text-link">
          {c('Mulai dari studi visual tanpa coding', 'Start with a visual study, no coding needed')}
          <ArrowUpRight size={14} />
        </Link>
      </p>
      <div className="challenge-board-head">
        <span>{c('PILIH EKSPERIMEN', 'CHOOSE AN EXPERIMENT')}</span>
        <div className="filter-tabs challenge-filters">
          {[
            ['all', c('Semua', 'All')],
            ['todo', c('Belum dicoba', 'To try')],
            ['done', c('Tuntas', 'Completed')],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={filter === id ? 'active' : ''}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <ol className="challenge-queue">
        {visible.map((l, index) => (
          <li key={l.id}>
            <Link
              className={`challenge-card ${challenges.includes(l.id) ? 'is-done' : ''}`}
              to={`/learn/${l.id}#challenge`}
            >
              <div className="challenge-card-meta">
                <span className="challenge-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="eyebrow">
                  {String(l.module + 1).padStart(2, '0')} / {text(modules[l.module].title)}
                </span>
                {challenges.includes(l.id) ? <Check size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="challenge-detail">
                <h2>{text(l.challenge.title)}</h2>
                <p>{text(l.challenge.task)}</p>
              </div>
              <div className="challenge-card-footer">
                <code>{l.concept}</code>
                <span>
                  {challenges.includes(l.id)
                    ? c('Sudah tuntas', 'Completed')
                    : c('Buka eksperimen', 'Open experiment')}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      {!visible.length && (
        <FeedbackState
          icon={Target}
          eyebrow={c('PAPAN TANTANGAN', 'CHALLENGE BOARD')}
          title={c('Belum ada tantangan di sini', 'No challenges here yet')}
          description={c(
            'Coba tampilkan semua tantangan untuk menemukan eksperimen berikutnya.',
            'Show all challenges to find your next experiment.',
          )}
          action={
            <button className="button secondary" onClick={() => setFilter('all')}>
              {c('Lihat semua tantangan', 'See all challenges')}
            </button>
          }
        />
      )}
    </div>
  )
}
