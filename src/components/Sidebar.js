"use client";
import { C, ROLES, MENU_ITEMS } from "./constants";

export default function Sidebar({ role, page, setPage, sideOpen, setSideOpen, onLogout }) {
  const currentRole = ROLES.find(r => r.id === role);
  const menus = MENU_ITEMS[role] || [];

  return (
    <div style={{
      width: sideOpen ? 240 : 64,
      background: C.card,
      borderRight: `1px solid ${C.border}`,
      transition: "width 0.3s ease",
      display: "flex", flexDirection: "column",
      overflow: "hidden", flexShrink: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.primary}, ${C.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "white",
          }}>S</div>
          {sideOpen && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: C.text, lineHeight: 1.2 }}>SIMA</div>
              <div style={{ fontSize: 10, color: C.textMuted }}>ISBI Aceh</div>
            </div>
          )}
        </div>
      </div>

      {/* Role Badge */}
      {sideOpen && (
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div style={{
            background: currentRole.color + "22",
            border: `1px solid ${currentRole.color}44`,
            borderRadius: 8, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18 }}>{currentRole.icon}</span>
            <div>
              <div style={{ fontSize: 10, color: C.textMuted }}>Login sebagai</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: currentRole.color }}>{currentRole.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {menus.map(m => (
          <button key={m.id} onClick={() => setPage(m.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, marginBottom: 2,
            background: page === m.id ? C.primary + "22" : "transparent",
            border: `1px solid ${page === m.id ? C.primary + "44" : "transparent"}`,
            color: page === m.id ? C.primary : C.textMuted,
            cursor: "pointer", fontSize: 13,
            fontWeight: page === m.id ? 600 : 400,
            transition: "all 0.15s", textAlign: "left",
          }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>{m.icon}</span>
            {sideOpen && <span style={{ whiteSpace: "nowrap" }}>{m.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <button onClick={() => setSideOpen(!sideOpen)} style={{
          width: "100%", padding: "8px 12px", borderRadius: 8,
          background: "transparent", border: "none", color: C.textMuted,
          cursor: "pointer", fontSize: 13,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>{sideOpen ? "◀" : "▶"}</span>
          {sideOpen && "Tutup Menu"}
        </button>
        <button onClick={onLogout} style={{
          width: "100%", padding: "8px 12px", borderRadius: 8,
          background: C.redDim, border: "none", color: C.red,
          cursor: "pointer", fontSize: 13, marginTop: 4,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span>🚪</span>{sideOpen && "Keluar"}
        </button>
      </div>
    </div>
  );
}
