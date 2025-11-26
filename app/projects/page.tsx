import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EmptyState } from "@/components/empty-state"
import { projects } from "@/lib/content"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ProjectsPage() {
  const hasProjects = projects.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="mt-3 font-serif text-base text-muted-foreground">
            Selected projects and ongoing investigations.
          </p>

          {hasProjects ? (
            <div className="mt-10 grid gap-6">
              {projects.map((project) => (
                <article
                  key={project.slug || project.title}
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
                    {/* // Link to project detail page if slug exists */}
                    {project.slug ? (
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                      >
                        Read more
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <a
                        href={project.link}
                        className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {project.linkLabel}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState type="projects" />
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
