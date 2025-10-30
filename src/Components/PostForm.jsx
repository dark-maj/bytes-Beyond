import { useState } from "react";

export default function PostForm({ initial = {}, onSubmit }) {
  const [title, setTitle] = useState(initial.title || "");
  const [author, setAuthor] = useState(initial.author || "");
  const [content, setContent] = useState(initial.content || "");
  const [tags, setTags] = useState(
    (initial.tags || []).join(", ")
  );

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.({
      title,
      author,
      content,
      tags,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#fff",
        border: "1px solid #cbd5e1",
        borderRadius: 16,
        padding: 24,
        maxWidth: 700,
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: 16,
          fontSize: 20,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        {initial.id ? "Edit Post" : "New Post"}
      </h2>

      {/* title */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Title</label>
        <input
          style={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* author */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Author</label>
        <input
          style={input}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Divakar BV"
        />
      </div>

      {/* tags */}
      <div style={{ marginBottom: 16 }}>
        <label style={label}>Tags (comma separated)</label>
        <input
          style={input}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="react, ai, notes"
        />
      </div>

      {/* content */}
      <div style={{ marginBottom: 24 }}>
        <label style={label}>Content</label>
        <textarea
          style={{
            ...input,
            minHeight: 160,
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        style={{
          background: "#0ea5e9",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontWeight: 600,
          padding: "10px 14px",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        {initial.id ? "Save Changes" : "Publish Post"}
      </button>
    </form>
  );
}

const label = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  marginBottom: 4,
  color: "#334155",
};

const input = {
  width: "100%",
  border: "1px solid #94a3b8",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 14,
  color: "#0f172a",
  outline: "none",
  background: "#fff",
};
