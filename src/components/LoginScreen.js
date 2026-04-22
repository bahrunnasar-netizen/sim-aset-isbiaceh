"use client";
import { useState } from "react";
import { C, ROLES } from "./constants";

export default function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 76, height: 76, borderRadius: 22, margin: "0 auto 18px",
            background: `linear-gradient(135deg, ${C.primary}, ${C.blue})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 38, boxShadow: `0 0 48px ${C.primary}55`,
            animation: "fadeUp 0.6s ease",
          }}>🏛️</div>
          <h1 style={{
            margin: 0, fontSize: 32, fontWeight: 900, color: C.text,
            letterSpacing: -1, animation: "fadeUp 0.7s ease",
          }}>SIMA</h1>
          <p style={{
            margin: "8px 0 0", color: C.textMuted, fontSize: 14,
            animation: "fadeUp 0.8s ease",
          }}>
            Sistem Informasi Manajemen Aset<br />
            <strong style={{ color: C.primary }}>Institut Seni Budaya Indonesia Aceh</strong>
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: C.card, borderRadius: 18,
          border: `1px solid ${C.border}`, padding: 28,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          animation: "fadeUp 0.9s ease",
        }}>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 18, textAlign: "center" }}>
            Pilih peran Anda untuk masuk ke sistem
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setSelected(r.id)} style={{
                padding: "16px 12px", borderRadius: 12, textAlign: "center",
                background: selected === r.id ? r.color + "22" : C.card2,
                border: `2px solid ${selected === r.id ? r.color : C.border}`,
                color: selected === r.id ? r.color : C.textMuted,
                cursor: "pointer", transition: "all 0.2s",
                transform: selected === r.id ? "scale(1.02)" : "scale(1)",
              }}>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{r.icon}</div>
                <div style={{ fontSize: 12, fontWeight: selected === r.id ? 700 : 400, lineHeight: 1.3 }}>
                  {r.label}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => selected && onLogin(selected)}
            disabled={!selected}
            style={{
              width: "100%", padding: "13px", borderRadius: 10, border: "none",
              background: selected
                ? `linear-gradient(135deg, ${C.primary}, ${C.blue})`
                : C.card2,
              color: selected ? "white" : C.textDim,
              fontWeight: 700, fontSize: 14,
              cursor: selected ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: selected ? `0 8px 24px ${C.primary}44` : "none",
            }}
          >
            {selected
              ? `Masuk sebagai ${ROLES.find(r => r.id === selected)?.label}`
              : "Pilih peran dulu..."}
          </button>
        </div>

        <p style={{ textAlign: "center", color: C.textDim, fontSize: 11, marginTop: 18 }}>
          🔒 SIMA ISBI Aceh v1.0 · Demo Sistem
        </p>
      </div>
    </div>
  );
}
