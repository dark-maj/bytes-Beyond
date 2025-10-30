import { useNavigate, useParams } from "react-router-dom";
import { useBlogStore } from "../State/BlogStore.js";
import PostForm from "../Components/PostForm";

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = useBlogStore((s) => s.getPostById(id));
  const updatePost = useBlogStore((s) => s.updatePost);

  if (!post) {
    return (
      <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <h2>Post not found</h2>
      </main>
    );
  }

  function handleSubmit(data) {
    updatePost(id, data);
    navigate(`/blog/${id}`);
  }

  return (
    <main
      style={{
        maxWidth: 800,
        margin: "24px auto",
        padding: "0 16px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <PostForm initial={post} onSubmit={handleSubmit} />
    </main>
  );
}
