import { ArrowRight, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import FeedbackState from '../components/FeedbackState'
export default function NotFoundPage() {
  const { c } = useApp()
  return (
    <FeedbackState
      kind="not-found"
      icon={Compass}
      eyebrow="404 / OFF THE TIMELINE"
      headingLevel="h1"
      className="page-width not-found"
      title={c('Sepertinya kita keluar jalur.', 'Looks like we left the timeline.')}
      description={c(
        'Halaman ini tidak ditemukan. Kamu bisa kembali ke jalur belajar.',
        'This page could not be found. Head back to the learning path.',
      )}
      action={
        <Link className="button primary" to="/learn">
          {c('Kembali belajar', 'Back to learning')}
          <ArrowRight size={15} />
        </Link>
      }
    />
  )
}
