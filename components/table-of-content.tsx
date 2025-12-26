"use client"

import { useEffect, useState } from "react"

export interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

// Extract headers from markdown content, ignoring code blocks
function extractHeaders(markdown: string): TocItem[] {
  const headers: TocItem[] = []
  const idCounts: Record<string, number> = {}
  
  // First, remove all code blocks (both ``` and indented code blocks)
  // This prevents # in code comments from being treated as headers
  let contentWithoutCode = markdown
  
  // Remove fenced code blocks (```...```)
  contentWithoutCode = contentWithoutCode.replace(/```[\s\S]*?```/g, '')
  
  // Remove indented code blocks (4 spaces or tab at start of line)
  contentWithoutCode = contentWithoutCode.replace(/^(    |\t).+$/gm, '')
  
  // Now extract headers from the cleaned content
  const lines = contentWithoutCode.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Match headers: # Header, ## Header, ### Header, etc.
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/)
    
    if (headerMatch) {
      const level = headerMatch[1].length
      const text = headerMatch[2]
        .replace(/\*\*/g, '') // Remove bold
        .replace(/\*/g, '') // Remove italic
        .replace(/`/g, '') // Remove code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
        .replace(/⟦cite:\d+⟧/g, '') // Remove citation markers
        .trim()
      
      // Create a base slug-like id from the text
      const baseId = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      // Skip "References" or "Referencias" headers
      if (!/^(references|referencias)$/i.test(text)) {
        // Make ID unique by adding a counter if it already exists
        let id = baseId
        if (idCounts[baseId] !== undefined) {
          idCounts[baseId]++
          id = `${baseId}-${idCounts[baseId]}`
        } else {
          idCounts[baseId] = 0
        }
        
        headers.push({ id, text, level })
      }
    }
  }
  
  return headers
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headers, setHeaders] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const extractedHeaders = extractHeaders(content)
    setHeaders(extractedHeaders)
  }, [content])

  useEffect(() => {
    // Observe headers in the page and update active state
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0
      }
    )

    // Find all header elements in the document
    headers.forEach((header) => {
      const element = document.getElementById(header.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headers])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const top = element.offsetTop - 100
      window.scrollTo({ top, behavior: "smooth" })
      setActiveId(id)
    }
  }

  if (headers.length === 0) {
    return null
  }

  return (
    <nav className="sticky top-24 hidden xl:block">
      <h3 className="mb-4 font-serif text-sm font-medium text-foreground">
        Table of Contents
      </h3>
      <ul className="space-y-2.5">
        {headers.map((header) => {
          const isActive = activeId === header.id
          const isH1 = header.level === 1
          const isH2 = header.level === 2
          const isH3 = header.level === 3
          
          return (
            <li
              key={header.id}
              style={{
                paddingLeft: isH1 ? '0' : isH2 ? '0.75rem' : '1.5rem'
              }}
            >
              <a
                href={`#${header.id}`}
                onClick={(e) => handleClick(e, header.id)}
                className={`
                  block font-serif text-sm leading-snug transition-colors
                  ${isActive 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                  ${isH1 ? 'font-medium' : ''}
                `}
              >
                {header.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

