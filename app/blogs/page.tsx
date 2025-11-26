import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { EmptyState } from "@/components/empty-state"
import { blogPosts, formatDate } from "@/lib/content"
import Link from "next/link"

export default function BlogsPage() {
  const hasPosts = blogPosts.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground">Blogs</h1>
          <p className="mt-3 font-serif text-base text-muted-foreground">
            Thoughts, reflections, and essays on AI, mathematics, and technology.
          </p>

          {hasPosts ? (
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
          ) : (
            <EmptyState type="blogs" />
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
