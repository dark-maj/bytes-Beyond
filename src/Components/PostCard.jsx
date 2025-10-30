import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const snippet =
    post.content.length > 140
      ? post.content.slice(0, 140) + "..."
      : post.content;

  return (
   <div
  style={{
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 6px 12px rgba(2,6,23,.04)",
    transition: "transform .12s ease, box-shadow .12s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 14px 28px rgba(2,6,23,.10)")}
  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 6px 12px rgba(2,6,23,.04)")}
    >
      <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>
        <Link
          to={`/blog/${post.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {post.title}
        </Link>
      </div>

      <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
        by {post.author} ·{" "}
        {new Date(post.createdAt).toLocaleString()}
      </div>

      <div
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.5,
          marginTop: 12,
        }}
      >
        {snippet}
      </div>

      {post.tags?.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#475569" }}>
          {post.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              style={{
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                padding: "2px 6px",
                borderRadius: 6,
                marginRight: 6,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
