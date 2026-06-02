"use client";

import { useState } from "react";
import { C, ROLES } from "./constants";

export default function LoginScreen({ onLogin }) {
  const [selected, setSelected] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "grid",
        placeItems: "center",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 980,
          display: "grid",
          gridTemplateColumns: "minmax(280px, 1fr) minmax(360px, 430px)",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <section
          style={{
            background: C.sidebar,
            color: C.inverseText,
            borderRadius: 8,
            padding: 34,
            minHeight: 520,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: C.shadow,
          }}
        >
          <div>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 8,
                background: C.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                marginBottom: 28,
              }}
            >
              SA
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700, marginBottom: 10 }}>
              SIMA ISBI ACEH
            </div>
            <h1 style={{ margin: 0, fontSize: 42, lineHeight: 1.08, fontWeight: 900, maxWidth: 440 }}>
              Pusat kendali aset BMN yang rapi dan mudah diaudit.
            </h1>
            <p style={{ margin: "18px 0 0", color: "#CBD5E1", fontSize: 15, lineHeight: 1.7, maxWidth: 520 }}>
              Kelola aset, ruangan, kendaraan, BAST, dan data SIMAN v2 dalam satu ruang kerja yang bersih.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              ["9.094", "Aset SIMAN"],
              ["15", "Kendaraan"],
              ["v2", "Import Ready"],
            ].map(([value, label]) => (
              <div key={label} style={{ borderTop: "1px solid rgba(255,255,255,0.14)", paddingTop: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#FFFFFF" }}>{value}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: 28,
            boxShadow: C.shadow,
            alignSelf: "center",
          }}
        >
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 700, marginBottom: 6 }}>
              AKSES APLIKASI
            </div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: C.text }}>
              Pilih peran pengguna
            </h2>
            <p style={{ margin: "8px 0 0", color: C.textMuted, fontSize: 13, lineHeight: 1.6 }}>
              Setiap peran membuka ruang kerja yang berbeda sesuai kebutuhan operasional.
            </p>
          </div>

          <div style={{ display: "grid", gap: 10, marginBottom: 18 }}>
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                style={{
                  width: "100%",
                  padding: "13px 14px",
                  borderRadius: 8,
                  background: selected === role.id ? `${role.color}12` : C.card2,
                  border: `1px solid ${selected === role.id ? role.color : C.border}`,
                  color: selected === role.id ? role.color : C.text,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: selected === role.id ? role.color : "#E2E8F0",
                    color: selected === role.id ? "white" : C.textMuted,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {role.icon}
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 13, fontWeight: 800 }}>{role.label}</span>
                  <span style={{ display: "block", color: C.textMuted, fontSize: 11, marginTop: 2 }}>
                    Masuk ke ruang kerja {role.label.toLowerCase()}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => selected && onLogin(selected)}
            disabled={!selected}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 8,
              border: "none",
              background: selected ? C.primary : "#E2E8F0",
              color: selected ? "white" : C.textDim,
              fontWeight: 800,
              fontSize: 14,
              cursor: selected ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: selected ? `0 12px 24px ${C.primary}30` : "none",
            }}
          >
            {selected ? `Masuk sebagai ${ROLES.find((role) => role.id === selected)?.label}` : "Pilih peran dulu"}
          </button>
        </section>
      </div>
    </div>
  );
}
