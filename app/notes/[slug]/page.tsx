import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { getNote, notes, formatDate } from "@/lib/content"
import { notFound } from "next/navigation"

interface NotePageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all notes
export async function generateStaticParams() {
  return notes.map((note) => ({
    slug: note.slug,
  }))
}

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params
  const note = await getNote(slug)

  if (!note || !note.content) {
    notFound()
  }

  const content = note.content

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : note.title ||
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
            <div className="flex items-center gap-3 mb-3">
              <time className="font-mono text-sm text-muted-foreground">{formatDate(note.date)}</time>
              <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {note.topic}
              </span>
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
