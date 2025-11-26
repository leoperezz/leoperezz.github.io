import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { projects } from "@/lib/content"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

const sampleProjectContent = `# Topological Methods in Robot Motion Planning

This project investigates the application of algebraic topology to configuration spaces, with implications for motion planning algorithms in high-dimensional robotic systems.

## Overview

Motion planning is a fundamental problem in robotics: given a robot and an environment with obstacles, find a collision-free path from start to goal. While this seems straightforward, the complexity grows exponentially with the robot's degrees of freedom.

## Mathematical Framework

The configuration space $\\mathcal{C}$ of a robot is the space of all possible configurations. For a robot with $n$ joints, this is typically:

$$
\\mathcal{C} \\subseteq \\mathbb{R}^n \\text{ or } \\mathcal{C} \\subseteq (S^1)^n
$$

The free configuration space $\\mathcal{C}_{free}$ is obtained by removing obstacle regions:

$$
\\mathcal{C}_{free} = \\mathcal{C} \\setminus \\mathcal{C}_{obs}
$$

## Topological Complexity

The topological complexity $TC(X)$ of a space $X$ measures the minimum number of "motion planning rules" needed:

$$
TC(X) = \\min\\{k : X \\times X = U_1 \\cup \\cdots \\cup U_k\\}
$$

where each $U_i$ admits a continuous motion planning section.

## Implementation

\`\`\`python
import numpy as np
from scipy.spatial import KDTree

class ConfigurationSpace:
    def __init__(self, dim, bounds):
        self.dim = dim
        self.bounds = bounds
        self.obstacles = []
    
    def add_obstacle(self, obstacle):
        self.obstacles.append(obstacle)
    
    def is_free(self, config):
        for obs in self.obstacles:
            if obs.contains(config):
                return False
        return True
    
    def sample_free(self, n_samples=1000):
        samples = []
        while len(samples) < n_samples:
            config = np.random.uniform(
                self.bounds[:, 0],
                self.bounds[:, 1]
            )
            if self.is_free(config):
                samples.append(config)
        return np.array(samples)
\`\`\`

## Results

Our approach reduces planning time by leveraging topological properties of the configuration space.
`

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params

  const project = projects.find((p) => p.slug === slug)
  const content = project?.content || sampleProjectContent

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : project?.title ||
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
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <header className="mb-10">
            <div className="flex items-start gap-3 mt-3">
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
