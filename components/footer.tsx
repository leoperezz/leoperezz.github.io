import { Github, Linkedin } from "lucide-react"

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* // Removed email, kept only GitHub, X, and LinkedIn */}
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://github.com/leoperezz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/leonardo-perez-nestares"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href="https://x.com/leoperzz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
            aria-label="X"
          >
            <XIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
