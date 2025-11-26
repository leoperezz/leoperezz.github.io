import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { getExercise, exercises, formatDate } from "@/lib/content"
import { notFound } from "next/navigation"

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

// Generate static params for all exercises
export async function generateStaticParams() {
  return exercises.map((exercise) => ({
    slug: exercise.slug,
  }))
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { slug } = await params
  const exercise = await getExercise(slug)

  if (!exercise || !exercise.content) {
    notFound()
  }

  const content = exercise.content

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch
    ? titleMatch[1]
    : exercise.title ||
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
              <time className="font-mono text-sm text-muted-foreground">{formatDate(exercise.date)}</time>
              <DifficultyBadge difficulty={exercise.difficulty} />
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
