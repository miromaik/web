# miromaik.com

A tiny personal homepage that occasionally comes alive. Built with pure Vanilla TypeScript, zero runtime dependencies, and handcrafted CSS.

![Preview](assets/preview.png)

## Features

- **Living Website System:** Subtle calendar-aware events (Halloween spiders, movable Easter hunt, Christmas fairy lights, Earth Day bloom, New Year fireworks) that bring the site to life without cluttering normal visits.
- **Hands-off Theme Synchronization:** Automatic `prefers-color-scheme` adaptation supporting warm ivory light mode and warm graphite dark mode without manual toggles.
- **Procedural Project Markers:** Deterministic SVG shapes and color palettes generated from project names via FNV-1a hashing.
- **Randomized Personal Thoughts:** Rotating informal thoughts on page reload without carousels, timers, or layout shifts.
- **Hidden Playground:** Production easter egg activated via Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`) on desktop or 5 quick taps on the avatar on mobile.
- **Zero Runtime Dependencies:** Pure vanilla TypeScript and standard CSS, bundled in under 100ms with Vite.

## Quick Start

```bash
# Clone repository
git clone https://github.com/miromaik/web.git
cd web

# Install dev dependencies
npm install

# Start local development server
npm run dev
```

## Customization

All personal data, links, projects, and one-liners are centrally configured in a single file:

```text
src/site.config.ts
```

- **Profile:** name, avatar path, and bio.
- **Social Links:** GitHub, Bluesky, X, Email, and Ko-fi links with micro-interactions.
- **One-Liners:** array of casual personal lines randomly picked on page load.
- **Projects:** project titles, descriptions, and URLs (shapes are deterministically generated).
- **Footer:** location and copyright metadata.

Replace `public/avatar.png` and the favicons in `public/` with your own assets.

## Build

```bash
# Type check and build static production bundle (dist/)
npm run build

# Preview production build locally
npm run preview

# Run verification test suite
npm test
```

The output in `dist/` is pure static HTML/CSS/JS ready for deployment to Cloudflare Pages, GitHub Pages, or any static host.

## License

MIT Copyright (c) 2026 Miro

