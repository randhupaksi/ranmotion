import { Link, Route, Routes } from 'react-router-dom'

function StarterPage({ title }: { title: string }) {
  return (
    <main className="starter-page">
      <p className="starter-kicker">RanMotion · starter</p>
      <h1>{title}</h1>
      <p>Kerangka dasar aplikasi sudah siap untuk tahap implementasi berikutnya.</p>
      <nav aria-label="Navigasi sementara">
        <Link to="/">Beranda</Link>
        <Link to="/learn">Belajar</Link>
        <Link to="/playground">Playground</Link>
      </nav>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StarterPage title="RanMotion" />} />
      <Route path="/learn/*" element={<StarterPage title="Jalur belajar" />} />
      <Route path="/playground/*" element={<StarterPage title="Playground" />} />
      <Route path="*" element={<StarterPage title="Halaman tidak ditemukan" />} />
    </Routes>
  )
}
