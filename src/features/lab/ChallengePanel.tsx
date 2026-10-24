import type { ReactNode } from 'react'
import { Check, CheckCircle2, Lightbulb } from 'lucide-react'
import { useApp } from '../../app/AppProvider'
import type { PracticeLesson } from '../../data/types'

export type ChallengeFeedback = 'pass' | 'retry' | 'run' | null

interface ChallengePanelProps {
  lesson: PracticeLesson
  /** "lesson" sits at the end of a lesson; "challenge" leads the standalone challenge page. */
  mode: 'lesson' | 'challenge'
  hints: number
  feedback: ChallengeFeedback
  onCheck: () => void
  onRevealHint: () => void
  onUseSolution: () => void
  /** Extra action shown after a pass on the standalone page, such as the next challenge. */
  passAction?: ReactNode
}

export default function ChallengePanel({
  lesson,
  mode,
  hints,
  feedback,
  onCheck,
  onRevealHint,
  onUseSolution,
  passAction,
}: ChallengePanelProps) {
  const { c, text, challenges, completed, completeLesson } = useApp()
  const standalone = mode === 'challenge'
  const totalHints = lesson.challenge.hints.length
  return (
    <section
      className={`lesson-challenge${standalone ? ' lesson-challenge--standalone' : ''}`}
      id={standalone ? undefined : 'challenge'}
    >
      <div className="challenge-label">
        <span className="eyebrow">
          {standalone
            ? c('PERIKSA HASILMU', 'CHECK YOUR RESULT')
            : c('04 / TERAPKAN PEMAHAMANMU', '04 / PUT IT INTO PRACTICE')}
        </span>
        {challenges.includes(lesson.id) && (
          <span className="completion-badge">
            <Check size={12} />
            {c('Sudah dituntaskan', 'Completed before')}
          </span>
        )}
      </div>
      {standalone ? (
        <p>
          {c(
            'Ubah kode di editor, tekan Jalankan kode, lalu periksa. Penilaian membaca animasi yang benar-benar berjalan.',
            'Edit the code, press Run code, then check. The check reads the animation that actually ran.',
          )}
        </p>
      ) : (
        <>
          <h2>{text(lesson.challenge.title)}</h2>
          <p>{text(lesson.challenge.task)}</p>
        </>
      )}
      <div className="button-row">
        <button className="button primary small" onClick={onCheck}>
          <CheckCircle2 size={14} />
          {c('Periksa tantangan', 'Check challenge')}
        </button>
        <button
          className="button secondary small"
          disabled={hints >= totalHints}
          onClick={onRevealHint}
        >
          <Lightbulb size={14} />
          {hints === totalHints
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
        <div className={`feedback ${feedback === 'pass' ? 'success' : 'neutral'}`} role="status">
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
              ? standalone
                ? c(
                    'Tantangan ini ditandai tuntas. Progres pelajaranmu tidak berubah.',
                    'This challenge is marked complete. Your lesson progress stays as it was.',
                  )
                : c(
                    'Tantangan ini ditandai tuntas. Coba jelaskan apa yang berubah sebelum melanjutkan.',
                    'This challenge is marked complete. Try explaining what changed before moving on.',
                  )
              : feedback === 'run'
                ? c(
                    'Ubah kode, tekan Jalankan kode, lalu periksa tantangan.',
                    'Edit your code, press Run code, then check the challenge.',
                  )
                : text(lesson.challenge.hints[0])}
          </p>
          {feedback === 'pass' && !standalone && !completed.includes(lesson.id) && (
            <div className="feedback-actions">
              <button className="button secondary small" onClick={() => completeLesson(lesson.id)}>
                <CheckCircle2 size={14} />
                {c('Tandai pelajaran selesai', 'Mark the lesson complete')}
              </button>
            </div>
          )}
          {feedback === 'pass' && standalone && passAction && (
            <div className="feedback-actions">{passAction}</div>
          )}
        </div>
      )}
      {hints === totalHints && (
        <details className="solution-disclosure">
          <summary>{c('Lihat satu contoh jawaban', 'See one possible solution')}</summary>
          <p>
            {c(
              'Bandingkan dengan kodemu. Pahami perubahan sebelum mencoba lagi.',
              'Compare it with your code. Understand the change before trying again.',
            )}
          </p>
          <pre tabIndex={0} aria-label={c('Contoh jawaban kode', 'Example solution code')}>
            <code>{lesson.solution}</code>
          </pre>
          <button className="button secondary small" onClick={onUseSolution}>
            {c('Gunakan contoh ini di editor', 'Use this example in the editor')}
          </button>
        </details>
      )}
    </section>
  )
}
