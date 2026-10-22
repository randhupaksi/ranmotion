import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import type { Scene, Locale } from '../../data/types'
import { previewDocument } from './previewDocument'
import { reportSchema } from './model'
import type { LabReport } from './model'
import type { LabDiagnostic } from './diagnostics'
export interface PreviewControls {
  send: (type: string, value?: number) => void
}
interface Props {
  scene: Scene
  locale: Locale
  reduced: boolean
  code: string | null
  comparison: boolean
  onReport: (report: LabReport) => void
  onError: (problem: LabDiagnostic) => void
  onState: (progress: number, paused: boolean) => void
  onActivate: () => void
}
const PreviewFrame = forwardRef<PreviewControls, Props>(function PreviewFrame(props, ref) {
  const frame = useRef<HTMLIFrameElement>(null)
  const token = useMemo(() => crypto.randomUUID(), [])
  const callbacks = useRef(props)
  callbacks.current = props
  const document = useMemo(
    () => previewDocument(props.scene, props.locale, token, props.comparison),
    [props.scene, props.locale, token, props.comparison],
  )
  useImperativeHandle(
    ref,
    () => ({
      send: (type, value) => frame.current?.contentWindow?.postMessage({ token, type, value }, '*'),
    }),
    [token],
  )
  useEffect(() => {
    const handle = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== 'null' ||
        event.data?.token !== token
      )
        return
      const data = event.data
      if (data.type === 'report') {
        const parsed = reportSchema.safeParse(data.report)
        if (parsed.success) callbacks.current.onReport(parsed.data)
      }
      if (data.type === 'error' && typeof data.message === 'string')
        callbacks.current.onError({
          message: data.message.slice(0, 400),
          line:
            Number.isInteger(data.line) && data.line > 0 && data.line <= 12001
              ? data.line
              : undefined,
          column:
            Number.isInteger(data.column) && data.column > 0 && data.column <= 12001
              ? data.column
              : undefined,
        })
      if (
        data.type === 'state' &&
        typeof data.progress === 'number' &&
        Number.isFinite(data.progress) &&
        typeof data.paused === 'boolean'
      )
        callbacks.current.onState(Math.min(1, Math.max(0, data.progress)), data.paused)
      if (data.type === 'activate') callbacks.current.onActivate()
    }
    window.addEventListener('message', handle)
    return () => window.removeEventListener('message', handle)
  }, [token])
  return (
    <iframe
      ref={frame}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      title={props.locale === 'id' ? 'Preview animasi GSAP' : 'GSAP animation preview'}
      srcDoc={document}
      onLoad={() => {
        if (props.code !== null)
          frame.current?.contentWindow?.postMessage(
            { token, type: 'run', code: props.code, reduced: props.reduced },
            '*',
          )
      }}
    />
  )
})
export default PreviewFrame
