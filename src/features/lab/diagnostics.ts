export interface LabDiagnostic {
  message: string
  line?: number
  column?: number
}

export function explainRuntimeError(problem: LabDiagnostic, english: boolean): LabDiagnostic {
  let explanation = ''
  if (/ReferenceError:/.test(problem.message))
    explanation = english
      ? 'This name has not been defined. Check its spelling or create the value before using it.'
      : 'Nama ini belum didefinisikan. Periksa ejaannya atau buat nilainya sebelum digunakan.'
  else if (/TypeError:.*(null|undefined)/.test(problem.message))
    explanation = english
      ? 'A value or element is missing. If you used a selector, match it to the HTML tab.'
      : 'Ada nilai atau elemen yang belum ditemukan. Jika memakai selector, cocokkan dengan tab HTML.'
  else if (/SecurityError|Blocked a frame/.test(problem.message))
    explanation = english
      ? 'Preview code cannot access the main page or its storage. Work with the elements inside the preview.'
      : 'Kode preview tidak dapat mengakses halaman utama atau penyimpanannya. Gunakan elemen di dalam preview.'
  return explanation ? { ...problem, message: `${explanation}\n${problem.message}` } : problem
}

export async function validateCode(code: string, english: boolean): Promise<LabDiagnostic | null> {
  const message = (id: string, en: string) => (english ? en : id)
  if (!code.trim())
    return {
      message: message(
        'Editor masih kosong. Tulis tween atau gunakan Reset contoh.',
        'The editor is empty. Write a tween or use Reset example.',
      ),
    }
  if (code.length > 12000)
    return {
      message: message(
        'Contoh terlalu panjang. Batasi eksperimen hingga 12.000 karakter.',
        'This example is too long. Keep experiments below 12,000 characters.',
      ),
    }

  const { javascriptLanguage } = await import('@codemirror/lang-javascript')
  let diagnostic: LabDiagnostic | null = null
  javascriptLanguage.parser.parse(code).iterate({
    enter(node) {
      if (diagnostic) return false
      let detail = ''
      if (node.type.isError)
        detail = message(
          'Periksa sintaks: pastikan kurung, koma, dan tanda kutip berpasangan.',
          'Check syntax: make sure braces, commas, and quotes are balanced.',
        )
      else if (
        /^(ForStatement|WhileStatement|DoStatement|ImportDeclaration|ExportDeclaration)$/.test(
          node.name,
        )
      )
        detail = message(
          'Loop dan import belum didukung di latihan ini. GSAP, ScrollTrigger, dan MotionPathPlugin sudah tersedia; gunakan tween, timeline, atau event.',
          'Loops and imports are not supported in this exercise. GSAP, ScrollTrigger, and MotionPathPlugin are already available; use tweens, timelines, or events.',
        )
      if (detail) {
        const before = code.slice(0, node.from)
        diagnostic = {
          message: detail,
          line: before.split('\n').length,
          column: node.from - before.lastIndexOf('\n'),
        }
        return false
      }
    },
  })
  return diagnostic
}

// new Function adds two wrapper lines; our strict-mode directive adds one more.
export function userCodeLocation(stack: string): { line?: number; column?: number } {
  const match = /ranmotion-user-code\.js:(\d+):(\d+)/.exec(stack)
  if (!match || Number(match[1]) <= 3) return {}
  return { line: Number(match[1]) - 3, column: Number(match[2]) }
}
