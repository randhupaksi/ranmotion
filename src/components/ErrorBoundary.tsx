import { Component } from 'react'
import type { ReactNode } from 'react'
import { RotateCw, TriangleAlert } from 'lucide-react'
import FeedbackState from './FeedbackState'
interface ErrorBoundaryProps {
  children: ReactNode
  fullScreen?: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return (
        <FeedbackState
          kind="error"
          fullScreen={this.props.fullScreen}
          icon={TriangleAlert}
          eyebrow="ERROR / 01"
          title="Bagian ini belum dapat dibuka / Unable to open this section"
          description="Progres belajar tetap tersimpan di perangkat ini. Muat ulang untuk mencoba lagi. / Your learning progress is still saved on this device. Reload to try again."
          action={
            <button className="button primary" onClick={() => location.reload()}>
              <RotateCw size={15} />
              Muat ulang / Reload
            </button>
          }
        />
      )
    return this.props.children
  }
}
