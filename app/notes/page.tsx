import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface Note {
  title: string
  date: string
  slug: string
}

const notes: Note[] = [
  {
    title: "On the Homotopy Type of Configuration Spaces",
    date: "2024-11-15",
    slug: "homotopy-configuration-spaces",
  },
  {
    title: "A Brief Introduction to Symplectic Geometry for Roboticists",
    date: "2024-10-28",
    slug: "symplectic-geometry-robotics",
  },
  {
    title: "Notes on Riemannian Optimization",
    date: "2024-09-12",
    slug: "riemannian-optimization",
  },
  {
    title: "Category Theory and Robot Perception",
    date: "2024-08-03",
    slug: "category-theory-perception",
  },
  {
    title: "Implementing SE(3) Equivariant Networks in PyTorch",
    date: "2024-07-19",
    slug: "se3-equivariant-networks",
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function NotesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Math Garden</h1>
          <p className="mt-3 font-serif text-base text-muted-foreground">Working notes, proofs, and explorations.</p>

          <ul className="mt-10 divide-y divide-border/40">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link
                  href={`/notes/${note.slug}`}
                  className="group flex items-baseline justify-between gap-4 py-4 transition-colors"
                >
                  <span className="font-serif text-base text-foreground transition-colors group-hover:text-primary">
                    {note.title}
                  </span>
                  <time className="shrink-0 font-mono text-xs text-muted-foreground">{formatDate(note.date)}</time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  )
}
