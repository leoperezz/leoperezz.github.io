"use client"

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import mermaid from "mermaid"
import { Copy, Check, X, ZoomIn, ZoomOut, Move } from "lucide-react"

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

function MermaidPlayground({ svg, onClose }: { svg: string; onClose: () => void }) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5))
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    },
    [position],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        })
      }
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.1 : 0.1
    setScale((prev) => Math.max(0.5, Math.min(3, prev + delta)))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        className="relative z-10 flex h-[85vh] w-[90vw] max-w-5xl flex-col rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with controls */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-medium text-foreground">Mermaid Diagram</span>
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
              {Math.round(scale * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleReset}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Reset view"
            >
              <Move className="h-4 w-4" />
            </button>
            <div className="mx-2 h-4 w-px bg-border" />
            <button
              onClick={onClose}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Diagram area */}
        <div
          ref={containerRef}
          className="flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="flex h-full w-full items-center justify-center p-8"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.1s ease-out",
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2">
          <p className="text-center font-mono text-xs text-muted-foreground">
            Scroll to zoom • Drag to pan • Press ESC or click outside to close
          </p>
        </div>
      </div>
    </div>
  )
}

function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      fontFamily: "Inter, system-ui, sans-serif",
    })

    if (containerRef.current) {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
      mermaid.render(id, chart).then(({ svg }) => {
        setSvg(svg)
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      })
    }
  }, [chart])

  return (
    <>
      <div
        className="group relative my-6 cursor-pointer overflow-x-auto rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
        onClick={() => setIsPlaygroundOpen(true)}
      >
        <div ref={containerRef} className="flex justify-center" />
        <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-opacity group-hover:bg-background/50 group-hover:opacity-100">
          <span className="rounded-md bg-primary px-3 py-1.5 font-sans text-sm font-medium text-primary-foreground">
            Click to expand
          </span>
        </div>
      </div>
      {isPlaygroundOpen && <MermaidPlayground svg={svg} onClose={() => setIsPlaygroundOpen(false)} />}
    </>
  )
}

function MediaElement({ src, alt }: { src: string; alt: string }) {
  const isVideo = src.includes(".mp4") || src.includes(".webm") || src.includes(".mov") || src.includes("/video/")

  if (isVideo) {
    return (
      <figure className="my-6">
        <video src={src} controls autoPlay loop muted playsInline className="w-full rounded-lg border border-border">
          Your browser does not support the video tag.
        </video>
        {alt && <figcaption className="mt-2 text-center font-serif text-sm text-muted-foreground">{alt}</figcaption>}
      </figure>
    )
  }

  return (
    <figure className="my-6">
      <img src={src || "/placeholder.svg"} alt={alt || ""} className="w-full rounded-lg border border-border" />
      {alt && <figcaption className="mt-2 text-center font-serif text-sm text-muted-foreground">{alt}</figcaption>}
    </figure>
  )
}

function hasMediaContent(children: React.ReactNode): boolean {
  if (!children) return false

  const childArray = React.Children.toArray(children)
  return childArray.some((child) => {
    if (typeof child === "object" && child !== null && "props" in child) {
      const props = child.props as any
      // Check if it's an img element (which gets converted to MediaElement)
      if (props?.node?.tagName === "img") return true
      if (
        props?.src &&
        (props.src.includes(".mp4") ||
          props.src.includes(".webm") ||
          props.src.includes(".mov") ||
          props.src.includes("/video/") ||
          props.src.includes(".png") ||
          props.src.includes(".jpg") ||
          props.src.includes(".jpeg") ||
          props.src.includes(".gif") ||
          props.src.includes(".webp") ||
          props.src.includes("/image/"))
      )
        return true
    }
    return false
  })
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
          p: ({ children, node }) => {
            // Check if any child is an image element
            const hasImage = node?.children?.some((child: any) => child.type === "element" && child.tagName === "img")

            if (hasImage) {
              return <div className="mb-4">{children}</div>
            }

            return <p className="mb-4 font-serif text-base leading-relaxed text-foreground/90">{children}</p>
          },
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
          img: ({ src, alt }) => <MediaElement src={src || ""} alt={alt || ""} />,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
