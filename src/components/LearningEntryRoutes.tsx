import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../app/AppProvider'

export default function LearningEntryRoutes() {
  const { c } = useApp()
  const routes = [
    { href: '/learn/orientation', title: c('Aku baru mulai', 'I am just starting'), note: c('Mulai dengan editor, koordinat, dan selector. Tiga pelajaran pendek untuk membangun pijakan.', 'Start with the editor, coordinates, and selectors. Three short lessons to find your footing.') },
    { href: '/learn/timeline', title: c('Aku sudah paham tween', 'I understand tweens'), note: c('Rangkai urutan, coba interaksi, lalu hubungkan dengan scroll.', 'Sequence animations, try interactions, then connect them to scrolling.') },
    { href: '/learn/svg-attributes', title: c('Aku ingin eksplorasi', 'I want to explore'), note: c('Coba SVG dan MotionPath, lalu pelajari animasi responsif serta cleanup.', 'Try SVG and MotionPath, then explore responsive animation and cleanup.') },
  ]
  return <section className="learning-entry-routes" aria-label={c('Pilih titik mulai', 'Choose a starting point')}><div className="entry-routes-heading"><span className="eyebrow">{c('PILIH TITIK MULAI', 'CHOOSE A STARTING POINT')}</span><p>{c('Tidak perlu menguasai semuanya sekaligus. Pilih bagian yang sesuai, lalu belajar dengan ritmemu.', 'You do not need to master everything at once. Start where it suits you and learn at your own pace.')}</p></div><div className="entry-routes-list">{routes.map((route,index)=><Link key={route.href} to={route.href}><span className="number-label">0{index+1}</span><div><h2>{route.title}</h2><p>{route.note}</p></div><ArrowUpRight size={16}/></Link>)}</div></section>
}
