# React 18 + TypeScript + Vite + Tailwind Scaffold

This repository is a production-ready scaffold for a React 18 project using TypeScript, Vite, and TailwindCSS.

What you get
- Public/index.html (minimal)
- src/ with:
  - main.tsx (React 18 entry with createRoot)
  - App.tsx (root app with responsive Tailwind layout)
  - components/ (Button, Card, Nav)
  - hooks/ (useToggle, useFetch)
  - utils/ (formatDate, classNames)
  - types/ (global types and Product type)
  - styles/index.css (Tailwind loading)
- Vite config suitable for HMR
- TSConfig and tsconfig.node.json
- Tailwind setup (tailwind.config.cjs) and PostCSS config
- ESLint + Prettier setup with ignore lists
- Example components/pages demonstrating usage
- README with setup/run instructions

How to run
1. Install dependencies
   npm install

2. Start the dev server
   npm run dev

3. Build for production
   npm run build

4. Preview production build
   npm run preview

Notes
- The UI is responsive using Tailwind CSS utility classes.
- Hello is printed on the main page as part of App.
- A sample useFetch demonstrates fetching product-like data.

This scaffold is ready to extend with real APIs, routing, and more components as needed.
