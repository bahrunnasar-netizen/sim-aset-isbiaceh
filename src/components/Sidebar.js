"use client";

import { useEffect, useState } from "react";
import { C, MENU_ITEMS, ROLES } from "./constants";

function IconBadge({ label, active, color }) {
  return (
    <span
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: active ? color : "rgba(255,255,255,0.08)",
        color: active ? "white" : "#CBD5E1",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        fontWeight: 900,
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  );
}

export default function Sidebar({ role, page, setPage, sideOpen, setSideOpen, onLogout }) {
  const currentRole = ROLES.find((item) => item.id === role);
  const menus = MENU_ITEMS[role] || [];
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <>
        {showMobileMenu && (
          <button
            aria-label="Tutup menu"
            onClick={() => setShowMobileMenu(false)}
            style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(15,23,42,0.45)", border: "none" }}
          />
        )}

        {showMobileMenu && (
          <div
            style={{
              position: "fixed",
              bottom: 70,
              left: 12,
              right: 12,
              zIndex: 999,
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: 14,
              boxShadow: C.shadow,
            }}
          >
            <div
              style={{
                background: `${currentRole.color}12`,
                border: `1px solid ${currentRole.color}30`,
                borderRadius: 8,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: currentRole.color,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                {currentRole.icon}
              </span>
              <div>
                <div style={{ fontSize: 10, color: C.textMuted }}>Login sebagai</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: currentRole.color }}>{currentRole.label}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
              {menus.map((menu) => {
                const active = page === menu.id;
                return (
                  <button
                    key={menu.id}
                    onClick={() => {
                      setPage(menu.id);
                      setShowMobileMenu(false);
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      background: active ? C.blueDim : C.card2,
                      border: `1px solid ${active ? C.blue : C.border}`,
                      color: active ? C.blue : C.text,
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: active ? 800 : 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 900 }}>{menu.icon}</span>
                    {menu.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={onLogout}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 8,
                background: C.redDim,
                border: `1px solid ${C.red}30`,
                color: C.red,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              Keluar dari Sistem
            </button>
          </div>
        )}

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: C.card,
            borderTop: `1px solid ${C.border}`,
            display: "flex",
            alignItems: "center",
            height: 66,
            padding: "0 8px",
            boxShadow: "0 -12px 26px rgba(15,23,42,0.08)",
          }}
        >
          {menus.slice(0, 3).map((menu) => (
            <button
              key={menu.id}
              onClick={() => setPage(menu.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: "7px 4px",
                borderRadius: 8,
                background: "transparent",
                border: "none",
                color: page === menu.id ? C.blue : C.textMuted,
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 900 }}>{menu.icon}</span>
              <span style={{ fontSize: 10, fontWeight: page === menu.id ? 800 : 600 }}>{menu.label.split(" ")[0]}</span>
            </button>
          ))}

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "7px 4px",
              borderRadius: 8,
              background: showMobileMenu ? C.blueDim : "transparent",
              border: "none",
              color: showMobileMenu ? C.blue : C.textMuted,
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900 }}>...</span>
            <span style={{ fontSize: 10, fontWeight: 700 }}>Menu</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <aside
      style={{
        width: sideOpen ? 260 : 76,
        background: C.sidebar,
        color: C.inverseText,
        transition: "width 0.25s ease",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        height: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ padding: "22px 16px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              flexShrink: 0,
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 900,
              color: "white",
            }}
          >
            SA
          </div>
          {sideOpen && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: C.inverseText, lineHeight: 1.15 }}>SIASET</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>ISBI Aceh</div>
            </div>
          )}
        </div>
      </div>

      {sideOpen && (
        <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: currentRole.color,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 900,
              }}
            >
              {currentRole.icon}
            </span>
            <div>
              <div style={{ fontSize: 10, color: "#94A3B8" }}>Login sebagai</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.inverseText }}>{currentRole.label}</div>
            </div>
          </div>
        </div>
      )}

      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        {menus.map((menu) => {
          const active = page === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => setPage(menu.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                marginBottom: 4,
                background: active ? "rgba(255,255,255,0.12)" : "transparent",
                border: `1px solid ${active ? "rgba(255,255,255,0.12)" : "transparent"}`,
                color: active ? C.inverseText : "#CBD5E1",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: active ? 800 : 600,
                transition: "all 0.15s",
                textAlign: "left",
              }}
            >
              <IconBadge label={menu.icon} active={active} color={C.primary} />
              {sideOpen && <span style={{ whiteSpace: "nowrap" }}>{menu.label}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{ padding: "12px 10px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <button
          onClick={() => setSideOpen(!sideOpen)}
          style={{
            width: "100%",
            padding: "9px 10px",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#CBD5E1",
            cursor: "pointer",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: sideOpen ? "flex-start" : "center",
            gap: 8,
            fontWeight: 700,
          }}
        >
          <span>{sideOpen ? "<" : ">"}</span>
          {sideOpen && "Tutup Menu"}
        </button>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "9px 10px",
            borderRadius: 8,
            background: "rgba(220,38,38,0.12)",
            border: "1px solid rgba(220,38,38,0.22)",
            color: "#FCA5A5",
            cursor: "pointer",
            fontSize: 12,
            marginTop: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: sideOpen ? "flex-start" : "center",
            gap: 8,
            fontWeight: 800,
          }}
        >
          <span>EX</span>
          {sideOpen && "Keluar"}
        </button>
      </div>
    </aside>
  );
}
