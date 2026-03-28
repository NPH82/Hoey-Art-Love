THEME
Pastel colors
- Purple, white, and Green
- Font: Google Fonts — "Nunito" (body), "Playfair Display" (headings)
- Pinterest-style masonry grid layout

Areas for quotes
- Happiness
- Displayed as styled callout cards on the home page

Purpose
- Showcase needle felting work
- Arts and crafts portfolio gallery
- Pinterest vibe — visual-first, soft aesthetic

GALLERY CATEGORIES (from existing content)
- Gnomes
- Animals (chicken)
- Objects & Other (candle)

CONTENT
- Each gallery item: image + title + optional short caption
- Images stored locally under resources/images/

SECURITY
- No CDN links without Subresource Integrity (SRI) hashes
- All npm dev dependencies audited via `npm audit` — no medium, high, or critical CVEs
- Content Security Policy via <meta> tag
- Use latest stable versions of all dependencies

TYPE
- Static web page (HTML5, CSS3, Vanilla JS)
- No backend or build framework required
- Deployed to GitHub Pages via GitHub Actions (main branch → gh-pages)
- Custom domain: hoeyartlove.com (CNAME record → <username>.github.io)

TEST
- Unit testing with Jest + jsdom
- Tests cover JavaScript utility/interaction functions in js/gallery.js
- Test command: `npm test`
- Tests run in CI via GitHub Actions on every push

ASSUMPTIONS
- No CMS or dynamic data required; all content is hand-authored HTML
- Lightbox/modal for enlarged image view (vanilla JS, no external library)
- No contact form or e-commerce at this stage
- Mobile-responsive layout (320px–1440px)
- Accessibility: WCAG 2.1 AA target (alt text, keyboard nav, color contrast)