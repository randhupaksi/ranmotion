import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Clock3, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { lessons, modules, getModuleLessons, nextRecommended, totalMinutes } from '../data/curriculum'
export default function LearnPage() {
  const { c, text, completed, lastLesson } = useApp()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const { hash } = useLocation()
  const next = nextRecommended(completed)
  const done = lessons.filter(l => completed.includes(l.id)).length
  useEffect(() => { document.title = `${c('Jalur belajar', 'Learning path')} — RanMotion` }, [c])
  return <div className="page-width learning-page"><header className="page-header split-heading"><div><p className="eyebrow">{c('JALUR BELAJAR GSAP', 'THE GSAP LEARNING PATH')}</p><h1>{c('Dari diam,', 'From stillness,')}<br/><em>{c('jadi bermakna.', 'to something meaningful.')}</em></h1><p className="page-lead">{c('Bangun pemahaman satu gerakan setiap kali. Semua pelajaran terbuka, dan kamu bebas memilih ritmemu.', 'Build understanding one movement at a time. Every lesson is open, and you choose the pace.')}</p></div><div className="path-progress"><span className="eyebrow">{c('PERJALANANMU', 'YOUR JOURNEY')}</span><strong>{done}<span> / {lessons.length}</span></strong><progress value={done} max={lessons.length} aria-label={c('Pelajaran selesai', 'Lessons completed')}/><p>{c('pelajaran selesai', 'lessons completed')}</p><Link className="text-link" to={`/learn/${next.id}`}>{done === lessons.length ? c('Ulangi dari awal', 'Revisit the basics') : lastLesson ? c('Lanjutkan perjalanan', 'Keep moving forward') : c('Mulai pelajaran pertama', 'Start your first lesson')}<ArrowRight size={14}/></Link></div></header>
    <div className="path-meta"><span><Clock3 size={15}/>{Math.round(totalMinutes / 60 * 10) / 10} {c('jam praktik terarah', 'hours of guided practice')}</span><span>{modules.length} {c('bagian', 'sections')}</span><span>{c('Pemula → mini proyek', 'Beginner → mini project')}</span></div>
    <details className="prereq-disclosure"><summary>{c('Apa yang perlu aku pahami sebelumnya?', 'What should I know before starting?')}<ChevronDown size={15}/></summary><p>{c('Kenali elemen HTML, selector class CSS (.box), dan dasar JavaScript seperti const, objek, dan fungsi. Pelajaran awal memberi pengingat singkat. RanMotion berfokus pada animasi, jadi kamu tidak perlu menguasai semua JavaScript untuk memulai.', 'Know HTML elements, CSS class selectors (.box), and JavaScript basics such as const, objects, and functions. The first lessons provide reminders. RanMotion focuses on animation; you do not need to master all of JavaScript to begin.')}</p></details>
    <div className="curriculum-toolbar"><div className="filter-tabs" aria-label={c('Filter status pelajaran', 'Filter lesson status')}>{[['all', c('Semua', 'All')], ['incomplete', c('Belum selesai', 'To learn')], ['completed', c('Selesai', 'Completed')]].map(([value,label]) => <button key={value} className={filter === value ? 'active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="inline-search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} aria-label={c('Cari dalam jalur belajar', 'Search the learning path')} placeholder={c('Cari materi…', 'Find a lesson…')}/></label></div>
    <div className="curriculum">{modules.map(m => {
      const all = getModuleLessons(m.number)
      const filtered = all.filter(l => (filter === 'all' || completed.includes(l.id) === (filter === 'completed')) && `${text(l.title)} ${l.concept}`.toLowerCase().includes(query.toLowerCase()))
      if (!filtered.length) return null
      const count = all.filter(l => completed.includes(l.id)).length
      return <details className="curriculum-module" key={`${m.number}-${filter}-${query ? 'search' : 'normal'}`} id={`module-${m.number}`} open={Boolean(query) || filter !== 'all' || m.number === next.module || hash === `#module-${m.number}`}>
        <summary><span className="module-number">{String(m.number + 1).padStart(2, '0')}</span><div className="module-title"><h2>{text(m.title)}</h2><p>{text(m.description)}</p></div><div className="module-meta"><span>{count}/{all.length} {c('selesai', 'complete')}</span><progress value={count} max={all.length} aria-label={`${text(m.title)} ${count}/${all.length}`}/></div><ChevronDown size={17}/></summary>
        <ol className="lesson-list">{filtered.map(l => <li key={l.id}><Link to={`/learn/${l.id}`}><span className={`lesson-status ${completed.includes(l.id) ? 'done' : ''}`}>{completed.includes(l.id) ? <Check size={13}/> : <span/>}</span><div><strong>{text(l.title)}</strong><small>{l.concept}</small></div><span className="lesson-time">{l.minutes} {c('menit', 'min')}</span><ArrowUpRight size={15}/></Link></li>)}</ol>
      </details>
    })}{!lessons.some(l => (filter === 'all' || completed.includes(l.id) === (filter === 'completed')) && `${text(l.title)} ${l.concept}`.toLowerCase().includes(query.toLowerCase())) && <div className="empty-state"><h2>{c('Belum ada pelajaran di sini.', 'No lessons here yet.')}</h2><p>{filter === 'completed' ? c('Selesaikan pelajaran pertamamu, lalu lihat progresnya di sini.', 'Complete your first lesson to see it here.') : c('Coba ubah filter atau kata pencarian.', 'Try another filter or search term.')}</p><button className="button secondary" onClick={() => { setFilter('all'); setQuery('') }}>{c('Tampilkan semua', 'Show all lessons')}</button></div>}</div>
    <div className="quiet-banner"><span>{c('Sudah punya ide yang ingin dicoba?', 'Already have an idea to try?')}</span><Link to="/playground" className="text-link">{c('Langsung ke playground', 'Open the playground')}<ArrowRight size={15}/></Link></div>
  </div>
}
