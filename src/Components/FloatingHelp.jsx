import { useState } from "react";

const FAQ = [
  { q: "How do I create a new post?", a: "Go to Blog → + New Post, fill the form, then Publish." },
  { q: "How to add tags?", a: "Use comma-separated tags in the form, e.g. react, notes." },
  { q: "Can I edit a post?", a: "Open the post and click Edit in the header." }
];

export default function FloatingHelp() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Hi! Ask me about using the blog." }]);

  const send = () => {
    if (!input.trim()) return;
    const user = { from: "you", text: input };
    const match = FAQ.find(f => input.toLowerCase().includes(f.q.toLowerCase().split(" ")[0]));
    const bot = { from: "bot", text: match?.a || "I'll pass that on to the team. For now, try the Blog page / New Post." };
    setMsgs((m) => [...m, user, bot]); setInput("");
  };

  return (
    <>
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, width: 300,
          background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12,
          boxShadow: "0 12px 24px rgba(2,6,23,.18)", overflow: "hidden", zIndex: 1000
        }}>
          <div style={{ padding: 10, background: "#0ea5e9", color: "#fff", fontWeight: 600 }}>
            Help
          </div>
          <div style={{ maxHeight: 260, overflowY: "auto", padding: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                margin: "6px 0", textAlign: m.from === "you" ? "right" : "left"
              }}>
                <span style={{
                  display: "inline-block", padding: "6px 8px", borderRadius: 8,
                  background: m.from === "you" ? "#e0f2fe" : "#f1f5f9", color: "#0f172a"
                }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, padding: 10, borderTop: "1px solid #e2e8f0" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)}
                   placeholder="Ask something…" style={{ flex: 1, border: "1px solid #cbd5e1", borderRadius: 8, padding: "6px 8px" }} />
            <button onClick={send} style={{ background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 8, padding: "6px 10px" }}>
              Send
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} aria-label="Help"
              style={{ position: "fixed", bottom: 24, right: 24, width: 48, height: 48,
                borderRadius: "50%", background: "#0ea5e9", color: "#fff", border: "none",
                boxShadow: "0 10px 20px rgba(14,165,233,.35)", cursor: "pointer", fontSize: 20 }}>
        ?
      </button>
    </>
  );
}
