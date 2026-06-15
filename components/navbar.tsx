"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { LatexLogo } from "./latex-logo"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const navItems = [
    { name: "About", href: "/" },
    { name: "Blogs", href: "/blogs" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-foreground transition-colors hover:text-foreground/70"
          title="Leonardo Pérez"
        >
          <LatexLogo />
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <div className="hidden items-center gap-6 sm:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-sans text-sm font-medium transition-colors hover:text-foreground ${
                  pathname === item.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background/95 backdrop-blur-sm sm:hidden">
          <div className="mx-auto flex max-w-4xl flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-3 py-2 font-sans text-sm font-medium transition-colors hover:bg-muted ${
                  pathname === item.href ? "text-foreground bg-muted/50" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
