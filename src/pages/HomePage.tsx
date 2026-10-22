import { ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Eye, MousePointer2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useApp } from '../app/AppProvider'
import { lessons, modules, nextRecommended } from '../data/curriculum'
import HomeDemo from '../components/HomeDemo'

export default function HomePage() {
  const { c, text, completed } = useApp()
  const next = nextRecommended(completed)
  useEffect(() => { document.title = c('RanMotion — Belajar lewat gerak.', 'RanMotion — Learn through motion.') }, [c])
  return <div className="home-page">
    <section className="hero page-width">
      <div className="hero-rail" aria-hidden="true"><span>FIELD STUDY<br/>001 / GSAP</span><i/><span>01<br/>07</span></div>
      <div className="hero-copy">
        <p className="eyebrow"><span className="tiny-line"/>{c('BELAJAR ANIMASI DENGAN CARA MENGALAMINYA', 'LEARN ANIMATION BY EXPERIENCING IT')}</p>
        <h1>{c('Pahami', 'Learn')}<br/><span className="hero-word"><em>{c('gerak', 'by moving')}</em><span className="hero-period" aria-hidden="true">✳</span></span></h1>
        <p className="hero-lead">{c('RanMotion mengubah GSAP dari baris kode menjadi sesuatu yang bisa kamu lihat, utak-atik, dan pahami. Mulai dari gerakan kecil. Bangun intuisi yang bisa kamu bawa ke mana saja.', 'RanMotion turns GSAP from lines of code into something you can see, tweak, and understand. Start with a small movement. Build intuition you can take anywhere.')}</p>
        <div className="hero-actions"><Link className="button primary" to={`/learn/${next.id}`}>{completed.length ? c('Lanjutkan perjalanan', 'Continue your journey') : c('Masuk ke pelajaran pertama', 'Enter the first lesson')}<ArrowUpRight size={16}/></Link><Link className="button ghost" to="/playground">{c('Buka ruang eksperimen', 'Open the experiment room')}<ArrowRight size={15}/></Link></div>
        <p className="hero-footnote"><Check size={13}/>{c('Gratis · Tanpa akun · Progres tersimpan di perangkatmu', 'Free · No account · Progress stays on your device')}</p>
        <div className="hero-index-strip"><span><i className="status-dot"/> GSAP / INTERACTIVE COURSE</span><span>01—07 / {modules.length} {c('BAB', 'CHAPTERS')}</span></div>
      </div>
      <div className="hero-lab"><div className="hero-lab-label"><span className="number-label">MOTION STUDY / 001</span><span className="handwritten">{c('tonton, lalu utak-atik', 'watch, then mess with it')} ↘</span></div><HomeDemo/><p className="hero-lab-note"><MousePointer2 size={12}/>{c('Gerakan ini berjalan sungguhan. Kamu memegang kendalinya.', 'This movement is running live. You are in control.')}</p></div>
      <a className="hero-scroll" href="#learning-path"><span>{c('GULIR UNTUK MENJELAJAH', 'SCROLL TO EXPLORE')}</span><ArrowDown size={14}/></a>
    </section>

    <div className="home-facts page-width"><span className="facts-kicker">{c('CATATAN LAPANGAN','FIELD NOTES')}<ArrowDown size={13}/></span><div><strong>{lessons.length}<i>×</i></strong><span>{c('eksperimen terpandu','guided experiments')}</span></div><div><strong>{String(modules.length).padStart(2,'0')}</strong><span>{c('bab dari dasar ke proyek','chapters from basics to project')}</span></div><div><strong>∞</strong><span>{c('cara untuk mengeksplorasi','ways to explore')}</span></div></div>

    <section className="home-path page-width" id="learning-path"><div className="section-intro"><div><p className="eyebrow">{c('JALUR BELAJAR / 01—07', 'LEARNING PATH / 01—07')}</p><h2>{c('Satu gerakan', 'One movement')}<br/><em>{c('membuka gerakan lain.', 'leads to another.')}</em></h2></div><div><p>{c('Mulai dengan cara GSAP memilih elemen. Lanjutkan ke waktu, urutan, interaksi, dan scroll. Di ujungnya, semua konsep bekerja bersama dalam satu proyek.', 'Start with how GSAP finds elements. Continue through timing, sequencing, interaction, and scroll. At the end, every idea works together in one project.')}</p><Link className="text-link" to="/learn">{c('Jelajahi seluruh kurikulum', 'Explore the full curriculum')}<ArrowUpRight size={15}/></Link></div></div><div className="home-module-list">{modules.map(m => <Link key={m.number} to={`/learn#module-${m.number}`} className="home-module"><span className="module-number">{String(m.number + 1).padStart(2, '0')}</span><div><h3>{text(m.title)}</h3><p>{m.topics}</p></div><span className="module-count">{lessons.filter(l => l.module === m.number).length} {c('STUDI', 'STUDIES')}</span><ArrowUpRight size={17}/></Link>)}</div><Link className="project-teaser" to="/learn/project"><span className="number-label">07 / CAPSTONE EXPERIMENT</span><strong>{c('Sekarang, buat sesuatu milikmu.', 'Now, make something of your own.')}</strong><span>{c('Satukan semua yang kamu pelajari', 'Bring everything you have learned together')}<ArrowRight size={16}/></span></Link></section>

    <section className="learning-method page-width"><div className="section-intro"><div><p className="eyebrow">{c('METODE / LIHAT → UBAH → PAHAMI', 'METHOD / SEE → CHANGE → UNDERSTAND')}</p><h2>{c('Jangan hafalkan geraknya.', 'Do not memorize the movement.')}<br/><em>{c('Pahami kenapa ia terjadi.', 'Understand why it happens.')}</em></h2></div><p>{c('Kode dan gerak berjalan berdampingan. Kamu mengubah satu hal, melihat hasilnya, lalu menghubungkan keduanya.', 'Code and motion sit side by side. Change one thing, see what happens, then connect the two.')}</p></div><div className="method-columns">{[{icon:Eye,n:'01',t:c('Amati', 'Observe'),d:c('Mulai dengan contoh nyata. Putar ulang, jeda, dan periksa gerakannya.', 'Start with a real example. Replay, pause, and inspect its movement.')},{icon:Code2,n:'02',t:c('Ubah', 'Change'),d:c('Atur nilai di kode. Jalankan lagi dan lihat dampaknya secara langsung.', 'Adjust a value in the code. Run it again and see the effect immediately.')},{icon:MousePointer2,n:'03',t:c('Rangkai', 'Compose'),d:c('Gunakan pemahamanmu dalam tantangan dan proyek yang lebih utuh.', 'Put what you learned to work in challenges and a complete project.')}].map(item => <div key={item.n}><div className="method-top"><item.icon size={20}/><span>{item.n}</span></div><h3>{item.t}</h3><p>{item.d}</p></div>)}</div></section>

    <section className="prerequisites page-width"><div><span className="eyebrow">{c('TITIK MULAI', 'YOUR STARTING POINT')}</span><h2>{c('Punya rasa ingin tahu? Sudah cukup.', 'Curiosity is a good enough start.')}</h2><p>{c('Sedikit HTML, selector CSS, dan JavaScript dasar akan membantu. Kami mengingatkan konsep yang dibutuhkan sambil berjalan.', 'A little HTML, CSS selectors, and basic JavaScript will help. We will revisit concepts when you need them.')}</p><div className="prerequisite-tags"><span>HTML</span><span>CSS</span><span>JavaScript</span></div></div><Link className="button primary" to="/learn/orientation">{c('Mulai bergerak', 'Start moving')}<ArrowUpRight size={17}/></Link></section>
  </div>
}
