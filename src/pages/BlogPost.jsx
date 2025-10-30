import { Link, useNavigate, useParams } from "react-router-dom";
import { useBlogStore } from "../State/BlogStore.js";
import { useState, useMemo } from "react";
import ConfirmDialog from "../Components/ConfirmDialog";
import ReadingProgress from "../Components/ReadingProgress";
import ReactionsBar from "../Components/ReactionsBar";
import FloatingHelp from "../Components/FloatingHelp";


export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = useBlogStore((s) => s.getPostById(id));
  const deletePost = useBlogStore((s) => s.deletePost);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const meta = useMemo(() => {
    if (!post) return {};
    const words = post.content.trim().split(/\s+/).length;
    return {
      words,
      readMins: Math.max(1, Math.round(words / 200)),
      created: new Date(post.createdAt).toLocaleString(),
      updated: new Date(post.updatedAt).toLocaleString(),
    };
  }, [post]);

  if (!post) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h2>Post not found</h2>
        <Link to="/blog" style={{ color: "#0ea5e9" }}>← Back to Blog</Link>
      </main>
    );
  }

  function handleDelete() {
    setConfirmOpen(true);
  }
  function reallyDelete() {
    deletePost(id);
    navigate("/blog");
  }

  return (
    <>
      <ReadingProgress />
      <main style={{
        maxWidth: 800, margin: "24px auto", padding: "0 16px",
        fontFamily: "system-ui, sans-serif", color: "#0f172a"
      }}>
        <header style={{ marginBottom: 16 }}>
          <h1 style={{ marginBottom: 4, fontSize: 32, fontWeight: 700 }}>{post.title}</h1>
          <div style={{ fontSize: 13, color: "#64748b" }}>
            by {post.author} · {meta.created} · {meta.readMins} min read
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <Link to={`/blog/${post.id}/edit`} style={{
              background: "#0ea5e9", borderRadius: 8, color: "#fff",
              fontWeight: 600, textDecoration: "none", fontSize: 13, padding: "8px 10px"
            }}>Edit</Link>

            <button onClick={handleDelete} style={{
              background: "#ef4444", borderRadius: 8, color: "#fff",
              fontWeight: 600, fontSize: 13, padding: "8px 10px", border: "none", cursor: "pointer"
            }}>Delete</button>

            <Link to="/blog" style={{
              background: "#e2e8f0", borderRadius: 8, color: "#0f172a",
              fontWeight: 500, textDecoration: "none", fontSize: 13, padding: "8px 10px"
            }}>← All Posts</Link>
          </div>
        </header>

        {post.tags?.length > 0 && (
          <div style={{ marginBottom: 16, fontSize: 12, color: "#475569" }}>
            {post.tags.map((tag) => (
              <span key={tag} style={{
                background: "#f1f5f9", border: "1px solid #cbd5e1",
                padding: "2px 6px", borderRadius: 6, marginRight: 6
              }}>#{tag}</span>
            ))}
          </div>
        )}

        <article style={{
          background: "#fff", border: "1px solid #cbd5e1", borderRadius: 16,
          padding: 24, fontSize: 17, lineHeight: 1.8, color: "#1e293b", whiteSpace: "pre-wrap"
        }}>
          {post.content}
        </article>

        <ReactionsBar />

        <footer style={{ fontSize: 12, color: "#94a3b8", marginTop: 24 }}>
          Last updated: {meta.updated}
        </footer>
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        message="This action can’t be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={reallyDelete}
      />

      <FloatingHelp />
    </>
  );
}
