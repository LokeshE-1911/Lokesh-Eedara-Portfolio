"use client";
import { useEffect, useRef, useState } from "react";
import { chatOnce } from "@/lib/api";

type Item = { role: "user" | "bot"; text: string };

export default function ChatBox() {
  const [items, setItems] = useState<Item[]>([
    { role: "bot", text: "Hi! I’m Lokesh’s AI assistant. Ask about my skills, projects, or experience."}
  ]);
  const [input, setInput] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [items]);

  async function send() {
    const msg = input.trim();
    if (!msg) return;
    setItems((it) => [...it, { role:"user", text: msg }, { role:"bot", text: "…" }]);
    setInput("");

    try {
      const data = await chatOnce(msg);
      // typing effect
      const full = data.reply || "Sorry, I could not generate a response.";
      let i = 0; const step = 20;
      function tick() {
        setItems((it) => {
          const copy = [...it];
          copy[copy.length - 1] = { role: "bot", text: full.slice(0, i) };
          return copy;
        });
        i += step;
        if (i <= full.length) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    } catch (e) {
      setItems((it) => {
        const copy = [...it];
        copy[copy.length - 1] = { role: "bot", text: "Sorry, I hit an error. Please try again." };
        return copy;
      });
    }
  }

  return (
    <div className="chatpanel hoverable">
      <div className="chathead">
        <div style={{fontWeight:800}}>Chat with Lokesh’s AI</div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#8efba7"}}>
          <span className="dot" /> online
        </div>
        <button className="btn ghost" onClick={()=>setItems([{role:"bot",text:"Hi! I’m Lokesh’s AI assistant. Ask about my skills, projects, or experience."}])}>Clear</button>
      </div>
      <div ref={logRef} className="log">
        {items.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
        ))}
      </div>
      <div className="inputrow">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask me anything about Lokesh…" onKeyDown={(e)=>e.key==="Enter"&&send()} />
        <button className="btn" onClick={send}>Send</button>
      </div>
    </div>
  );
}
