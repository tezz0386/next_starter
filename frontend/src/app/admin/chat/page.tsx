"use client";

import React, { useEffect, useRef, useState } from "react";
import OpenAI from 'openai';
import axios from "axios";


export default function ChatApp() {



  const [activeConv, setActiveConv] = useState('');

  const [project, setProject] = useState({});
  const [projects, setProjects] = useState([{}]);
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
        text: "", // start empty, will fill with stream
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    

    // Start streaming the response
    //  await puter?.auth?.signOut();
    const isSignedin = await puter?.auth?.isSignedIn();
    if(!isSignedin){
      await puter?.auth?.signIn();
    }

   const prompt = `
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
    ${trimmed}
    `;


    const stream = await window?.puter?.ai?.chat(prompt, {
      model: "gpt-5-nano",
      stream: true, // ✅ enable streaming
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
    const backendResponse = await axios.post("http://localhost:3001/api/v1/projects",{
      project_id: project?._id ?? null,
      message:trimmed,
      plain_text:partialText,
      response:JSON.stringify(allChunks),
    });

    setProject(backendResponse.data?.data?.project ?? {});
    setIsGenerating(false);

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
                <div className="font-medium text-slate-800 dark:text-slate-100">{projects.find((c) => c?._id === activeConv)?.name}</div>
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
