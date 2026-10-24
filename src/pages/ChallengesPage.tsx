import { useEffect } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FlaskConical,
  RotateCcw,
  Search,
  Target,
} from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { challengeNumber, modules, nextChallenge, practiceLessons } from '../data/curriculum'
import FeedbackState from '../components/FeedbackState'
import SelectField from '../components/SelectField'

type Status = 'all' | 'todo' | 'done'
const pad = (value: number) => String(value).padStart(2, '0')

export default function ChallengesPage() {
  const { c, text, challenges } = useApp()
  // Filters live in the URL so returning from a challenge restores the same view.
  const [params, setParams] = useSearchParams()
  const statusParam = params.get('status')
  const status: Status = statusParam === 'todo' || statusParam === 'done' ? statusParam : 'all'
  const moduleFilter = params.get('module') ?? 'all'
  const query = params.get('q') ?? ''
  const setFilter = (key: string, value: string, fallback: string) =>
    setParams(
      () => {
        // Read the live URL: the hook's params can lag behind a navigation still in a transition.
        const next = new URLSearchParams(window.location.search)
        if (value === fallback) next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true },
    )
  useEffect(() => {
    document.title = `${c('Tantangan', 'Challenges')} - RanMotion`
  }, [c])

  const isDone = (id: string) => challenges.includes(id)
  const doneCount = practiceLessons.filter(l => isDone(l.id)).length
  const next = nextChallenge(challenges)
  const needle = query.trim().toLowerCase()
  const visible = practiceLessons.filter(
    l =>
      (status === 'all' || isDone(l.id) === (status === 'done')) &&
      (moduleFilter === 'all' || String(l.module) === moduleFilter) &&
      (!needle ||
        [text(l.challenge.title), text(l.challenge.task), text(l.title), l.concept]
          .join(' ')
          .toLowerCase()
          .includes(needle)),
  )
  const groups = modules
    .map(m => ({
      module: m,
      all: practiceLessons.filter(l => l.module === m.number),
      items: visible.filter(l => l.module === m.number),
    }))
    .filter(group => group.items.length > 0)
  const moduleOptions = [
    { value: 'all', label: c('Semua modul', 'All modules') },
    ...modules
      .filter(m => practiceLessons.some(l => l.module === m.number))
      .map(m => ({ value: String(m.number), label: `${pad(m.number + 1)} · ${text(m.title)}` })),
  ]
  const filtered = status !== 'all' || moduleFilter !== 'all' || needle !== ''

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
            'Setiap tantangan meminta satu perubahan yang bermakna. Jalankan kode, amati animasinya, lalu gunakan petunjuk saat kamu membutuhkannya. Tantangan punya progres sendiri, terpisah dari progres pelajaran.',
            'Each challenge asks for one meaningful change. Run the code, inspect the movement, and use a hint whenever you need one. Challenges keep their own progress, separate from your lessons.',
          )}
        </p>
      </header>

      <section
        className="challenge-spotlight"
        aria-label={c('Progres dan tantangan berikutnya', 'Progress and next challenge')}
      >
        <div className="challenge-spotlight__progress">
          <Target size={20} />
          <p>
            <strong>
              {doneCount} / {practiceLessons.length}
            </strong>{' '}
            {c('tantangan dituntaskan', 'challenges completed')}
          </p>
          <progress
            value={doneCount}
            max={practiceLessons.length}
            aria-label={c('Progres tantangan', 'Challenge progress')}
          />
        </div>
        {next ? (
          <Link className="challenge-spotlight__next" to={`/challenges/${next.id}`}>
            <span className="eyebrow">
              {doneCount
                ? c('LANJUTKAN DARI SINI', 'PICK UP FROM HERE')
                : c('MULAI DARI SINI', 'START HERE')}{' '}
              · {c('TANTANGAN', 'CHALLENGE')} {pad(challengeNumber(next.id))}
            </span>
            <strong>{text(next.challenge.title)}</strong>
            <span className="challenge-spotlight__task">{text(next.challenge.task)}</span>
            <span className="challenge-spotlight__cta">
              {doneCount
                ? c('Lanjutkan tantangan', 'Continue challenges')
                : c('Mulai tantangan pertama', 'Start the first challenge')}
              <ArrowRight size={15} />
            </span>
          </Link>
        ) : (
          <Link className="challenge-spotlight__next" to="/playground">
            <span className="eyebrow">{c('SEMUA TUNTAS', 'ALL DONE')}</span>
            <strong>
              {c('Semua tantangan sudah kamu tuntaskan', 'You completed every challenge')}
            </strong>
            <span className="challenge-spotlight__task">
              {c(
                'Gabungkan idenya di ruang eksperimen dan buat animasimu sendiri.',
                'Combine the ideas in the playground and make an animation of your own.',
              )}
            </span>
            <span className="challenge-spotlight__cta">
              {c('Buka ruang eksperimen', 'Open the playground')}
              <FlaskConical size={15} />
            </span>
          </Link>
        )}
      </section>
      <p className="challenge-start-note">
        {c('Baru mengenal GSAP? ', 'New to GSAP? ')}
        <Link to="/learn/gsap-foundations" className="text-link">
          {c('Mulai dari studi visual tanpa coding', 'Start with a visual study, no coding needed')}
          <ArrowUpRight size={14} />
        </Link>
      </p>

      <div className="challenge-board-head">
        <h2 className="challenge-board-title">{c('PILIH TANTANGAN', 'CHOOSE A CHALLENGE')}</h2>
        <div className="challenge-controls">
          <label className="inline-search challenge-search">
            <Search size={15} />
            <input
              type="search"
              value={query}
              onChange={event => setFilter('q', event.target.value, '')}
              aria-label={c('Cari tantangan', 'Search challenges')}
              placeholder={c('Cari judul atau konsep…', 'Find a title or concept…')}
            />
          </label>
          <SelectField
            label={c('Filter modul', 'Filter module')}
            value={moduleFilter}
            onValueChange={value => setFilter('module', value, 'all')}
            options={moduleOptions}
            className="challenge-module-select"
          />
          <div
            className="filter-tabs challenge-filters"
            role="group"
            aria-label={c('Filter status tantangan', 'Filter challenge status')}
          >
            {(
              [
                ['all', c('Semua', 'All')],
                ['todo', c('Belum dicoba', 'To try')],
                ['done', c('Tuntas', 'Completed')],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter('status', id, 'all')}
                aria-pressed={status === id}
                className={status === id ? 'active' : ''}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="challenge-result-count" role="status">
        {visible.length} {c('tantangan ditampilkan', 'challenges shown')}
        {filtered && (
          <button
            type="button"
            className="text-link"
            onClick={() => setParams({}, { replace: true })}
          >
            <RotateCcw size={12} />
            {c('Atur ulang filter', 'Reset filters')}
          </button>
        )}
      </p>

      {groups.map(({ module: m, all, items }) => {
        const moduleDone = all.filter(l => isDone(l.id)).length
        return (
          <section
            className="challenge-group"
            key={m.number}
            aria-labelledby={`challenge-group-${m.number}`}
          >
            <header className="challenge-group-head">
              <span className="challenge-group-number">
                {c('MODUL', 'MODULE')} {pad(m.number + 1)}
              </span>
              <h2 id={`challenge-group-${m.number}`}>{text(m.title)}</h2>
              <span className="challenge-group-count">
                {moduleDone}/{all.length} {c('tuntas', 'done')}
              </span>
              <progress
                value={moduleDone}
                max={all.length}
                aria-label={`${text(m.title)} ${moduleDone}/${all.length}`}
              />
            </header>
            <ol className="challenge-queue">
              {items.map(l => {
                const done = isDone(l.id)
                return (
                  <li key={l.id}>
                    <Link
                      className={`challenge-card ${done ? 'is-done' : ''}`}
                      to={`/challenges/${l.id}`}
                    >
                      <div className="challenge-card-meta">
                        <span className="challenge-index">{pad(challengeNumber(l.id))}</span>
                        <span className={`challenge-status ${done ? 'is-done' : ''}`}>
                          {done ? <Check size={12} /> : null}
                          {done ? c('Tuntas', 'Completed') : c('Belum dicoba', 'Not tried yet')}
                        </span>
                      </div>
                      <div className="challenge-detail">
                        <h3>{text(l.challenge.title)}</h3>
                        <p>{text(l.challenge.task)}</p>
                        <span className="challenge-lesson-ref">
                          {c('Konsep dari pelajaran: ', 'Concept from the lesson: ')}
                          {text(l.title)}
                        </span>
                      </div>
                      <div className="challenge-card-footer">
                        <code>{l.concept}</code>
                        <span>
                          {done
                            ? c('Ulangi tantangan', 'Try it again')
                            : c('Buka tantangan', 'Open challenge')}
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      {!visible.length && (
        <FeedbackState
          icon={Target}
          eyebrow={c('PAPAN TANTANGAN', 'CHALLENGE BOARD')}
          title={c('Belum ada tantangan yang cocok', 'No challenges match yet')}
          description={c(
            'Coba kata yang lebih pendek, pilih semua modul, atau tampilkan semua status.',
            'Try a shorter word, choose all modules, or show every status.',
          )}
          action={
            <button className="button secondary" onClick={() => setParams({}, { replace: true })}>
              {c('Atur ulang filter', 'Reset filters')}
            </button>
          }
        />
      )}
    </div>
  )
}
