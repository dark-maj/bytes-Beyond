import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 4, zIndex: 999 }}>
      <div style={{
        width: `${pct}%`, height: 4,
        background: "linear-gradient(90deg,#0ea5e9,#38bdf8)",
        boxShadow: "0 0 10px rgba(56,189,248,.5)"
      }} />
    </div>
  );
}
