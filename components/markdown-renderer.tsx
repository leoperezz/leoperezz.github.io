"use client"

import { useState, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import mermaid from "mermaid"
import { Copy, Check } from "lucide-react"

interface MarkdownRendererProps {
  content: string
  onCopyAll?: () => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Copy code"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).Prism) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css"
      document.head.appendChild(link)

      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"
      script.async = true
      script.onload = () => {
        const autoloader = document.createElement("script")
        autoloader.src = "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"
        autoloader.async = true
        autoloader.onload = () => {
          if (codeRef.current && (window as any).Prism) {
            ;(window as any).Prism.highlightElement(codeRef.current)
          }
        }
        document.head.appendChild(autoloader)
      }
      document.head.appendChild(script)
    } else if (codeRef.current && (window as any).Prism) {
      setTimeout(() => {
        if (codeRef.current && (window as any).Prism) {
          ;(window as any).Prism.highlightElement(codeRef.current)
        }
      }, 100)
    }
  }, [children, language])

  return (
    <code ref={codeRef} className={`language-${language}`}>
      {children}
    </code>
  )
}

function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      fontFamily: "Inter, system-ui, sans-serif",
    })

    if (containerRef.current) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
    }
  }, [chart])

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4"
    />
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-6 mt-10 font-sans text-3xl font-semibold tracking-tight text-foreground first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-8 font-sans text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
          ),
          h3: ({ children }) => <h3 className="mb-3 mt-6 font-sans text-xl font-medium text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="mb-2 mt-4 font-sans text-lg font-medium text-foreground">{children}</h4>,
          p: ({ children }) => (
            <p className="mb-4 font-serif text-base leading-relaxed text-foreground/90">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-serif text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 font-serif text-base text-foreground/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 font-serif text-base text-foreground/90">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-primary/50 pl-6 font-serif italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "")
            const isInline = !match && !className

            if (isInline) {
              return (
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">{children}</code>
              )
            }

            const language = match?.[1] || "text"
            const codeString = String(children).replace(/\n$/, "")

            if (language === "mermaid") {
              return <MermaidDiagram chart={codeString} />
            }

            return <CodeBlock language={language}>{codeString}</CodeBlock>
          },
          pre: ({ children, ...props }) => {
            // Extract code content for copy button
            const codeElement = (children as any)?.props?.children
            const codeString = typeof codeElement === "string" ? codeElement : String(codeElement || "")

            return (
              <div className="relative my-6">
                <CopyButton text={codeString} />
                <pre className="overflow-x-auto rounded-lg border border-border bg-[#2d2d2d] p-4 pt-10 font-mono text-sm">
                  {children}
                </pre>
              </div>
            )
          },
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className="w-full border-collapse font-serif text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="border-b-2 border-border bg-muted/50">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-sans font-semibold text-foreground">{children}</th>
          ),
          td: ({ children }) => <td className="px-4 py-3 text-foreground/90">{children}</td>,
          hr: () => <hr className="my-8 border-border" />,
          img: ({ src, alt }) => (
            <figure className="my-6">
              <img src={src || "/placeholder.svg"} alt={alt || ""} className="rounded-lg border border-border" />
              {alt && (
                <figcaption className="mt-2 text-center font-serif text-sm text-muted-foreground">{alt}</figcaption>
              )}
            </figure>
          ),
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
