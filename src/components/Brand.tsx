export function BrandMark() {
  return <span className="brand-symbol" aria-hidden="true"><i/><i/><i/><b/></span>
}

export default function Brand({ small = false }: { small?: boolean }) {
  return <span className={`brand${small ? ' brand-small' : ''}`}><BrandMark/><span>ranmotion<span className="brand-dot">.</span></span></span>
}
