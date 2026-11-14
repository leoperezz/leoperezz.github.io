# Leonardo Pérez — Personal Website

Personal portfolio, blog, and academic notes built with Next.js, React, and Tailwind CSS. Markdown content supports LaTeX, syntax highlighting, Mermaid diagrams, and citations.

## Development

Use Node.js 22 (see `.nvmrc`).

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

Generates the static site in `out/`. Fonts are bundled locally through Fontsource, so builds do not fetch them from Google Fonts.

## Content

Add metadata in `lib/content.ts` and a matching Markdown file:

- Blog posts: `content/blogs/<slug>.md`
- Notes: `content/notes/<slug>.md`
- Exercises: `content/exercises/<slug>.md`

See [MARKDOWN_GUIDE.md](./MARKDOWN_GUIDE.md) for formatting examples.

## Customization

- Homepage: `app/page.tsx`
- Theme and styles: `app/globals.css`
- Fonts and page metadata: `app/layout.tsx`
- Navigation and social links: `components/navbar.tsx` and `components/footer.tsx`
- Images and other assets: `public/`
