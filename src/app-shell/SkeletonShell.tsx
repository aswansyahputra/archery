"use client";
export function SkeletonShell() {
  return (
    <div style={{ maxWidth: 448, margin: "0 auto", minHeight: "100vh", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ height: 32, width: 192, borderRadius: 8, background: "#e5e7eb", animation: "pulse 2s infinite" }} />
      <div style={{ marginTop: 16, height: 128, borderRadius: 8, background: "#e5e7eb", animation: "pulse 2s infinite" }} />
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ height: 48, borderRadius: 8, background: "#e5e7eb", animation: "pulse 2s infinite" }} />
        <div style={{ height: 48, borderRadius: 8, background: "#e5e7eb", animation: "pulse 2s infinite" }} />
      </div>
      <p style={{ marginTop: 24, fontSize: 12, color: "#6b7280" }}>Memuat aplikasi…</p>
    </div>
  );
}
