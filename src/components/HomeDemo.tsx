import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import gsap from 'gsap'
import { useApp } from '../app/AppProvider'
import { BrandMark } from './Brand'
import SelectField from './SelectField'
export default function HomeDemo() {
  const { c, reducedMotion } = useApp()
  const box = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const [duration, setDuration] = useState(1.2)
  const [ease, setEase] = useState('power2.out')
  const [distance, setDistance] = useState(180)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const observer = new ResizeObserver(() =>
      setDistance(Math.max(80, Math.min(180, (stage.current?.clientWidth ?? 400) - 155))),
    )
    if (stage.current) observer.observe(stage.current)
    return () => {
      observer.disconnect()
      tween.current?.kill()
    }
  }, [])
  useEffect(() => {
    if (reducedMotion) {
      tween.current?.progress(1).pause()
      setPlaying(false)
    }
  }, [reducedMotion])
  const play = () => {
    if (playing) {
      tween.current?.pause()
      setPlaying(false)
      return
    }
    if (tween.current && tween.current.progress() < 1 && progress > 0 && !reducedMotion) {
      tween.current.resume()
      setPlaying(true)
      return
    }
    tween.current?.kill()
    tween.current = gsap.fromTo(
      box.current,
      { x: 0, rotation: 0 },
      {
        x: distance,
        rotation: 90,
        duration,
        ease,
        onUpdate: () => setProgress(Math.round((tween.current?.progress() ?? 0) * 100)),
        onComplete: () => setPlaying(false),
      },
    )
    if (reducedMotion) {
      tween.current.progress(1).pause()
      setProgress(100)
    } else setPlaying(true)
  }
  const reset = () => {
    tween.current?.kill()
    gsap.set(box.current, { x: 0, rotation: 0 })
    setProgress(0)
    setPlaying(false)
  }
  return (
    <div className="home-demo">
      <div className="demo-topline">
        <span>
          <span className="status-dot" />
          {c('ANIMASI PERTAMA', 'YOUR FIRST ANIMATION')}
        </span>
        <span>GSAP LAB / 001</span>
      </div>
      <div className="home-demo-stage" ref={stage}>
        <div className="coordinate coordinate-top">y ↑</div>
        <div className="motion-route" style={{ width: distance + 65 }}>
          <span className="motion-ghost" style={{ left: distance }} />
          <div ref={box} className="motion-box">
            <BrandMark />
          </div>
          <span className="motion-origin">0</span>
          <span className="motion-destination" style={{ left: distance + 18 }}>
            {distance}px
          </span>
        </div>
        <span className="coordinate coordinate-bottom">x →</span>
        <div className="demo-caption">
          {c(
            'Satu ide. Satu animasi. Banyak kemungkinan.',
            'One idea. One animation. Endless possibilities.',
          )}
        </div>
      </div>
      <div className="home-demo-code">
        <span className="code-file">motion.js</span>
        <pre>
          <code>
            <span className="syntax-purple">gsap</span>.<span className="syntax-green">to</span>(
            <span className="syntax-string">".box"</span>, {'{'}
            {'\n'} x: <span className="syntax-number">{distance}</span>, rotation:{' '}
            <span className="syntax-number">90</span>,{'\n'} duration:{' '}
            <span className="syntax-number">{duration}</span>, ease:{' '}
            <span className="syntax-string">"{ease}"</span>
            {'\n'}
            {'}'});
          </code>
        </pre>
        <span className="code-comment">
          // {c('ubah nilainya, lihat bedanya', 'change a value, see the difference')}
        </span>
      </div>
      <div className="demo-settings">
        <label>
          duration{' '}
          <SelectField
            label="duration"
            size="sm"
            value={String(duration)}
            onValueChange={value => {
              setDuration(Number(value))
              reset()
            }}
            options={[
              { value: '0.7', label: '0.7s' },
              { value: '1.2', label: '1.2s' },
              { value: '2', label: '2.0s' },
            ]}
          />
        </label>
        <label>
          ease{' '}
          <SelectField
            label="ease"
            size="sm"
            value={ease}
            onValueChange={value => {
              setEase(value)
              reset()
            }}
            options={['power2.out', 'none', 'back.out(1.7)'].map(value => ({
              value,
              label: value,
            }))}
          />
        </label>
      </div>
      <div className="demo-controls">
        <button className="button primary small" onClick={play}>
          {playing ? <Pause size={13} /> : <Play size={13} />}{' '}
          {playing
            ? c('Jeda', 'Pause')
            : reducedMotion
              ? c('Lihat hasil', 'Show result')
              : progress > 0 && progress < 100
                ? c('Lanjutkan demo', 'Resume the demo')
                : progress === 100
                  ? c('Ulangi demo', 'Replay the demo')
                  : c('Jalankan demo', 'Run the demo')}
        </button>
        <button className="icon-button" onClick={reset} aria-label={c('Reset demo', 'Reset demo')}>
          <RotateCcw size={15} />
        </button>
        <span className="demo-progress">
          <span style={{ width: `${progress}%` }} />
        </span>
        <output aria-live="off">{String(progress).padStart(2, '0')}%</output>
      </div>
    </div>
  )
}
