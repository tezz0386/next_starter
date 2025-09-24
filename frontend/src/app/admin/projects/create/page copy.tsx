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
      
      // const response = await window?.puter?.ai?.chat(chatMessages, { model: "gpt-5-nano" });
      
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

        
        // const message = response.message?.content ?? '';
      
        const message = "Here's a complete, production-ready React 18 application scaffold using TypeScript, Vite, and TailwindCSS with structure, tooling, linting/formatting, and example components/pages. It includes a working main page that prints \"Hello\" and demonstrates hooks, utilities, and types.\n\nNote: I’ve included exact content for the three files you asked for explicitly:\n- index.html (root)\n- tsconfig.node.json (minimal)\n- package.json (latest dependencies)\n\nThe rest of the scaffold is provided as code blocks for easy copy-paste into your project.\n\nProject structure (summary)\n- index.html (root entry)\n- public/ (static assets)\n- src/\n  - main.tsx (React 18 entry)\n  - App.tsx (root app with responsive Tailwind layout)\n  - components/ (Button, Card, Nav)\n  - hooks/ (useToggle, useFetch)\n  - utils/ (formatDate, classNames)\n  - types/ (Product type and global types)\n  - styles/index.css (Tailwind directives)\n- configs\n  - vite.config.ts\n  - tsconfig.json\n  - tsconfig.node.json (minimal)\n  - tailwind.config.cjs\n  - postcss.config.cjs\n- linting/formatting\n  - eslintrc.cjs\n  - .prettierrc\n  - .eslintignore\n  - .prettierignore\n- README.md\n\nKey notes\n- Hello is printed on the main page as part of App.tsx.\n- Tailwind utility classes are used for responsive layout and accessibility.\n- A simple, reusable component set demonstrates Button, Card, and Nav usage.\n- A generic useFetch hook fetches product-like data from fakestoreapi (demonstrating integration).\n- Product type demonstrates how you’d model domain data globally.\n\nExact content for required files\n\n1) index.html (root)\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>React 18 + TS + Vite + Tailwind Scaffold</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n```\n\n2) tsconfig.node.json (minimal)\n```json\n{\n  \"compilerOptions\": {\n    \"module\": \"commonjs\",\n    \"target\": \"es2020\",\n    \"lib\": [\"es2020\"],\n    \"strict\": false,\n    \"esModuleInterop\": true,\n    \"resolveJsonModule\": true\n  }\n}\n```\n\n3) package.json (latest dependencies)\nNote: This content uses \"latest\" for all dependencies to reflect the latest stable versions as of 2025. You may prefer pinning specific versions for reproducible builds.\n\n```json\n{\n  \"name\": \"react-ts-vite-tailwind-scaffold\",\n  \"version\": \"0.1.0\",\n  \"private\": true,\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview --port 5173\",\n    \"lint\": \"eslint \\\"src/**/*.{ts,tsx}\\\"\",\n    \"format\": \"prettier --write \\\"src/**/*.{ts,tsx,js,jsx,css}\\\"\"\n  },\n  \"dependencies\": {\n    \"react\": \"latest\",\n    \"react-dom\": \"latest\",\n    \"tailwindcss\": \"latest\",\n    \"autoprefixer\": \"latest\",\n    \"postcss\": \"latest\"\n  },\n  \"devDependencies\": {\n    \"typescript\": \"latest\",\n    \"vite\": \"latest\",\n    \"@types/react\": \"latest\",\n    \"@types/react-dom\": \"latest\",\n    \"eslint\": \"latest\",\n    \"eslint-config-prettier\": \"latest\",\n    \"eslint-plugin-react\": \"latest\",\n    \"eslint-plugin-react-hooks\": \"latest\",\n    \"prettier\": \"latest\"\n  }\n}\n```\n\nAdditional scaffolding (code blocks)\n\n4) src/main.tsx\n```tsx\nimport React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './styles/index.css';\n\n// React 18 entrypoint\nconst rootElement = document.getElementById('root');\nif (rootElement) {\n  const root = createRoot(rootElement);\n  root.render(\n    <React.StrictMode>\n      <App />\n    </React.StrictMode>\n  );\n}\n```\n\n5) src/App.tsx\n```tsx\nimport React from 'react';\nimport { Nav } from './components/Nav';\nimport { Card } from './components/Card';\nimport { Button } from './components/Button';\nimport { useFetch } from './hooks/useFetch';\nimport { Product } from './types';\nimport { useToggle } from './hooks/useToggle';\nimport { formatDate } from './utils/formatDate';\n\nconst App: React.FC = () => {\n  // Fetch a small set of products for demo\n  const { data: products, loading, error } = useFetch<Product[]>('https://fakestoreapi.com/products?limit=6');\n  const { on, toggle } = useToggle(false);\n\n  return (\n    <>\n      <Nav />\n      <main className=\"min-h-screen bg-gray-50\">\n        <section className=\"max-w-7xl mx-auto p-4\">\n          <div className=\"mb-6\">\n            <h1 className=\"text-3xl font-bold mb-2\">Hello</h1>\n            <p className=\"text-gray-600\">\n              This is a scaffolded React 18 + TypeScript + Vite + Tailwind app.\n            </p>\n          </div>\n\n          <section className=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6\">\n            {loading && (\n              <div className=\"col-span-full text-center text-gray-600\">Loading...</div>\n            )}\n            {error && (\n              <div className=\"col-span-full text-red-600\">Error: {error}</div>\n            )}\n            {!loading && products?.map((p) => (\n              <Card\n                key={p.id}\n                title={p.title}\n                description={p.description}\n                image={p.image}\n                price={p.price}\n                onClick={toggle}\n              />\n            ))}\n          </section>\n\n          {on && (\n            <section className=\"mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md\" aria-label=\"details-panel\">\n              <p className=\"text-sm text-blue-800\">Additional details panel is visible.</p>\n              <p className=\"text-xs text-blue-600\">Format date example: {formatDate(new Date())}</p>\n            </section>\n          )}\n\n          <div className=\"mt-6 flex gap-4\">\n            <Button onClick={toggle} variant=\"primary\">Toggle Details</Button>\n            <Button onClick={() => alert('Action example')} variant=\"secondary\">Action</Button>\n          </div>\n        </section>\n      </main>\n    </>\n  );\n};\n\nexport default App;\n```\n\n6) src/components/Nav.tsx\n```tsx\nimport React from 'react';\n\nexport const Nav: React.FC = () => {\n  return (\n    <header className=\"bg-white shadow-sm sticky top-0 z-50\">\n      <nav className=\"max-w-7xl mx-auto px-4 py-4 flex items-center justify-between\">\n        <div className=\"flex items-center gap-2\">\n          <span aria-label=\"logo\" className=\"w-8 h-8 bg-blue-600 rounded-full inline-block\" />\n          <span className=\"font-semibold text-xl\">Dyad Scaffold</span>\n        </div>\n        <ul className=\"hidden md:flex space-x-4 text-sm\">\n          <li><a href=\"#\" className=\"hover:underline\">Home</a></li>\n          <li><a href=\"#\" className=\"hover:underline\">Shop</a></li>\n          <li><a href=\"#\" className=\"hover:underline\">About</a></li>\n        </ul>\n      </nav>\n    </header>\n  );\n};\n```\n\n7) src/components/Card.tsx\n```tsx\nimport React from 'react';\nimport { classNames } from '../utils/classNames';\n\ntype CardProps = {\n  title: string;\n  description?: string;\n  price?: number;\n  image?: string;\n  onClick?: () => void;\n};\n\nexport const Card: React.FC<CardProps> = ({ title, description, price, image, onClick }) => {\n  return (\n    <article className={classNames('bg-white rounded-lg shadow p-4 flex flex-col', image ? '' : 'h-full')}>\n      {image && (\n        <img src={image} alt={title} className=\"h-40 w-full object-cover rounded mb-4\" />\n      )}\n      <div className=\"flex-1\">\n        <h3 className=\"text-lg font-semibold\">{title}</h3>\n        {description && <p className=\"text-sm text-gray-600 mt-2\">{description}</p>}\n        {typeof price === 'number' && <p className=\"mt-2 font-semibold\">${price.toFixed(2)}</p>}\n      </div>\n      <button\n        onClick={onClick}\n        className=\"mt-4 w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700\"\n      >\n        View\n      </button>\n    </article>\n  );\n};\n```\n\n8) src/components/Button.tsx\n```tsx\nimport React from 'react';\nimport { classNames } from '../utils/classNames';\n\ntype ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {\n  variant?: 'primary' | 'secondary';\n};\n\nexport const Button: React.FC<ButtonProps> = ({\n  variant = 'primary',\n  className,\n  children,\n  ...rest\n}) => (\n  <button\n    className={classNames(\n      'px-4 py-2 rounded-md focus:outline-none',\n      variant === 'primary'\n        ? 'bg-blue-600 text-white hover:bg-blue-700'\n        : 'bg-gray-200 text-gray-800 hover:bg-gray-300',\n      className\n    )}\n    {...rest}\n  >\n    {children}\n  </button>\n);\n```\n\n9) src/hooks/useToggle.ts\n```ts\nimport { useState } from 'react';\n\nexport const useToggle = (initial = false) => {\n  const [on, setOn] = useState<boolean>(initial);\n  const toggle = () => setOn((v) => !v);\n  const set = (value: boolean) => setOn(value);\n  return { on, toggle, set };\n};\n```\n\n10) src/hooks/useFetch.ts\n```ts\nimport { useEffect, useState } from 'react';\n\nexport const useFetch = <T,>(url: string) => {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState<boolean>(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    let mounted = true;\n    setLoading(true);\n    fetch(url)\n      .then((res) => {\n        if (!res.ok) throw new Error(`Error ${res.status}`);\n        return res.json();\n      })\n      .then((d) => {\n        if (mounted) {\n          setData(d as T);\n          setLoading(false);\n        }\n      })\n      .catch((err) => {\n        if (mounted) {\n          setError((err as Error).message);\n          setLoading(false);\n        }\n      });\n    return () => {\n      mounted = false;\n    };\n  }, [url]);\n\n  return { data, loading, error };\n};\n```\n\n11) src/utils/formatDate.ts\n```ts\nexport const formatDate = (\n  value: string | number | Date,\n  options?: Intl.DateTimeFormatOptions\n) => {\n  try {\n    const date = new Date(value);\n    return date.toLocaleDateString(undefined, {\n      year: 'numeric',\n      month: 'short',\n      day: 'numeric',\n      ...(options || {}),\n    });\n  } catch {\n    return String(value);\n  }\n};\n```\n\n12) src/utils/classNames.ts\n```ts\nexport const classNames = (...classes: Array<string | false | null | undefined>) =>\n  classes.filter(Boolean).join(' ');\n```\n\n13) src/types/index.ts\n```ts\nexport type Product = {\n  id: number;\n  title: string;\n  price: number;\n  description?: string;\n  image?: string;\n  category?: string;\n  rating?: { rate: number; count: number };\n};\n```\n\n14) src/styles/index.css\n```css\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Basic global styles for a clean baseline */\nhtml, body, #root {\n  height: 100%;\n}\nbody {\n  @apply bg-gray-50 text-gray-900;\n  margin: 0;\n  font-family: ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", Roboto;\n}\n```\n\n15) vite.config.ts\n```ts\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport path from 'path';\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    host: true,\n    port: 5173,\n    open: true\n  },\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, './src')\n    }\n  }\n});\n```\n\n16) tailwind.config.cjs\n```js\n/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: [\n    './index.html',\n    './src/**/*.{ts,tsx,js,jsx}',\n  ],\n  theme: {\n    extend: {\n      // Example extension; adjust as needed\n      colors: {\n        brand: '#1d4ed8'\n      }\n    }\n  },\n  plugins: [],\n};\n```\n\n17) postcss.config.cjs\n```js\nmodule.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n```\n\n18) tsconfig.json\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"lib\": [\"DOM\", \"DOM.Iterable\", \"ES2020\"],\n    \"jsx\": \"react-jsx\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"Node\",\n    \"strict\": true,\n    \"skipLibCheck\": true,\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true\n  },\n  \"include\": [\"src\"]\n}\n```\n\n19) ESLint + Prettier setup (example)\n\n19a) eslintrc.cjs\n```js\nmodule.exports = {\n  root: true,\n  parser: '@typescript-eslint/parser',\n  parserOptions: {\n    ecmaVersion: 2020,\n    sourceType: 'module',\n    ecmaFeatures: { jsx: true }\n  },\n  env: {\n    browser: true,\n    es2021: true,\n    node: true\n  },\n  plugins: ['@typescript-eslint', 'react', 'react-hooks'],\n  extends: [\n    'eslint:recommended',\n    'plugin:react/recommended',\n    'plugin:react-hooks/recommended',\n    'plugin:@typescript-eslint/recommended',\n    'plugin:prettier/recommended'\n  ],\n  settings: {\n    react: {\n      version: 'detect'\n    }\n  },\n  rules: {\n    // Example: enforce using React imports (optional with new JSX runtime)\n    'react/react-in-jsx-scope': 'off'\n  }\n};\n```\n\n19b) .prettierrc\n```json\n{\n  \"singleQuote\": true,\n  \"semi\": true,\n  \"printWidth\": 100,\n  \"trailingComma\": \"all\",\n  \"arrowParens\": \"always\"\n}\n```\n\n19c) .eslintignore\n```\nnode_modules/\ndist/\nbuild/\npublic/\ncoverage/\n```\n\n19d) .prettierignore\n```\nnode_modules/\ndist/\nbuild/\npublic/\n```\n\n20) README.md (setup and run instructions)\nExcerpt (you can expand as needed):\n\n- Prerequisites: Node.js 18+ (LTS) or newer.\n- Install: npm install\n- Run dev: npm run dev\n- Build: npm run build\n- Preview: npm run preview\n- Lint: npm run lint\n- Format: npm run format\n\nWhat this scaffold demonstrates\n- A responsive app layout using TailwindCSS utilities.\n- TypeScript typings for global Product type.\n- Reusable components: Button, Card, Nav.\n- Custom hooks: useToggle, useFetch.\n- Utility helpers: formatDate, classNames.\n- A minimal, production-oriented Vite + TS + Tailwind setup with ESLint + Prettier configuration.\n- Print \"Hello\" on the main page as requested to verify scaffold works.\n\nUsage tips\n- Replace the sample data endpoint in App.tsx (useFetch) with your own API as needed.\n- Extend Product type and data mapping as your domain grows.\n- Add more components/pages following the provided structure to scale the app.\n\nIf you’d like, I can tailor the scaffold to your preferred Node version, add routing (React Router), or replace the fakestore data with a local mock API.";
        console.log(message);
        
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
        react: `Create a complete, production-ready React 18 application scaffold using TypeScript, Vite, and TailwindCSS with the latest stable versions (as of 2025). 

          Requirements:

          1. Project layout
          - index.html in the project root as the main entrypoint (minimal).
          - public/ folder for static assets only (images, favicon, etc.).
          - src/ folder:
            - src/main.tsx: React 18 entry using createRoot.
            - src/App.tsx: root App component with responsive Tailwind layout.
            - src/components/: at least 3 reusable components (Button, Card, Nav).
            - src/hooks/: at least 2 custom hooks (useToggle, useFetch).
            - src/utils/: at least 2 utility functions (formatDate, classNames).
            - src/types/: global types and a sample 'Product' type.
            - src/styles/index.css: loads Tailwind directives (@tailwind base, components, utilities).

          2. Tooling & config
          - Vite config (vite.config.ts) configured for React + TypeScript and Hot Module Replacement.
          - tsconfig.json and minimal tsconfig.node.json for node tooling.
          - package.json with scripts: dev, build, preview, lint, format.
          - Tailwind config (tailwind.config.cjs) with content paths and basic theme extend.
          - PostCSS config if needed.

          3. Linting & formatting
          - ESLint for TypeScript + React (eslintrc.cjs) with recommended rules and Prettier integration.
          - Prettier config (.prettierrc) and ignore files (.eslintignore, .prettierignore).

          4. Example components and pages
          - Responsive, accessible examples using Tailwind CSS utility classes.
          - Example usage of hooks, utils, and types in the app.
          - Print "Hello" on the main page to verify the scaffold works.

          5. Additional
          - README with setup and run instructions.
          - Keep code concise and clear, include inline comments where helpful.
          - Use latest stable versions for all dependencies.

          Also generate **exact content** for:
          - index.html (root)
          - tsconfig.node.json (minimal)
          - package.json (latest dependencies)`,

        
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
