import { useEffect, useId, useRef } from 'react'
import { basicSetup } from 'codemirror'
import { Decoration, EditorView, keymap, WidgetType } from '@codemirror/view'
import type { DecorationSet } from '@codemirror/view'
import { StateEffect, StateField } from '@codemirror/state'
import { javascript } from '@codemirror/lang-javascript'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import type { LabDiagnostic } from './diagnostics'

class ErrorMessage extends WidgetType {
  readonly message: string
  readonly id: string
  constructor(message: string, id: string) {
    super()
    this.message = message
    this.id = id
  }
  eq(other: ErrorMessage) {
    return this.message === other.message && this.id === other.id
  }
  toDOM() {
    const element = document.createElement('div')
    element.className = 'cm-code-error'
    element.id = this.id
    element.setAttribute('role', 'alert')
    element.textContent = this.message
    return element
  }
}
const setProblem = StateEffect.define<{
  problem: LabDiagnostic | null
  label: string
  id: string
}>()
const problems = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(decorations, transaction) {
    if (transaction.docChanged) decorations = Decoration.none
    for (const effect of transaction.effects) {
      if (!effect.is(setProblem)) continue
      const { problem, label, id } = effect.value
      if (!problem) return Decoration.none
      const line = transaction.state.doc.line(
        Math.min(
          transaction.state.doc.lines,
          Math.max(1, problem.line ?? transaction.state.doc.lines),
        ),
      )
      const marks = [
        Decoration.widget({ widget: new ErrorMessage(label, id), block: true, side: 1 }).range(
          line.to,
        ),
      ]
      if (problem.line) {
        marks.push(Decoration.line({ class: 'cm-error-line' }).range(line.from))
        const from = Math.min(line.to, line.from + Math.max(0, (problem.column ?? 1) - 1))
        if (from < line.to)
          marks.push(Decoration.mark({ class: 'cm-error-underline' }).range(from, line.to))
      }
      decorations = Decoration.set(marks, true)
    }
    return decorations
  },
  provide: field => EditorView.decorations.from(field),
})

const theme = EditorView.theme(
  {
    '&': { color: '#dce6df', backgroundColor: '#0d120f', fontSize: '12px', height: '100%' },
    '.cm-scroller': {
      fontFamily: '"Geist Mono Variable", monospace',
      lineHeight: '1.9',
      overflow: 'auto',
    },
    '.cm-content': { padding: '18px 0', minHeight: '290px', caretColor: '#b5e6ae' },
    '.cm-line': { padding: '0 18px 0 8px' },
    '.cm-gutters': {
      backgroundColor: '#0d120f',
      color: '#59685e',
      border: 'none',
      padding: '0 7px',
    },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#18211b' },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
      backgroundColor: '#3e5844 !important',
    },
    '&.cm-focused': { outline: 'none' },
  },
  { dark: true },
)
const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#c3aff1' },
  { tag: tags.string, color: '#b5dba8' },
  { tag: tags.number, color: '#e8ca94' },
  { tag: tags.comment, color: '#819187', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#b5e6ae' },
  { tag: tags.propertyName, color: '#c0cfda' },
  { tag: tags.bool, color: '#e8ca94' },
])
export default function CodeEditor({
  value,
  onChange,
  onRun,
  label,
  problem = null,
  problemLabel = '',
  focusRequest,
}: {
  value: string
  onChange: (value: string) => void
  onRun: () => void
  label: string
  problem?: LabDiagnostic | null
  problemLabel?: string
  focusRequest?: { key: number; line?: number }
}) {
  const diagnosticId = useId()
  const parent = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const callbacks = useRef({ onChange, onRun })
  callbacks.current = { onChange, onRun }
  const external = useRef(false)
  useEffect(() => {
    if (!parent.current) return
    const editor = new EditorView({
      parent: parent.current,
      doc: value,
      extensions: [
        basicSetup,
        problems,
        javascript(),
        theme,
        syntaxHighlighting(highlight),
        EditorView.contentAttributes.of({
          'aria-label': label,
          spellcheck: 'false',
          tabindex: '0',
        }),
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              callbacks.current.onRun()
              return true
            },
          },
        ]),
        EditorView.updateListener.of(update => {
          if (update.docChanged && !external.current)
            callbacks.current.onChange(update.state.doc.toString())
        }),
      ],
    })
    view.current = editor
    return () => {
      editor.destroy()
      view.current = null
    }
    // The editor instance remains stable; external text changes are dispatched below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) {
      external.current = true
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
      external.current = false
    }
    if (editor) editor.contentDOM.setAttribute('aria-label', label)
  }, [value, label])
  useEffect(() => {
    const editor = view.current
    if (!editor) return
    editor.dispatch({ effects: setProblem.of({ problem, label: problemLabel, id: diagnosticId }) })
    editor.contentDOM.setAttribute('aria-invalid', String(Boolean(problem)))
    if (problem) editor.contentDOM.setAttribute('aria-describedby', diagnosticId)
    else editor.contentDOM.removeAttribute('aria-describedby')
  }, [problem, problemLabel, diagnosticId])
  useEffect(() => {
    const editor = view.current
    if (!editor || !focusRequest) return
    const line = editor.state.doc.line(
      Math.min(editor.state.doc.lines, Math.max(1, focusRequest.line ?? 1)),
    )
    editor.dispatch({
      selection: { anchor: line.from },
      effects: EditorView.scrollIntoView(line.from, { y: 'center' }),
    })
    editor.focus()
  }, [focusRequest])
  return <div className="code-editor" ref={parent} />
}
