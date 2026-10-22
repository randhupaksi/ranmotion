import { Component } from 'react'
import type { ReactNode } from 'react'
export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed)
      return (
        <div className="empty-state" role="alert">
          <h2>Bagian ini belum dapat dibuka / Unable to open this section</h2>
          <p>Progres tersimpan di perangkat ini. Muat ulang untuk mencoba lagi.</p>
          <button className="button primary" onClick={() => location.reload()}>
            Muat ulang / Reload
          </button>
        </div>
      )
    return this.props.children
  }
}
