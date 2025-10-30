import { useNavigate } from "react-router-dom";
import { useBlogStore } from "../State/BlogStore.js";
import PostForm from "../Components/PostForm";

export default function BlogNew() {
  const createPost = useBlogStore((s) => s.createPost);
  const navigate = useNavigate();

  function handleSubmit(data) {
    const newId = createPost(data);
    navigate(`/blog/${newId}`);
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
      <PostForm onSubmit={handleSubmit} />
    </main>
  );
}
