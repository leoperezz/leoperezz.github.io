import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { TableOfContents } from "@/components/table-of-content"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CopyBlogButton } from "@/components/copy-blog-button"
import { getBlogPost, blogPosts, formatDate } from "@/lib/content"
import { notFound } from "next/navigation"

interface BlogPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post || !post.content) {
    notFound()
  }

  const content = post.content

  // Prioritize post.title from content.ts, then fallback to markdown h1, then slug
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = post.title ||
    (titleMatch ? titleMatch[1] : null) ||
    slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex gap-12 justify-center">
            {/* Main article - centered and with fixed max-width */}
            <article className="w-full max-w-3xl flex-shrink-0">
              <Link
                href="/blogs"
                className="mb-8 inline-flex items-center gap-2 font-sans text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Link>

              <header className="mb-10">
                <time className="font-mono text-sm text-muted-foreground">{formatDate(post.date)}</time>
                <div className="flex items-start gap-3 mt-3">
                  <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground sm:text-4xl flex-1">
                    {title}
                  </h1>
                  <CopyBlogButton content={content} />
                </div>
              </header>

              <MarkdownRenderer content={content} />
            </article>

            {/* Table of Contents - on the right side */}
            <aside className="hidden xl:block w-64 flex-shrink-0">
              <TableOfContents content={content} />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
