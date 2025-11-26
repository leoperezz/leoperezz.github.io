import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ExternalLink } from "lucide-react"

interface Project {
  title: string
  description: string
  tags: string[]
  link: string
  linkLabel: string
}

const projects: Project[] = [
  {
    title: "Topological Methods in Robot Motion Planning",
    description:
      "Investigating the application of algebraic topology to configuration spaces, with implications for motion planning algorithms in high-dimensional robotic systems.",
    tags: ["Topology", "Motion Planning", "Configuration Spaces"],
    link: "#",
    linkLabel: "View PDF",
  },
  {
    title: "Neural Implicit Representations for 3D Scene Understanding",
    description:
      "Exploring coordinate-based neural networks for encoding spatial information, with applications to robot perception and manipulation tasks.",
    tags: ["Computer Vision", "Neural Networks", "3D Reconstruction"],
    link: "#",
    linkLabel: "GitHub",
  },
  {
    title: "Geometric Control on Lie Groups",
    description:
      "Studying the mathematical foundations of geometric control theory and its applications to autonomous systems operating on non-Euclidean manifolds.",
    tags: ["Control Theory", "Lie Groups", "Differential Geometry"],
    link: "#",
    linkLabel: "View PDF",
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="mt-3 font-serif text-base text-muted-foreground">
            Selected projects and ongoing investigations.
          </p>

          <div className="mt-10 grid gap-6">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group rounded-lg border border-border/60 bg-card p-6 transition-colors hover:border-border"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <h2 className="font-sans text-lg font-medium text-foreground">{project.title}</h2>
                    <p className="font-serif text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-sm bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <a
                    href={project.link}
                    className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {project.linkLabel}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
