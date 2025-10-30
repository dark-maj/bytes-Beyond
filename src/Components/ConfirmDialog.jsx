import { useEffect } from "react";

export default function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return; // run effect only when open
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: 360,
          background: "#fff",
          borderRadius: 14,
          padding: 18,
          boxShadow: "0 20px 40px rgba(2,6,23,.2)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{
            margin: "4px 0 2px",
            fontSize: 18,
            fontWeight: 700,
            color: "#0f172a",
          }}
        >
          {title || "Are you sure?"}
        </h3>
        <p style={{ margin: "6px 0 0", color: "#475569", fontSize: 14 }}>
          {message}
        </p>
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #cbd5e1",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
