import { FileText, FolderOpen, BookOpen, Code } from "lucide-react"

interface EmptyStateProps {
  type: "blogs" | "projects" | "notes" | "exercises"
}

const config = {
  blogs: {
    icon: FileText,
    title: "No blog posts yet",
    description: "Blog posts will appear here once you add them to the content folder.",
  },
  projects: {
    icon: FolderOpen,
    title: "No projects yet",
    description: "Projects will appear here once you add them to the content folder.",
  },
  notes: {
    icon: BookOpen,
    title: "No notes yet",
    description: "Course notes and learning resources will appear here.",
  },
  exercises: {
    icon: Code,
    title: "No exercises yet",
    description: "Practice problems and coding challenges will appear here.",
  },
}

export function EmptyState({ type }: EmptyStateProps) {
  const { icon: Icon, title, description } = config[type]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-sans text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm font-serif text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
