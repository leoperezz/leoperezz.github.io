"use client"

import React from "react"
import { createPortal } from "react-dom"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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

interface Reference {
  id: number
  text: string
  shortTitle: string
  url?: string
}

// Extract short title from reference text (usually in quotes)
function extractShortTitle(text: string): string {
  // Try to find title in quotes: "Title" or 'Title' or *Title*
  const quotedMatch = text.match(/[""]([^""]+)[""]|"([^"]+)"|'([^']+)'|\*([^*]+)\*/)
  if (quotedMatch) {
    return quotedMatch[1] || quotedMatch[2] || quotedMatch[3] || quotedMatch[4]
  }
  
  // If no quotes, try to get the first part before a period or comma
  const firstPart = text.split(/[.,]/)[0]?.trim()
  if (firstPart && firstPart.length < 80) {
    return firstPart
  }
  
  // Fallback: truncate if too long
  return text.length > 60 ? text.substring(0, 57) + "..." : text
}

// Parse references from the References/Referencias section
function parseReferences(content: string): Reference[] {
  const references: Reference[] = []
  
  // Match the references section (handles both "References" and "Referencias")
  const refSectionMatch = content.match(/##\s*(?:References|Referencias)\s*\n([\s\S]*?)(?=\n##|$)/i)
  if (!refSectionMatch) return references
  
  const refSection = refSectionMatch[1]
  
  // Match numbered list items with markdown links: "1. [text](url)" or just "1. text"
  const refPattern = /(\d+)\.\s*(?:\[([^\]]+)\]\(([^)]+)\)|(.+?)(?=\n\d+\.|\n*$))/g
  let match
  
  while ((match = refPattern.exec(refSection)) !== null) {
    const id = parseInt(match[1], 10)
    const text = match[2] || match[4]?.trim() || ""
    const url = match[3] || undefined
    
    if (text) {
      references.push({ 
        id, 
        text,
        shortTitle: extractShortTitle(text),
        url 
      })
    }
  }
  
  return references
}

// Preprocess content to convert [[n]] citations to a special marker
function preprocessCitations(content: string): string {
  // Replace [[n]] with a special marker that won't be affected by markdown parsing
  return content.replace(/\[\[(\d+)\]\]/g, '⟦cite:$1⟧')
}

// Citation tooltip component - uses portal to avoid HTML nesting issues
function CitationTooltip({ 
  reference, 
  onClose,
  position 
}: { 
  reference: Reference
  onClose: () => void
  position: { x: number; y: number }
}) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])
  
  useEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let newX = position.x
      let newY = position.y
      
      // Adjust horizontal position
      if (rect.right > viewportWidth - 16) {
        newX = viewportWidth - rect.width - 16
      }
      if (newX < 16) newX = 16
      
      // Adjust vertical position - show above if not enough space below
      if (rect.bottom > viewportHeight - 16) {
        newY = position.y - rect.height - 30
      }
      
      setAdjustedPosition({ x: newX, y: newY })
    }
  }, [position])
  
  const tooltipContent = (
    <div
      ref={tooltipRef}
      className="citation-tooltip"
      style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        zIndex: 9999
      }}
    >
      <div className="citation-tooltip-content">
        <span className="citation-tooltip-number">{reference.id}</span>
        <span className="citation-tooltip-text">
          <span className="citation-tooltip-title">{reference.shortTitle}</span>
          <span className="citation-tooltip-hint">Full references below</span>
          {reference.url && (
            <a 
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="citation-tooltip-link"
              onClick={(e) => e.stopPropagation()}
            >
              View source →
            </a>
          )}
        </span>
      </div>
    </div>
  )
  
  // Use portal to render tooltip at document body level
  if (!mounted) return null
  return createPortal(tooltipContent, document.body)
}

// Citation link component with tooltip on click
function CitationLink({ refId, references }: { refId: number; references: Reference[] }) {
  const reference = references.find(r => r.id === refId)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left,
        y: rect.bottom + 8
      })
    }
    
    setShowTooltip(!showTooltip)
  }
  
  if (!reference) {
    return <sup className="citation-badge">{refId}</sup>
  }
  
  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleClick}
        className="citation-link"
        aria-label={`Reference ${refId}: ${reference.shortTitle}`}
      >
        <span className="citation-badge">{refId}</span>
      </button>
      {showTooltip && (
        <CitationTooltip
          reference={reference}
          onClose={() => setShowTooltip(false)}
          position={tooltipPosition}
        />
      )}
    </>
  )
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
  const srcString = typeof src === "string" ? src : ""
  const isVideo = srcString.includes(".mp4") || srcString.includes(".webm") || srcString.includes(".mov") || srcString.includes("/video/")

  if (isVideo) {
    return (
      <figure className="my-6">
        <video src={srcString} controls autoPlay loop muted playsInline className="w-full rounded-lg border border-border">
          Your browser does not support the video tag.
        </video>
        {alt && <figcaption className="mt-2 text-center font-serif text-sm text-muted-foreground">{alt}</figcaption>}
      </figure>
    )
  }

  return (
    <figure className="my-6">
      <img src={srcString || "/placeholder.svg"} alt={alt || ""} className="w-full rounded-lg border border-border" />
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

// Helper to render text with citation links
function renderTextWithCitations(text: string, references: Reference[]): React.ReactNode {
  const parts = text.split(/(⟦cite:\d+⟧)/g)
  
  return parts.map((part, index) => {
    const citationMatch = part.match(/⟦cite:(\d+)⟧/)
    if (citationMatch) {
      const refId = parseInt(citationMatch[1], 10)
      return <CitationLink key={index} refId={refId} references={references} />
    }
    return part
  })
}

// Recursively process children to handle citations
function processChildren(children: React.ReactNode, references: Reference[]): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return renderTextWithCitations(child, references)
    }
    if (React.isValidElement(child)) {
      const childProps = child.props as { children?: React.ReactNode }
      if (childProps.children) {
        return React.cloneElement(child as React.ReactElement<any>, {
          ...childProps,
          children: processChildren(childProps.children, references)
        })
      }
    }
    return child
  })
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse references and preprocess citations
  const references = useMemo(() => parseReferences(content), [content])
  const processedContent = useMemo(() => preprocessCitations(content), [content])
  
  // Pre-generate all header IDs deterministically to avoid hydration mismatches
  const headerIdMap = useMemo(() => {
    const map = new Map<string, string>()
    const counts: Record<string, number> = {}
    
    // Extract all headers from the content
    const headerRegex = /^(#{1,6})\s+(.+)$/gm
    let match
    
    while ((match = headerRegex.exec(processedContent)) !== null) {
      const headerText = match[2]
      
      // Generate base ID from header text
      const baseId = headerText
        .toLowerCase()
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/`/g, '') // Remove code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/⟦cite:\d+⟧/g, '') // Remove citation markers
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      // Make ID unique by adding a counter if it already exists
      let id = baseId
      if (counts[baseId] !== undefined) {
        counts[baseId]++
        id = `${baseId}-${counts[baseId]}`
      } else {
        counts[baseId] = 0
      }
      
      map.set(headerText, id)
    }
    
    return map
  }, [processedContent])
  
  // Get pre-generated ID for a header
  const getHeaderId = useCallback((text: string): string => {
    return headerIdMap.get(text) || ''
  }, [headerIdMap])
  
  return (
    <div className="prose-custom">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children }) => {
            const text = String(children)
            const id = getHeaderId(text)
            return (
              <h1 id={id} className="mb-6 mt-10 font-sans text-3xl font-semibold tracking-tight text-foreground first:mt-0 scroll-mt-24">
                {processChildren(children, references)}
              </h1>
            )
          },
          h2: ({ children }) => {
            const text = String(children)
            const id = getHeaderId(text)
            // Check if this is the references section
            const isReferencesHeader = /references|referencias/i.test(text)
            
            if (isReferencesHeader) {
              return (
                <h2 
                  id={id}
                  className="references-header mb-4 mt-8 font-sans text-2xl font-semibold tracking-tight text-foreground scroll-mt-24"
                  data-references-section="true"
                >
                  {children}
                </h2>
              )
            }
            return (
              <h2 id={id} className="mb-4 mt-8 font-sans text-2xl font-semibold tracking-tight text-foreground scroll-mt-24">
                {processChildren(children, references)}
              </h2>
            )
          },
          h3: ({ children }) => {
            const text = String(children)
            const id = getHeaderId(text)
            return (
              <h3 id={id} className="mb-3 mt-6 font-sans text-xl font-medium text-foreground scroll-mt-24">
                {processChildren(children, references)}
              </h3>
            )
          },
          h4: ({ children }) => {
            const id = getHeaderId(String(children))
            return (
              <h4 id={id} className="mb-2 mt-4 font-sans text-lg font-medium text-foreground scroll-mt-24">
                {processChildren(children, references)}
              </h4>
            )
          },
          p: ({ children, node }) => {
            // Check if any child is an image element
            const hasImage = node?.children?.some((child: any) => child.type === "element" && child.tagName === "img")

            if (hasImage) {
              return <div className="mb-4">{children}</div>
            }

            return (
              <p className="mb-4 font-serif text-base leading-relaxed text-foreground/90">
                {processChildren(children, references)}
              </p>
            )
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
          ol: ({ children, node, start }) => {
            // Check if this is the references list by looking at preceding sibling
            // We detect this by checking if the ol comes right after an h2 with references
            const parent = node?.position
            const isRefList = node?.position && content.slice(0, node.position.start.offset || 0).match(/##\s*(?:References|Referencias)\s*\n\s*$/i)
            
            if (isRefList) {
              // Render children with proper indices
              const childArray = React.Children.toArray(children)
              return (
                <ol className="references-list mb-4 ml-6 list-decimal space-y-2 font-serif text-base text-foreground/90">
                  {childArray.map((child, index) => {
                    if (React.isValidElement(child)) {
                      return React.cloneElement(child as React.ReactElement<any>, {
                        'data-ref-index': index + 1,
                        key: index
                      })
                    }
                    return child
                  })}
                </ol>
              )
            }
            return (
              <ol className="mb-4 ml-6 list-decimal space-y-2 font-serif text-base text-foreground/90">
                {children}
              </ol>
            )
          },
          li: ({ children, node, ...props }) => {
            // Check if this li has a ref index (meaning it's in the references section)
            const refIndex = (props as any)['data-ref-index']
            
            if (refIndex) {
              return (
                <li 
                  id={`ref-${refIndex}`} 
                  className="reference-item leading-relaxed scroll-mt-24 transition-colors duration-500"
                >
                  {children}
                </li>
              )
            }
            return (
              <li className="leading-relaxed">
                {processChildren(children, references)}
              </li>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-2 border-primary/50 pl-6 font-serif italic text-muted-foreground">
              {processChildren(children, references)}
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
          img: ({ src, alt }) => <MediaElement src={typeof src === "string" ? src : ""} alt={alt || ""} />,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">
              {processChildren(children, references)}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic">
              {processChildren(children, references)}
            </em>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
