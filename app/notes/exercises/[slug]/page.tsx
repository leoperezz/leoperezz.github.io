import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { exercises, formatDate } from "@/lib/content"

interface ExercisePageProps {
  params: Promise<{ slug: string }>
}

function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const colors = {
    Easy: "bg-green-500/10 text-green-600 dark:text-green-400",
    Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400",
  }
  return <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${colors[difficulty]}`}>{difficulty}</span>
}

const sampleExerciseContent = `# Lie Groups and Rotation Representations

This exercise explores different representations of rotations and their relationships through Lie group theory.

## Problem Statement

Given a rotation matrix $R \\in SO(3)$, find the corresponding:
1. Axis-angle representation $(\\hat{\\omega}, \\theta)$
2. Unit quaternion $q \\in S^3$
3. Euler angles $(\\phi, \\theta, \\psi)$

## Background

The rotation group $SO(3)$ is a Lie group with Lie algebra $\\mathfrak{so}(3)$:

$$
\\mathfrak{so}(3) = \\{A \\in \\mathbb{R}^{3 \\times 3} : A^T = -A\\}
$$

### Exponential Map

The exponential map $\\exp: \\mathfrak{so}(3) \\to SO(3)$ is given by Rodrigues' formula:

$$
\\exp([\\omega]_\\times \\theta) = I + \\sin\\theta [\\hat{\\omega}]_\\times + (1 - \\cos\\theta)[\\hat{\\omega}]_\\times^2
$$

## Exercise

### Part 1: Axis-Angle Extraction

Given:
$$
R = \\begin{pmatrix} 0 & -1 & 0 \\\\ 1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}
$$

Find $\\hat{\\omega}$ and $\\theta$.

### Part 2: Implementation

\`\`\`python
import numpy as np

def rotation_to_axis_angle(R):
    """Extract axis-angle from rotation matrix."""
    theta = np.arccos((np.trace(R) - 1) / 2)
    
    if np.abs(theta) < 1e-6:
        return np.array([0, 0, 1]), 0
    
    omega = (1 / (2 * np.sin(theta))) * np.array([
        R[2, 1] - R[1, 2],
        R[0, 2] - R[2, 0],
        R[1, 0] - R[0, 1]
    ])
    
    return omega / np.linalg.norm(omega), theta

# Test with the given rotation
R = np.array([
    [0, -1, 0],
    [1, 0, 0],
    [0, 0, 1]
])

axis, angle = rotation_to_axis_angle(R)
print(f"Axis: {axis}")
print(f"Angle: {np.degrees(angle)} degrees")
\`\`\`

## Solution

The rotation matrix represents a 90° rotation about the z-axis:
- $\\hat{\\omega} = (0, 0, 1)$
- $\\theta = \\frac{\\pi}{2}$
`

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { slug } = await params

  const exercise = exercises.find((e) => e.slug === slug)
  const content = exercise?.content || sampleExerciseContent

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : exercise?.title ||
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
            {exercise && (
              <div className="flex items-center gap-3 mb-3">
                <time className="font-mono text-sm text-muted-foreground">{formatDate(exercise.date)}</time>
                <DifficultyBadge difficulty={exercise.difficulty} />
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
