# Leonardo Pérez - Academic Portfolio

A personal academic website built with Next.js, featuring a markdown-based content system with support for LaTeX equations, code syntax highlighting, Mermaid diagrams, images, and videos.

## Ejecutar el proyecto y publicarlo

Las dependencias se instalan dentro de `node_modules/`. Node.js y npm deben estar instalados en el equipo; no se suben al repositorio. Para nuevas instalaciones se recomienda Node.js 22 (ver `.nvmrc`).

```bash
cd /home/leonardo/personal-blog
# Si utilizas nvm: nvm install && nvm use
npm ci
npm run dev
```

Abre http://localhost:3000. Para detener el servidor, pulsa Ctrl+C.
Si las dependencias ya están instaladas, basta con ejecutar `npm run dev`.

### Publicar en https://leoperezz.github.io

Esta configuración está preparada para el dominio raíz `leoperezz.github.io`.
GitHub exige que un sitio personal use un repositorio llamado exactamente
`USUARIO.github.io`. El repositorio actual se llama `personal-blog`.

1. En GitHub, abre el repositorio `leoperezz/personal-blog`.
2. En **Settings → General → Repository name**, cambia su nombre a
   `leoperezz.github.io`. Si ese repositorio ya existe, elige primero dónde
   conservar el sitio existente; no lo sobrescribas.
3. En tu terminal, actualiza la dirección del repositorio:

   ```bash
   git remote set-url origin git@github.com:leoperezz/leoperezz.github.io.git
   ```

4. En GitHub, entra en **Settings → Pages → Build and deployment → Source**
   y selecciona **GitHub Actions**. Con GitHub Free, utiliza un repositorio público.
5. Comprueba la compilación y sube los archivos preparados:

   ```bash
   npm run build
   git add README.md next.config.mjs package-lock.json .nvmrc .github/workflows/deploy-pages.yml
   git commit -m "Prepare GitHub Pages deployment"
   git push origin main
   ```

6. En la pestaña **Actions**, espera a que **Deploy to GitHub Pages** termine
   correctamente. Si no se ejecuta, selecciónalo y pulsa **Run workflow** en `main`.
7. Visita https://leoperezz.github.io. La publicación puede tardar unos minutos.

Cada nuevo `git push` a `main` reconstruye y publica el sitio automáticamente.
El workflow instala las dependencias con `npm ci`, ejecuta `npm run build` y
publica la carpeta `out/`. No subas `node_modules/`, `.next/` ni `out/` a Git.
La exportación estática no utiliza `npm start`; ese comando requiere un servidor
Next.js y no corresponde a GitHub Pages.

Conservar el nombre `personal-blog` produciría una URL del tipo
`https://leoperezz.github.io/personal-blog/` y requeriría configurar `basePath`
y adaptar las rutas de las imágenes. Para el dominio raíz pedido, sigue los
pasos anteriores.

Documentación oficial: [GitHub Pages](https://docs.github.com/en/pages/quickstart),
[workflows de Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
y [exportación estática de Next.js](https://nextjs.org/docs/app/guides/static-exports).

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
| **Citations** | `[[1]]` | Interactive tooltips linking to references |

### Academic Citations

The renderer supports an academic citation system with interactive tooltips:

\`\`\`markdown
Neural networks [[1]] have revolutionized machine learning.

## References

1. [Goodfellow, Ian, et al. "Deep Learning". MIT Press, 2016.](https://www.deeplearningbook.org/)
\`\`\`

When you click on the circular citation badge (①), a tooltip appears showing the paper title and a link to the source.

📖 **For complete documentation**, see [MARKDOWN_GUIDE.md](./MARKDOWN_GUIDE.md)

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
