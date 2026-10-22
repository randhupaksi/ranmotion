import { useEffect, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { lessons } from '../data/curriculum'
export default function ReferencePage() {
  const { c, text } = useApp()
  const [query, setQuery] = useState('')
  useEffect(() => {
    document.title = `${c('Referensi singkat', 'Quick reference')} — RanMotion`
  }, [c])
  return (
    <div className="page-width standard-page reference-page">
      <header className="page-header">
        <p className="eyebrow">{c('SAAT KAMU BUTUH PENGINGAT', 'WHEN YOU NEED A REMINDER')}</p>
        <h1>
          {c('Ide penting,', 'Key ideas,')}
          <br />
          <em>{c('dalam satu tempat.', 'in one place.')}</em>
        </h1>
        <p className="page-lead">
          {c(
            'Pengingat ringkas untuk konsep yang sudah kamu coba. Buka pelajarannya untuk penjelasan dan eksperimen lengkap.',
            'A quick reminder of the concepts you have tried. Open a lesson for the full explanation and experiment.',
          )}
        </p>
      </header>
      <label className="inline-search reference-search">
        <Search size={16} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={c('Cari API atau konsep…', 'Search APIs or concepts…')}
          aria-label={c('Cari referensi', 'Search reference')}
        />
      </label>
      <div className="reference-list">
        {lessons
          .filter(l => `${l.concept} ${text(l.title)}`.toLowerCase().includes(query.toLowerCase()))
          .map(l => (
            <section key={l.id}>
              <code>{l.concept}</code>
              <div>
                <h2>{text(l.title)}</h2>
                <p>{text(l.model)}</p>
                <Link className="text-link" to={`/learn/${l.id}`}>
                  {c('Coba dalam pelajaran', 'Try in a lesson')}
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </section>
          ))}
      </div>
      {!lessons.some(l =>
        `${l.concept} ${text(l.title)}`.toLowerCase().includes(query.toLowerCase()),
      ) && (
        <div className="empty-state">
          {c(
            'Tidak ada konsep yang cocok. Coba kata lain.',
            'No matching concepts. Try another term.',
          )}
        </div>
      )}
      <div className="quiet-banner">
        <p>{c('Perlu detail API lebih jauh?', 'Need more API detail?')}</p>
        <a href="https://gsap.com/docs/v3/" target="_blank" rel="noreferrer" className="text-link">
          {c('Dokumentasi resmi GSAP', 'Official GSAP documentation')}
          <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  )
}
