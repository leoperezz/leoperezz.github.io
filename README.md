# Leonardo Pérez - Academic Portfolio

A personal academic website built with Next.js, featuring a markdown-based content system with support for LaTeX equations, code syntax highlighting, Mermaid diagrams, images, and videos.

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx              # About page (homepage)
│   ├── blogs/
│   │   ├── page.tsx          # Blog listing page
│   │   └── [slug]/
│   │       └── page.tsx      # Individual blog post
│   ├── projects/
│   │   └── page.tsx          # Projects listing page
│   └── notes/
│       ├── page.tsx          # Notes listing page
│       └── [slug]/
│           └── page.tsx      # Individual note (to be created)
├── components/
│   ├── markdown-renderer.tsx # Renders markdown with LaTeX, code, mermaid, etc.
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── ...
├── lib/
│   └── content.ts            # Content data (blogs, projects, notes, exercises)
└── content/                  # Markdown files for your content
    ├── blogs/
    │   └── neural-networks-math.md
    ├── projects/
    ├── notes/
    └── exercises/
\`\`\`

## Adding Content

### 1. Blog Posts

**Step 1:** Add your blog metadata to `lib/content.ts`:

\`\`\`typescript
export const blogPosts: BlogPost[] = [
  {
    title: "Your Blog Title",
    excerpt: "A short description of your blog post.",
    date: "2024-12-01",  // YYYY-MM-DD format
    slug: "your-blog-slug",  // URL-friendly identifier
  },
  // ... existing posts
]
\`\`\`

**Step 2:** Create a markdown file at `content/blogs/your-blog-slug.md`:

\`\`\`markdown
# Your Blog Title

Your content here with full markdown support...

## Math Equations

Inline math: $E = mc^2$

Block math:
$$
\nabla \cdot \mathbf{E} = \frac{\rho}{\varepsilon_0}
$$

## Code Blocks

\`\`\`python
def hello():
    print("Hello, world!")
\`\`\`

## Images

![Image description](https://your-image-url.com/image.png)

## Videos

![Video description](https://your-video-url.com/video.mp4)

## Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`
\`\`\`

**Step 3:** Update `app/blogs/[slug]/page.tsx` to load from your markdown files (optional - currently uses embedded content).

### 2. Projects

Add your projects to `lib/content.ts`:

\`\`\`typescript
export const projects: Project[] = [
  {
    title: "Your Project Title",
    description: "Project description here.",
    tags: ["Tag1", "Tag2", "Tag3"],
    link: "https://github.com/your-repo",
    linkLabel: "GitHub",
  },
  // ... existing projects
]
\`\`\`

### 3. Notes

**Step 1:** Add note metadata to `lib/content.ts`:

\`\`\`typescript
export const notes: Note[] = [
  {
    title: "Note Title",
    date: "2024-12-01",
    slug: "note-slug",
    topic: "Mathematics",  // Category/topic
  },
  // ... existing notes
]
\`\`\`

**Step 2:** Create `content/notes/note-slug.md` with your note content.

**Step 3:** Create `app/notes/[slug]/page.tsx` to render individual notes (similar to blog post page).

### 4. Exercises

Add exercises to `lib/content.ts`:

\`\`\`typescript
export const exercises: Exercise[] = [
  {
    title: "Exercise Title",
    date: "2024-12-01",
    slug: "exercise-slug",
    difficulty: "Medium",  // "Easy" | "Medium" | "Hard"
  },
  // ... existing exercises
]
\`\`\`

## Markdown Features

The `MarkdownRenderer` component supports:

| Feature | Syntax | Example |
|---------|--------|---------|
| **Headers** | `# H1` `## H2` `### H3` | Standard markdown headers |
| **Bold/Italic** | `**bold**` `*italic*` | **bold** and *italic* |
| **Inline Math** | `$equation$` | `$E = mc^2$` |
| **Block Math** | `$$equation$$` | See above |
| **Code Blocks** | ` ```language ``` ` | With syntax highlighting + copy button |
| **Mermaid** | ` ```mermaid ``` ` | Interactive diagrams with zoom/pan |
| **Images** | `![alt](url)` | With caption from alt text |
| **Videos** | `![alt](url.mp4)` | Auto-detected from URL |
| **Tables** | Standard GFM | Styled tables |
| **Blockquotes** | `> quote` | Styled quotes |
| **Lists** | `- item` or `1. item` | Bulleted and numbered |

## Customization

### Colors & Theme

Edit `app/globals.css` to customize:
- Light mode: Warm cream background with charcoal accents
- Dark mode: Soft black (#0a0a0a) with neutral accents

### Typography

The site uses:
- **Inter** - Headings and UI elements
- **Merriweather** - Body text (serif)
- **JetBrains Mono** - Code blocks

### Social Links

Update your social links in `components/footer.tsx`:

\`\`\`typescript
const socials = [
  { icon: Github, href: "https://github.com/yourusername", label: "GitHub" },
  { icon: Mail, href: "mailto:your@email.com", label: "Email" },
  { icon: Twitter, href: "https://x.com/yourusername", label: "X" },
]
\`\`\`

## Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
\`\`\`

## Logo

The logo displays ∇𝓛ᵖ (nabla L^p) using Unicode math symbols, representing the gradient of a Lebesgue space - a nod to optimization and functional analysis.
