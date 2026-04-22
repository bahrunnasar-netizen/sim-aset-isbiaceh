"use client";
import { useState } from "react";
import { C, ROLES, MENU_ITEMS } from "./constants";
import LoginScreen from "./LoginScreen";
import Sidebar from "./Sidebar";
import {
  DashboardPage, AsetPage, ImportPage, PeminjamanPage,
  PinjamBaruPage, LaporanPage, PenggunaPage, PengadaanPage,
} from "./Pages";

export default function SimaApp() {
  const [role,      setRole]      = useState(null);
  const [page,      setPage]      = useState("dashboard");
  const [sideOpen,  setSideOpen]  = useState(true);
  const [searchQ,   setSearchQ]   = useState("");
  const [notif,     setNotif]     = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  if (!role) return <LoginScreen onLogin={(r) => { setRole(r); setPage("dashboard"); }} />;

  const currentRole = ROLES.find(r => r.id === role);
  const menus       = MENU_ITEMS[role] || [];
  const pageLabel   = menus.find(m => m.id === page)?.label || "Dashboard";

  const renderPage = () => {
    const props = { role, showNotif, searchQ, setPage };
    switch (page) {
      case "dashboard":   return <DashboardPage   {...props} />;
      case "aset":        return <AsetPage         {...props} />;
      case "import":      return <ImportPage        {...props} />;
      case "peminjaman":  return <PeminjamanPage    {...props} />;
      case "pinjam_baru": return <PinjamBaruPage    {...props} />;
      case "laporan":     return <LaporanPage       {...props} />;
      case "pengguna":    return <PenggunaPage      {...props} />;
      case "pengadaan":   return <PengadaanPage     {...props} />;
      default:            return <DashboardPage   {...props} />;
    }
  };

  return (
    <div style={{
      display:"flex", height:"100vh",
      background:C.bg, color:C.text,
      fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow:"hidden",
    }}>
      {/* Toast */}
      {notif && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          background: notif.type==="success" ? C.primary : C.red,
          color:"white", padding:"12px 20px", borderRadius:10,
          fontSize:14, fontWeight:600,
          boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
          animation:"slideIn 0.3s ease",
        }}>
          {notif.type==="success" ? "✅" : "❌"} {notif.msg}
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        role={role} page={page} setPage={setPage}
        sideOpen={sideOpen} setSideOpen={setSideOpen}
        onLogout={() => { setRole(null); setPage("dashboard"); }}
      />

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{
          padding:"14px 24px", background:C.card,
          borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexShrink:0,
        }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700 }}>{pageLabel}</div>
            <div style={{ fontSize:11, color:C.textMuted }}>Rabu, 22 April 2026 · SIMA ISBI Aceh</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            {/* Search */}
            <div style={{
              background:C.card2, border:`1px solid ${C.border}`,
              borderRadius:8, padding:"7px 12px",
              display:"flex", alignItems:"center", gap:8,
            }}>
              <span style={{ fontSize:14 }}>🔍</span>
              <input
                placeholder="Cari aset..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                style={{
                  background:"transparent", border:"none", outline:"none",
                  color:C.text, fontSize:13, width:150,
                }}
              />
            </div>

            {/* Notif bell */}
            <div style={{
              width:36, height:36, borderRadius:10,
              background:C.card2, border:`1px solid ${C.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, cursor:"pointer", position:"relative",
            }}
              onClick={() => showNotif("2 notifikasi baru")}
            >
              🔔
              <div style={{
                position:"absolute", top:6, right:6,
                width:8, height:8, borderRadius:"50%",
                background:C.red,
              }}/>
            </div>

            {/* Avatar */}
            <div style={{
              width:36, height:36, borderRadius:"50%",
              background:`linear-gradient(135deg,${currentRole.color},${C.blue})`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:16, cursor:"pointer",
            }} title={currentRole.label}>{currentRole.icon}</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
