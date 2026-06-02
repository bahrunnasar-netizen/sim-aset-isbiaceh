"use client";
import { useState } from "react";
import { C, ROLES, MENU_ITEMS } from "./constants";
import LoginScreen from "./LoginScreen";
import Sidebar from "./Sidebar";
import MasterAssetPage from "./MasterAssetPage";
import MasterOrganizationPage from "./MasterOrganizationPage";
import MasterRoomPage from "./MasterRoomPage";
import VehicleBMNPage from "./VehicleBMNPage";
import ImportSimanPage from "./ImportSimanPage";
import FreshDashboardPage from "./FreshDashboardPage";
import {
  AsetPage, PeminjamanPage,
  PinjamBaruPage, LaporanPage, PenggunaPage, PengadaanPage,
  BASTPage,
} from "./Pages";

export default function SimaApp() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sideOpen, setSideOpen] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [notif, setNotif] = useState(null);

  const showNotif = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 3000);
  };

  if (!role) return <LoginScreen onLogin={(r) => { setRole(r); setPage("dashboard"); }} />;

  const currentRole = ROLES.find((r) => r.id === role);
  const menus = MENU_ITEMS[role] || [];
  const pageLabel = menus.find((m) => m.id === page)?.label || "Dashboard";

  const renderPage = () => {
    const props = { role, showNotif, searchQ, setPage };
    switch (page) {
      case "bast": return <BASTPage {...props} />;
      case "dashboard": return <FreshDashboardPage {...props} />;
      case "organisasi": return <MasterOrganizationPage {...props} />;
      case "ruangan": return <MasterRoomPage {...props} />;
      case "aset": return role === "admin" ? <MasterAssetPage {...props} /> : <AsetPage {...props} />;
      case "kendaraan": return <VehicleBMNPage {...props} />;
      case "import": return <ImportSimanPage {...props} />;
      case "peminjaman": return <PeminjamanPage {...props} />;
      case "pinjam_baru": return <PinjamBaruPage {...props} />;
      case "laporan": return <LaporanPage {...props} />;
      case "pengguna": return <PenggunaPage {...props} />;
      case "pengadaan": return <PengadaanPage {...props} />;
      default: return <FreshDashboardPage {...props} />;
    }
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      overflow: "hidden",
    }}>
      {notif && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          background: C.card,
          color: C.text,
          padding: "12px 16px",
          borderRadius: 12,
          fontSize: 14,
          fontWeight: 650,
          border: `1px solid ${notif.type === "success" ? C.primary : C.red}33`,
          boxShadow: C.shadow,
          animation: "slideIn 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: notif.type === "success" ? C.primaryDim : C.redDim,
            color: notif.type === "success" ? C.primary : C.red,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 900,
          }}>{notif.type === "success" ? "OK" : "!"}</span>
          {notif.msg}
        </div>
      )}

      <Sidebar
        role={role}
        page={page}
        setPage={setPage}
        sideOpen={sideOpen}
        setSideOpen={setSideOpen}
        onLogout={() => { setRole(null); setPage("dashboard"); }}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{
          padding: "14px 24px",
          background: "rgba(255,255,255,0.88)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          backdropFilter: "blur(12px)",
          boxShadow: "0 1px 0 rgba(15, 23, 42, 0.02)",
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 850, letterSpacing: 0 }}>{pageLabel}</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              Selasa, 2 Juni 2026 - SIASET ISBI Aceh
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
            }}>
              <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 900 }}>CR</span>
              <input
                placeholder="Cari aset..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: C.text,
                  fontSize: 13,
                  width: 190,
                }}
              />
            </div>

            <button
              type="button"
              onClick={() => showNotif("2 notifikasi baru")}
              title="Notifikasi"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: C.card,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 900,
                color: C.textMuted,
                cursor: "pointer",
                position: "relative",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
              }}
            >
              NT
              <span style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.red,
              }} />
            </button>

            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg,${currentRole.color},${C.sidebar2})`,
              color: "white",
              fontWeight: 900,
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 10px 22px rgba(15, 23, 42, 0.12)",
            }} title={currentRole.label}>
              {currentRole.icon}
            </div>
          </div>
        </div>

        <div className="main-content" style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
