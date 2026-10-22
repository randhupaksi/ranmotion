import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
export default function NotFoundPage() {
  const { c } = useApp()
  return (
    <div className="page-width empty-state not-found">
      <p className="eyebrow">404 / OFF THE TIMELINE</p>
      <h1>{c('Sepertinya kita keluar jalur.', 'Looks like we left the timeline.')}</h1>
      <p>
        {c(
          'Halaman ini tidak ditemukan. Kamu bisa kembali ke jalur belajar.',
          'This page could not be found. Head back to the learning path.',
        )}
      </p>
      <Link className="button primary" to="/learn">
        {c('Kembali belajar', 'Back to learning')}
      </Link>
    </div>
  )
}
