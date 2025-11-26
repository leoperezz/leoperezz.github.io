import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { notes, formatDate } from "@/lib/content"

interface NotePageProps {
  params: Promise<{ slug: string }>
}

const sampleNoteContent = `# Introduction to Differential Geometry

These are my notes from the differential geometry course, covering the fundamental concepts of curves, surfaces, and manifolds.

## 1. Curves in $\\mathbb{R}^n$

A parametrized curve is a smooth map $\\gamma: I \\to \\mathbb{R}^n$ where $I \\subseteq \\mathbb{R}$ is an interval.

### Arc Length

The arc length of a curve from $t=a$ to $t=b$ is:

$$
L(\\gamma) = \\int_a^b \\|\\gamma'(t)\\| \\, dt
$$

### Curvature

For a unit-speed curve, the curvature is:

$$
\\kappa(s) = \\|\\gamma''(s)\\|
$$

## 2. Surfaces

A regular surface is a subset $S \\subseteq \\mathbb{R}^3$ such that for every point $p \\in S$, there exists a neighborhood $V$ of $p$ and a map $\\mathbf{x}: U \\to V \\cap S$ that is:

1. **Smooth**: $\\mathbf{x}$ is infinitely differentiable
2. **Homeomorphism**: $\\mathbf{x}$ is a homeomorphism onto its image
3. **Regular**: $d\\mathbf{x}_q$ is injective for all $q \\in U$

### First Fundamental Form

$$
I = E \\, du^2 + 2F \\, du \\, dv + G \\, dv^2
$$

where:
- $E = \\langle \\mathbf{x}_u, \\mathbf{x}_u \\rangle$
- $F = \\langle \\mathbf{x}_u, \\mathbf{x}_v \\rangle$
- $G = \\langle \\mathbf{x}_v, \\mathbf{x}_v \\rangle$

## 3. Gaussian Curvature

The Gaussian curvature is defined as:

$$
K = \\kappa_1 \\cdot \\kappa_2
$$

where $\\kappa_1$ and $\\kappa_2$ are the principal curvatures.

### Theorema Egregium

Gauss's remarkable theorem states that $K$ depends only on the first fundamental form—it is an intrinsic property of the surface.

## Key Formulas

| Concept | Formula |
|---------|---------|
| Arc Length | $L = \\int \\|\\gamma'\\| \\, dt$ |
| Curvature | $\\kappa = \\|T'\\|$ |
| Gaussian Curvature | $K = \\kappa_1 \\kappa_2$ |
| Mean Curvature | $H = \\frac{1}{2}(\\kappa_1 + \\kappa_2)$ |
`

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params

  const note = notes.find((n) => n.slug === slug)
  const content = note?.content || sampleNoteContent

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : note?.title ||
      slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 py-12">
          <Link
            href="/notes"
            className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notes
          </Link>

          <header className="mb-10">
            {note && (
              <div className="flex items-center gap-3 mb-3">
                <time className="font-mono text-sm text-muted-foreground">{formatDate(note.date)}</time>
                <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {note.topic}
                </span>
              </div>
            )}
            <div className="flex items-start gap-3">
              <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl flex-1">
                {title}
              </h1>
              <CopyBlogButton content={content} />
            </div>
          </header>

          <MarkdownRenderer content={content} />
        </article>
      </main>
      <Footer />
    </div>
  )
}
