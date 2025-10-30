import { create } from "zustand";

const STORAGE_KEY = "my-blog-posts";

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Failed to load posts", err);
    return null;
  }
}

function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.warn("Failed to save posts", err);
  }
}

// some starter demo posts
const defaultPosts = [
  {
    id: crypto.randomUUID(),
    title: "Why I'm Learning React",
    author: "Jaahnavi Yeturi",
    content:
      "React lets me build real apps fast. I'm using Zustand for state, React Router for pages, and localStorage for persistence. This blog is my practice ground.",
    tags: ["react", "learning", "journey"],
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: crypto.randomUUID(),
    title: "What I Want From AI Career",
    author: "Jaahnavi Yeturi",
    content:
      "AI PM to me means product + systems + user value, not just models. I want to ship features that actually reduce friction.",
    tags: ["career", "ai", "goals"],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const useBlogStore = create((set, get) => ({
  posts: loadPosts() ?? defaultPosts,

  createPost: ({ title, author, content, tags }) => {
    const now = Date.now();
    const newPost = {
      id: crypto.randomUUID(),
      title: title || "Untitled Post",
      author: author || "Anonymous",
      content: content || "",
      tags:
        typeof tags === "string"
          ? tags.split(",").map((t) => t.trim()).filter(Boolean)
          : tags || [],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newPost, ...get().posts];
    savePosts(updated);
    set({ posts: updated });
    return newPost.id; // useful for navigation after create
  },

  updatePost: (id, patch) => {
    const now = Date.now();
    const updated = get().posts.map((p) =>
      p.id === id
        ? {
            ...p,
            ...patch,
            tags:
              typeof patch.tags === "string"
                ? patch.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : patch.tags ?? p.tags,
            updatedAt: now,
          }
        : p
    );
    savePosts(updated);
    set({ posts: updated });
  },

  deletePost: (id) => {
    const filtered = get().posts.filter((p) => p.id !== id);
    savePosts(filtered);
    set({ posts: filtered });
  },

  getPostById: (id) => {
    return get().posts.find((p) => p.id === id);
  },
}));
