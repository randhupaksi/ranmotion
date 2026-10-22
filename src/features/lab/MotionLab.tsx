import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import {
  Check,
  CheckCircle2,
  Copy,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Square,
  Terminal,
} from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import type { Lesson } from '../../data/types'
import { readConstant, replaceConstant } from '../../data/examples'
import PreviewFrame from './PreviewFrame'
import type { PreviewControls } from './PreviewFrame'
import { checkChallenge } from './model'
import type { LabReport } from './model'
import { sceneCSS, sceneMarkup } from './scene'
import './lab.css'
const CodeEditor = lazy(() => import('./CodeEditor'))

async function validate(code: string, english: boolean): Promise<string | null> {
  const message = (id: string, en: string) => (english ? en : id)
  if (!code.trim())
    return message(
      'Editor masih kosong. Tulis tween atau gunakan Reset.',
      'The editor is empty. Write a tween or use Reset.',
    )
  if (code.length > 12000)
    return message(
      'Contoh terlalu panjang. Batasi eksperimen hingga 12.000 karakter.',
      'This example is too long. Keep experiments below 12,000 characters.',
    )
  const { javascriptLanguage } = await import('@codemirror/lang-javascript')
  let error: string | null = null
  javascriptLanguage.parser.parse(code).iterate({
    enter(node) {
      if (node.type.isError && !error) {
        const line = code.slice(0, node.from).split('\n').length
        error = message(
          `Periksa sintaks di sekitar baris ${line}. Pastikan kurung, koma, dan tanda kutip berpasangan.`,
          `Check syntax near line ${line}. Make sure braces, commas, and quotes are balanced.`,
        )
      }
      if (
        /^(ForStatement|WhileStatement|DoStatement|ImportDeclaration|ExportDeclaration)$/.test(
          node.name,
        )
      )
        error = message(
          'Latihan ini tidak mendukung loop atau import. GSAP, ScrollTrigger, dan MotionPathPlugin sudah tersedia; gunakan tween, timeline, atau event.',
          'Loops and imports are not supported in this exercise. GSAP, ScrollTrigger, and MotionPathPlugin are already available; use tweens, timelines, or events.',
        )
    },
  })
  return error
}
function readDraft(key: string, initial: string) {
  try {
    const value = localStorage.getItem(key)
    if (!value) return initial
    const parsed: unknown = JSON.parse(value)
    return typeof parsed === 'string' && parsed.length <= 12000 ? parsed : initial
  } catch {
    return initial
  }
}

export default function MotionLab({
  lesson,
  challenge = true,
  namespace = 'lesson',
}: {
  lesson: Lesson
  challenge?: boolean
  namespace?: string
}) {
  const { c, text, locale, reducedMotion, completeLesson, challenges } = useApp()
  const draftKey = `ranmotion.draft.${lesson.id}.v1`
  const comparisonKey = `${draftKey}.before-variation`
  const [code, setCode] = useState(() => readDraft(draftKey, lesson.code))
  const [comparisonCode, setComparisonCode] = useState<string | null>(
    () => readDraft(comparisonKey, '') || null,
  )
  const [tab, setTab] = useState('js')
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [runId, setRunId] = useState(0)
  const generation = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<LabReport | null>(null)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(true)
  const [loading, setLoading] = useState(false)
  const [draftSaved, setDraftSaved] = useState(true)
  const [copyStatus, setCopyStatus] = useState('')
  const [hints, setHints] = useState(0)
  const [feedback, setFeedback] = useState<'pass' | 'retry' | 'run' | null>(null)
  const preview = useRef<PreviewControls>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const clearRunTimeout = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify(code))
        setDraftSaved(true)
      } catch {
        setDraftSaved(false)
      }
    }, 350)
    return () => {
      clearTimeout(timer)
      try {
        localStorage.setItem(draftKey, JSON.stringify(code))
      } catch {
        /* Keep the in-memory draft when storage is unavailable. */
      }
    }
  }, [code, draftKey])
  useEffect(() => () => clearRunTimeout(), [clearRunTimeout])
  useEffect(() => {
    if (challenge && location.hash === '#challenge') {
      const id = requestAnimationFrame(() => document.getElementById('challenge')?.scrollIntoView())
      return () => cancelAnimationFrame(id)
    }
  }, [challenge])
  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => setCopyStatus(''), 2000)
      return () => clearTimeout(timer)
    }
  }, [copyStatus])
  const changeCode = (next: string) => {
    setCode(next)
    setFeedback(null)
  }
  const loadPreset = (next: string) => {
    if (code !== lesson.code && code !== lesson.activity?.variation.code) {
      setComparisonCode(code)
      try {
        localStorage.setItem(comparisonKey, JSON.stringify(code))
      } catch {
        /* The in-memory backup remains available. */
      }
    }
    changeCode(next)
  }
  const restoreComparison = () => {
    if (!comparisonCode) return
    changeCode(comparisonCode)
    setComparisonCode(null)
    try {
      localStorage.removeItem(comparisonKey)
    } catch {
      /* Restoring the in-memory backup still works. */
    }
  }
  const run = async () => {
    clearRunTimeout()
    const currentGeneration = ++generation.current
    setLoading(true)
    setReport(null)
    setError(null)
    setPaused(true)
    let problem: string | null
    try {
      problem = await validate(code, locale === 'en')
    } catch {
      problem = c(
        'Pemeriksaan kode belum tersedia. Muat ulang halaman untuk mencoba lagi.',
        'Code validation is unavailable. Reload this page to try again.',
      )
    }
    if (currentGeneration !== generation.current) return
    setFeedback(null)
    if (problem) {
      preview.current?.send('pause')
      setPaused(true)
      setError(problem)
      setLoading(false)
      return
    }
    setError(null)
    setReport(null)
    setProgress(0)
    setLoading(true)
    setPaused(reducedMotion)
    setSubmitted(code)
    setRunId(currentGeneration)
    timeout.current = setTimeout(() => {
      setLoading(false)
      setError(
        c(
          'Preview belum merespons. Coba Reset, lalu jalankan contoh yang lebih sederhana.',
          'The preview has not responded. Try Reset, then run a simpler example.',
        ),
      )
    }, 6500)
  }
  const activatePreview = () => {
    if (loading) return
    if (submitted !== code || !report || error) {
      void run()
      return
    }
    const resume = paused
    const restart = resume && progress >= 0.999
    preview.current?.send(restart ? 'replay' : resume ? 'resume' : 'pause')
    setPaused(!resume)
    if (restart) setProgress(0)
  }
  const reset = () => {
    clearRunTimeout()
    setCode(lesson.code)
    setSubmitted(null)
    setRunId(++generation.current)
    setReport(null)
    setError(null)
    setProgress(0)
    setPaused(true)
    setLoading(false)
    setFeedback(null)
    setHints(0)
  }
  const receiveReport = (next: LabReport) => {
    clearRunTimeout()
    setLoading(false)
    if (!next.animations.length) {
      setError(
        c(
          'Belum ada tween yang dibuat. Coba gsap.to() dengan target dari tab HTML.',
          'No tweens were created. Try gsap.to() with a target from the HTML tab.',
        ),
      )
      return
    }
    if (next.animations.every(a => a.targets === 0)) {
      setError(
        c(
          'Target animasi tidak ditemukan. Cocokkan selector dengan class di tab HTML.',
          'No animation targets were found. Match your selector to a class in the HTML tab.',
        ),
      )
      return
    }
    setReport(next)
  }
  const receiveError = (message: string) => {
    clearRunTimeout()
    setLoading(false)
    setError(message)
    setReport(null)
    setPaused(true)
  }
  const check = () => {
    if (!report || submitted !== code || error) {
      setFeedback('run')
      return
    }
    if (checkChallenge(lesson.challenge.rule, report)) {
      setFeedback('pass')
      completeLesson(lesson.id, true)
    } else setFeedback('retry')
  }
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(
        tab === 'js'
          ? code
          : tab === 'html'
            ? sceneMarkup(lesson.scene, locale, lesson.id === 'easing')
            : sceneCSS,
      )
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }
  const scrollScene = lesson.scene === 'scroll' || lesson.scene === 'project'
  const duration = readConstant(code, 'duration')
  const distance = readConstant(code, 'distance')
  const ease = readConstant(code, 'ease')
  const controlEnabled = Boolean(report && !error && !loading)
  const tracks = report?.animations.filter(a => a.duration > 0).slice(0, 6) ?? []
  const maxTime = Math.max(0.01, report?.duration ?? 1)
  const supportedEases = [
    'none',
    'power1.in',
    'power2.in',
    'power2.out',
    'power2.inOut',
    'back.out(1.7)',
    'bounce.out',
    'elastic.out(1, 0.3)',
  ]
  const handleTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const order = ['js', 'html', 'css']
    const index = order.indexOf(tab)
    const next =
      event.key === 'ArrowRight'
        ? order[(index + 1) % 3]
        : event.key === 'ArrowLeft'
          ? order[(index + 2) % 3]
          : event.key === 'Home'
            ? 'js'
            : event.key === 'End'
              ? 'css'
              : null
    if (next) {
      event.preventDefault()
      setTab(next)
      document.getElementById(`tab-${namespace}-${next}`)?.focus()
    }
  }
  return (
    <>
      <div className="motion-lab" id="experiment">
        <div className="lab-heading">
          <span>
            <Terminal size={15} />
            {c('RUANG EKSPERIMEN', 'YOUR MOTION LAB')}
          </span>
          <span className="lab-draft-status">
            {draftSaved
              ? c('Draf tersimpan lokal', 'Draft saved locally')
              : c('Draf hanya untuk sesi ini', 'Draft for this session only')}
          </span>
        </div>
        {lesson.activity && (
          <div className="lab-variations">
            <div>
              <strong>
                {c('Coba sudut pandang lain: ', 'Try another angle: ')}
                {text(lesson.activity.variation.title)}
              </strong>
              <p>
                {text(lesson.activity.variation.observation)}{' '}
                {c(
                  'Pilihan versi mengganti isi editor. Kode suntinganmu bisa dipulihkan. Tekan Jalankan kode untuk melihat hasil.',
                  'Choosing a version replaces the editor contents. Your edits can be restored. Press Run code to see the result.',
                )}
              </p>
            </div>
            <div className="lab-variation-actions">
              <button
                type="button"
                aria-pressed={code === lesson.code}
                onClick={() => loadPreset(lesson.code)}
              >
                {c('Contoh awal', 'Starting example')}
              </button>
              <button
                type="button"
                aria-pressed={code === lesson.activity.variation.code}
                onClick={() => loadPreset(lesson.activity!.variation.code)}
              >
                {c('Coba variasi', 'Try variation')}
              </button>
              {comparisonCode && comparisonCode !== code && (
                <button type="button" onClick={restoreComparison}>
                  {c('Kembali ke kode saya', 'Restore my code')}
                </button>
              )}
            </div>
          </div>
        )}
        <div className="lab-workspace">
          <section className="editor-pane" aria-label={c('Panel kode', 'Code panel')}>
            <div className="code-tabs">
              <div
                className="tab-buttons"
                role="tablist"
                aria-label={c('Berkas contoh', 'Example files')}
                onKeyDown={handleTabKey}
              >
                {[
                  ['js', 'JavaScript'],
                  ['html', 'HTML'],
                  ['css', 'CSS'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    id={`tab-${namespace}-${id}`}
                    role="tab"
                    tabIndex={tab === id ? 0 : -1}
                    aria-selected={tab === id}
                    aria-controls={`panel-${namespace}`}
                    className={tab === id ? 'active' : ''}
                    onClick={() => setTab(id)}
                  >
                    {label}
                    {id === 'js' && <span className="editable-dot" />}
                  </button>
                ))}
              </div>
              <button
                className="icon-button copy-button"
                onClick={copyCode}
                aria-label={c('Salin kode', 'Copy code')}
              >
                {copyStatus === 'copied' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div
              className="editor-content"
              id={`panel-${namespace}`}
              role="tabpanel"
              aria-labelledby={`tab-${namespace}-${tab}`}
            >
              <div hidden={tab !== 'js'} className="editor-js">
                <Suspense
                  fallback={
                    <div className="code-loading" role="status">
                      {c('Memuat editor…', 'Loading the editor…')}
                    </div>
                  }
                >
                  <CodeEditor
                    value={code}
                    onChange={changeCode}
                    onRun={run}
                    label={c('Editor JavaScript', 'JavaScript editor')}
                  />
                </Suspense>
              </div>
              {tab !== 'js' && (
                <pre className="readonly-code">
                  <code>
                    {tab === 'html'
                      ? sceneMarkup(lesson.scene, locale, lesson.id === 'easing')
                      : sceneCSS}
                  </code>
                </pre>
              )}
            </div>
            <div className="editor-footnote">
              <span>
                {tab === 'js'
                  ? c('Dapat diedit', 'Editable')
                  : c('Struktur preview · hanya baca', 'Preview structure · read only')}
              </span>
              <kbd>Ctrl / ⌘ + Enter</kbd>
            </div>
          </section>
          <section className="preview-pane" aria-label={c('Panel preview', 'Preview panel')}>
            <div className="preview-toolbar">
              <span className="eyebrow">
                <span className="status-dot" />
                LIVE PREVIEW
              </span>
              <span>{lesson.scene.toUpperCase()}</span>
            </div>
            <div className="preview-frame">
              <PreviewFrame
                key={`${runId}-${locale}-${reducedMotion}`}
                ref={preview}
                scene={lesson.scene}
                locale={locale}
                reduced={reducedMotion}
                code={submitted}
                comparison={lesson.id === 'easing'}
                onReport={value => {
                  if (runId === generation.current) receiveReport(value)
                }}
                onError={message => {
                  if (runId === generation.current) receiveError(message)
                }}
                onState={(value, isPaused) => {
                  if (runId === generation.current) {
                    setProgress(value)
                    setPaused(isPaused)
                  }
                }}
                onActivate={activatePreview}
              />
              {loading && (
                <div className="preview-loading" role="status">
                  {c('Menyiapkan animasi…', 'Preparing the animation…')}
                </div>
              )}
            </div>
            <div className="playback-controls">
              <button
                className="icon-button"
                disabled={!controlEnabled || reducedMotion}
                onClick={() => {
                  preview.current?.send(paused ? 'resume' : 'pause')
                  setPaused(!paused)
                }}
                aria-label={
                  paused
                    ? c('Lanjutkan animasi', 'Resume animation')
                    : c('Jeda animasi', 'Pause animation')
                }
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <label className="scrubber">
                <span className="sr-only">
                  {scrollScene
                    ? c('Progres scroll', 'Scroll progress')
                    : c('Progres animasi', 'Animation progress')}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(progress * 100)}
                  disabled={!controlEnabled}
                  onInput={e => {
                    const value = Number(e.currentTarget.value) / 100
                    preview.current?.send(scrollScene ? 'scroll' : 'seek', value)
                    setProgress(value)
                    if (!scrollScene) setPaused(true)
                  }}
                />
              </label>
              <output aria-live="off">
                {String(Math.round(progress * 100)).padStart(2, '0')}%
              </output>
              <button
                className="icon-button"
                disabled={!controlEnabled}
                onClick={() => {
                  if (scrollScene) preview.current?.send('scroll', 0)
                  else preview.current?.send('replay')
                }}
                aria-label={c('Ulangi animasi', 'Replay animation')}
              >
                <RotateCcw size={14} />
              </button>
            </div>
            <p className="preview-help">
              {scrollScene
                ? c(
                    'Klik preview untuk menjalankan atau menjeda. Gulir atau geser slider untuk menjelajahi animasinya.',
                    'Click the preview to run or pause. Scroll or use the slider to explore the motion.',
                  )
                : lesson.scene === 'interaction'
                  ? c(
                      'Klik preview untuk menjalankan atau menjeda animasi dan mencoba interaksi.',
                      'Click the preview to run or pause the motion and try its interactions.',
                    )
                  : reducedMotion
                    ? c(
                        'Klik preview untuk menjalankan kode. Animasi dikurangi; gunakan slider untuk melihat tiap keadaan.',
                        'Click the preview to run the code. Motion is reduced; use the slider to inspect each state.',
                      )
                    : c(
                        'Klik atau sentuh area preview untuk menjalankan atau menjeda animasi.',
                        'Click or touch the preview area to run or pause the animation.',
                      )}
            </p>
          </section>
        </div>
        <div className="experiment-controls">
          <label hidden={duration === undefined}>
            {c('Durasi', 'Duration')}
            <input
              type="range"
              min="0.3"
              max="3"
              step="0.1"
              value={Number(duration) || 1.2}
              disabled={duration === undefined}
              onChange={e => changeCode(replaceConstant(code, 'duration', Number(e.target.value)))}
            />
            <output>{duration ?? '—'}s</output>
          </label>
          <label hidden={distance === undefined}>
            {c('Jarak', 'Distance')}
            <input
              type="range"
              min="40"
              max="280"
              step="10"
              value={Number(distance) || 180}
              disabled={distance === undefined}
              onChange={e => changeCode(replaceConstant(code, 'distance', Number(e.target.value)))}
            />
            <output>{distance ?? '—'}px</output>
          </label>
          <label className="ease-control" hidden={ease === undefined}>
            Easing
            <select
              value={ease ?? ''}
              disabled={ease === undefined}
              onChange={e => changeCode(replaceConstant(code, 'ease', e.target.value))}
            >
              {ease && !supportedEases.includes(ease) && <option>{ease}</option>}
              {supportedEases.map(value => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </label>
        </div>
        {lesson.scene === 'scroll' && (
          <div className="scroll-mode-controls">
            <span>{c('Mode scroll', 'Scroll mode')}</span>
            <button
              className={readConstant(code, 'scrub') === 'false' ? 'active' : ''}
              disabled={readConstant(code, 'scrub') === undefined}
              onClick={() => changeCode(replaceConstant(code, 'scrub', false))}
              aria-pressed={readConstant(code, 'scrub') === 'false'}
            >
              Trigger
            </button>
            <button
              className={readConstant(code, 'scrub') === 'true' ? 'active' : ''}
              disabled={readConstant(code, 'scrub') === undefined}
              onClick={() => changeCode(replaceConstant(code, 'scrub', true))}
              aria-pressed={readConstant(code, 'scrub') === 'true'}
            >
              Scrub
            </button>
            <label>
              <input
                type="checkbox"
                checked={readConstant(code, 'pin') === 'true'}
                disabled={readConstant(code, 'pin') === undefined}
                onChange={e => changeCode(replaceConstant(code, 'pin', e.target.checked))}
              />
              Pin
            </label>
            <small>{c('Terapkan dengan Jalankan', 'Apply with Run')}</small>
          </div>
        )}
        <div className="lab-actionbar">
          <div className="button-row">
            <button className="button primary small" onClick={run} disabled={loading}>
              <Play size={13} />
              {loading ? c('Menjalankan…', 'Running…') : c('Jalankan kode', 'Run code')}
            </button>
            <button className="button ghost small" onClick={reset}>
              <RotateCcw size={13} />
              {c('Reset contoh', 'Reset example')}
            </button>
            {controlEnabled && (
              <button
                className="button ghost small"
                onClick={() => {
                  preview.current?.send('pause')
                  setPaused(true)
                }}
              >
                <Square size={11} />
                {c('Berhenti', 'Stop')}
              </button>
            )}
          </div>
          <span className="run-status" role="status">
            {copyStatus === 'copied'
              ? c('Kode disalin', 'Code copied')
              : copyStatus === 'failed'
                ? c(
                    'Salin tidak tersedia. Pilih teks secara manual.',
                    'Copy unavailable. Select the text manually.',
                  )
                : loading
                  ? c('Menjalankan kode…', 'Running code…')
                  : submitted && submitted !== code
                    ? c('Kode berubah · jalankan lagi', 'Code changed · run again')
                    : report && !error
                      ? c('Kode berhasil dijalankan', 'Code ran successfully')
                      : c('Siap bereksperimen', 'Ready to experiment')}
          </span>
        </div>
        {error && (
          <div className="lab-error" role="alert">
            <strong>{c('Ada yang perlu diperiksa', 'Something needs attention')}</strong>
            <p>{error}</p>
            <small>
              {c(
                'Materi dan progres tetap tersedia. Periksa kode atau gunakan Reset contoh.',
                'Your lesson and progress are still available. Check your code or use Reset example.',
              )}
            </small>
          </div>
        )}
      </div>
      {(lesson.scene === 'timeline' ||
        ['stagger', 'stagger-order', 'keyframes', 'scroll-timeline'].includes(lesson.id)) && (
        <section
          className="timeline-visualizer"
          aria-label={c('Visualisasi timeline', 'Timeline visualization')}
        >
          <div className="timeline-heading">
            <span className="eyebrow">TIMELINE INSPECTOR</span>
            <span>
              {report
                ? `${maxTime.toFixed(2)}s · ${report.timelineScale}×`
                : c('Jalankan untuk melihat urutan', 'Run to see the sequence')}
            </span>
          </div>
          {tracks.length ? (
            <div className="timeline-tracks">
              <div
                className="timeline-playhead"
                style={{ left: `calc(90px + (100% - 100px) * ${progress})` }}
              />
              {tracks.map((a, i) => (
                <div className="timeline-row" key={i}>
                  <span>{a.target}</span>
                  <div>
                    <div
                      className={`timeline-bar tone-${i % 3}`}
                      style={{
                        left: `${(a.start / maxTime) * 100}%`,
                        width: `${Math.max(2, (a.duration / maxTime) * 100)}%`,
                      }}
                    >
                      {a.duration.toFixed(1)}s
                    </div>
                  </div>
                </div>
              ))}
              <div className="timeline-labels">
                {report?.labels.map((label, i) => (
                  <span key={i} style={{ left: `${(label.time / maxTime) * 100}%` }}>
                    ⚑ {label.name}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="quiet-note">
              {c(
                'Track menampilkan waktu mulai dan durasi tween dari kode yang benar-benar kamu jalankan.',
                'Tracks show the start time and duration of tweens your code actually created.',
              )}
            </p>
          )}
          <p className="quiet-note">
            {c(
              'Ubah progres preview untuk melihat posisi playhead. Track yang bertumpuk berarti tween berlangsung bersamaan.',
              'Scrub preview progress to inspect the playhead position. Overlapping tracks mean tweens run together.',
            )}
          </p>
        </section>
      )}
      <p className="lab-limit-note">
        {c(
          'GSAP, ScrollTrigger, dan MotionPathPlugin sudah tersedia. Editor latihan mendukung tween, timeline, dan event; import serta loop tidak didukung. Kontrol hanya mengubah konstanta yang masih ada di kodemu.',
          'GSAP, ScrollTrigger, and MotionPathPlugin are ready to use. The exercise editor supports tweens, timelines, and events; imports and loops are not supported. Controls only edit constants that still exist in your code.',
        )}
      </p>
      {challenge && (
        <section className="lesson-challenge" id="challenge">
          <div className="challenge-label">
            <span className="eyebrow">
              {c('04 / TERAPKAN PEMAHAMANMU', '04 / PUT IT INTO PRACTICE')}
            </span>
            {challenges.includes(lesson.id) && (
              <span className="completion-badge">
                <Check size={12} />
                {c('Sudah dituntaskan', 'Completed before')}
              </span>
            )}
          </div>
          <h2>{text(lesson.challenge.title)}</h2>
          <p>{text(lesson.challenge.task)}</p>
          <div className="button-row">
            <button className="button primary small" onClick={check}>
              <CheckCircle2 size={14} />
              {c('Periksa tantangan', 'Check challenge')}
            </button>
            <button
              className="button secondary small"
              disabled={hints >= lesson.challenge.hints.length}
              onClick={() => setHints(n => Math.min(n + 1, lesson.challenge.hints.length))}
            >
              <Lightbulb size={14} />
              {hints === lesson.challenge.hints.length
                ? c('Semua petunjuk dibuka', 'All hints revealed')
                : c('Beri aku petunjuk', 'Give me a hint')}
            </button>
          </div>
          {hints > 0 && (
            <ol className="challenge-hints">
              {lesson.challenge.hints.slice(0, hints).map((hint, i) => (
                <li key={i}>{text(hint)}</li>
              ))}
            </ol>
          )}
          {feedback && (
            <div
              className={`feedback ${feedback === 'pass' ? 'success' : 'neutral'}`}
              role="status"
            >
              <strong>
                {feedback === 'pass'
                  ? c(
                      'Berhasil. Kamu sudah menerapkan idenya!',
                      'You did it. You have put the idea into practice!',
                    )
                  : feedback === 'run'
                    ? c('Jalankan kode terbarumu dahulu.', 'Run your latest code first.')
                    : c(
                        'Belum sesuai. Coba satu perubahan lagi.',
                        'Not quite yet. Try one more change.',
                      )}
              </strong>
              <p>
                {feedback === 'pass'
                  ? c(
                      'Pelajaran dan tantangan ini ditandai selesai. Coba jelaskan apa yang berubah sebelum melanjutkan.',
                      'This lesson and challenge are marked complete. Try explaining what changed before moving on.',
                    )
                  : feedback === 'run'
                    ? c(
                        'Ubah kode, tekan Jalankan kode, lalu periksa tantangan.',
                        'Edit your code, press Run code, then check the challenge.',
                      )
                    : text(lesson.challenge.hints[0])}
              </p>
            </div>
          )}
          {hints === lesson.challenge.hints.length && (
            <details className="solution-disclosure">
              <summary>{c('Lihat satu contoh jawaban', 'See one possible solution')}</summary>
              <p>
                {c(
                  'Bandingkan dengan kodemu. Pahami perubahan sebelum mencoba lagi.',
                  'Compare it with your code. Understand the change before trying again.',
                )}
              </p>
              <pre>
                <code>{lesson.solution}</code>
              </pre>
              <button
                className="button secondary small"
                onClick={() => {
                  changeCode(lesson.solution)
                  setTab('js')
                }}
              >
                {c('Gunakan contoh ini di editor', 'Use this example in the editor')}
              </button>
            </details>
          )}
        </section>
      )}
    </>
  )
}
