import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import BlogHome from "./pages/BlogHome.jsx";
import BlogNew from "./pages/BlogNew.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import BlogEdit from "./pages/BlogEdit.jsx";
import ChatBotWidget from "./Components/ChatbotWidget.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "16px",
          fontFamily: "system-ui, sans-serif",
          color: "#0f172a",
        }}
      >
        {/* ---------- NAVBAR ---------- */}
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f1f5f9",
            padding: "12px 16px",
            borderRadius: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            BYTES AND BEYOND💻
          </div>

          <div style={{ display: "flex", gap: 16, fontSize: 15 }}>
            <Link to="/blog" style={linkStyle}>
              Home
            </Link>
            <Link to="/blog/new" style={linkStyle}>
              New Post
            </Link>
            <Link to="/about" style={linkStyle}>
              About
            </Link>
          </div>
        </nav>

        {/* ---------- ROUTES ---------- */}
        <Routes>
          <Route path="/" element={<BlogHome />} />
          <Route path="/blog" element={<BlogHome />} />
          <Route path="/blog/new" element={<BlogNew />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/blog/:id/edit" element={<BlogEdit />} />
          <Route
            path="/about"
            element={
              <main style={{ padding: 24 }}>
                <h2>About This Blog</h2>
                <p style={{ color: "#475569", lineHeight: 1.5 }}>
                  This simple React + Zustand app lets you write, edit, and manage blog posts right in your browser.
                  Data is saved locally using <b>localStorage</b> so your posts stay even after refreshing.
                  You can extend it with Firebase, authentication, and AI summaries later.
                </p>
              </main>
            }
          />
          <Route
            path="*"
            element={
              <main style={{ padding: 24 }}>
                <h2>404 — Page Not Found</h2>
                <p>
                  Go back to <Link to="/blog">Home</Link>
                </p>
              </main>
            }
          />
        </Routes>
        <ChatBotWidget />
      </div>
    </BrowserRouter>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#0ea5e9",
  fontWeight: 500,
};
