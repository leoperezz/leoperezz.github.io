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

// Sample blog posts - add your content here
export const blogPosts: BlogPost[] = [
  {
    title: "Understanding the Mathematics of Neural Networks",
    excerpt:
      "Exploring the fundamental mathematical concepts behind neural networks, from linear algebra to optimization.",
    date: "2024-11-20",
    slug: "neural-networks-math",
  },
  {
    title: "Why Embodied AI is the Future of Robotics",
    excerpt: "Reflections on why embodied intelligence represents a paradigm shift in how we think about AI.",
    date: "2024-10-15",
    slug: "embodied-ai-future",
  },
  {
    title: "Building an AI Lab in Latin America",
    excerpt: "The challenges and opportunities of creating AI research infrastructure in the region.",
    date: "2024-09-08",
    slug: "ai-lab-latam",
  },
]

// Sample projects - add your content here
export const projects: Project[] = [
  {
    title: "Topological Methods in Robot Motion Planning",
    description:
      "Investigating the application of algebraic topology to configuration spaces, with implications for motion planning algorithms in high-dimensional robotic systems.",
    tags: ["Topology", "Motion Planning", "Configuration Spaces"],
    link: "#",
    linkLabel: "View PDF",
    slug: "topological-motion-planning",
  },
  {
    title: "Neural Implicit Representations for 3D Scene Understanding",
    description:
      "Exploring coordinate-based neural networks for encoding spatial information, with applications to robot perception and manipulation tasks.",
    tags: ["Computer Vision", "Neural Networks", "3D Reconstruction"],
    link: "#",
    linkLabel: "GitHub",
    slug: "neural-implicit-3d",
  },
  {
    title: "Geometric Control on Lie Groups",
    description:
      "Studying the mathematical foundations of geometric control theory and its applications to autonomous systems operating on non-Euclidean manifolds.",
    tags: ["Control Theory", "Lie Groups", "Differential Geometry"],
    link: "#",
    linkLabel: "View PDF",
    slug: "geometric-control-lie-groups",
  },
]

// Sample notes - add your content here
export const notes: Note[] = [
  {
    title: "Introduction to Differential Geometry",
    date: "2024-11-15",
    slug: "intro-differential-geometry",
    topic: "Mathematics",
  },
  {
    title: "Reinforcement Learning: Policy Gradient Methods",
    date: "2024-10-28",
    slug: "policy-gradient-methods",
    topic: "Machine Learning",
  },
  {
    title: "Control Theory for Robotics",
    date: "2024-09-12",
    slug: "control-theory-robotics",
    topic: "Robotics",
  },
  {
    title: "Linear Algebra Review: Eigenvalues and SVD",
    date: "2024-08-03",
    slug: "linear-algebra-eigen-svd",
    topic: "Mathematics",
  },
  {
    title: "Probabilistic Graphical Models",
    date: "2024-07-19",
    slug: "probabilistic-graphical-models",
    topic: "Machine Learning",
  },
]

// Sample exercises - add your content here
export const exercises: Exercise[] = [
  {
    title: "Lie Groups and Rotation Representations",
    date: "2024-11-10",
    slug: "lie-groups-rotations",
    difficulty: "Hard",
  },
  {
    title: "Implementing a Simple MDP Solver",
    date: "2024-10-15",
    slug: "mdp-solver",
    difficulty: "Medium",
  },
  {
    title: "Gradient Descent Variants Comparison",
    date: "2024-09-05",
    slug: "gradient-descent-variants",
    difficulty: "Easy",
  },
  {
    title: "PID Controller Tuning Challenge",
    date: "2024-08-20",
    slug: "pid-tuning-challenge",
    difficulty: "Medium",
  },
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
