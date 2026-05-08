# Mohay Portfolio - Full Project Handover

এই ফাইলটা এমনভাবে লেখা হয়েছে যেন ভবিষ্যতে পুরো কোডবেস আবার শুরু থেকে না পড়েও প্রজেক্টটা দ্রুত বোঝা যায়।

## 1) Project at a Glance

- **Type:** Single-page personal portfolio
- **Framework:** Next.js (App Router)
- **UI:** React + Tailwind CSS v4 + CSS variable driven design system
- **Motion:** GSAP + ScrollTrigger (heavy animation-focused experience)
- **Language:** TypeScript (strict mode)
- **Content source:** Mostly hardcoded constants inside section components (no CMS/API)

## 2) Directory Structure (What lives where)

- `app/`
  - `layout.tsx` -> root layout, fonts, metadata, global nav wrapper
  - `page.tsx` -> main page composition (section order)
  - `globals.css` -> global styles, theme tokens, marquee keyframes, shared utilities
  - `components/` -> section-wise UI blocks (`Hero`, `About`, `Experience`, etc.)
- `ui/`
  - reusable animation/utility UI pieces (`TextHover`, `HomeLoader`, `iframe`)
- `public/`
  - static assets (currently very minimal: template SVG files)
- root configs
  - `package.json`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next.config.ts`

## 3) Runtime + Tooling

- **Next.js + React**
  - Next.js `16.2.4`
  - React `19.2.4`
- **Styling**
  - Tailwind v4 through `@import "tailwindcss"` in `app/globals.css`
  - PostCSS plugin: `@tailwindcss/postcss`
- **Lint/Type**
  - ESLint 9 with Next + TS config
  - TypeScript strict mode on
- **Motion libs**
  - `gsap` + `gsap/ScrollTrigger`
- **Other**
  - `lucide-react` used for icons
  - `swiper` installed but currently not used

## 4) Page Composition and Data Flow

Main route is the home page (`app/page.tsx`) and it renders section components in sequence.

Current active order:
1. `Experience`
2. `Education`
3. `Skills`
4. `Blog`
5. `Beyond`
6. `Contact`

Currently commented out in `page.tsx`:
- `Hero`
- `About`
- `Projects`
- `HomeLoader`

### Navigation behavior

- `Nav` uses anchor links (`#hero`, `#about`, etc.) and highlights active section via `IntersectionObserver`.
- `Nav` also controls theme switch (dark/light), saving choice in `localStorage` and applying `data-theme` to `document.documentElement`.

### Data flow style

- No global state manager (Redux/Zustand/etc.).
- Mostly local static arrays/constants inside each section component (experience list, skills, blog entries, social links).
- Sections are mostly self-contained and presentational.

## 5) Theme System (Important)

Theme architecture is centralized in `app/globals.css` through CSS custom properties.

### Core token groups

- **Background tokens:** `--bg-base`, `--bg-surface`, `--bg-card`, `--bg-inverse`
- **Text tokens:** `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
- **Accent tokens:** `--accent`, `--accent-soft`, `--accent-strong`, `--accent-ink`
- **Line/shadow/easing tokens:** `--line`, `--line-strong`, `--shadow-*`, `--ease-*`
- **Layout tokens:** `--shell-pad-x`, `--section-pad-y`, etc.

### Theme modes

- `:root` + `[data-theme='light']` + `[data-theme='dark']` sets token values.
- Switching theme does not rewrite component classes; components consume tokens, so palette changes globally.

### Typography system

- Fonts loaded in `layout.tsx` via `next/font/google`:
  - Inter (`--font-sans`)
  - Fraunces (`--font-display`)
  - JetBrains Mono (`--font-mono`)

## 6) Animation System (Important)

This project is motion-first. GSAP is used across many components.

### Main animation patterns

- Scroll-triggered reveal animations (`opacity`, `y`, stagger).
- Pinned long-scroll narrative behavior (notably in `About`).
- Character-level hover wave effect via `ui/TextHover.tsx`.
- Loader transition choreography (`ui/HomeLoader.tsx`) with slingshot-like motion.
- Marquee keyframe animations in CSS (`marqueeLeft`, `marqueeRight`) used in skills bands.
- Extra interactive motion (e.g., magnetic hover, draggable-style interactions in some sections).

### Motion-heavy files

- `app/components/Hero.tsx`
- `app/components/About.tsx`
- `app/components/Projects.tsx`
- `app/components/Experience.tsx`
- `app/components/Skills.tsx`
- `app/components/Contact.tsx`
- `ui/TextHover.tsx`
- `ui/HomeLoader.tsx`
- `app/globals.css`

## 7) Content Strategy

- Portfolio content is currently hardcoded within component files.
- No backend, CMS, DB, or markdown pipeline for content yet.
- External profile/project links are embedded directly in section data.

Implication:
- Quick to edit in code.
- Harder to scale for non-dev content updates.

## 8) Assets and Media Notes

- `public/` has only a few SVG template files now.
- Components reference `public/Picture.jpg` (via import paths in `Hero`/`About`) but this file is not present in current repo scan.

If `Hero`/`About` are re-enabled, this missing image can break build/runtime unless the file is added or imports are changed.

## 9) Current Architecture Style (In one sentence)

**A section-based, single-route Next.js portfolio with a tokenized theme system and GSAP-driven high-motion storytelling.**

## 10) Run, Build, Lint

From project root:

- `npm run dev` -> start development server
- `npm run build` -> production build
- `npm run start` -> run production server
- `npm run lint` -> run ESLint checks

## 11) Known Gaps / Cleanup Candidates

- Unused dependency: `swiper` (installed, no active imports found)
- Commented-out sections in `app/page.tsx` indicate in-progress or staged UI rollout
- Loader handshake logic (`data-loaded`) exists in multiple components but loader rendering is currently disabled
- Potential missing image asset (`public/Picture.jpg`)

## 12) If You Need To Onboard Fast (Reading order)

1. `app/page.tsx` -> understand active page composition
2. `app/layout.tsx` -> global shell, fonts, nav
3. `app/components/Nav.tsx` -> section anchor + active state + theme toggle
4. `app/globals.css` -> design tokens + theme definitions + global motion keyframes
5. `app/components/*` -> section-level content and behavior
6. `ui/TextHover.tsx` + `ui/HomeLoader.tsx` -> reusable/advanced animation logic

---

If this project evolves, keep this file updated after each major structural, visual, or animation change so newcomers can understand the codebase in minutes.
