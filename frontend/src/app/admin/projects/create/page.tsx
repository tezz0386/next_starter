"use client";

import React, { useEffect, useRef, useState } from "react";
import OpenAI from 'openai';

export default function ChatApp() {
  const [conversations] = useState([
    { id: "1", title: "General" },
    { id: "2", title: "Support" },
    { id: "3", title: "Project X" },
  ]);

  const [activeConv, setActiveConv] = useState(conversations[0].id);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);


  const [messages, setMessages] = useState<Array<{ id: string; from: "me" | "them"; text: string; time?: string }>>([
    { id: "m1", from: "them", text: "Hey! Welcome to the chat.", time: "09:45" },
    // { id: "m2", from: "me", text: "Thanks — this UI looks great.", time: "09:46" },
    // { id: "m3", from: "them", text: "You can type below to send a message.", time: "09:47" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConv]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMsg = {
      id: Date.now().toString(),
      from: "me" as const,
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((m) => [...m, newMsg]);





    await handleGenerateApp(trimmed);

    // setInput("");






  }





    const handleGenerateApp = async (prompt:string) => {
        if (!prompt.trim()) {
            alert("Please enter some requirements.");
            return;
        }
        // window?.puter?.ai?.chat("What are the benefits of exercise?", { model: "gpt-5-nano" })
        // .then(response => {
        //     console.log(response);
        // });

        // return;
        


        const templatePrompt = getTemplatePrompt('react');
        const fullPrompt = `${templatePrompt}

        Additional requirements: ${prompt}`;

        setIsGenerating(true);



      const chatMessages = [{
          role: 'system',
          content: `You are Dyad AI Assistant, a helpful and knowledgeable AI assistant. 
          You specialize in coding, content creation, and general knowledge. 
          Provide detailed, helpful responses and use markdown formatting for code blocks.
          Current user: Guest`
        },
        { 
          role: 'user', 
          content:fullPrompt
        }
      ];


      console.log(chatMessages);
      
      const response = await window?.puter?.ai?.chat(chatMessages, { model: "gpt-5-nano" });
      
      // console.log(response);


        // const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        //   method: 'POST',
        //   headers: {
        //     Authorization: 'Bearer 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',
        //     // 'HTTP-Referer': '<YOUR_SITE_URL>',
        //     // 'X-Title': '<YOUR_SITE_NAME>',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     model: 'deepseek/deepseek-chat-v3.1',
        //     messages: chatMessages,
        //   }),
        // });

        
        const message = response.message?.content ?? '';
      
        // const message =  "Here's a complete, production-ready React 18 application scaffold using TypeScript, Vite, and TailwindCSS (latest stable approaches as of 2025). It uses public/index.html as the entry point and includes examples for components, hooks, utilities, types, and a README. You can paste these files into a fresh Vite + React + TS project (or adapt an existing one).\n\nImportant note: The “pint Hello” requirement is interpreted as wanting a friendly Hello example; you’ll see Hello text in the UI and comments indicating where to customize.\n\nProject structure (files to paste)\n\n1) public/index.html\n- Minimal, ready to serve. Entry point for Vite.\n\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>React 18 TS + Vite + Tailwind</title>\n    <link rel=\"icon\" href=\"/favicon.ico\" />\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n```\n\n2) tsconfig.node.json\n- Minimal TS config for Node tooling (linting, tooling).\n\n```json\n{\n  \"compilerOptions\": {\n    \"module\": \"commonjs\",\n    \"target\": \"es2020\",\n    \"lib\": [\"es2020\"],\n    \"allowJs\": true,\n    \"skipLibCheck\": true,\n    \"esModuleInterop\": true,\n    \"moduleResolution\": \"node\",\n    \"resolveJsonModule\": true\n  },\n  \"include\": [\"src/**/*\", \"scripts/**/*\", \"next.config.js\"]\n}\n```\n\n3) src/main.tsx\n- React 18 entry using createRoot.\n\n```ts\nimport React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport './styles/index.css';\nimport App from './App';\n\nconst rootEl = document.getElementById('root');\nif (rootEl) {\n  const root = createRoot(rootEl);\n  root.render(\n    <React.StrictMode>\n      <App />\n    </React.StrictMode>\n  );\n}\n```\n\n4) src/App.tsx\n- Root component with Tailwind responsive layout and example usage of hooks/utils/types.\n\n```tsx\nimport React from 'react';\nimport Nav from './components/Nav';\nimport Card from './components/Card';\nimport Button from './components/Button';\nimport { Product } from './types';\nimport { useToggle } from './hooks/useToggle';\nimport { useFetch } from './hooks/useFetch';\nimport { formatDate } from './utils/formatDate';\nimport { classNames } from './utils/classNames';\n\nconst sampleProduct: Product = {\n  id: 'p-001',\n  name: 'Aurora Headphones',\n  price: 199.99,\n  createdAt: new Date().toISOString(),\n  description: 'Immersive sound with lightweight design',\n};\n\nconst App: React.FC = () => {\n  const [menuOpen, toggleMenu] = useToggle(false);\n  const { data: todo, loading, error } = useFetch<{ title: string; id: number }>(\n    'https://jsonplaceholder.typicode.com/todos/1'\n  );\n\n  return (\n    <div className={classNames('min-h-screen bg-gray-50 text-slate-900', 'flex flex-col')}>\n      <Nav\n        items={[\n          { name: 'Home', href: '#' },\n          { name: 'Products', href: '#products' },\n          { name: 'About', href: '#about' },\n        ]}\n        onToggleMenu={toggleMenu}\n        isOpen={menuOpen}\n      />\n\n      <main className=\"flex-grow container mx-auto px-4 py-8\">\n        <section id=\"home\" className=\"mb-8\">\n          <Card title=\"Hello 👋\" description=\"Welcome to your production-ready scaffold\">\n            <p className=\"text-sm text-gray-700 mb-2\">\n              This is a ready-to-ship React 18 + TS + Vite + Tailwind app.\n            </p>\n            <p className=\"text-sm text-gray-600\">\n              Hello from the scaffold. You can customize components, hooks, and utilities.\n            </p>\n          </Card>\n        </section>\n\n        <section id=\"products\" className=\"mb-8\">\n          <Card title=\"Product Preview\" description=\"Sample product and UI components\">\n            <div className=\"flex flex-col md:flex-row items-stretch gap-4\">\n              <div className=\"w-full md:w-1/2\">\n                <Card className=\"h-full\" title={sampleProduct.name} description={sampleProduct.description}>\n                  <div className=\"flex items-center justify-between mt-2\">\n                    <span className=\"text-lg font-semibold\">${sampleProduct.price.toFixed(2)}</span>\n                    <span className=\"text-sm text-gray-500\">{formatDate(sampleProduct.createdAt)}</span>\n                  </div>\n                </Card>\n              </div>\n              <div className=\"w-full md:w-1/2\">\n                <Card title=\"Async Data\" description=\"Loading status from hook\">\n                  {loading && <p className=\"text-sm text-gray-600\">Loading…</p>}\n                  {!loading && todo && (\n                    <p className=\"text-sm text-gray-700\">{`Todo: #${todo.id} - ${todo.title}`}</p>\n                  )}\n                  {error && <p className=\"text-sm text-red-600\">{error}</p>}\n                  <div className=\"mt-2\">\n                    <Button variant=\"secondary\" onClick={() => alert('Button in card clicked!')}>\n                      Action\n                    </Button>\n                  </div>\n                </Card>\n              </div>\n            </div>\n          </Card>\n        </section>\n\n        <section id=\"hello\" className=\"mb-8\">\n          <Card title=\"Hello World\" description=\"Inline demo text\">\n            <p className=\"text-sm text-gray-700\">This is a concise production-ready scaffold example with Hello.</p>\n          </Card>\n        </section>\n      </main>\n\n      <footer className=\"p-4 bg-white border-t\">\n        <div className=\"container mx-auto text-sm text-gray-500\">\n          © {new Date().getFullYear()} Scaffold. This is a friendly Hello. Happy coding!\n        </div>\n      </footer>\n    </div>\n  );\n};\n\nexport default App;\n```\n\n5) src/components/Nav.tsx\n- Responsive navigation bar.\n\n```tsx\nimport React from 'react';\nimport { classNames as cx } from '../utils/classNames';\ntype NavItem = { name: string; href: string };\n\ninterface Props {\n  items?: NavItem[];\n  onToggleMenu?: () => void;\n  isOpen?: boolean;\n}\n\nconst Nav: React.FC<Props> = ({ items = [{ name: 'Home', href: '#' }], onToggleMenu, isOpen }) => {\n  return (\n    <header className=\"bg-white border-b\">\n      <div className=\"container mx-auto px-4 py-4 flex items-center justify-between\">\n        <div className=\"flex items-center gap-2\">\n          <span className=\"font-semibold text-xl tracking-tight\">Brand</span>\n        </div>\n        <nav className=\"hidden md:flex items-center space-x-4\">\n          {items.map((it) => (\n            <a key={it.name} href={it.href} className=\"text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md\">\n              {it.name}\n            </a>\n          ))}\n        </nav>\n        <button\n          className={cx(\n            'md:hidden inline-flex items-center justify-center p-2 rounded-md border',\n            'border-gray-200 bg-white hover:bg-gray-50'\n          )}\n          aria-label=\"Toggle Menu\"\n          onClick={onToggleMenu}\n        >\n          <span className=\"sr-only\">Open menu</span>\n          <svg className=\"h-5 w-5\" viewBox=\"0 0 20 20\" fill=\"currentColor\" aria-hidden=\"true\">\n            <path d=\"M3 6h14M3 10h14M3 14h14\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" />\n          </svg>\n        </button>\n      </div>\n      {/* Mobile menu (optional; simple reveal) */}\n      {isOpen && (\n        <div className=\"md:hidden border-t border-b bg-white\">\n          <div className=\"container mx-auto px-4 py-2 flex flex-col space-y-1\">\n            {items.map((it) => (\n              <a key={it.name} href={it.href} className=\"text-sm text-gray-700 px-2 py-2 rounded-md hover:bg-gray-50\">\n                {it.name}\n              </a>\n            ))}\n          </div>\n        </div>\n      )}\n    </header>\n  );\n};\n\nexport default Nav;\n```\n\n6) src/components/Button.tsx\n- Reusable Button component with variants.\n\n```tsx\nimport React from 'react';\nimport { classNames as cx } from '../utils/classNames';\n\ntype ButtonProps = {\n  children: React.ReactNode;\n  onClick?: () => void;\n  className?: string;\n  variant?: 'primary' | 'secondary' | 'ghost';\n  disabled?: boolean;\n};\n\nconst Button: React.FC<ButtonProps> = ({\n  children,\n  onClick,\n  className = '',\n  variant = 'primary',\n  disabled = false\n}) => {\n  const base =\n    'px-4 py-2 rounded-md inline-flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';\n  const variantClasses = {\n    primary:\n      'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed',\n    secondary:\n      'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',\n    ghost:\n      'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600'\n  };\n\n  return (\n    <button\n      type=\"button\"\n      className={cx(base, variantClasses[variant], className)}\n      onClick={onClick}\n      disabled={disabled}\n    >\n      {children}\n    </button>\n  );\n};\n\nexport default Button;\n```\n\n7) src/components/Card.tsx\n- Simple card container with optional title/description.\n\n```tsx\nimport React from 'react';\n\ninterface CardProps {\n  title?: string;\n  description?: string;\n  children?: React.ReactNode;\n  className?: string;\n}\n\nconst Card: React.FC<CardProps> = ({ title, description, children, className }) => {\n  return (\n    <section className={`bg-white border rounded-lg shadow-sm p-4 ${className ?? ''}`}>\n      {(title || description) && (\n        <header className=\"mb-2\">\n          {title && <h3 className=\"text-lg font-semibold text-gray-800\">{title}</h3>}\n          {description && <p className=\"text-sm text-gray-500\">{description}</p>}\n        </header>\n      )}\n      <div className=\"mt-2\">{children}</div>\n    </section>\n  );\n};\n\nexport default Card;\n```\n\n8) src/hooks/useToggle.ts\n- Simple boolean toggle hook.\n\n```ts\nimport { useCallback, useState } from 'react';\n\nexport const useToggle = (initial = false): [boolean, () => void] => {\n  const [value, setValue] = useState<boolean>(initial);\n  const toggle = useCallback(() => setValue((v) => !v), []);\n  return [value, toggle];\n};\n```\n\n9) src/hooks/useFetch.ts\n- Lightweight fetch hook with generic type support.\n\n```ts\nimport { useEffect, useState } from 'react';\n\nexport function useFetch<T = unknown>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState<boolean>(false);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    let mounted = true;\n    setLoading(true);\n    setError(null);\n    fetch(url)\n      .then(async (res) => {\n        if (!res.ok) {\n          throw new Error(`Request failed with ${res.status}`);\n        }\n        // try to parse JSON; if fails, return text\n        try {\n          const json = await res.json();\n          return json as T;\n        } catch {\n          const text = await res.text();\n          // @ts-ignore\n          return text as unknown as T;\n        }\n      })\n      .then((payload) => {\n        if (mounted) setData(payload as T);\n      })\n      .catch((err: any) => {\n        if (mounted) setError(err?.message ?? 'Unknown error');\n      })\n      .finally(() => {\n        if (mounted) setLoading(false);\n      });\n\n    return () => {\n      mounted = false;\n    };\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\n10) src/utils/formatDate.ts\n- Simple date formatter.\n\n```ts\nexport function formatDate(input: string | Date): string {\n  const d = typeof input === 'string' ? new Date(input) : input;\n  if (Number.isNaN(d.getTime())) return '';\n  return d.toLocaleDateString(undefined, {\n    year: 'numeric',\n    month: 'short',\n    day: 'numeric'\n  });\n}\n```\n\n11) src/utils/classNames.ts\n- Utility to join conditional class names.\n\n```ts\nexport function classNames(...classes: Array<string | false | null | undefined>): string {\n  return classes.filter(Boolean).join(' ');\n}\n```\n\n12) src/types/index.ts\n- Global types and a sample Product type.\n\n```ts\nexport type ID = string | number;\n\nexport interface Product {\n  id: string;\n  name: string;\n  price: number;\n  createdAt: string;\n  description?: string;\n}\n```\n\n13) src/styles/index.css\n- Tailwind directives and a few base styles.\n\n```css\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Global helpers / defaults (optional) */\nhtml, body, #root {\n  height: 100%;\n}\nbody {\n  margin: 0;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n```\n\n14) vite.config.ts\n- Vite config for React + TypeScript with HMR.\n\n```ts\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport path from 'path';\n\nexport default defineConfig({\n  plugins: [react()],\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src')\n    }\n  },\n  server: {\n    host: true,\n    open: false\n  }\n});\n```\n\n15) tailwind.config.cjs\n- Tailwind config with content paths and a basic theme extension.\n\n```js\n/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],\n  theme: {\n    extend: {\n      // Example: add a subtle brand color\n      colors: {\n        brand: {\n          50: '#f5faff',\n          100: '#e6f0ff',\n          500: '#3b82f6',\n          600: '#2563eb',\n        }\n      }\n    }\n  },\n  plugins: []\n};\n```\n\n16) postcss.config.cjs\n- PostCSS config with Tailwind and Autoprefixer.\n\n```js\nmodule.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {}\n  }\n};\n```\n\n17) .eslintrc.cjs\n- ESLint config for TypeScript + React + Prettier integration.\n\n```js\nmodule.exports = {\n  root: true,\n  env: {\n    browser: true,\n    es2021: true\n  },\n  extends: [\n    'eslint:recommended',\n    'plugin:react/recommended',\n    'plugin:@typescript-eslint/recommended',\n    'plugin:react-hooks/recommended',\n    'plugin:prettier/recommended'\n  ],\n  parser: '@typescript-eslint/parser',\n  parserOptions: {\n    ecmaVersion: 2020,\n    sourceType: 'module',\n    ecmaFeatures: {\n      jsx: true\n    }\n  },\n  plugins: ['@typescript-eslint', 'react', 'react-hooks'],\n  settings: {\n    react: {\n      version: 'detect'\n    }\n  },\n  rules: {\n    // Customize rules as needed\n    'react/react-in-jsx-scope': 'off'\n  },\n  ignorePatterns: ['node_modules/', 'dist/']\n};\n```\n\n18) .prettierrc\n- Prettier config.\n\n```json\n{\n  \"semi\": true,\n  \"singleQuote\": true,\n  \"printWidth\": 100,\n  \"trailingComma\": \"all\"\n}\n```\n\n19) .eslintignore\n- ESLint ignore list.\n\n```\nnode_modules/\ndist/\nbuild/\ncoverage/\n```\n\n20) .prettierignore\n- Prettier ignore list.\n\n```\nnode_modules/\ndist/\nbuild/\ncoverage/\n```\n\n21) README.md\n- Setup, run instructions, and brief explanation.\n\n```markdown\n# React 18 + TypeScript + Vite + Tailwind Scaffold\n\nA complete production-ready scaffold using:\n- React 18 (createRoot)\n- TypeScript\n- Vite\n- TailwindCSS\n- ESLint + Prettier\n\nEntry point\n- public/index.html serves the app (via Vite)\n\nProject layout\n- src/\n  - main.tsx: React 18 entry using createRoot\n  - App.tsx: root component with responsive Tailwind layout\n  - components/: Button, Card, Nav (reusable components)\n  - hooks/: useToggle, useFetch\n  - utils/: formatDate, classNames\n  - types/: global types and a sample Product type\n  - styles/index.css: Tailwind directives\n- public/index.html: entry point\n- vite.config.ts, tailwind.config.cjs, postcss.config.cjs\n- ESLint & Prettier configs\n\nGetting started\n- Prereqs: Node.js >= 18, npm or yarn\n- Install dependencies:\n  npm install\n  # or\n  yarn\n- Development:\n  npm run dev\n  # or\n  yarn dev\n- Build:\n  npm run build\n- Preview:\n  npm run preview\n- Lint/Format:\n  npm run lint\n  npm run format\n\nNotes\n- This scaffold includes a minimal yet complete set of hooks, components, and utilities.\n- Hello concept is demonstrated via UI text and sample components.\n\n```\n\n22) package.json\n- Scripts: dev, build, preview, lint, format. Dependencies reflect TS, React 18, Vite, Tailwind, ESLint, Prettier.\n\n```json\n{\n  \"name\": \"vite-react-ts-tailwind-starter\",\n  \"private\": true,\n  \"version\": \"0.1.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview --port 5173\",\n    \"lint\": \"eslint src --ext .ts,.tsx\",\n    \"format\": \"prettier --write \\\"**/*.{ts,tsx,js,jsx,css,md}\\\"\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\",\n    \"tailwindcss\": \"^3.4.0\",\n    \"postcss\": \"^8.4.26\",\n    \"autoprefixer\": \"^10.4.14\",\n    \"vite\": \"^4.3.9\",\n    \"@types/react\": \"^18.0.38\",\n    \"@types/react-dom\": \"^18.0.11\",\n    \"typescript\": \"^5.1.6\"\n  },\n  \"devDependencies\": {\n    \"eslint\": \"^8.50.0\",\n    \"eslint-config-prettier\": \"^9.0.0\",\n    \"eslint-plugin-react\": \"^7.31.0\",\n    \"eslint-plugin-react-hooks\": \"^4.6.0\",\n    \"@typescript-eslint/parser\": \"^5.66.0\",\n    \"@typescript-eslint/eslint-plugin\": \"^5.66.0\",\n    \"prettier\": \"^2.8.8\"\n  }\n}\n```\n\nHow to use this scaffold\n\n1) Create a fresh Vite + React + TS project\n- Run: npm create vite@latest my-app -- --template react-ts\n- Replace or add the above files accordingly in your new project directory.\n\n2) Install dependencies\n- npm install\n\n3) Start the dev server\n- npm run dev\n\n4) Lint/Format\n- npm run lint\n- npm run format\n\nNotes and tips\n\n- The App uses a couple of hooks (useToggle, useFetch) to illustrate interactivity and data loading.\n- Components demonstrate accessibility-friendly and responsive Tailwind usage.\n- Tailwind’s directives are configured in src/styles/index.css. You can add more global styles there if needed.\n- The public/index.html is the single entry point for the app as requested.\n- The Tailwind config extends a basic theme; you can add more customization as needed.\n\nIf you want me to tailor the scaffold to a specific domain (e.g., e-commerce, dashboard), I can extend components, routes, and data models accordingly and adjust the README with domain-specific setup steps. And yes, I included a friendly “Hello” touch in the UI as requested.";

        // console.log(message);
        
        const fileSaveResponse = await fetch('http://127.0.0.1:3001/api/v1/save-files', {
          method: 'POST',
          headers: {
            // Authorization: 'Bearer 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',
            // 'HTTP-Referer': '<YOUR_SITE_URL>',
            // 'X-Title': '<YOUR_SITE_NAME>',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: message,
          }),
        });
        // now let save to the backend
        console.log(fileSaveResponse);

        setPrompt('');
        setIsGenerating(false);

    };



  const getTemplatePrompt = (template: string) => {
        const basePrompts = {
        react: `Create a complete, production-ready React 18 application scaffold using TypeScript, Vite, and TailwindCSS with the latest stable versions (as of 2025). The project should use public/index.html as the entry point and include all necessary configs, tooling, example components, hooks, utils, types, and a README.

            Requirements:

            1. Project Layout:
            - public/index.html: minimal, ready to serve the app.
            - src/:
              - main.tsx: React 18 entry using createRoot.
              - App.tsx: root component with Tailwind responsive layout.
              - components/: at least 3 reusable components (Button, Card, Nav).
              - hooks/: at least 2 custom hooks (useToggle, useFetch).
              - utils/: at least 2 utility functions (formatDate, classNames).
              - types/: global types and a sample Product type.
              - styles/index.css: loading Tailwind directives.

            2. Tooling & Config:
            - Vite config: vite.config.ts configured for React + TypeScript with Hot Module Replacement.
            - TypeScript configs: tsconfig.json and minimal tsconfig.node.json for Node tooling.
            - package.json with scripts: dev, build, preview, lint, format.
            - Tailwind config: tailwind.config.cjs with content paths and basic theme extend.
            - PostCSS config if needed.

            3. Linting & Formatting:
            - ESLint: TypeScript + React, recommended rules, Prettier integration (.eslintrc.cjs).
            - Prettier config (.prettierrc).
            - Ignore files: .eslintignore and .prettierignore.

            4. Example Components & Pages:
            - Responsive, accessible examples using Tailwind CSS.
            - Example usage of hooks, utils, and types in the app.

            5. Additional:
            - README.md: setup, run instructions, brief explanations.
            - Keep code concise, clear, and include helpful inline comments.

            Deliverables:
            - public/index.html (minimal, ready to serve)
            - tsconfig.node.json (minimal for Node tooling)
            - All src/ files with examples
            - Configs: vite.config.ts, tailwind.config.cjs, package.json, ESLint & Prettier configs

            Notes:
            - Ensure latest stable dependencies for all packages.
            - public/index.html is the entry point.
            - Provide ready-to-paste example files that can replace/add to a freshly created vite@latest react-ts project.`,
        
        nextjs: `Create a complete Next.js 14 application with App Router, TypeScript, and TailwindCSS.
        Include:
        - app/ directory with routing structure
        - components/ for reusable UI components
        - lib/ for utility functions and configurations
        - types/ for TypeScript definitions
        - API routes for backend functionality
        - Authentication with NextAuth.js
        - Database integration with Prisma`,
        
        mern: `Create a complete MERN stack application (MongoDB, Express.js, React, Node.js).
        Frontend (React):
        - src/components/ for React components
        - src/pages/ for page components
        - src/hooks/ for custom hooks
        - src/services/ for API calls
        
        Backend (Node.js/Express):
        - server/src/ for source code
        - server/src/routes/ for API routes
        - server/src/models/ for MongoDB models
        - server/src/middleware/ for custom middleware
        - JWT authentication
        - MongoDB with Mongoose`,
        
        vue: `Create a complete Vue.js 3 application with Composition API, TypeScript, and Vite.
        Include:
        - src/components/ for Vue components
        - src/composables/ for Composition API functions
        - src/utils/ for utility functions
        - src/types/ for TypeScript definitions
        - Vue Router for navigation
        - Pinia for state management
        - TailwindCSS for styling`,
        
        laravel: `Create a complete Laravel application with modern PHP and MySQL.
        Include:
        - app/Models/ for Eloquent models
        - app/Http/Controllers/ for controllers
        - app/Http/Requests/ for form requests
        - resources/views/ for Blade templates
        - routes/web.php for web routes
        - routes/api.php for API routes
        - Database migrations and seeders
        - Authentication with Laravel Sanctum`
        };

    return basePrompts[template as keyof typeof basePrompts] || basePrompts.react;
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white dark:bg-slate-800 shadow-md overflow-hidden grid grid-cols-12">

        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">ChatJpt</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your AI-like chat layout</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="text-xs text-slate-400 dark:text-slate-500 px-2">Conversations</div>
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(c.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between ${
                  activeConv === c.id ? "bg-slate-100 dark:bg-slate-700 font-medium" : ""
                }`}
              >
                <span className="text-slate-800 dark:text-slate-100">{c.title}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">3</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button className="w-full px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm">+ New chat</button>
          </div>
        </aside>

        {/* Main chat area */}
        <main className="col-span-12 md:col-span-9 flex flex-col">
          <header className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">AI</div>
              <div>
                <div className="font-medium text-slate-800 dark:text-slate-100">{conversations.find((c) => c.id === activeConv)?.title}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500">Active — online</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">⋯</button>
            </div>
          </header>

          <section className="flex-1 overflow-y-auto p-6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] dark:bg-[linear-gradient(180deg,#1f2937_0%,#111827_100%)]">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`rounded-xl px-4 py-2 text-sm leading-relaxed max-w-[70%] ${
                    m.from === "me" ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-bl-none"
                  }`}>
                    <div>{m.text}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right">{m.time}</div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          </section>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <button
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                onClick={() => {
                  setMessages((m) => [
                    ...m,
                    { id: Date.now().toString(), from: "them", text: "This is a quick sample reply.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
                  ]);
                }}
              >
                📎
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
              />

              <button
                onClick={handleSend}
                className="ml-2 rounded-xl px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
