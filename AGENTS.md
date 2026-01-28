# Repository Guidelines

## Project Structure & Module Organization
- `index.html` is the prototype preview board that embeds all pages via iframes.
- `Pages/` contains individual high‑fidelity HTML pages (`home.html`, `studio.html`, `result.html`, `history.html`). Each file is a full document and can be opened standalone.
- `emoji/` is currently empty and can be used for future assets if you move away from CDN assets.

## Build, Test, and Development Commands
This is a static HTML prototype with no build step. Use any of the following to preview locally:
- `open index.html` (macOS) or open the file in your browser.
- `python3 -m http.server 8000` then visit `http://localhost:8000/index.html` to avoid iframe file‑origin restrictions.

## Coding Style & Naming Conventions
- Indentation: 2 spaces in HTML.
- Use Tailwind CSS via CDN only; avoid custom CSS unless strictly necessary.
- Use utility classes for layout and spacing; keep class ordering consistent (layout → spacing → typography → color → effects).
- File naming: lowercase, kebab‑case for new pages (e.g., `pricing.html`).
- Assets: prefer real URLs (e.g., Unsplash) rather than placeholders.

## Testing Guidelines
- No automated tests are defined.
- Manual QA checklist: open each page in `Pages/`, verify responsive layout at mobile and desktop widths, check icon rendering, and confirm iframes load inside `index.html`.

## Commit & Pull Request Guidelines
- This repo has no Git history yet; default to Conventional Commits for clarity (e.g., `feat: add pricing page`, `fix: adjust hero spacing`).
- PRs should include:
  - A short description of UI/UX changes.
  - Screenshots of key pages (desktop + mobile).
  - Notes on any new external assets or CDN dependencies.

## Security & Configuration Notes
- External CDNs are required for Tailwind and icons; ensure availability in the target deployment environment.
- If moving to self‑hosted assets, place them under `emoji/` or a new `assets/` folder and update references accordingly.
