"use client";
import { C } from "./constants";

const roleStats = {
  admin: [
    { label: "Total Aset SIMAN", value: "9.094", badge: "AS", color: C.blue, sub: "Data rill tersimpan" },
    { label: "Kendaraan BMN", value: "15", badge: "KD", color: C.primary, sub: "Pajak & STNK terpantau" },
    { label: "Dipinjam", value: "23", badge: "PJ", color: C.accent, sub: "Aktif saat ini" },
    { label: "Perlu Perawatan", value: "47", badge: "RW", color: C.red, sub: "Rusak ringan/berat" },
  ],
  pj: [
    { label: "Aset Ruangan Saya", value: "34", badge: "AS", color: C.blue, sub: "Lab Komputer 1" },
    { label: "Kondisi Baik", value: "28", badge: "OK", color: C.primary, sub: "82% dari total" },
    { label: "Sedang Dipinjam", value: "4", badge: "PJ", color: C.accent, sub: "Perlu dikembalikan" },
    { label: "Perlu Perawatan", value: "2", badge: "RW", color: C.red, sub: "Segera ditangani" },
  ],
  peminjam: [
    { label: "Pinjaman Aktif", value: "2", badge: "PA", color: C.blue, sub: "Sedang berlangsung" },
    { label: "Total Dipinjam", value: "8", badge: "AS", color: C.primary, sub: "Riwayat semua" },
    { label: "Menunggu Approval", value: "1", badge: "AP", color: C.accent, sub: "Segera diproses" },
    { label: "Jatuh Tempo", value: "1", badge: "JT", color: C.red, sub: "Besok harus kembali" },
  ],
  pimpinan: [
    { label: "Total Aset", value: "9.094", badge: "AS", color: C.blue, sub: "Seluruh unit" },
    { label: "Kendaraan BMN", value: "15", badge: "KD", color: C.primary, sub: "Unit aktif terdata" },
    { label: "Utilisasi Aset", value: "78%", badge: "UT", color: C.accent, sub: "Digunakan aktif" },
    { label: "Usulan Pengadaan", value: "5", badge: "PN", color: C.purple, sub: "Menunggu approval" },
  ],
};

const conditions = [
  { label: "Baik", pct: 71, color: C.primary },
  { label: "Rusak Ringan", pct: 18, color: C.accent },
  { label: "Rusak Berat", pct: 7, color: C.red },
  { label: "Tidak Aktif", pct: 4, color: C.textDim },
];

const categories = [
  { label: "Furnitur & Mebel", value: 342, color: C.blue },
  { label: "Peralatan TI", value: 287, color: C.primary },
  { label: "Alat Seni & Musik", value: 198, color: C.accent },
  { label: "Peralatan Gedung", value: 156, color: C.purple },
  { label: "Kendaraan", value: 15, color: C.red },
];

const activities = [
  { time: "10:24", text: "Proyektor Epson dipinjam oleh Dr. Rasyid untuk Kuliah Tamu", badge: "PJ", color: C.accent },
  { time: "09:15", text: "Import data SIMAN v2 berhasil - 9.094 aset tersinkronisasi", badge: "IM", color: C.primary },
  { time: "08:50", text: "Laporan KIR Lab Komputer 1 dicetak oleh PJ Ruangan", badge: "LP", color: C.blue },
  { time: "Kemarin", text: "Kamera Canon dikembalikan dalam kondisi baik", badge: "OK", color: C.primary },
];

function Badge({ text, color }) {
  return (
    <div style={{
      width: 38,
      height: 38,
      borderRadius: 10,
      background: `${color}14`,
      border: `1px solid ${color}22`,
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 900,
      flexShrink: 0,
    }}>
      {text}
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: 20,
      boxShadow: C.shadow,
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 850 }}>{title}</h3>
      {children}
    </section>
  );
}

export default function FreshDashboardPage({ role, setPage }) {
  const stats = roleStats[role] || roleStats.admin;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 850 }}>Selamat datang</h2>
        <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: 14 }}>
          Selasa, 2 Juni 2026 - ringkasan aset ISBI Aceh terkini
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 14, marginBottom: 24 }}>
        {stats.map((item) => (
          <section key={item.label} style={{
            background: C.card,
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${item.color}`,
            borderRadius: 12,
            padding: "18px 20px",
            boxShadow: C.shadow,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}>{item.sub}</div>
              </div>
              <Badge text={item.badge} color={item.color} />
            </div>
          </section>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 16 }}>
        <Panel title="Kondisi Aset">
          {conditions.map((item) => (
            <div key={item.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: C.textMuted }}>{item.label}</span>
                <span style={{ color: item.color, fontWeight: 800 }}>{item.pct}%</span>
              </div>
              <div style={{ background: C.card2, borderRadius: 999, height: 7 }}>
                <div style={{ background: item.color, width: `${item.pct}%`, height: 7, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Kategori Aset">
          {categories.map((item) => (
            <div key={item.label} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 10px",
              borderRadius: 8,
              marginBottom: 5,
              background: `${item.color}10`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: item.color }} />
                <span style={{ color: C.textMuted }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: 850, color: item.color, fontSize: 13 }}>{item.value}</span>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="Aktivitas Terbaru">
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -40, marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => setPage("peminjaman")}
            style={{
              background: C.primaryDim,
              border: `1px solid ${C.primary}44`,
              color: C.primary,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Lihat Semua
          </button>
        </div>
        {activities.map((item, index) => (
          <div key={`${item.time}-${item.badge}`} style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            padding: "11px 0",
            borderBottom: index < activities.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <Badge text={item.badge} color={item.color} />
            <div>
              <div style={{ fontSize: 13, color: C.text }}>{item.text}</div>
              <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{item.time}</div>
            </div>
          </div>
        ))}
      </Panel>
    </div>
  );
}
