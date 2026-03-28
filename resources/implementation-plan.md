# Implementation Plan — Hoey-Art-Love

> Source of truth: `resources/schema.md`  
> Architecture reference: `resources/architecture.md`  
> Last updated: 2026-03-28

---

## Phases at a Glance

| Phase | Goal | Output |
|---|---|---|
| 1 | Project scaffolding | Folder structure, `package.json`, `.gitignore` |
| 2 | HTML structure | Semantic `index.html` with all sections |
| 3 | CSS theming | Design tokens, layout, responsive Pinterest grid |
| 4 | JavaScript | Gallery filter + lightbox (vanilla JS) |
| 5 | Content | Images migrated, captions authored |
| 6 | Quotes section | Happiness quote cards styled and populated |
| 7 | Unit tests | Jest tests for all exported JS functions |
| 8 | Security hardening | CSP meta tag, SRI hashes, `npm audit` pass |
| 9 | CI/CD | GitHub Actions — test + deploy workflows |
| 10 | QA & launch | Cross-browser check, accessibility audit, go-live |

---

## Phase 1 — Project Scaffolding

**Goal:** Establish clean folder structure and tooling baseline.

### Tasks

- [ ] Create folder structure as defined in `architecture.md`
  - `css/`, `js/`, `tests/`, `resources/images/{gnomes,animals,plants,objects}/`, `.github/workflows/`
- [ ] Create `package.json` with:
  ```json
  {
    "name": "hoey-art-love",
    "private": true,
    "scripts": {
      "test": "jest --coverage --coverageThreshold='{\"global\":{\"lines\":80}}'"
    },
    "devDependencies": {
      "jest": "latest",
      "jest-environment-jsdom": "latest"
    },
    "jest": {
      "testEnvironment": "jsdom"
    }
  }
  ```
- [ ] Create `.gitignore` (node_modules, coverage/)
- [ ] Run `npm install` and confirm `npm audit` returns zero medium/high/critical issues
- [ ] Rename `Hoey-Art-Love.html` → `index.html`

**Done when:** `npm test` runs (no tests yet, exits cleanly) and folder structure matches architecture.

---

## Phase 2 — HTML Structure

**Goal:** Build the full semantic page skeleton.

### Tasks

- [ ] `<head>` — charset, viewport, title, CSP meta (placeholder), Google Fonts preconnect + `<link>`
- [ ] `<header>` — `<h1>` site name, tagline paragraph
- [ ] `<nav>` — filter buttons: All | Gnomes | Animals | Plants | Objects & Other
  - Each button has `data-filter="all|gnomes|animals|plants|objects"` attribute
  - First button (`All`) has `aria-pressed="true"` by default
- [ ] `<section id="quotes">` — 2–3 `<blockquote>` happiness quote cards (static text for now)
- [ ] `<main id="gallery">` — grid container
  - Placeholder `<article class="gallery-card" data-category="gnomes">` items for each category
  - Each card: `<figure><img src="" alt=""><figcaption><h3></h3></figcaption></figure>`
- [ ] `<dialog id="lightbox">` — `<img>`, close `<button>`, `aria-label="Image lightbox"`
- [ ] `<footer>` — copyright, optional Instagram/Pinterest link placeholders
- [ ] Link `css/theme.css`, `css/styles.css`, and `js/gallery.js` (as `type="module"`)
- [ ] Validate HTML at validator.w3.org (zero errors)

**Done when:** Page renders in browser with correct semantic structure and all sections visible (unstyled is fine).

---

## Phase 3 — CSS Theming & Layout

**Goal:** Apply the pastel Pinterest aesthetic and responsive masonry grid.

### Tasks

**`css/theme.css`**

- [ ] Define all CSS custom properties (colors, fonts, spacing, border-radius, shadows) per `architecture.md` Design System
- [ ] Import Google Fonts `@import` statement

**`css/styles.css`**

- [ ] CSS reset / normalize (box-sizing, margin reset)
- [ ] `body` — background color, font family, text color
- [ ] `header` — centered, purple heading, soft shadow, tagline in green
- [ ] `nav` — pill-shaped filter buttons; active state uses `--color-purple-dark`; hover transitions
- [ ] `#quotes` — horizontal scroll or centered row of quote cards; pastel card with italic text, decorative quotation mark
- [ ] `#gallery` — CSS `columns` masonry layout (2 → 3 → 4 columns at breakpoints)
- [ ] `.gallery-card` — white card, rounded corners, soft drop-shadow, `break-inside: avoid`; image fills card width; figcaption padding
- [ ] `.gallery-card:hover` — subtle scale + shadow lift (`transform: scale(1.02)`)
- [ ] `dialog#lightbox` — full-viewport dark overlay (`::backdrop`), centered large image, close button top-right
- [ ] `footer` — small text, centered, muted color
- [ ] **Responsive breakpoints:** 320px, 600px, 900px, 1200px
- [ ] **Contrast check:** all text/background pairs meet WCAG AA (4.5:1 normal, 3:1 large)

**Done when:** Page matches Pinterest pastel gallery aesthetic at all viewport widths.

---

## Phase 4 — JavaScript (Gallery Filter + Lightbox)

**Goal:** Implement interactive gallery filtering and image lightbox using vanilla JS.

### Tasks

- [ ] `js/gallery.js` — write and `export` the following pure/testable functions:
  - `filterCards(category)` — iterates all `.gallery-card` elements; sets `hidden` attribute when `data-category` doesn't match (except `'all'`)
  - `openLightbox(imgSrc, altText, triggerEl)` — sets `<dialog>` img `src`/`alt`, stores `triggerEl` ref, calls `dialog.showModal()`
  - `closeLightbox(dialog, triggerEl)` — calls `dialog.close()`, calls `triggerEl.focus()` to restore keyboard position
  - `initGallery()` — wires all event listeners on `DOMContentLoaded`; not exported but called at module load
- [ ] Filter nav: clicking a button updates `aria-pressed`, calls `filterCards()`
- [ ] Gallery cards: clicking a card image calls `openLightbox()`
- [ ] Lightbox close: close button click, `Escape` key, and click-outside-dialog all call `closeLightbox()`
- [ ] No use of `innerHTML` with any dynamic values (XSS safeguard — use `setAttribute` / property assignment only)

**Done when:** Filtering hides/shows cards correctly; lightbox opens and closes; keyboard navigation works throughout.

---

## Phase 5 — Content Population

**Goal:** Replace placeholder content with real images and captions.

### Tasks

- [ ] Move/copy all existing images (`gnome.jpg`, `mouse.jpg`, `cactus.jpg`, `ornament balls.jpg`) into `resources/images/<category>/`
- [ ] Rename files to lowercase, hyphenated, no spaces (e.g., `ornament-balls.jpg`)
- [ ] Update `index.html` image `src` paths to new locations
- [ ] Write descriptive `alt` text for every image (required for accessibility + SEO)
- [ ] Add `<figcaption>` titles and optional short captions for each card
- [ ] Populate 2–3 happiness quotes in `<section id="quotes">` (attributed if sourced)
- [ ] Validate all image paths load without 404s

**Done when:** All current images display correctly in the gallery with alt text and captions.

---

## Phase 6 — Quotes Section

**Goal:** Style and populate the happiness quotes section.

### Tasks

- [ ] Author 2–3 short happiness/creativity quotes relevant to arts & crafts
- [ ] Mark each up as `<blockquote><p>...</p><footer>— Author</footer></blockquote>`
- [ ] Style as pastel-purple card with large decorative `"` glyph and italic font
- [ ] Ensure quotes section is visually distinct but complements gallery below

**Done when:** Quotes section renders attractively and consistently with the overall theme.

---

## Phase 7 — Unit Tests

**Goal:** Achieve ≥ 80% line coverage on `gallery.js` with meaningful tests.

### Tasks

- [ ] `tests/gallery.test.js`:
  - `filterCards('gnomes')` — only gnome cards are visible; others are hidden
  - `filterCards('all')` — all cards visible; no `hidden` attributes
  - `filterCards('animals')` — only animal cards visible
  - `openLightbox(src, alt, triggerEl)` — dialog `<img>` has correct `src` and `alt`; `dialog.open` is true
  - `closeLightbox(dialog, triggerEl)` — `dialog.open` is false; `triggerEl.focus()` was called
- [ ] Setup: use jsdom's `document` to build minimal fixture HTML before each test
- [ ] Run `npm test` — all tests pass, coverage ≥ 80%

**Done when:** `npm test` exits 0 with all assertions green and coverage threshold met.

---

## Phase 8 — Security Hardening

**Goal:** Satisfy all security requirements from `schema.md`.

### Tasks

- [ ] **Content Security Policy** — add `<meta http-equiv="Content-Security-Policy">`:
  ```
  default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'self'; object-src 'none';
  ```
- [ ] **SRI for Google Fonts** — add `integrity` + `crossorigin` attributes to `<link>` tags (generate via srihash.org)
- [ ] **npm audit** — run `npm audit --audit-level=moderate`; resolve any medium/high/critical findings before merge
- [ ] **No inline event handlers** — all JS wired programmatically (no `onclick=""` in HTML)
- [ ] **No `eval`, `Function()`, or unsafe dynamic code** — review `gallery.js`
- [ ] **Image path safety** — confirm all `src` values are static strings, never user-supplied

**Done when:** `npm audit` reports zero medium/high/critical CVEs; CSP meta tag is in place; SRI hashes on all external resources.

---

## Phase 9 — CI/CD Setup

**Goal:** Automate testing and deployment via GitHub Actions.

### Tasks

- [ ] **`.github/workflows/test.yml`** — trigger on `push` and `pull_request` to `main`:
  ```yaml
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with: { node-version: '20' }
  - run: npm ci
  - run: npm audit --audit-level=moderate
  - run: npm test
  ```
- [ ] **`.github/workflows/deploy.yml`** — trigger on `push` to `main` after tests pass:
  - Checkout → setup Node → `npm ci` → `npm test` → deploy static files to `gh-pages` branch via `actions/deploy-pages`
- [ ] Enable GitHub Pages in repo settings: source = `gh-pages` branch, root `/`
- [ ] Push to `main` and verify deployment succeeds

**Done when:** Every push to `main` runs tests, audits dependencies, and deploys the site automatically.

---

## Phase 10 — QA & Launch

**Goal:** Validate site quality before sharing publicly.

### Tasks

- [ ] Cross-browser smoke test: Chrome, Firefox, Safari (or Edge), mobile viewport
- [ ] Lighthouse audit (target: Performance ≥ 90, Accessibility ≥ 90, Best Practices ≥ 90)
- [ ] Check all images load and have non-empty alt text
- [ ] Verify lightbox opens/closes with keyboard only (Tab, Enter, Escape)
- [ ] Check color contrast with browser DevTools / WebAIM Contrast Checker
- [ ] Confirm live URL (`https://<username>.github.io/Hoey-Art-Love/`) loads correctly
- [ ] Update README.md with project description and live link

**Done when:** Lighthouse scores meet targets; no broken links or images; site is accessible on mobile and desktop.

---

## Dependency Summary

| Package | Version | Purpose |
|---|---|---|
| `jest` | latest | Test runner |
| `jest-environment-jsdom` | latest | DOM simulation for tests |

> All production assets are vanilla HTML/CSS/JS — zero runtime npm dependencies.
