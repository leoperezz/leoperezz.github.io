import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    title: "Understanding the Mathematics of Neural Networks",
    excerpt:
      "Exploring the fundamental mathematical concepts behind neural networks, from linear algebra to optimization.",
    date: "2024-11-20",
    slug: "neural-networks-math",
  },
  {
    title: "Why Embodied AI is the Future of Robotics",
    excerpt: "Reflections on why embodied intelligence represents a paradigm shift in how we think about AI.",
    date: "2024-10-15",
    slug: "embodied-ai-future",
  },
  {
    title: "Building an AI Lab in Latin America",
    excerpt: "The challenges and opportunities of creating AI research infrastructure in the region.",
    date: "2024-09-08",
    slug: "ai-lab-latam",
  },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Blogs</h1>
          <p className="mt-3 font-serif text-base text-muted-foreground">
            Thoughts, reflections, and essays on AI, mathematics, and technology.
          </p>

          <div className="mt-10 space-y-8">
            {blogPosts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blogs/${post.slug}`} className="block">
                  <time className="font-mono text-xs text-muted-foreground">{formatDate(post.date)}</time>
                  <h2 className="mt-2 font-sans text-xl font-medium text-foreground transition-colors group-hover:text-muted-foreground">
                    {post.title}
                  </h2>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
