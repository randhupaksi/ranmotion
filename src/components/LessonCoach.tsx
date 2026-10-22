import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { getLesson } from '../data/curriculum'
import { glossary } from '../data/learningActivities'
import type { Copy, Lesson } from '../data/types'
import './lessonCoach.css'

export default function LessonCoach({ lesson }: { lesson: Lesson }) {
  const { c, text } = useApp()
  const uid = useId()
  const [tab, setTab] = useState('predict')
  const [choice, setChoice] = useState<number | null>(null)
  const [line, setLine] = useState(0)
  const activity = lesson.activity
  if (!activity) return null
  const tabs = [
    { id: 'predict', label: c('Prediksi dahulu', 'Predict first') },
    { id: 'code', label: c('Baca kodenya', 'Read the code') },
    { id: 'terms', label: c('Kamus mini', 'Mini glossary') },
  ]
  const moveTab = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex(item => item.id === tab)
    const next = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : null
    if (next !== null) { event.preventDefault(); setTab(tabs[next].id); document.getElementById(`${uid}-${tabs[next].id}`)?.focus() }
  }
  const selected = activity.walkthrough[line]
  return <section className="lesson-coach" aria-label={c('Teman belajar', 'Learning companion')}>
    <div className="coach-header"><div><span className="eyebrow"><Sparkles size={13}/>{c('PAHAMI SATU HAL DAHULU', 'ONE IDEA AT A TIME')}</span><h2>{c('Pelan-pelan, sampai masuk akal.', 'Take your time until it clicks.')}</h2></div><span className="coach-level">{lesson.module <= 2 ? c('DASAR', 'FOUNDATIONS') : lesson.module <= 5 ? c('PRAKTIK', 'PRACTICE') : lesson.module <= 7 ? c('EKSPLORASI', 'EXPLORATION') : c('PROYEK', 'PROJECT')}</span></div>
    {activity.prerequisites.length > 0 && <nav className="coach-prerequisites" aria-label={c('Konsep pendukung', 'Supporting concepts')}><span>{c('Butuh pengingat?', 'Need a reminder?')}</span>{activity.prerequisites.map(id => { const prerequisite = getLesson(id); return prerequisite ? <Link key={id} to={`/learn/${id}`}><BookOpen size={11}/>{text(prerequisite.title)}</Link> : null })}</nav>}
    <div className="coach-tabs" role="tablist" aria-label={c('Cara memahami materi', 'Ways to understand the lesson')} onKeyDown={moveTab}>{tabs.map(item => <button type="button" role="tab" id={`${uid}-${item.id}`} key={item.id} aria-selected={tab === item.id} aria-controls={`${uid}-panel-${item.id}`} tabIndex={tab === item.id ? 0 : -1} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
    <div className="coach-panel" role="tabpanel" id={`${uid}-panel-predict`} aria-labelledby={`${uid}-predict`} hidden={tab !== 'predict'}>
      <p className="coach-intro">{c('Tebak dahulu, lalu bandingkan dengan animasinya. Jawaban ini tidak memengaruhi progresmu.', 'Make a prediction, then compare it with the animation. This answer does not affect your progress.')}</p>
      <fieldset className="prediction-options"><legend>{text(activity.question)}</legend>{activity.choices.map((option, index) => <label key={index} className={choice === index ? 'is-chosen' : ''}><input type="radio" name={`${uid}-prediction`} checked={choice === index} onChange={() => setChoice(index)}/><span className="prediction-letter">{String.fromCharCode(65 + index)}</span><span>{text(option)}</span></label>)}</fieldset>
      {choice !== null && <div className={`prediction-feedback ${choice === activity.answer ? 'is-correct' : ''}`} role="status"><strong>{choice === activity.answer ? c('Ya, kamu menangkap idenya.', 'Yes, you have the idea.') : c('Coba lihat dari sisi ini.', 'Try looking at it this way.')}</strong><p>{text(activity.explanation)}</p><button type="button" className="text-button" onClick={() => setChoice(null)}><RotateCcw size={12}/>{c('Ulangi prediksi', 'Try the prediction again')}</button></div>}
    </div>
    <div className="coach-panel" role="tabpanel" id={`${uid}-panel-code`} aria-labelledby={`${uid}-code`} hidden={tab !== 'code'}>
      <p className="coach-intro">{c('Baca contoh awal satu bagian setiap kali. Pilih baris penting untuk melihat artinya.', 'Read the starting example one part at a time. Choose a key line to see what it means.')}</p>
      <div className="walkthrough-picks">{activity.walkthrough.map((part, index) => <button type="button" key={part.match} aria-pressed={line === index} onClick={() => setLine(index)}><span>{String(index + 1).padStart(2, '0')}</span><code>{part.match}</code></button>)}</div>
      <pre className="coach-code" aria-label={c('Contoh kode dengan baris pilihan', 'Example code with selected lines')}><code>{lesson.code.split('\n').map((source, index) => <span key={index} className={`coach-code-line ${source.includes(selected.match) ? 'is-highlighted' : ''}`}><i aria-hidden="true">{index + 1}</i><span>{source || ' '}</span></span>)}</code></pre>
      <div className="walkthrough-note" aria-live="polite"><span className="eyebrow">{String(line + 1).padStart(2, '0')} / {activity.walkthrough.length}</span><p>{text(selected.explanation)}</p><div><button type="button" className="icon-button" aria-label={c('Bagian kode sebelumnya', 'Previous code explanation')} disabled={line === 0} onClick={() => setLine(n => n - 1)}><ArrowLeft size={14}/></button><button type="button" className="icon-button" aria-label={c('Bagian kode berikutnya', 'Next code explanation')} disabled={line === activity.walkthrough.length - 1} onClick={() => setLine(n => n + 1)}><ArrowRight size={14}/></button></div></div>
    </div>
    <div className="coach-panel" role="tabpanel" id={`${uid}-panel-terms`} aria-labelledby={`${uid}-terms`} hidden={tab !== 'terms'}><p className="coach-intro">{c('Istilah boleh terasa baru. Buka yang kamu butuhkan dan kembali ke contoh kapan saja.', 'New terms are welcome here. Open what you need and return to the example whenever you like.')}</p><div className="mini-glossary">{glossary[lesson.module].map(item => <details key={item.term}><summary><code>{item.term}</code><span aria-hidden="true">+</span></summary><p>{text(item.definition)}</p></details>)}</div></div>
  </section>
}

export function GuidedSteps({ steps }: { steps: Copy[] }) {
  const { c, text } = useApp()
  const [checked, setChecked] = useState<number[]>([])
  return <><div className="guided-step-status"><span>{checked.length}/{steps.length} {c('langkah dicoba', 'steps tried')}</span><progress value={checked.length} max={steps.length} aria-label={c('Langkah eksperimen dicoba', 'Experiment steps tried')}/><button type="button" className="text-button muted" disabled={!checked.length} onClick={() => setChecked([])}>{c('Ulangi', 'Reset')}</button></div><ol className="guided-steps">{steps.map((step, index) => <li key={index} className={checked.includes(index) ? 'is-tried' : ''}><label><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked(items => items.includes(index) ? items.filter(item => item !== index) : [...items, index])}/><span className="guided-check" aria-hidden="true">{checked.includes(index) ? <Check size={13}/> : String(index + 1).padStart(2, '0')}</span><span>{text(step)}</span></label></li>)}</ol><p className="quiet-note">{c('Centang langkah setelah mencobanya di editor. Kamu bebas mengulang; pelajaran ditandai selesai lewat tombol di akhir.', 'Check a step after trying it in the editor. Repeat freely; use the button at the end to mark the lesson complete.')}</p></>
}
