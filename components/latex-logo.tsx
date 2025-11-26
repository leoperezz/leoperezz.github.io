export function LatexLogo() {
  // Using Unicode math symbols: ∇ (nabla), 𝓛 (script L), superscript p
  return (
    <span className="text-xl tracking-tight" title="nabla script-L superscript p">
      <span>∇</span>
      <span className="italic">𝓛</span>
      <sup className="text-xs align-super">{"\n"}</sup>
    </span>
  )
}
