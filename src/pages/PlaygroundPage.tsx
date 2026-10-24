import { lazy, Suspense, useEffect, useMemo } from 'react'
import { ArrowUpRight, FlaskConical, ShieldCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { getPracticeLesson, getModuleLessons, modules } from '../data/curriculum'
import ErrorBoundary from '../components/ErrorBoundary'
import { SectionLoadingSkeleton } from '../components/LoadingSkeleton'
import SelectField from '../components/SelectField'
import { learningActivity } from '../data/learningActivities'
const MotionLab = lazy(() => import('../features/lab/MotionLab'))
export default function PlaygroundPage() {
  const { c, text } = useApp()
  const [params, setParams] = useSearchParams()
  const source = getPracticeLesson(params.get('example') ?? 'to') ?? getPracticeLesson('to')!
  const lesson = useMemo(() => ({ ...source, activity: learningActivity(source) }), [source])
  useEffect(() => {
    document.title = `${c('Playground animasi', 'Animation playground')} - RanMotion`
  }, [c])
  return (
    <div className="page-width playground-page">
      <header className="playground-header">
        <div>
          <p className="eyebrow">
            <FlaskConical size={13} />
            {c('RUANG UNTUK MENCOBA', 'A LITTLE ROOM TO EXPERIMENT')}
          </p>
          <h1>{c('Ikuti rasa ingin tahumu', 'Follow your curiosity')}</h1>
          <p>
            {c(
              'Pilih contoh, ubah kodenya, lihat apa yang terjadi. Tidak perlu takut salah.',
              'Choose an example, change its code, and see what happens. It is a safe place to get things wrong.',
            )}
          </p>
        </div>
        <Link className="text-link" to={`/learn/${lesson.id}`}>
          {c('Pelajari konsep ini', 'Learn this concept')}
          <ArrowUpRight size={15} />
        </Link>
      </header>
      <div className="playground-example-picker">
        <label htmlFor="example-select">
          {c('MULAI DARI SEBUAH CONTOH', 'START WITH AN EXAMPLE')}
        </label>
        <SelectField
          id="example-select"
          label={c('MULAI DARI SEBUAH CONTOH', 'START WITH AN EXAMPLE')}
          value={lesson.id}
          onValueChange={example => setParams({ example })}
          groups={modules
            .map(m => ({
              label: text(m.title),
              options: getModuleLessons(m.number)
                .filter(l => l.format !== 'concept')
                .map(l => ({ value: l.id, label: `${text(l.title)} · ${l.concept}` })),
            }))
            .filter(group => group.options.length > 0)}
        />
        <span className="quiet-note">
          {c('Setiap contoh punya draf sendiri.', 'Each example keeps its own draft.')}
        </span>
      </div>
      <ErrorBoundary>
        <Suspense
          fallback={
            <SectionLoadingSkeleton
              variant="lab"
              label={c('Menyiapkan ruang praktik', 'Getting your playground ready')}
            />
          }
        >
          <MotionLab lesson={lesson} mode="playground" namespace="playground" key={lesson.id} />
        </Suspense>
      </ErrorBoundary>
      <div className="playground-bottom">
        <p>
          <ShieldCheck size={14} />
          {c(
            'Kode berjalan di browser ini dan tidak dikirim ke server.',
            'Your code runs in this browser and is not sent to a server.',
          )}
        </p>
        <Link className="text-link" to={`/challenges/${lesson.id}`}>
          {c('Siap mencoba tantangannya?', 'Ready for the challenge?')}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  )
}
