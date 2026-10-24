import { useEffect, useId, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import gsap from 'gsap'
import { useApp } from '../app/AppProvider'
import { introStudies } from '../data/introCurriculum'
import type { ConceptLesson } from '../data/types'
import { BrandMark } from './Brand'
import SelectField from './SelectField'
import './conceptStudy.css'

export default function ConceptStudy({ lesson }: { lesson: ConceptLesson }) {
  const { c, text, reducedMotion } = useApp()
  const uid = useId()
  const study = introStudies[lesson.id]
  const blueprint = lesson.id === 'animation-blueprint'
  const box = useRef<HTMLDivElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const [distance, setDistance] = useState(160)
  const [duration, setDuration] = useState(1.2)
  const [ease, setEase] = useState('none')
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [choice, setChoice] = useState<number | null>(null)
  useEffect(() => {
    const animation = gsap.fromTo(
      box.current,
      { x: 0 },
      {
        x: distance,
        duration,
        ease,
        paused: true,
        onUpdate: function (this: gsap.core.Tween) {
          setProgress(Math.round(this.progress() * 100))
        },
        onComplete: () => setPlaying(false),
      },
    )
    tween.current = animation
    setProgress(0)
    setPlaying(false)
    return () => {
      animation.kill()
    }
  }, [distance, duration, ease])
  useEffect(() => {
    if (reducedMotion) {
      tween.current?.progress(1).pause()
      setPlaying(false)
    }
  }, [reducedMotion, distance, duration, ease])
  const play = () => {
    const animation = tween.current
    if (!animation) return
    if (reducedMotion) {
      animation.progress(1).pause()
      return
    }
    if (playing) animation.pause()
    else if (animation.progress() >= 1) animation.restart()
    else animation.play()
    setPlaying(!playing)
  }
  const originLeft = `calc(50% - ${distance / 2 + 22}px)`
  const destinationLeft = `calc(50% + ${distance / 2 - 22}px)`
  const trackLeft = `calc(50% - ${distance / 2}px)`
  return (
    <>
      <div className="concept-roles">
        {study.terms.map((term, index) => (
          <div key={term.title.en}>
            <span className="number-label">0{index + 1}</span>
            <h3>{text(term.title)}</h3>
            <p>{text(term.explanation)}</p>
          </div>
        ))}
      </div>
      <section className="concept-study" id="experiment" aria-labelledby={`${uid}-heading`}>
        <div className="concept-study-heading">
          <p className="eyebrow">{c('02 / LIHAT DAN RASAKAN', '02 / SEE AND FEEL')}</p>
          <h2 id={`${uid}-heading`}>
            {blueprint
              ? c(
                  'Satu kotak. Pilihanmu menentukan rasanya.',
                  'One box. Your choices shape its feel.',
                )
              : c(
                  'Ada cerita di antara awal dan akhir.',
                  'There is a story between start and finish.',
                )}
          </h2>
          <p>
            {c(
              'Cukup gunakan tombol dan slider. Tidak perlu menulis kode.',
              'Just use the buttons and sliders. No code needed.',
            )}
          </p>
        </div>
        <div
          className="concept-stage"
          role="img"
          aria-label={c(
            'Studi visual: kotak berpindah dari posisi awal menuju garis tujuan.',
            'Visual study: a box travels from the start to the destination marker.',
          )}
        >
          <span className="concept-stage-label">
            {c('TARGET / SATU ELEMEN', 'TARGET / ONE ELEMENT')}
          </span>
          <div className="concept-track" style={{ left: trackLeft, width: distance }} />
          <div className="concept-ghost" style={{ left: destinationLeft }} aria-hidden="true" />
          <div className="concept-box" ref={box} style={{ left: originLeft }} aria-hidden="true">
            <BrandMark />
          </div>
          <span className="concept-origin" style={{ left: originLeft }}>
            {c('awal / 0', 'start / 0')}
          </span>
          <span className="concept-destination" style={{ left: destinationLeft }}>
            {distance}px
          </span>
        </div>
        <div className="concept-playback">
          <button className="button primary small" onClick={play}>
            {playing ? <Pause size={15} /> : <Play size={15} />}
            {reducedMotion
              ? c('Lihat hasil akhir', 'Show final state')
              : playing
                ? c('Jeda animasi', 'Pause animation')
                : progress === 100
                  ? c('Putar ulang', 'Replay animation')
                  : c('Putar animasi', 'Play animation')}
          </button>
          <button
            className="icon-button"
            aria-label={c('Kembali ke posisi awal', 'Return to the start')}
            onClick={() => {
              tween.current?.pause(0)
              setProgress(0)
              setPlaying(false)
            }}
          >
            <RotateCcw size={16} />
          </button>
          <label className="concept-scrubber">
            <span>{c('Amati progres', 'Inspect progress')}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={event => {
                tween.current?.progress(Number(event.target.value) / 100).pause()
                setPlaying(false)
              }}
            />
          </label>
          <output aria-live="off">{progress}%</output>
        </div>
        {blueprint && (
          <div className="concept-settings">
            <label htmlFor={`${uid}-distance`}>
              {c('Tujuan kotak', 'Box destination')} <output aria-live="off">{distance}px</output>
              <input
                id={`${uid}-distance`}
                type="range"
                min="40"
                max="160"
                step="20"
                value={distance}
                aria-valuetext={`${distance} ${c('piksel', 'pixels')}`}
                onChange={event => setDistance(Number(event.target.value))}
              />
            </label>
            <label htmlFor={`${uid}-duration`}>
              {c('Waktu tempuh', 'Travel time')} <output aria-live="off">{duration}s</output>
              <input
                id={`${uid}-duration`}
                type="range"
                min="0.6"
                max="3"
                step="0.2"
                value={duration}
                aria-valuetext={`${duration} ${c('detik', 'seconds')}`}
                onChange={event => setDuration(Number(event.target.value))}
              />
            </label>
            <label>
              {c('Karakter kecepatan', 'Speed pattern')}
              <SelectField
                label={c('Karakter kecepatan', 'Speed pattern')}
                value={ease}
                onValueChange={setEase}
                options={[
                  { value: 'none', label: c('Konstan', 'Constant') },
                  { value: 'power2.out', label: c('Melambat di akhir', 'Slow down at the end') },
                ]}
              />
            </label>
          </div>
        )}
        <p className="concept-motion-note">
          {reducedMotion
            ? c(
                'Mode kurangi animasi aktif. Geser progres untuk membandingkan keadaan secara manual.',
                'Reduced motion is on. Scrub the progress control to compare states manually.',
              )
            : c(
                'Geser progres untuk berhenti di satu keadaan. Ubah pilihan, lalu putar lagi untuk membandingkan.',
                'Scrub progress to stop at a state. Change a setting, then play again to compare.',
              )}
        </p>
        <ol className="concept-observations">
          {lesson.steps.map(step => (
            <li key={step.en}>{text(step)}</li>
          ))}
        </ol>
      </section>
      <section className="concept-check lesson-section" id="challenge">
        <p className="eyebrow">{c('03 / CEK PEMAHAMAN', '03 / CHECK YOUR UNDERSTANDING')}</p>
        <h2>{c('Ceritakan kembali idenya', 'Put the idea into your own words')}</h2>
        <p>
          {c(
            'Pilih jawaban, lalu baca penjelasannya. Kamu bebas mencoba lagi.',
            'Choose an answer, then read the explanation. You can try again freely.',
          )}
        </p>
        <fieldset className="concept-choices">
          <legend>{text(study.question)}</legend>
          {study.choices.map((answer, index) => (
            <label key={answer.en}>
              <input
                type="radio"
                name={`${uid}-answer`}
                checked={choice === index}
                onChange={() => setChoice(index)}
              />
              <span>{text(answer)}</span>
            </label>
          ))}
        </fieldset>
        {choice !== null && (
          <div className="concept-answer" role="status">
            <strong>
              {choice === study.answer
                ? c('Ya, kamu memahami idenya.', 'Yes, you understand the idea.')
                : c('Mari hubungkan dengan yang terlihat.', 'Let’s connect this to what you saw.')}
            </strong>
            <p>{text(study.explanation)}</p>
            <button className="text-button" onClick={() => setChoice(null)}>
              {c('Coba lagi', 'Try again')}
            </button>
          </div>
        )}
        {blueprint && (
          <details className="concept-code-preview">
            <summary>
              {c(
                'Penasaran bentuk instruksinya di JavaScript?',
                'Curious what the instructions look like in JavaScript?',
              )}
            </summary>
            <p>
              {c(
                'Ini hanya untuk dibaca. Nilainya mengikuti pilihanmu di atas. Pelajaran berikutnya akan mengenalkan editor selangkah demi selangkah.',
                'This is just for reading. The values follow your choices above. The next lesson introduces the editor one step at a time.',
              )}
            </p>
            <pre>
              <code>{`gsap.to(".box", {\n  x: ${distance},\n  duration: ${duration},\n  ease: "${ease}"\n});`}</code>
            </pre>
          </details>
        )}
      </section>
    </>
  )
}
