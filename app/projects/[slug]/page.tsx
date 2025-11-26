import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { getProject, projects } from "@/lib/content"
import { notFound } from "next/navigation"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all projects with slugs
export async function generateStaticParams() {
  return projects
    .filter((project) => project.slug)
    .map((project) => ({
      slug: project.slug,
    }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project || !project.content) {
    notFound()
  }

  const content = project.content

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : project.title ||
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
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-sm bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
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
