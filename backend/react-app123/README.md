# React 18 + TypeScript + Vite + Tailwind Scaffold

A complete production-ready scaffold using:
- React 18 (createRoot)
- TypeScript
- Vite
- TailwindCSS
- ESLint + Prettier

Entry point
- public/index.html serves the app (via Vite)

Project layout
- src/
  - main.tsx: React 18 entry using createRoot
  - App.tsx: root component with responsive Tailwind layout
  - components/: Button, Card, Nav (reusable components)
  - hooks/: useToggle, useFetch
  - utils/: formatDate, classNames
  - types/: global types and a sample Product type
  - styles/index.css: Tailwind directives
- public/index.html: entry point
- vite.config.ts, tailwind.config.cjs, postcss.config.cjs
- ESLint & Prettier configs

Getting started
- Prereqs: Node.js >= 18, npm or yarn
- Install dependencies:
  npm install
  # or
  yarn
- Development:
  npm run dev
  # or
  yarn dev
- Build:
  npm run build
- Preview:
  npm run preview
- Lint/Format:
  npm run lint
  npm run format

Notes
- This scaffold includes a minimal yet complete set of hooks, components, and utilities.
- Hello concept is demonstrated via UI text and sample components.

