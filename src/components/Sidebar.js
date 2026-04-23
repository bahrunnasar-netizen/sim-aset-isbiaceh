"use client";
import { useState, useEffect } from "react";
import { C, ROLES, MENU_ITEMS } from "./constants";

export default function Sidebar({ role, page, setPage, sideOpen, setSideOpen, onLogout }) {
  const currentRole = ROLES.find(r => r.id === role);
  const menus = MENU_ITEMS[role] || [];
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── MOBILE: Bottom Navigation Bar ──────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {showMobileMenu && (
          <div onClick={() => setShowMobileMenu(false)} style={{
            position:"fixed", inset:0, zIndex:998,
            background:"rgba(0,0,0,0.6)",
          }} />
        )}

        {/* Slide-up panel */}
        {showMobileMenu && (
          <div style={{
            position:"fixed", bottom:64, left:0, right:0,
            zIndex:999, background:C.card,
            borderTop:`1px solid ${C.border}`,
            borderRadius:"20px 20px 0 0",
            padding:"16px 16px 8px",
            boxShadow:"0 -8px 32px rgba(0,0,0,0.4)",
          }}>
            {/* Role badge */}
            <div style={{
              background:currentRole.color+"22",
              border:`1px solid ${currentRole.color}44`,
              borderRadius:10, padding:"10px 14px",
              display:"flex", alignItems:"center", gap:10, marginBottom:12,
            }}>
              <span style={{ fontSize:20 }}>{currentRole.icon}</span>
              <div>
                <div style={{ fontSize:10, color:C.textMuted }}>Login sebagai</div>
                <div style={{ fontSize:13, fontWeight:700, color:currentRole.color }}>{currentRole.label}</div>
              </div>
            </div>

            {/* Menu grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
              {menus.map(m => (
                <button key={m.id} onClick={() => { setPage(m.id); setShowMobileMenu(false); }} style={{
                  padding:"12px 10px", borderRadius:10,
                  background: page===m.id ? C.primary+"22" : C.card2,
                  border:`1px solid ${page===m.id ? C.primary+"66" : C.border}`,
                  color: page===m.id ? C.primary : C.textMuted,
                  cursor:"pointer", fontSize:13,
                  fontWeight: page===m.id ? 700 : 400,
                  display:"flex", alignItems:"center", gap:8,
                  transition:"all 0.15s",
                }}>
                  <span style={{ fontSize:18 }}>{m.icon}</span>
                  <span style={{ textAlign:"left", lineHeight:1.3 }}>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Keluar */}
            <button onClick={onLogout} style={{
              width:"100%", padding:"12px", borderRadius:10,
              background:C.redDim, border:`1px solid ${C.red}44`,
              color:C.red, cursor:"pointer", fontSize:13, fontWeight:600,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              🚪 Keluar dari Sistem
            </button>
          </div>
        )}

        {/* Bottom Nav Bar */}
        <div style={{
          position:"fixed", bottom:0, left:0, right:0,
          zIndex:1000, background:C.card,
          borderTop:`1px solid ${C.border}`,
          display:"flex", alignItems:"center",
          height:64, padding:"0 8px",
          boxShadow:"0 -4px 20px rgba(0,0,0,0.3)",
        }}>
          {menus.slice(0,3).map(m => (
            <button key={m.id} onClick={() => { setPage(m.id); setShowMobileMenu(false); }} style={{
              flex:1, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:3,
              padding:"8px 4px", borderRadius:10,
              background:"transparent", border:"none",
              color: page===m.id ? C.primary : C.textMuted,
              cursor:"pointer", transition:"all 0.15s",
            }}>
              <span style={{ fontSize:20 }}>{m.icon}</span>
              <span style={{ fontSize:10, fontWeight:page===m.id?700:400, whiteSpace:"nowrap" }}>
                {m.label.split(" ")[0]}
              </span>
              {page===m.id && <div style={{ width:4, height:4, borderRadius:"50%", background:C.primary }} />}
            </button>
          ))}

          {/* Tombol Menu */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} style={{
            flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:3,
            padding:"8px 4px", borderRadius:10,
            background: showMobileMenu ? C.primary+"22" : "transparent",
            border:"none",
            color: showMobileMenu ? C.primary : C.textMuted,
            cursor:"pointer",
          }}>
            <span style={{ fontSize:20 }}>☰</span>
            <span style={{ fontSize:10 }}>Menu</span>
          </button>
        </div>
      </>
    );
  }

  // ── DESKTOP: Sidebar biasa ──────────────────────────────────
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
      <div style={{ padding:"20px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{
            width:36, height:36, borderRadius:10, flexShrink:0,
            background:`linear-gradient(135deg, ${C.primary}, ${C.blue})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, fontWeight:900, color:"white",
          }}>S</div>
          {sideOpen && (
            <div>
              <div style={{ fontSize:14, fontWeight:900, color:C.text, lineHeight:1.2 }}>SIASET</div>
              <div style={{ fontSize:10, color:C.textMuted }}>ISBI Aceh</div>
            </div>
          )}
        </div>
      </div>

      {/* Role Badge */}
      {sideOpen && (
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{
            background:currentRole.color+"22",
            border:`1px solid ${currentRole.color}44`,
            borderRadius:8, padding:"8px 12px",
            display:"flex", alignItems:"center", gap:8,
          }}>
            <span style={{ fontSize:18 }}>{currentRole.icon}</span>
            <div>
              <div style={{ fontSize:10, color:C.textMuted }}>Login sebagai</div>
              <div style={{ fontSize:12, fontWeight:700, color:currentRole.color }}>{currentRole.label}</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
        {menus.map(m => (
          <button key={m.id} onClick={() => setPage(m.id)} style={{
            width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"10px 12px", borderRadius:8, marginBottom:2,
            background: page===m.id ? C.primary+"22" : "transparent",
            border:`1px solid ${page===m.id ? C.primary+"44" : "transparent"}`,
            color: page===m.id ? C.primary : C.textMuted,
            cursor:"pointer", fontSize:13,
            fontWeight: page===m.id ? 600 : 400,
            transition:"all 0.15s", textAlign:"left",
          }}>
            <span style={{ fontSize:17, flexShrink:0 }}>{m.icon}</span>
            {sideOpen && <span style={{ whiteSpace:"nowrap" }}>{m.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom — selalu terlihat */}
      <div style={{
        padding:"12px 8px",
        borderTop:`1px solid ${C.border}`,
        flexShrink:0, background:C.card,
      }}>
        <button onClick={() => setSideOpen(!sideOpen)} style={{
          width:"100%", padding:"8px 12px", borderRadius:8,
          background:"transparent", border:"none", color:C.textMuted,
          cursor:"pointer", fontSize:13,
          display:"flex", alignItems:"center", gap:8,
        }}>
          <span style={{ fontSize:16 }}>{sideOpen ? "◀" : "▶"}</span>
          {sideOpen && "Tutup Menu"}
        </button>
        <button onClick={onLogout} style={{
          width:"100%", padding:"8px 12px", borderRadius:8,
          background:C.redDim, border:`1px solid ${C.red}33`,
          color:C.red, cursor:"pointer", fontSize:13, marginTop:4,
          display:"flex", alignItems:"center", gap:8, fontWeight:600,
        }}>
          <span>🚪</span>{sideOpen && "Keluar"}
        </button>
      </div>
    </div>
  );
}
