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
          content: `You are AI Assistant, a helpful and knowledgeable AI assistant. 
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
      
        // const message =  "Below is a complete, production-ready React 18 + TypeScript scaffold using Vite and TailwindCSS, designed as a drop-in replacement for a fresh vite@latest react-ts project. It includes all requested parts: public/index.html, src with components/hooks/utils/types, tooling configs (Vite, TS, Tailwind, ESLint, Prettier, etc.), and a README. It also prints “Hello World” as part of the demo.\n\nNote: All code blocks are wrapped in Markdown code blocks as requested. TypeScript files are shown with the JS block label per your heuristic.\n\npublic/index.html\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>React TS Tailwind Scaffold</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n```\n\ntsconfig.node.json\n```json\n{\n  \"compilerOptions\": {\n    \"module\": \"commonjs\",\n    \"target\": \"es2020\",\n    \"lib\": [\"es2020\"],\n    \"strict\": false\n  }\n}\n```\n\ntsconfig.json\n```json\n{\n  \"compilerOptions\": {\n    \"target\": \"es2020\",\n    \"lib\": [\"dom\", \"dom.iterable\", \"es2020\"],\n    \"jsx\": \"react-jsx\",\n    \"module\": \"esnext\",\n    \"moduleResolution\": \"node\",\n    \"allowJs\": true,\n    \"skipLibCheck\": true,\n    \"strict\": true,\n    \"forceConsistentCasingInFileNames\": true,\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"esModuleInterop\": true,\n    \"useDefineForClassFields\": true\n  },\n  \"include\": [\"src\"]\n}\n```\n\nvite.config.ts\n```ts\nimport { defineConfig } from 'vite'\nimport react from '@vitejs/plugin-react'\n\nexport default defineConfig({\n  plugins: [react()],\n  server: {\n    port: 5173,\n    host: true\n  }\n})\n```\n\ntailwind.config.cjs\n```js\n/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],\n  theme: {\n    extend: {}\n  },\n  plugins: []\n}\n```\n\npostcss.config.cjs\n```js\nmodule.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {}\n  }\n}\n```\n\npublic/styles (not a separate folder, Tailwind is loaded via src/styles)\n\nsrc/styles/index.css\n```css\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Optional: global styles for accessibility / typography */\n:root {\n  --bg: 0 0 0;\n}\n```\n\nsrc/main.tsx\n```js\nimport React from 'react'\nimport { createRoot } from 'react-dom/client'\nimport './styles/index.css'\nimport App from './App'\n\nconst rootEl = document.getElementById('root')\nif (rootEl) {\n  createRoot(rootEl).render(\n    <React.StrictMode>\n      <App />\n    </React.StrictMode>\n  )\n}\n```\n\nsrc/App.tsx\n```js\nimport React from 'react'\nimport Nav from './components/Nav'\nimport Card from './components/Card'\nimport Button from './components/Button'\nimport { Product } from './types'\nimport { formatDate } from './utils/formatDate'\nimport { useToggle } from './hooks/useToggle'\nimport { coerceToNumber } from './utils/classNames' // small helper usage example\n\n// Simple Hello World demonstration\nconst HelloWorld = () => <span className=\"font-semibold text-blue-600\">Hello World</span>\n\nconst sampleProduct: Product = {\n  id: 'p-1001',\n  name: 'Aurora Headphones',\n  price: 149.99,\n  dateAdded: new Date().toISOString()\n}\n\nexport default function App() {\n  const [isPanelOpen, togglePanel] = useToggle(false)\n\n  return (\n    <div className=\"min-h-screen bg-gray-50 text-gray-900\">\n      <Nav />\n      <main className=\"max-w-7xl mx-auto p-4 space-y-6\">\n        <section className=\"rounded-lg bg-white shadow p-4 md:p-6\" aria-label=\"intro\">\n          <div className=\"flex items-center gap-3\">\n            <div className=\"h-9 w-9 rounded-full bg-blue-500 text-white flex items-center justify-center\" aria-label=\"logo\">\n              🪶\n            </div>\n            <div>\n              <h1 className=\"text-2xl font-semibold\">React 18 + TS + Tailwind Scaffold</h1>\n              <p className=\"text-sm text-gray-600\">A ready-to-run app with examples of components, hooks, utilities, and types.</p>\n            </div>\n          </div>\n          <div className=\"mt-4\">\n            <HelloWorld />\n          </div>\n        </section>\n\n        <section aria-label=\"cards\" className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n          <Card title=\"Product Spotlight\" subtitle={`Last updated: ${formatDate(sampleProduct.dateAdded)}`} className=\"\">\n            <p className=\"text-sm text-gray-700\">\n              {sampleProduct.name} is available for <strong>${sampleProduct.price.toFixed(2)}</strong>.\n            </p>\n            <p className=\"text-xs text-gray-500 mt-1\">Product ID: {sampleProduct.id}</p>\n          </Card>\n\n          <Card title=\"Interactivity\" subtitle=\"Demo components\" className=\"\">\n            <div className=\"space-y-2\">\n              <Button variant=\"primary\" onClick={() => alert('Button clicked!')}>Primary Action</Button>\n              <Button variant=\"secondary\" onClick={() => alert('Secondary action')}>Secondary Action</Button>\n              <div className={classNames('mt-2', coerceToNumber('1') ? 'text-green-600' : 'text-red-600')}>\n                State: Toggle panel is {isPanelOpen ? 'OPEN' : 'CLOSED'}\n              </div>\n              {isPanelOpen && (\n                <div className=\"p-2 rounded border border-gray-200 bg-gray-50 text-sm\">\n                  This panel is toggled with useToggle hook.\n                </div>\n              )}\n              <button\n                onClick={togglePanel}\n                className=\"px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200\"\n              >\n                Toggle Panel\n              </button>\n            </div>\n          </Card>\n\n          <Card title=\"Utilities\" subtitle=\"Small helpers in TS\" className=\"\">\n            <div className=\"text-sm text-gray-700 space-y-1\">\n              <div>formatDate(new Date()) -> {formatDate(new Date())}</div>\n              <div>classNames helper available.</div>\n            </div>\n          </Card>\n        </section>\n      </main>\n    </div>\n  )\n}\n\n// Small helper to showcase inline TS usage\nfunction classNames(...args: any[]) {\n  return args.filter(Boolean).join(' ')\n}\n```\n\nsrc/components/Button.tsx\n```js\nimport React from 'react'\n\ntype ButtonProps = {\n  onClick?: () => void\n  children: React.ReactNode\n  variant?: 'primary' | 'secondary'\n  className?: string\n}\n\nexport default function Button({ onClick, children, variant = 'primary', className = '' }: ButtonProps) {\n  const base = 'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors'\n  const color =\n    variant === 'primary'\n      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'\n      : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500'\n\n  return (\n    <button onClick={onClick} className={[base, color, className].join(' ')} type=\"button\">\n      {children}\n    </button>\n  )\n}\n```\n\nsrc/components/Card.tsx\n```js\nimport React from 'react'\nimport { classNames } from '../utils/classNames' // optional, reuse helper if you want\n\ninterface CardProps {\n  title: string\n  subtitle?: string\n  children?: React.ReactNode\n  className?: string\n}\n\nexport default function Card({ title, subtitle, children, className }: CardProps) {\n  return (\n    <section className={classNames('bg-white border border-gray-200 rounded-lg shadow-sm p-4', className)}>\n      <header className=\"mb-2\">\n        <h3 className=\"text-lg font-semibold\">{title}</h3>\n        {subtitle && <p className=\"text-sm text-gray-500\">{subtitle}</p>}\n      </header>\n      <div>{children}</div>\n    </section>\n  )\n}\n```\n\nsrc/components/Nav.tsx\n```js\nimport React from 'react'\n\nexport default function Nav() {\n  return (\n    <nav className=\"bg-white border-b border-gray-200\" aria-label=\"Main navigation\">\n      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\">\n        <div className=\"flex items-center justify-between h-16\">\n          <div className=\"flex items-center gap-3\">\n            <div className=\"h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center\">\n              🚀\n            </div>\n            <span className=\"font-semibold text-xl\">Scaffold</span>\n          </div>\n          <div className=\"hidden md:flex space-x-4\" aria-label=\"Navigation links\">\n            <a href=\"#\" className=\"text-sm font-medium text-gray-700 hover:text-blue-600\">\n              Home\n            </a>\n            <a href=\"#\" className=\"text-sm font-medium text-gray-700 hover:text-blue-600\">\n              Products\n            </a>\n            <a href=\"#\" className=\"text-sm font-medium text-gray-700 hover:text-blue-600\">\n              About\n            </a>\n          </div>\n          <div className=\"md:hidden\" aria-label=\"Mobile menu button\">\n            <button className=\"px-2 py-1 rounded bg-gray-100 text-sm\" aria-label=\"Open menu\">\n              Menu\n            </button>\n          </div>\n        </div>\n      </div>\n    </nav>\n  )\n}\n```\n\nsrc/hooks/useToggle.ts\n```js\nimport { useState } from 'react'\n\nexport function useToggle(initial = false): [boolean, () => void, (v: boolean) => void] {\n  const [value, setValue] = useState<boolean>(initial)\n  const toggle = () => setValue((v) => !v)\n  const set = (v: boolean) => setValue(v)\n  return [value, toggle, set]\n}\n```\n\nsrc/hooks/useFetch.ts\n```js\nimport { useEffect, useState } from 'react'\n\nexport function useFetch<T = unknown>(url: string) {\n  const [data, setData] = useState<T | null>(null)\n  const [loading, setLoading] = useState<boolean>(false)\n  const [error, setError] = useState<string | null>(null)\n\n  useEffect(() => {\n    let cancelled = false\n    if (!url) return\n    setLoading(true)\n    fetch(url)\n      .then((res) => {\n        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)\n        return res.json()\n      })\n      .then((json) => {\n        if (!cancelled) {\n          setData(json as T)\n          setError(null)\n        }\n      })\n      .catch((err) => {\n        if (!cancelled) {\n          setError((err as Error).message)\n        }\n      })\n      .finally(() => {\n        if (!cancelled) setLoading(false)\n      })\n    return () => {\n      cancelled = true\n    }\n  }, [url])\n\n  return { data, loading, error }\n}\n```\n\nsrc/utils/classNames.ts\n```js\nexport function classNames(...args: any[]) {\n  return args.filter(Boolean).join(' ')\n}\n```\n\nBecause you asked for two utilities, I’m including a small helper export to demonstrate usage in App. If you prefer a dedicated file path, you can rename this to src/utils/classNames.ts and export as default as needed.\n\nsrc/utils/formatDate.ts\n```js\nexport function formatDate(input: string | Date): string {\n  try {\n    const d = typeof input === 'string' ? new Date(input) : input\n    return d.toLocaleDateString(undefined, {\n      year: 'numeric',\n      month: 'short',\n      day: 'numeric'\n    })\n  } catch {\n    return String(input)\n  }\n}\n```\n\nsrc/types/index.ts\n```ts\nexport type Product = {\n  id: string\n  name: string\n  price: number\n  dateAdded: string\n}\n\n// You can add global app types here in the future\n```\n\nsrc/types/global.ts\n```ts\n// Example of a minimal global-type file (left intentionally tiny for scaffolding)\nexport type ID = string | number\n```\n\nREADME.md\n```md\n# React 18 + TypeScript + Vite + TailwindCSS Scaffold\n\nThis is a production-ready scaffold of a React 18 app using TypeScript, Vite, and TailwindCSS. It includes:\n- Public entry: public/index.html\n- A TS + React app under src/ with components, hooks, utils, and types\n- Tailwind-based responsive layout\n- ESLint + Prettier configuration\n- Basic documentation and run steps\n\nHello World\n- The app renders a Hello World snippet as part of the intro section.\n\nProject structure (highlights)\n- public/index.html: minimal entry page\n- src/main.tsx: React 18 entry\n- src/App.tsx: root component with Tailwind layout\n- src/components/: Button, Card, Nav\n- src/hooks/: useToggle, useFetch\n- src/utils/: formatDate, classNames\n- src/types/: Product type example\n- Tailwind CSS setup with PostCSS\n- ESLint + Prettier configs and ignore files\n- README.md with setup & run instructions\n\nUsage\n- npm install\n- npm run dev to start Vite dev server\n- npm run build to generate a production bundle\n- npm run preview to preview the production build\n\nNote\n- The code is designed to replace/add to a fresh Vite + React + TS project.\n- All code blocks are ready to paste into respective files.\n\n```\n\npackage.json\n```json\n{\n  \"name\": \"vite-react-ts-tailwind-scaffold\",\n  \"private\": true,\n  \"version\": \"0.1.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"preview\": \"vite preview --port 5174\",\n    \"lint\": \"eslint . --ext .ts,.tsx,.js,.jsx\",\n    \"format\": \"prettier --write .\"\n  },\n  \"dependencies\": {\n    \"react\": \"^18.2.0\",\n    \"react-dom\": \"^18.2.0\"\n  },\n  \"devDependencies\": {\n    \"@types/react\": \"^18.2.14\",\n    \"@types/react-dom\": \"^18.2.6\",\n    \"eslint\": \"^8.48.0\",\n    \"eslint-config-prettier\": \"^9.0.0\",\n    \"eslint-plugin-prettier\": \"^4.2.0\",\n    \"eslint-plugin-react\": \"^7.32.0\",\n    \"eslint-plugin-react-hooks\": \"^4.9.0\",\n    \"prettier\": \"^2.8.8\",\n    \"tailwindcss\": \"^3.6.7\",\n    \"postcss\": \"^8.4.26\",\n    \"autoprefixer\": \"^10.4.13\",\n    \"typescript\": \"^5.2.2\",\n    \"vite\": \"^5.6.0\",\n    \"@vitejs/plugin-react\": \"^2.9.0\"\n  }\n}\n```\n\n.eslintrc.cjs\n```js\nmodule.exports = {\n  root: true,\n  env: {\n    browser: true,\n    es2021: true\n  },\n  parser: '@typescript-eslint/parser',\n  parserOptions: {\n    ecmaVersion: 12,\n    sourceType: 'module',\n    ecmaFeatures: {\n      jsx: true\n    }\n  },\n  settings: {\n    react: {\n      version: 'detect'\n    }\n  },\n  extends: [\n    'eslint:recommended',\n    'plugin:react/recommended',\n    'plugin:react-hooks/recommended',\n    'plugin:@typescript-eslint/recommended',\n    'plugin:prettier/recommended'\n  ],\n  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier'],\n  rules: {\n    'prettier/prettier': 'error'\n  }\n}\n```\n\n.prettierrc\n```json\n{\n  \"printWidth\": 100,\n  \"semi\": true,\n  \"singleQuote\": true,\n  \"jsxSingleQuote\": true,\n  \"trailingComma\": \"all\",\n  \"arrowParens\": \"avoid\",\n  \"endOfLine\": \"auto\"\n}\n```\n\n.eslintignore\n```\nnode_modules/\ndist/\nbuild/\ncoverage/\nvite.config.ts\npublic/build/\n```\n\n.prettierignore\n```\nnode_modules/\ndist/\nbuild/\ncoverage/\npublic/build/\n```\n\nNotes and tips\n- The app uses the latest stable patterns for React 18 + TypeScript with Vite.\n- Tailwind is configured via tailwind.config.cjs and PostCSS config for Tailwind directives in src/styles/index.css.\n- The example components illustrate accessible, responsive Tailwind layouts.\n- Inline comments are included in key files to explain design decisions.\n- Hello World is printed in the intro section via a small HelloWorld component.\n\nWhat to paste into a fresh Vite project\n- Replace the default files in a new Vite + React + TS template with the above files. If you already have a Vite project, you can merge the src/ and public/ folders and add the config files and package.json accordingly.\n- After placing all files, run:\n  - npm install\n  - npm run dev\n\nThis scaffold should render a clean, responsive UI using Tailwind and provide a solid starting point for production-grade apps.\n\nIf you want me to tailor specific dependencies to a different major version, or want a minimal Next.js option instead, I can adapt quickly.";

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
        react:`
          Always wrap all code in proper Markdown code blocks.
          - Try to detect the language heuristically:
            - JS/TS → use \`\`\`js
            - Python → use \`\`\`python
            - HTML → use \`\`\`html
            - Bash/Shell → use \`\`\`bash
            - C/C++ → use \`\`\`cpp
            - Java → use \`\`\`java
            - Any unknown language → use \`\`\`code
          - Plain explanations stay outside backticks.
          - Never break code into pieces unnecessarily.
          - Output should be ready to render in a code viewer with copy buttons.
        
          User request:
          Create a complete, production-ready React 18 application scaffold using TypeScript, Vite, and TailwindCSS with the latest stable versions (as of 2025). The project should use public/index.html as the entry point and include all necessary configs, tooling, example components, hooks, utils, types, and a README.

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

            3. **package.json** with all required latest stable dependencies

            4. Linting & Formatting:
            - ESLint: TypeScript + React, recommended rules, Prettier integration (.eslintrc.cjs).
            - Prettier config (.prettierrc).
            - Ignore files: .eslintignore and .prettierignore.

            5. Example Components & Pages:
            - Responsive, accessible examples using Tailwind CSS.
            - Example usage of hooks, utils, and types in the app.

            6. Additional:
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
            - Provide ready-to-paste example files that can replace/add to a freshly created vite@latest react-ts project.

            Important:
            - Provide a complete package.json for the project.
            - Provide all config files: tsconfig.json, vite.config.ts, tailwind.config.cjs, ESLint, Prettier.
            ;`,
        
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
