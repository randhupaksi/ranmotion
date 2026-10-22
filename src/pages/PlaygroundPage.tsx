import { lazy, Suspense, useEffect } from 'react'
import { ArrowUpRight, FlaskConical, ShieldCheck } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import { getLesson, getModuleLessons, modules } from '../data/curriculum'
import ErrorBoundary from '../components/ErrorBoundary'
const MotionLab=lazy(()=>import('../features/lab/MotionLab'))
export default function PlaygroundPage(){
  const {c,text}=useApp()
  const [params,setParams]=useSearchParams()
  const lesson=getLesson(params.get('example')??'to')??getLesson('to')!
  useEffect(()=>{document.title=`${c('Playground animasi','Animation playground')} — RanMotion`},[c])
  return <div className="page-width playground-page"><header className="playground-header"><div><p className="eyebrow"><FlaskConical size={13}/>{c('RUANG UNTUK MENCOBA','A LITTLE ROOM TO EXPERIMENT')}</p><h1>{c('Ikuti rasa ingin tahumu.','Follow your curiosity.')}</h1><p>{c('Pilih contoh, ubah kodenya, lihat apa yang terjadi. Tidak perlu takut salah.','Choose an example, change its code, and see what happens. It is a safe place to get things wrong.')}</p></div><Link className="text-link" to={`/learn/${lesson.id}`}>{c('Pelajari konsep ini','Learn this concept')}<ArrowUpRight size={15}/></Link></header><div className="playground-example-picker"><label htmlFor="example-select">{c('MULAI DARI SEBUAH CONTOH','START WITH AN EXAMPLE')}</label><select id="example-select" value={lesson.id} onChange={e=>setParams({example:e.target.value})}>{modules.map(m=><optgroup key={m.number} label={text(m.title)}>{getModuleLessons(m.number).map(l=><option key={l.id} value={l.id}>{text(l.title)} · {l.concept}</option>)}</optgroup>)}</select><span className="quiet-note">{c('Setiap contoh punya draf sendiri.','Each example keeps its own draft.')}</span></div><ErrorBoundary><Suspense fallback={<div className="lab-skeleton" role="status">{c('Menyiapkan ruang praktik…','Getting your playground ready…')}</div>}><MotionLab lesson={lesson} challenge={false} namespace="playground" key={lesson.id}/></Suspense></ErrorBoundary><div className="playground-bottom"><p><ShieldCheck size={14}/>{c('Kode berjalan di browser ini dan tidak dikirim ke server.','Your code runs in this browser and is not sent to a server.')}</p><Link className="text-link" to={`/learn/${lesson.id}#challenge`}>{c('Siap mencoba tantangannya?','Ready for the challenge?')}<ArrowUpRight size={14}/></Link></div></div>
}
