import { useId } from 'react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

type FeedbackKind = 'empty' | 'error' | 'not-found'

interface FeedbackStateProps {
  kind?: FeedbackKind
  icon: LucideIcon
  eyebrow?: ReactNode
  title: ReactNode
  description: ReactNode
  action?: ReactNode
  compact?: boolean
  fullScreen?: boolean
  headingLevel?: 'h1' | 'h2'
  className?: string
}

export default function FeedbackState({
  kind = 'empty',
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  compact = false,
  fullScreen = false,
  headingLevel = 'h2',
  className = '',
}: FeedbackStateProps) {
  const titleId = useId()
  const descriptionId = useId()
  const Heading = headingLevel

  return (
    <section
      className={`feedback-state feedback-state--${kind}${compact ? ' feedback-state--compact' : ''}${fullScreen ? ' feedback-state--fullscreen' : ''}${className ? ` ${className}` : ''}`}
      role={kind === 'error' ? 'alert' : 'status'}
      aria-live={kind === 'error' ? 'assertive' : 'polite'}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="feedback-state__content">
        <div className="feedback-state__visual" aria-hidden="true">
          <span className="feedback-state__orbit" />
          <span className="feedback-state__signal" />
          <span className="feedback-state__icon">
            <Icon size={30} strokeWidth={1.7} />
          </span>
        </div>
        {eyebrow && <p className="feedback-state__eyebrow">{eyebrow}</p>}
        <Heading className="feedback-state__title" id={titleId}>
          {title}
        </Heading>
        <p className="feedback-state__description" id={descriptionId}>
          {description}
        </p>
        {action && <div className="feedback-state__actions">{action}</div>}
      </div>
    </section>
  )
}
