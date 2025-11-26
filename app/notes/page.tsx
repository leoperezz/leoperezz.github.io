import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EmptyState } from "@/components/empty-state"
import { notes, exercises, formatDate } from "@/lib/content"
import Link from "next/link"

function DifficultyBadge({ difficulty }: { difficulty: "Easy" | "Medium" | "Hard" }) {
  const colors = {
    Easy: "bg-green-500/10 text-green-600 dark:text-green-400",
    Medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    Hard: "bg-red-500/10 text-red-600 dark:text-red-400",
  }
  return <span className={`rounded-full px-2 py-0.5 font-mono text-xs ${colors[difficulty]}`}>{difficulty}</span>
}

export default function NotesPage() {
  const hasNotes = notes.length > 0
  const hasExercises = exercises.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Notes</h1>
          <p className="mt-3 font-serif text-base text-muted-foreground">
            Course notes, topic summaries, and learning resources.
          </p>

          {/* Notes Section */}
          <h2 className="mt-12 font-sans text-xl font-medium text-foreground">Course Notes</h2>
          {hasNotes ? (
            <ul className="mt-6 divide-y divide-border/40">
              {notes.map((note) => (
                <li key={note.slug}>
                  <Link
                    href={`/notes/${note.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-serif text-base text-foreground transition-colors group-hover:text-primary">
                        {note.title}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">{note.topic}</span>
                    </div>
                    <time className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatDate(note.date, "short")}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState type="notes" />
          )}

          {/* Exercises Section */}
          <h2 className="mt-16 font-sans text-xl font-medium text-foreground">Exercises</h2>
          <p className="mt-2 font-serif text-sm text-muted-foreground">Practice problems and coding challenges.</p>
          {hasExercises ? (
            <ul className="mt-6 divide-y divide-border/40">
              {exercises.map((exercise) => (
                <li key={exercise.slug}>
                  <Link
                    href={`/notes/exercises/${exercise.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base text-foreground transition-colors group-hover:text-primary">
                        {exercise.title}
                      </span>
                      <DifficultyBadge difficulty={exercise.difficulty} />
                    </div>
                    <time className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatDate(exercise.date, "short")}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState type="exercises" />
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
