import { useLocation } from 'react-router-dom'
import { useApp } from '../app/AppProvider'
import './loadingSkeleton.css'

type LineSize = 'eyebrow' | 'small' | 'copy' | 'heading' | 'title' | 'control'
type SectionSkeletonProps = {
  label?: string
  variant?: 'lab' | 'concept' | 'demo' | 'editor'
}

function Line({ width = '100%', size = 'copy' }: { width?: string; size?: LineSize }) {
  return <span className={`rm-skeleton__line rm-skeleton__line--${size}`} style={{ width }} />
}

function Lines({ count = 3, compact = false }: { count?: number; compact?: boolean }) {
  const widths = ['100%', '88%', '69%', '93%']
  return (
    <div className={`rm-skeleton__lines${compact ? ' rm-skeleton__lines--compact' : ''}`}>
      {Array.from({ length: count }, (_, index) => (
        <Line key={index} width={widths[index % widths.length]} />
      ))}
    </div>
  )
}

function PageHeader({ progress = false }: { progress?: boolean }) {
  return (
    <header
      className={`rm-skeleton__page-header${progress ? ' rm-skeleton__page-header--progress' : ''}`}
    >
      <div className="rm-skeleton__header-copy">
        <Line width="146px" size="eyebrow" />
        <Line width="min(530px, 80vw)" size="title" />
        <Line width="min(400px, 66vw)" size="title" />
        <div className="rm-skeleton__header-lead">
          <Lines count={2} />
        </div>
      </div>
      {progress && (
        <div className="rm-skeleton__journey-card">
          <Line width="90px" size="eyebrow" />
          <Line width="72px" size="title" />
          <Line width="100%" size="control" />
          <Line width="116px" size="copy" />
        </div>
      )}
    </header>
  )
}

function Toolbar({ tabs = 3 }: { tabs?: number }) {
  return (
    <div className="rm-skeleton__toolbar">
      <div className="rm-skeleton__tabs">
        {Array.from({ length: tabs }, (_, index) => (
          <Line key={index} width={`${58 + index * 13}px`} size="control" />
        ))}
      </div>
      <Line width="min(260px, 38vw)" size="control" />
    </div>
  )
}

function ModuleRows({ count = 3 }: { count?: number }) {
  return (
    <div className="rm-skeleton__modules">
      {Array.from({ length: count }, (_, index) => (
        <div className="rm-skeleton__module" key={index}>
          <Line width="30px" size="eyebrow" />
          <div>
            <Line width={`${47 + index * 9}%`} size="heading" />
            <Line width="62%" size="copy" />
          </div>
          <div className="rm-skeleton__module-progress">
            <Line width="54px" size="eyebrow" />
            <Line width="100%" size="small" />
          </div>
          <Line width="18px" size="eyebrow" />
        </div>
      ))}
    </div>
  )
}

function Workspace({ dense = false }: { dense?: boolean }) {
  return (
    <div className={`rm-skeleton__workspace${dense ? ' rm-skeleton__workspace--dense' : ''}`}>
      <div className="rm-skeleton__workspace-bar">
        <div className="rm-skeleton__workspace-tabs">
          <Line width="67px" size="eyebrow" />
          <Line width="42px" size="eyebrow" />
          <Line width="38px" size="eyebrow" />
        </div>
        <Line width="18px" size="eyebrow" />
      </div>
      <div className="rm-skeleton__workspace-main">
        <div className="rm-skeleton__code">
          <Lines count={dense ? 9 : 7} compact />
        </div>
        <div className="rm-skeleton__preview">
          <Line width="110px" size="eyebrow" />
          <div className="rm-skeleton__preview-mark" />
          <Line width="58%" size="copy" />
        </div>
      </div>
      <div className="rm-skeleton__workspace-controls">
        <Line width="126px" size="control" />
        <Line width="100%" size="small" />
      </div>
    </div>
  )
}

function HomeSkeleton() {
  return (
    <div className="rm-skeleton__home">
      <section className="rm-skeleton__hero">
        <div className="rm-skeleton__hero-copy">
          <Line width="205px" size="eyebrow" />
          <Line width="min(500px, 73vw)" size="title" />
          <Line width="min(365px, 58vw)" size="title" />
          <div className="rm-skeleton__hero-lead">
            <Lines count={3} />
          </div>
          <div className="rm-skeleton__actions">
            <Line width="214px" size="control" />
          </div>
          <Line width="185px" size="eyebrow" />
        </div>
        <div className="rm-skeleton__demo-shell">
          <div className="rm-skeleton__demo-label">
            <Line width="120px" size="eyebrow" />
            <Line width="142px" size="heading" />
          </div>
          <div className="rm-skeleton__demo-panel">
            <Line width="92px" size="eyebrow" />
            <div className="rm-skeleton__demo-stage">
              <span />
              <i />
            </div>
            <Lines count={3} compact />
          </div>
        </div>
      </section>
      <div className="rm-skeleton__facts">
        <Line width="124px" size="eyebrow" />
        <Line width="75px" size="heading" />
        <Line width="75px" size="heading" />
        <Line width="75px" size="heading" />
      </div>
      <section className="rm-skeleton__home-path">
        <div>
          <Line width="138px" size="eyebrow" />
          <Line width="min(380px, 70vw)" size="title" />
          <Lines count={2} />
        </div>
        <ModuleRows count={3} />
      </section>
    </div>
  )
}

function LearnSkeleton() {
  return (
    <>
      <PageHeader progress />
      <div className="rm-skeleton__path-meta">
        <Line width="148px" size="copy" />
        <Line width="76px" size="copy" />
        <Line width="145px" size="copy" />
      </div>
      <div className="rm-skeleton__entry-routes">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index}>
            <Line width="24px" size="eyebrow" />
            <Line width={`${54 + index * 8}%`} size="heading" />
            <Line width="86%" size="copy" />
          </div>
        ))}
      </div>
      <Toolbar />
      <ModuleRows />
    </>
  )
}

function LessonSkeleton() {
  return (
    <div className="rm-skeleton__lesson-layout">
      <aside className="rm-skeleton__lesson-sidebar">
        <Line width="105px" size="copy" />
        <Line width="145px" size="eyebrow" />
        <Line width="100%" size="small" />
        <div className="rm-skeleton__sidebar-links">
          <Line width="100%" size="control" />
          <Line width="86%" size="control" />
          <Line width="76%" size="control" />
          <Line width="92%" size="control" />
        </div>
      </aside>
      <div className="rm-skeleton__lesson-content">
        <div className="rm-skeleton__lesson-crumbs">
          <Line width="58px" size="eyebrow" />
          <Line width="105px" size="eyebrow" />
        </div>
        <Line width="106px" size="eyebrow" />
        <Line width="min(500px, 72vw)" size="title" />
        <Lines count={2} />
        <div className="rm-skeleton__lesson-nav">
          <Line width="66px" size="control" />
          <Line width="88px" size="control" />
          <Line width="78px" size="control" />
        </div>
        <div className="rm-skeleton__objective">
          <Line width="20px" size="heading" />
          <div>
            <Line width="175px" size="heading" />
            <Line width="84%" size="copy" />
          </div>
        </div>
        <section className="rm-skeleton__reading">
          <Line width="125px" size="eyebrow" />
          <Line width="245px" size="heading" />
          <Lines count={3} />
        </section>
        <Workspace />
      </div>
    </div>
  )
}

function PlaygroundSkeleton() {
  return (
    <>
      <div className="rm-skeleton__playground-header">
        <div>
          <Line width="164px" size="eyebrow" />
          <Line width="min(420px, 74vw)" size="title" />
          <Lines count={2} />
        </div>
        <Line width="142px" size="control" />
      </div>
      <div className="rm-skeleton__picker">
        <Line width="150px" size="eyebrow" />
        <Line width="min(460px, 100%)" size="control" />
        <Line width="180px" size="copy" />
      </div>
      <Workspace dense />
    </>
  )
}

function ChallengesSkeleton() {
  return (
    <>
      <PageHeader />
      <div className="rm-skeleton__challenge-overview">
        <Line width="21px" size="heading" />
        <Line width="104px" size="title" />
        <Line width="100%" size="small" />
        <Line width="132px" size="control" />
      </div>
      <Toolbar />
      <div className="rm-skeleton__challenge-list">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index}>
            <div className="rm-skeleton__challenge-meta">
              <Line width="34px" size="eyebrow" />
              <Line width="110px" size="eyebrow" />
            </div>
            <div>
              <Line width={`${52 + index * 9}%`} size="heading" />
              <Lines count={2} compact />
            </div>
            <Line width="92px" size="control" />
          </div>
        ))}
      </div>
    </>
  )
}

function ProgressSkeleton() {
  return (
    <>
      <PageHeader />
      <div className="rm-skeleton__progress-summary">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index}>
            <Line width="74px" size="title" />
            <Line width="116px" size="copy" />
          </div>
        ))}
      </div>
      <div className="rm-skeleton__next-lesson">
        <Line width="115px" size="eyebrow" />
        <Line width="min(340px, 70vw)" size="heading" />
        <Lines count={2} />
        <Line width="138px" size="control" />
      </div>
      <div className="rm-skeleton__progress-map">
        <Line width="180px" size="heading" />
        <ModuleRows count={3} />
      </div>
    </>
  )
}

function ReferenceSkeleton() {
  return (
    <>
      <PageHeader />
      <Toolbar tabs={2} />
      <div className="rm-skeleton__reference-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <article key={index}>
            <Line width="94px" size="eyebrow" />
            <Line width={`${51 + index * 11}%`} size="heading" />
            <Lines count={2} compact />
            <div className="rm-skeleton__code-block">
              <Lines count={4} compact />
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function routeVariant(pathname: string) {
  if (pathname === '/') return 'home'
  if (pathname === '/learn') return 'learn'
  if (pathname.startsWith('/learn/')) return 'lesson'
  if (pathname === '/playground') return 'playground'
  if (pathname === '/challenges') return 'challenges'
  if (pathname === '/progress') return 'progress'
  if (pathname === '/reference') return 'reference'
  return 'default'
}

function RouteSkeletonContent({ variant }: { variant: string }) {
  switch (variant) {
    case 'home':
      return <HomeSkeleton />
    case 'learn':
      return <LearnSkeleton />
    case 'lesson':
      return <LessonSkeleton />
    case 'playground':
      return <PlaygroundSkeleton />
    case 'challenges':
      return <ChallengesSkeleton />
    case 'progress':
      return <ProgressSkeleton />
    case 'reference':
      return <ReferenceSkeleton />
    default:
      return <PageHeader />
  }
}

export function RouteSkeleton() {
  const { pathname } = useLocation()
  const { c } = useApp()
  const variant = routeVariant(pathname)
  return (
    <div
      className={`rm-skeleton rm-skeleton--${variant} page-width`}
      role="status"
      aria-busy="true"
      aria-label={c('Memuat halaman', 'Loading page')}
      data-route-loading=""
    >
      <span className="rm-skeleton__indicator" aria-hidden="true" />
      <div className="rm-skeleton__content" aria-hidden="true">
        <RouteSkeletonContent variant={variant} />
      </div>
    </div>
  )
}

export function SectionLoadingSkeleton({ label, variant = 'lab' }: SectionSkeletonProps) {
  const { c } = useApp()
  const resolvedLabel = label ?? c('Menyiapkan bagian ini', 'Preparing this section')
  if (variant === 'demo') {
    return (
      <div
        className="rm-section-skeleton rm-section-skeleton--demo"
        role="status"
        aria-label={resolvedLabel}
      >
        <div className="rm-section-skeleton__demo-top">
          <Line width="96px" size="eyebrow" />
          <Line width="73px" size="eyebrow" />
        </div>
        <div className="rm-section-skeleton__demo-stage">
          <span />
          <i />
        </div>
        <Lines count={3} compact />
      </div>
    )
  }

  if (variant === 'concept') {
    return (
      <div
        className="rm-section-skeleton rm-section-skeleton--concept"
        role="status"
        aria-label={resolvedLabel}
      >
        <div className="rm-section-skeleton__concept-roles">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index}>
              <Line width="22px" size="eyebrow" />
              <Line width="78px" size="heading" />
              <Line width="90%" size="copy" />
            </div>
          ))}
        </div>
        <Line width="128px" size="eyebrow" />
        <Line width="260px" size="heading" />
        <div className="rm-section-skeleton__concept-stage">
          <span />
          <i />
        </div>
        <div className="rm-section-skeleton__concept-controls">
          <Line width="138px" size="control" />
          <Line width="28px" size="control" />
          <Line width="100%" size="small" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rm-section-skeleton rm-section-skeleton--${variant}`}
      role="status"
      aria-busy="true"
      aria-label={resolvedLabel}
    >
      <Workspace dense={variant === 'editor'} />
    </div>
  )
}
