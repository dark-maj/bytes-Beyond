import { Link } from "react-router-dom";
import { useBlogStore } from "../State/BlogStore.js";
import PostCard from "../Components/PostCard";

export default function BlogHome() {
  const posts = useBlogStore((s) => s.posts);

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "24px auto",
        padding: "0 16px",
        fontFamily: "system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            My Blog ✍️
          </h1>
          <p
            style={{
              marginTop: 4,
              fontSize: 14,
              color: "#475569",
              maxWidth: 500,
              lineHeight: 1.4,
            }}
          >
            Thoughts, experiments, and notes from the journey.
          </p>
        </div>

        <Link
          to="/blog/new"
          style={{
            background: "#0ea5e9",
            borderRadius: 8,
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: 14,
            padding: "10px 12px",
            alignSelf: "flex-start",
          }}
        >
          + New Post
        </Link>
      </header>

      <section
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {posts.length === 0 ? (
          <div
            style={{
              border: "1px dashed #cbd5e1",
              borderRadius: 12,
              padding: 24,
              textAlign: "center",
              background: "#f8fafc",
              color: "#475569",
              fontSize: 14,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              No posts yet
            </div>
            <div>Click “New Post” to publish your first entry.</div>
          </div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </section>
    </main>
  );
}
