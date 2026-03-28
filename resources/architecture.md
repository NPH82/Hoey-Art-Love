# Architecture — Hoey-Art-Love

> Source of truth: `resources/schema.md`  
> Last updated: 2026-03-28

---

## Overview

Hoey-Art-Love is a static, client-side-only portfolio website for displaying needle felting and arts & crafts work. It has no backend, no database, and no server-side rendering. All pages are pre-authored HTML served via GitHub Pages.

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Markup | HTML5 (semantic) | Accessibility, SEO, simplicity |
| Styling | CSS3 — custom properties, Grid, Flexbox | No runtime dependency; full control |
| Interactivity | Vanilla JavaScript (ES6+) | No framework overhead for a gallery |
| Fonts | Google Fonts — Nunito, Playfair Display | Matches soft/Pinterest aesthetic |
| Testing | Jest + jsdom | Standard JS unit testing; no browser needed |
| CI/CD | GitHub Actions | Automates test runs and Pages deployment |
| Hosting | GitHub Pages | Matches static-only requirement |

---

## Project Structure

```
Hoey-Art-Love/
├── index.html                  # Main (and only) page
├── css/
│   ├── theme.css               # Design tokens (colors, fonts, spacing)
│   └── styles.css              # Layout, components, responsive rules
├── js/
│   └── gallery.js              # Gallery filtering + lightbox logic
├── resources/
│   ├── images/                 # All gallery images (organized by category)
│   │   ├── gnomes/
│   │   ├── animals/
│   │   ├── plants/
│   │   └── objects/
│   ├── schema.md               # Source of truth
│   ├── architecture.md         # This file
│   └── implementation-plan.md  # Step-by-step build plan
├── tests/
│   └── gallery.test.js         # Jest unit tests for gallery.js
├── package.json                # Dev dependencies (Jest) + test script
├── .github/
│   └── workflows/
│       ├── test.yml            # Run tests on every push / PR
│       └── deploy.yml          # Deploy to GitHub Pages on main push
└── .gitignore
```

---

## Page Structure (`index.html`)

```
<header>          — Site title + tagline
<nav>             — Category filter buttons (All | Gnomes | Animals | Plants | Objects)
<section#quotes>  — Happiness quote cards (2–3 rotating quotes)
<main#gallery>    — Masonry CSS Grid of .gallery-card items
  <article.gallery-card> × N
    <img>
    <figcaption>  — Title + optional caption
<dialog#lightbox> — Enlarged image overlay (WAI-ARIA dialog)
<footer>          — Attribution / social links
```

---

## Design System

### Color Palette (CSS custom properties)

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#faf7ff` | Page background |
| `--color-purple` | `#c9a6e4` | Primary accent, headings |
| `--color-purple-dark` | `#7e5bad` | Hover states, borders |
| `--color-green` | `#a8d5a2` | Secondary accent, tags |
| `--color-white` | `#ffffff` | Cards, nav |
| `--color-text` | `#3d2b56` | Body copy |

### Typography

- **Headings:** Playfair Display (serif) — elegant, craft-studio feel
- **Body / UI:** Nunito (rounded sans-serif) — warm, approachable
- Base size: `16px`; scale: `1rem / 1.25rem / 1.5rem / 2rem`

### Gallery Layout — Uniform CSS Grid

```css
#gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* 320px–599px */
  grid-template-columns: repeat(3, 1fr);  /* 600px–899px */
  grid-template-columns: repeat(4, 1fr);  /* 900px+ */
  gap: 1rem;
}
.gallery-card img {
  aspect-ratio: 4 / 3;   /* all images same proportions */
  object-fit: cover;      /* crops to fill without distortion */
}
```

---

## JavaScript Architecture (`js/gallery.js`)

Exported functions (testable with Jest):

| Function | Purpose |
|---|---|
| `filterCards(category)` | Hides/shows `.gallery-card` elements by `data-category` attribute |
| `openLightbox(imgSrc, altText)` | Populates and opens the `<dialog#lightbox>` |
| `closeLightbox()` | Closes dialog, restores focus to trigger element |
| `initGallery()` | Attaches all event listeners on `DOMContentLoaded` |

State is stored in DOM attributes only — no global mutable variables.

---

## Security Architecture

| Concern | Mitigation |
|---|---|
| Third-party script injection | No CDN scripts used; all JS is local |
| Google Fonts | Loaded via `<link>` with SRI hash attributes |
| Content Security Policy | `<meta http-equiv="Content-Security-Policy">` restricting scripts to `'self'` |
| Dependency CVEs | `npm audit --audit-level=moderate` gating CI; fail build on medium+ CVE |
| Image paths | Relative paths only; no user-supplied URLs |
| XSS | No `innerHTML` with dynamic content; lightbox uses `src` and `alt` attribute assignment only |

---

## Testing Architecture

```
tests/
└── gallery.test.js
    ├── filterCards() — filters cards by category; shows all on 'all'
    ├── openLightbox() — sets dialog img src/alt; dialog is open
    └── closeLightbox() — dialog is closed after call
```

- Runner: Jest (`npm test`)
- Environment: `testEnvironment: 'jsdom'` in `package.json`
- CI: Runs on every push and pull request via `.github/workflows/test.yml`
- Coverage threshold: 80% (enforced via `--coverage --coverageThreshold`)

---

## Deployment

```
GitHub push to main
  └─► test.yml   → npm test (must pass)
  └─► deploy.yml → gh-pages branch updated via actions/deploy-pages
```

- Live URL: `https://hoeyartlove.com`
- Branch strategy: `main` is the single development branch; `gh-pages` is auto-managed by Actions only.
