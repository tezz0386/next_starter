"use client";

import React, { useEffect, useRef, useState } from "react";
import OpenAI from 'openai';
import axios from "axios";


export default function ChatApp() {



  const [activeConv, setActiveConv] = useState('');

  const [project, setProject] = useState({});
  const [projects, setProjects] = useState([{}]);
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('static_site');
  const [isGenerating, setIsGenerating] = useState(false);



  const [messages, setMessages] = useState<Array<{ id: string; from: "me" | "them"; text: string; time?: string }>>([
    
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/projects");
        setProjects(res.data?.data ?? []);
      } catch (err: unknown) {
        // typed error handling
        if (axios.isAxiosError(err)) {
          console.error("API error:", err.response?.data ?? err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
    }
    fetchProjects();
  }, []);


  useEffect(() => {
    console.log("This is projects", projects);
  }, [projects]);




  useEffect(() => {
    if (!activeConv) return;

    let canceled = false;
    
    async function fetchProjectMessages() {
      try {
        const res = await axios.get(`http://localhost:3001/api/v1/projects/${activeConv}`);
        // try several shapes just in case
        const proj = res.data?.data?.project ?? res.data?.data ?? res.data ?? {};
        if (canceled) return;
        setProject(proj);

        const rawMsgs: any[] = Array.isArray(res.data?.data?.messages) ? res.data?.data?.messages : res.data?.data?.messages ?? [];

        // sort by createdAt/updatedAt then take last 10 (latest)
        const sorted = rawMsgs
          .slice()
          .sort((a, b) => {
            const ta = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
            const tb = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
            return ta - tb;
          });
        const last10 = sorted.slice(-10);

        const uiMessages: Array<{ id: string; from: "me" | "them"; text: string; time?: string }> = [];
        const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

        last10.forEach((m: any) => {
          const time = new Date(m.createdAt ?? m.updatedAt ?? Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          // possible shapes
          const userText = m.message ?? m.text ?? m.content ?? m.user?.text ?? "";
          const aiText = m.plain_text ?? m.reply ?? m.answer ?? m.aiResponse ?? m.response ?? "";

          // If we have both a user message and an AI response, push them as two messages (me then them)
          if (userText && aiText) {
            uiMessages.push({
              id: m._id ? `${m._id}-u` : genId(),
              from: "me",
              text: userText,
              time,
            });
            uiMessages.push({
              id: m._id ? `${m._id}-a` : genId(),
              from: "them",
              text: aiText,
              time,
            });
          } else {
            // fallback: single message mapping like before
            uiMessages.push({
              id: m._id ?? m.id ?? genId(),
              from:
              m.from === "me" ||
              m.from === "user" ||
              m.sender === "user" ||
              m.role === "user"
                ? "me"
                : "them",
                  text: userText || aiText || "",
                  time,
                });
              }
        });

        if (!canceled) setMessages(uiMessages);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("API error:", err.response?.data ?? err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
    }

    fetchProjectMessages();

    return () => {
      canceled = true;
    };
  }, [activeConv]);

  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConv]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    await handleGenerateApp(trimmed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }



function renderMessageText(text: string) {
  // Split by Markdown code blocks
  const parts = text.split(/```([\s\S]*?)```/g);

  return parts.flatMap((part, i) => {
    if (i % 2 === 1) {
      // ✅ Inside backticks → treat as code
      const [firstLine, ...restLines] = part.split("\n");
      const remaining = restLines.join("\n");

      return (
        <pre key={i} className="bg-slate-800 text-white p-2 rounded overflow-x-auto">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div className="text-sm font-mono break-words text-white">{firstLine}</div>
            <button
              type="button"
              className="ml-3 text-xs px-2 py-1 rounded bg-slate-600 hover:bg-slate-500 text-white"
              onClick={() => void navigator.clipboard?.writeText(part)}
            >
              Copy
            </button>
          </div>
          <code className="whitespace-pre-wrap">{remaining}</code>
        </pre>
      );
    } else {
      // Outside backticks → render normally
      const lines = part.split("\n");
      return lines.map((line, j) => {
        const trimmedLine = line.trim();
        if (trimmedLine === "") return <br key={`${i}-${j}`} />;
        return <span key={`${i}-${j}`} dangerouslySetInnerHTML={{ __html: line }} />;
      });
    }
  });
}








  const handleGenerateApp = async (prompt:string) => {

    
      if (!prompt.trim()) {
          alert("Please enter some requirements.");
          return;
      }
      
      const trimmed = prompt;
      const newMsg = {
        id: Date.now().toString(),
        from: "me" as const,
        text: trimmed,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((m) => [...m, newMsg]);
      setPrompt('');
      setInput('');
      // First, add a "placeholder" message so you can update it as the stream comes in
      const newMsgId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setMessages((m) => [
        ...m,
        {
          id: newMsgId,
          from: "them",
          text: "Thinking.....", // start empty, will fill with stream
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);

      // Start streaming the response
      //  await puter?.auth?.signOut();
      const isSignedin = await puter?.auth?.isSignedIn();
      if(!isSignedin){
        await puter?.auth?.signIn();
      }

      let fullPrompt = ``;

      if (!project?._id) {
        const templatePrompt = getTemplatePrompt(selectedTemplate);
        fullPrompt += `${templatePrompt}

        Additional requirements: ${prompt}`;
      } else {
        fullPrompt += `${prompt}`;
      }
      




      setIsGenerating(true);



      const chatMessages = [{
          role: 'system',
          content: `You are Dyad AI Assistant, a helpful and knowledgeable AI assistant. 
          You specialize in coding, content creation, and general knowledge. 
          Provide detailed, helpful responses and use markdown formatting for code blocks.
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
          Current user: Guest`
        },
        
      ];

      if (messages.length > 0) {
        messages.reverse().forEach((message) => {
          const oldMessage = {
            role: message.from === 'me' ? 'user' : 'assistant',
            content: message.text
          };
          chatMessages.push(oldMessage);
        });
      }



      const stream = await window?.puter?.ai?.chat(chatMessages, { 
        model: "gpt-5-nano",
        stream: true,
      });



      // Listen for chunks as they arrive
      let partialText = '';
      const allChunks: any[] = [];
      for await (const chunk of stream) {
        partialText += chunk?.text ?? "";
        allChunks.push(chunk); // save each chunk
        // Update the message text progressively



        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsgId ? { ...msg, text: partialText } : msg
          )
        );


      }

  
    // let save to backend

    const blob = new Blob([partialText], { type: "text/plain" });
    const responseBlob = new Blob([JSON.stringify(allChunks)], { type: "application/json" });

    const formData = new FormData();
    formData.append("plain_text", blob, "plain_text.txt");
    formData.append("message", trimmed ?? "");
    formData.append("response", responseBlob, "response.json");
    formData.append("project_id", project?._id ?? "");
    formData.append("project_type", selectedTemplate);


    const backendResponse = await axios.post("http://localhost:3001/api/v1/projects",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    setProject(backendResponse.data?.data?.project ?? {});
    setPrompt('');

    setIsGenerating(false);
  };

  const templates = [
      {
        "text":"React",
        "value":"react",
      },
      {
        "text":"Static Site",
        "value":"static_site",
      },
      {
        "text":"Vue JS",
        "value":"vue",
      },
      {
        "text":"Next JS",
        "value":"nextjs",
      },
      {
        "text":"MERN STACK",
        "value":"mern",
      },
      {
        "text":"Laravel",
        "value":"laravel",
      },
  ];

const getTemplatePrompt = (template: string) => {
      const basePrompts = {
      react:`
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



      static_site:`
        User request:
        Create a **modern, production-ready static website scaffold** using **HTML, CSS, JS, jQuery, and TailwindCSS** with the **latest stable CDN links (as of 2025)**.  
        All pages must include **Tailwind CSS CDN** and **jQuery CDN**.

        ✨ Design Direction (Important):
        - Use a **modern, minimal, and responsive design** based on current 2025 web UI trends.
        - Prioritize **dark/light mode toggle**, smooth **scroll animations**, **sticky navigation**, and elegant **hover effects**.
        - Use **Tailwind utility classes** heavily for layout and responsiveness.
        - Include **subtle motion effects** (e.g., fade-in, slide-in) using CSS or small jQuery snippets.
        - Use **modern color palettes** (e.g., soft gradients, glassmorphism backgrounds, neumorphic cards, or minimal light/dark contrast).
        - Typography should feel clean and professional (e.g., Inter, Poppins, Roboto).

        Requirements:

        1. **Project Layout:**
          - index.html: main landing page (hero, features, CTA, footer).
          - about.html: team and company info page.
          - contact.html: form page with validation and AJAX submission.
          - css/
            - styles.css: custom overrides, animations, and theme variables.
          - js/
            - main.js: global site logic, dark/light toggle, and event handling.
            - utils.js: at least 2 reusable utility functions.
            - components/
              - navbar.js: sticky + responsive navigation bar.
              - modal.js: modal popup with animation and accessibility.

        2. **HTML Requirements:**
          - Responsive, semantic HTML with meta tags for SEO.
          - Include Tailwind CDN in <head>.
          - Include jQuery CDN before </body>.
          - Add **favicon**, **social preview meta tags**, and basic **OpenGraph tags**.
          - Use reusable sections (hero, features, testimonials, CTA, footer).
          - Include **dark/light mode toggle**.

        3. **JS Requirements:**
          - main.js: global init (dark mode toggle, scroll reveal animations).
          - utils.js: example utilities (formatDate, debounce, scrollToSection).
          - navbar.js: mobile toggle, active link highlight on scroll.
          - modal.js: open/close logic with fade transitions.

        4. **CSS Requirements:**
          - styles.css: theme variables, animations (fade, slide, scale), and custom classes.
          - Demonstrate how to extend Tailwind with custom utilities.

        5. **Examples & Interactivity:**
          - Animated hero section on index.html with a CTA button.
          - Contact form with validation + AJAX submission via jQuery.
          - Modal popup with smooth transitions.
          - Responsive navbar that highlights current section.
          - Dark/light mode toggle stored in localStorage.

        6. **Additional:**
          - README.md: setup instructions, file structure, customization guide.
          - Code must be **copy-paste ready** for GitHub Pages, Netlify, or Vercel.
          - Comment important parts of the code.

        Deliverables:
          - index.html
          - about.html
          - contact.html
          - css/styles.css
          - js/main.js
          - js/utils.js
          - js/components/navbar.js
          - js/components/modal.js
          - README.md

        Notes:
          - **Every HTML page must include Tailwind CSS CDN and jQuery CDN.**
          - Use the latest stable CDN versions available as of 2025.
          - Provide **complete, production-ready, trending, and well-commented code** for all files.
      `,
      
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
      
      laravel:`
            User request:
            Create a **complete, modern Laravel 11+ application scaffold** using **PHP 8+**, **MySQL**, and **Vite + TailwindCSS** for frontend.  
            The project must be production-ready, following best practices, PSR coding style, environment separation, Laravel Sanctum authentication, and modern UI/UX practices.

            ✨ Key Design & Frontend Requirements:
            - Responsive, semantic Blade templates using TailwindCSS (latest CDN or Vite build).
            - Include a dark/light mode toggle.
            - Use modern UI patterns (hero section, cards, modals, CTA sections, sticky navbar).
            - Smooth animations (fade-in, slide-in) via Tailwind or minimal JS/jQuery.
            - Frontend tooling with Vite and Tailwind configured for Laravel.

            Requirements:

            1. **Project Layout:**
              - app/
                - Models/: User, Product/Post, Comment/Order with relationships
                - Http/Controllers/: API + Web controllers (AuthController, ProductController)
                - Http/Requests/: StoreProductRequest, UpdateProductRequest
                - Policies/: example policy
                - Providers/: custom service provider example
              - database/
                - migrations/: users, products/posts, comments/orders
                - seeders/: DatabaseSeeder, UserSeeder, SampleDataSeeder
                - factories/: model factories
              - resources/
                - views/: layouts/app.blade.php, home.blade.php, products/index.blade.php, auth skeleton
                - lang/: en sample localization
              - routes/: web.php, api.php
              - config/: sanctum.php, cors.php modifications
              - tests/: Feature tests for Auth, Product API, Authorization
              - public/: favicon, basic assets
              - .env.example, .gitignore, README.md

            2. **Frontend Tooling:**
              - package.json: npm scripts (dev, build, preview, lint, format)
              - vite.config.js: configured for Laravel + React/JS if needed
              - tailwind.config.cjs: content paths, theme extend, dark mode
              - postcss.config.cjs: Tailwind + autoprefixer

            3. **Authentication:**
              - Full Laravel Sanctum setup for SPA + API tokens
              - Auth routes and controllers: register, login, logout, profile
              - Middleware applied for protected routes

            4. **Database:**
              - Proper migrations and relationships
              - Seeders and factories with example data
              - Example pivot tables if needed

            5. **Controllers & Requests:**
              - Resource controllers (index/show/store/update/destroy)
              - Form requests for validation
              - API Resource classes for JSON responses

            6. **Testing:**
              - Feature tests for web and API
              - Auth, Product CRUD, unauthorized access
              - Use RefreshDatabase trait

            7. **Developer Tooling & Scripts:**
              - composer.json (dependencies only)
              - package.json (frontend tooling, Tailwind, Vite)
              - phpunit.xml
              - README.md: setup, migrate, seed, serve, npm build/dev commands
              - Gitignore: Laravel + node_modules + vendor

            8. **Additional Features:**
              - Example Blade sections: hero, cards, modals, footer
              - Dark/light mode toggle
              - Scroll animations or minimal jQuery interactions
              - Proper SEO meta tags and OpenGraph tags

            Deliverables (example files/code blocks to provide):
              - app/Models/User.php, Product.php, Comment.php
              - app/Http/Controllers/AuthController.php, ProductController.php
              - app/Http/Requests/StoreProductRequest.php, UpdateProductRequest.php
              - database/migrations/xxxx_create_users_table.php, xxxx_create_products_table.php
              - database/seeders/UserSeeder.php, SampleDataSeeder.php
              - database/factories/ProductFactory.php
              - resources/views/layouts/app.blade.php, home.blade.php, products/index.blade.php
              - routes/web.php, routes/api.php
              - config/sanctum.php, config/cors.php
              - tests/Feature/AuthTest.php, ProductApiTest.php, AuthorizationTest.php
              - public/: favicon or example assets
              - package.json, vite.config.js, tailwind.config.cjs, postcss.config.cjs
              - composer.json
              - .env.example, .gitignore, README.md

            Notes:
              - Use modern PHP 8+ features: typed properties, arrow functions, null coalescing, union types.
              - Controllers should be concise, demonstrating Form Requests, Policies, and API Resources.
              - Frontend must leverage TailwindCSS utilities and Vite bundling.
              - Code blocks must be ready-to-paste for a fresh Laravel install.
              - Document optional environment-specific setup (Redis, Mail, etc.) in README.

            Important:
              - Assume the developer runs this locally with Composer, Node.js, and MySQL.
              - Provide a realistic, production-ready scaffold including **backend, frontend tooling, and styling**.`
      };

  return basePrompts[template as keyof typeof basePrompts] || basePrompts.react;
};




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
            <div className="text-xs text-slate-400 dark:text-slate-500 px-2">Conversations/Project</div>


            {projects.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveConv(c?._id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between ${
                  activeConv === c?._id ? "bg-slate-100 dark:bg-slate-700 font-medium" : ""
                }`}
              >
                <span className="text-slate-800 dark:text-slate-100">{c?.name}</span>
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
                  <div className="font-medium text-slate-800 dark:text-slate-100">
                    {projects.find((c) => c?._id === activeConv)?.name}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">Active — online</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Project Type Select */}
                <select
                  className="p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                  value={selectedTemplate} // state variable for selected template
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Please Select</option>
                  {templates.map((template, i) => (
                    <option key={i} value={template.value}>
                      {template.text}
                    </option>
                  ))}
                </select>

                {/* Existing button */}
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
                    <div> {renderMessageText(m.text)} </div>
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
