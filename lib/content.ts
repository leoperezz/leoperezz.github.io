import fs from "fs/promises"
import path from "path"

// Content types for blogs, projects, notes, and exercises

export interface BlogPost {
  title: string
  excerpt: string
  date: string
  slug: string
  content?: string
}

export interface Project {
  title: string
  description: string
  tags: string[]
  link: string
  linkLabel: string
  slug?: string
  content?: string
}

export interface Note {
  title: string
  date: string
  slug: string
  topic: string
  content?: string
}

export interface Exercise {
  title: string
  date: string
  slug: string
  difficulty: "Easy" | "Medium" | "Hard"
  content?: string
}

// Sample blog posts - add your content here (ordered by date, newest first)
export const blogPosts: BlogPost[] = [
  {
    title: "Whole Body Control: The necessary step for truly useful robots",
    excerpt:
      "Why coordinating the full body, not just the arms, is essential for robots that can actually help us in the real world.",
    date: "2024-03-25",
    slug: "whole-body-control",
  },
  {
    title: "Optimal Embodiment: Searching for the perfect robot to imitate humans (In progress)",
    excerpt:
      "Exploring the relationship between robot morphology and human imitation—what makes a body ideal for learning from us.",
    date: "2024-03-20",
    slug: "optimal-embodiment",
  },
  {
    title: "Reinforcement Learning for VLAs: Overview and Thoughts",
    excerpt:
      "An overview of reinforcement learning methods for Vision-Language-Action models, plus personal reflections on the field.",
    date: "2024-03-15",
    slug: "reinforcement-learning-vlas",
  },
  {
    title: "Action Chunking Transformer",
    excerpt:
      "Paper Review of one of the most important robotics papers of recent years.",
    date: "2024-02-20",
    slug: "action-chunking-transformer",
  },
  {
    title: "Proximal Policy Optimization",
    excerpt:
      "Explaining the Proximal Policy Optimization algorithm and its applications in reinforcement learning.",
    date: "2024-02-12",
    slug: "proximal-policy-optimization",
  },
  {
    title: "Policy Gradient Theorem",
    excerpt:
      "Proof of the policy gradient theorem in reinforcement learning and a little analysis.",
    date: "2024-02-7",
    slug: "policy-gradient-theorem",
  },
  {
    title: "Attention Mechanism I",
    excerpt: "Exploring the attention mechanism in neural networks, and its applications in natural language processing and computer vision. Focusing on the mechanism of attention in 'Attention Is All You Need' paper.",
    date: "2024-01-12",
    slug: "attention-mechanism-i",
  },
]

// Sample projects - add your content here
export const projects: Project[] = [
  {
    title: "NONHUMAN",
    description:
      "Embodied AI laboratory in Latin America. Aiming to advance research in embodied artificial intelligence across the region. I'm the founder and director of the laboratory.",
    tags: ["Embodied AI", "Research"],
    link: "https://www.nonhuman.site",
    linkLabel: "View Website",
    slug: "nonhuman",
  },
  {
    title: "Robonet",
    description:
      "The internet of Robotics. Robonet is a startup focused on scaling full-body datasets to enable whole-body policies in robots.",
    tags: ["Robotics", "Embodied AI", "Startup"],
    link: "https://robonet.nonhuman.site",
    linkLabel: "View Website",
    slug: "robonet",
  },
]

// Sample notes - add your content here
export const notes: Note[] = [
  {
    title: "Covariant Derivative and some differential geometry",
    date: "2024-11-15",
    slug: "covariant-derivative-differential-geometry",
    topic: "Mathematics",
  }
]

// Sample exercises - add your content here
export const exercises: Exercise[] = [
  {
    title: "Differential Geometry",
    date: "2024-11-10",
    slug: "lie-groups-rotations",
    difficulty: "Hard",
  }
]

// Helper function to format dates
export function formatDate(dateString: string, format: "long" | "short" = "long") {
  const date = new Date(dateString)
  if (format === "short") {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Get the content directory path
function getContentDirectory() {
  return path.join(process.cwd(), "content")
}

// Read markdown content from a file
export async function getMarkdownContent(
  type: "blogs" | "notes" | "projects" | "exercises",
  slug: string
): Promise<string | null> {
  try {
    const filePath = path.join(getContentDirectory(), type, `${slug}.md`)
    const content = await fs.readFile(filePath, "utf-8")
    return content
  } catch {
    return null
  }
}

// Get blog post with content
export async function getBlogPost(slug: string): Promise<(BlogPost & { content: string }) | null> {
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return null

  const content = await getMarkdownContent("blogs", slug)
  return {
    ...post,
    content: content || "",
  }
}

// Get note with content
export async function getNote(slug: string): Promise<(Note & { content: string }) | null> {
  const note = notes.find((n) => n.slug === slug)
  if (!note) return null

  const content = await getMarkdownContent("notes", slug)
  return {
    ...note,
    content: content || "",
  }
}

// Get project with content
export async function getProject(slug: string): Promise<(Project & { content: string }) | null> {
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null

  const content = await getMarkdownContent("projects", slug)
  return {
    ...project,
    content: content || "",
  }
}

// Get exercise with content
export async function getExercise(slug: string): Promise<(Exercise & { content: string }) | null> {
  const exercise = exercises.find((e) => e.slug === slug)
  if (!exercise) return null

  const content = await getMarkdownContent("exercises", slug)
  return {
    ...exercise,
    content: content || "",
  }
}
