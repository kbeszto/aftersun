# Personal log

A static site built with [Astro](https://astro.build). Every entry is a Markdown
file in `src/content/`. No database, no CMS, no server — the whole site is HTML
and CSS by the time it reaches anyone.

## Running it

```bash
npm run dev      # local site at http://localhost:4321, live-reloads as you type
npm run build    # produces dist/
npm run preview  # serve the built dist/ locally
npm run check    # type-check content frontmatter and components
```

## Writing an entry

Create a Markdown file in the right folder. The filename becomes the URL.

```
src/content/movies/heat.md   ->   /movies/heat/
```

```markdown
---
title: Heat
date: 2026-09-25
year: 1995
director: Michael Mann
rating: 4.5
summary: Two professionals, one coffee shop.
tags: [crime, rewatch-worthy]
---

Write the review here, in normal Markdown.
```

Only `title` and `date` are ever required. Everything else is optional — a
thought can be three lines with no fields at all.

Add `draft: true` to keep an entry out of the built site. Drafts still show up
in `npm run dev` so you can see them while writing.

### Fields by section

| Section    | Extra fields |
|------------|--------------|
| `thoughts` | — |
| `movies`   | `year`, `director`, `rating` (0–5, halves ok), `rewatch` |
| `tv`       | `year`, `creator`, `season`, `rating`, `status` (`watching` / `finished` / `abandoned`) |
| `music`    | `artist`, `year`, `rating`, `format` |
| `photos`   | `location`, `images[]` |

Shared by all of them: `title`, `date`, `summary`, `tags`, `draft`.

### Photos

Drop the image files next to the Markdown file and reference them relatively:

```markdown
---
title: Walk, late September
date: 2026-09-22
location: Riverside
images:
  - src: ./walk-01.jpg
    alt: Low sun across the water
    caption: Everyone had gone home already.
  - src: ./walk-02.jpg
    alt: Bare branches
---
```

Astro resizes them, converts to WebP and emits responsive `srcset`s at build
time, so you can drop a 6MB photo straight off your phone in there.

## Changing how it looks

Roughly in order of how often you'll want them:

| I want to change... | Edit |
|---------------------|------|
| Colours, fonts, text size, column width | `src/styles/theme.css` |
| Site name, tagline, footer links, domain | `src/site.config.ts` |
| Which sections exist, nav order, blurbs | `src/lib/sections.ts` |
| Base typography, spacing, prose styles | `src/styles/global.css` |
| The header / footer | `src/components/Header.astro`, `Footer.astro` |
| How list rows look | `src/components/EntryList.astro` |
| How a single entry page is laid out | `src/layouts/Entry.astro` |
| The homepage | `src/pages/index.astro` |

`theme.css` is the important one. It's nothing but CSS custom properties, and
every other stylesheet reads from it — change `--accent` there and it changes
links, stars and hover states everywhere. `--measure` (prose line width) and
`--font-body` are the two knobs that most change the site's character.

## Adding a whole new section

Say you want `/books`:

1. Add a `books` collection in `src/content.config.ts` (copy the `movies` one).
2. Add an entry to `SECTIONS` in `src/lib/sections.ts`.
3. Create `src/content/books/` and write a Markdown file.

Routing, nav, the homepage feed, tags and RSS all pick it up automatically —
there are no per-section page files to write.

## Structure

```
src/
  site.config.ts      you, the site title, links
  content.config.ts   what fields each section allows
  content/            ← your writing lives here
    thoughts/ movies/ tv/ music/ photos/
  lib/
    sections.ts       the list of sections
    posts.ts          turns collections into one uniform feed
    format.ts         date formatting
  layouts/            Base (page shell), Entry (a single post)
  components/         Header, Footer, EntryList, Rating, PhotoGrid, ThemeToggle
  pages/
    index.astro           homepage feed
    about.astro
    [section]/            index + entry pages for every section
    tags/
    rss.xml.ts
public/               favicon, robots.txt, anything served as-is
```

## Deploying

The build output is a plain folder of static files, so anything that serves
static files will host it. Cloudflare Pages and Netlify both do it free, and
redeploy on every `git push`:

- **Build command:** `npm run build`
- **Output directory:** `dist`

This repo deploys to Cloudflare. `wrangler.jsonc` names the project
(`kobepickled`) and points it at `dist/`; `.nvmrc` pins the build to Node 24.

The editing loop is entirely local — you never edit anything in the Cloudflare
dashboard:

```
edit a .md file  ->  git commit  ->  git push  ->  Cloudflare rebuilds
```

If you add a custom domain, update `url` in `src/site.config.ts` and the
`Sitemap:` line in `public/robots.txt` to match.
