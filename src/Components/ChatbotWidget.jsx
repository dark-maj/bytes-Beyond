import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
// If your store exports named:
import { useBlogStore } from "../State/BlogStore.js";
// If default export instead, swap to: import useBlogStore from "../State/BlogStore";

const BOT_NAME = "Helper";
const LS_KEY = "blog.chatbot.v1";

/**
 * Minimal “NLU” to answer blog-related queries.
 * You can replace handleUserQuery with a fetch to your backend/LLM later.
 */
function useChatBrain(posts) {
  const index = useMemo(() => {
    const arr = posts.map((p) => ({
      id: p.id,
      title: p.title || "",
      author: p.author || "",
      content: (p.content || "").toLowerCase(),
      tags: (p.tags || []).map((t) => t.toLowerCase()),
      createdAt: p.createdAt,
    }));
    return arr;
  }, [posts]);

  function searchByTitleOrContent(q) {
    const needle = q.toLowerCase();
    return index
      .filter(
        (p) =>
          p.title.toLowerCase().includes(needle) ||
          p.content.includes(needle)
      )
      .slice(0, 5);
  }

  function filterByTag(tag) {
    const t = tag.toLowerCase();
    return index.filter((p) => p.tags.includes(t)).slice(0, 8);
  }

  function listRecent() {
    return [...index]
      .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
      .slice(0, 5);
  }

  function helpText() {
    return [
      "Here’s what I can do:",
      "• list posts — recent posts",
      "• search <text> — find posts by title/content",
      "• tag:<name> — filter by tag (e.g., tag:react)",
      "• new post — how to publish a new post",
      "• edit post — how to edit",
      "• help — show this help",
    ].join("\n");
  }

  function handleUserQuery(raw) {
    const q = (raw || "").trim();

    if (!q) {
      return {
        type: "text",
        text: "Ask me about your blog. Try: list posts, search state management, tag:react",
      };
    }

    if (/^help$/i.test(q) || /^commands?$/i.test(q)) {
      return { type: "text", text: helpText() };
    }

    if (/^list( posts?)?$/i.test(q)) {
      const items = listRecent();
      if (items.length === 0) return { type: "text", text: "No posts yet. Click “+ New Post” in the blog header." };
      return { type: "posts", items };
    }

    const tagMatch = q.match(/^tag\s*:\s*(.+)$/i);
    if (tagMatch) {
      const tag = tagMatch[1];
      const items = filterByTag(tag);
      if (items.length === 0) return { type: "text", text: `No posts found with tag “${tag}”.` };
      return { type: "posts", items, badge: `#${tag}` };
    }

    if (/^new post$/i.test(q)) {
      return {
        type: "text",
        text:
          'To publish: go to Blog → "+ New Post", fill Title/Content/Tags, then "Publish Post".',
      };
    }

    if (/^edit( post)?$/i.test(q)) {
      return {
        type: "text",
        text:
          "Open the post, click Edit, update fields, then Save Changes. You can also update tags (comma-separated).",
      };
    }

    const searchMatch = q.match(/^search\s+(.+)$/i);
    if (searchMatch) {
      const term = searchMatch[1];
      const items = searchByTitleOrContent(term);
      if (items.length === 0) return { type: "text", text: `No posts found for “${term}”.` };
      return { type: "posts", items, badge: `“${term}”` };
    }

    // Fallback: treat as search
    const items = searchByTitleOrContent(q);
    if (items.length > 0) {
      return { type: "posts", items, badge: `“${q}”` };
    }
    return {
      type: "text",
      text:
        "Hmm, I didn’t find anything for that. Try: list posts, search <text>, tag:<name>, or help.",
    };
  }

  return { handleUserQuery };
}

export default function ChatBotWidget() {
  const posts = useBlogStore((s) => s.posts);
  const { handleUserQuery } = useChatBrain(posts);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      return (
        saved || [
          { from: "bot", t: Date.now(), text: `Hi, I’m ${BOT_NAME}. Ask me about your blog. Type help to see commands.` },
        ]
      );
    } catch {
      return [
        { from: "bot", t: Date.now(), text: `Hi, I’m ${BOT_NAME}. Ask me about your blog. Type help to see commands.` },
      ];
    }
  });
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(msgs));
    // auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, open]);

  function send() {
    const text = input.trim();
    if (!text) return;
    const my = { from: "you", t: Date.now(), text };
    setMsgs((m) => [...m, my]);
    setInput("");
    setTyping(true);

    // Simulate async “thinking” then respond
    setTimeout(() => {
      const result = handleUserQuery(text);
      const botMsg =
        result.type === "text"
          ? { from: "bot", t: Date.now(), text: result.text }
          : { from: "bot", t: Date.now(), rich: result };
      setMsgs((m) => [...m, botMsg]);
      setTyping(false);
    }, 350);
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const styles = {
    fab: {
      position: "fixed",
      bottom: 24,
      right: 24,
      width: 52,
      height: 52,
      borderRadius: "50%",
      background: "#0ea5e9",
      color: "#fff",
      border: "none",
      boxShadow: "0 10px 20px rgba(14,165,233,.35)",
      cursor: "pointer",
      fontSize: 22,
      zIndex: 1000,
    },
    panel: {
      position: "fixed",
      bottom: 88,
      right: 24,
      width: 340,
      maxHeight: 420,
      display: open ? "flex" : "none",
      flexDirection: "column",
      background: "#fff",
      border: "1px solid #cbd5e1",
      borderRadius: 14,
      boxShadow: "0 18px 36px rgba(2,6,23,.2)",
      overflow: "hidden",
      zIndex: 1000,
    },
    head: {
      padding: "10px 12px",
      background: "#0ea5e9",
      color: "#fff",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    list: {
      padding: 10,
      overflowY: "auto",
      flex: 1,
      background: "#f8fafc",
    },
    inputRow: {
      display: "flex",
      gap: 8,
      padding: 10,
      borderTop: "1px solid #e2e8f0",
      background: "#fff",
    },
    bubble: (mine) => ({
      display: "inline-block",
      padding: "6px 8px",
      borderRadius: 10,
      margin: "4px 0",
      background: mine ? "#e0f2fe" : "#f1f5f9",
      color: "#0f172a",
      border: mine ? "1px solid #bae6fd" : "1px solid #e2e8f0",
      maxWidth: 260,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }),
    chip: {
      display: "inline-block",
      padding: "2px 6px",
      borderRadius: 999,
      background: "#eef2ff",
      border: "1px solid #c7d2fe",
      color: "#312e81",
      fontSize: 12,
      marginLeft: 6,
    },
  };

  return (
    <>
      {/* Panel */}
      <div style={styles.panel}>
        <div style={styles.head}>
          <span>Ask {BOT_NAME}</span>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        <div ref={scrollRef} style={styles.list}>
          {msgs.map((m, i) => (
            <div key={i} style={{ textAlign: m.from === "you" ? "right" : "left" }}>
              {m.rich ? (
                <div style={styles.bubble(false)}>
                  {m.rich.badge && <span style={styles.chip}>{m.rich.badge}</span>}
                  <div style={{ fontWeight: 600, margin: "4px 0 6px" }}>
                    {m.rich.items.length} result{m.rich.items.length !== 1 ? "s" : ""}
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    {m.rich.items.map((p) => (
                      <Link
                        key={p.id}
                        to={`/blog/${p.id}`}
                        style={{
                          textDecoration: "none",
                          border: "1px solid #e2e8f0",
                          background: "#fff",
                          borderRadius: 8,
                          padding: "6px 8px",
                          color: "#0f172a",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{p.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          by {p.author || "Unknown"}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <span style={styles.bubble(m.from === "you")}>{m.text}</span>
              )}
            </div>
          ))}

          {typing && (
            <div style={{ textAlign: "left" }}>
              <span style={styles.bubble(false)}>typing…</span>
            </div>
          )}

          {/* Quick suggestions for empty chat */}
          {msgs.length <= 2 && !typing && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {["list posts", "search react", "tag:notes", "help"].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    // send immediately
                    setTimeout(() => send(), 0);
                  }}
                  style={{
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#0f172a",
                    borderRadius: 999,
                    padding: "4px 8px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={styles.inputRow}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask: list posts, search <text>, tag:<name>…"
            rows={1}
            style={{
              flex: 1,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              padding: "8px 10px",
              resize: "none",
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: 1.3,
              minHeight: 36,
              maxHeight: 90,
            }}
          />
          <button
            onClick={send}
            style={{
              background: "#0ea5e9",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={styles.fab}
        aria-label="Open chat"
        title="Ask Helper"
      >
        💬
      </button>
    </>
  );
}
