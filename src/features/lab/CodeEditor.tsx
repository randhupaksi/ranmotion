import { useEffect, useRef } from 'react'
import { basicSetup } from 'codemirror'
import { EditorView, keymap } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'

const theme = EditorView.theme({
  '&': { color: '#dce6df', backgroundColor: '#0d120f', fontSize: '12px', height: '100%' },
  '.cm-scroller': { fontFamily: '"Geist Mono Variable", monospace', lineHeight: '1.9', overflow: 'auto' },
  '.cm-content': { padding: '18px 0', minHeight: '290px', caretColor: '#b5e6ae' },
  '.cm-line': { padding: '0 18px 0 8px' },
  '.cm-gutters': { backgroundColor: '#0d120f', color: '#59685e', border: 'none', padding: '0 7px' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#18211b' },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': { backgroundColor: '#3e5844 !important' },
  '&.cm-focused': { outline: 'none' },
}, { dark: true })
const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: '#c3aff1' }, { tag: tags.string, color: '#b5dba8' },
  { tag: tags.number, color: '#e8ca94' }, { tag: tags.comment, color: '#819187', fontStyle: 'italic' },
  { tag: tags.function(tags.variableName), color: '#b5e6ae' }, { tag: tags.propertyName, color: '#c0cfda' },
  { tag: tags.bool, color: '#e8ca94' },
])
export default function CodeEditor({ value, onChange, onRun, label }: { value: string; onChange: (value: string) => void; onRun: () => void; label: string }) {
  const parent = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const callbacks = useRef({ onChange, onRun })
  callbacks.current = { onChange, onRun }
  const external = useRef(false)
  useEffect(() => {
    if (!parent.current) return
    const editor = new EditorView({ parent: parent.current, doc: value, extensions: [basicSetup, javascript(), theme, syntaxHighlighting(highlight), EditorView.contentAttributes.of({ 'aria-label': label, spellcheck: 'false' }), keymap.of([{ key: 'Mod-Enter', run: () => { callbacks.current.onRun(); return true } }]), EditorView.updateListener.of(update => { if (update.docChanged && !external.current) callbacks.current.onChange(update.state.doc.toString()) })] })
    view.current = editor
    return () => { editor.destroy(); view.current = null }
  // The editor instance remains stable; external text changes are dispatched below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) { external.current = true; editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } }); external.current = false }
    if (editor) editor.contentDOM.setAttribute('aria-label', label)
  }, [value, label])
  return <div className="code-editor" ref={parent}/>
}
