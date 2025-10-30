import { useState } from "react";

export default function ReactionsBar() {
  const [r, setR] = useState({ like: 0, clap: 0, idea: 0 });
  const bump = (k) => setR((x) => ({ ...x, [k]: x[k] + 1 }));

  const btn = {
    border: "1px solid #cbd5e1", background: "#fff", borderRadius: 999,
    padding: "6px 10px", fontSize: 13, cursor: "pointer"
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
      <button style={btn} onClick={() => bump("like")}>👍 {r.like}</button>
      <button style={btn} onClick={() => bump("clap")}>👏 {r.clap}</button>
      <button style={btn} onClick={() => bump("idea")}>💡 {r.idea}</button>
    </div>
  );
}
