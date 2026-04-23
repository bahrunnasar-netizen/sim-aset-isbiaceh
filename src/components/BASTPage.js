"use client";
import { useState } from "react";
import { C, DATA_BAST, ASSETS, KATEGORI_BAST, btnStyle } from "./constants";

/* ─── STATUS COLORS ─────────────────────────────────────── */
const statusColor = (s) =>
  s === "Aktif"             ? C.primary :
  s === "Menunggu Approval" ? C.accent  :
  s === "Dikembalikan"      ? C.blue    : C.textDim;

/* ═══════════════════════════════════════════════════════════
   HALAMAN BAST — dipakai Admin & Pimpinan (beda mode)
══════════════════════════════════════════════════════════════ */
export default function BASTPage({ role, showNotif }) {
  const [list, setList]           = useState(DATA_BAST);
  const [showForm, setShowForm]   = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [filterStatus, setFilter] = useState("Semua");

  /* Approve / Tolak (Pimpinan) */
  const approve = (id) => {
    setList(l => l.map(b => b.id === id
      ? { ...b, status: "Aktif", approved_by: "Rektor ISBI Aceh", tgl_approve: "23 Apr 2026" }
      : b
    ));
    showNotif("BAST berhasil disetujui!");
    setShowDetail(null);
  };
  const tolak = (id) => {
    setList(l => l.map(b => b.id === id
      ? { ...b, status: "Ditolak" } : b
    ));
    showNotif("BAST ditolak.", "error");
    setShowDetail(null);
  };

  /* Kembalikan aset (Admin) */
  const kembalikan = (id) => {
    setList(l => l.map(b => b.id === id
      ? { ...b, status: "Dikembalikan" } : b
    ));
    showNotif("Aset berhasil ditandai dikembalikan!");
    setShowDetail(null);
  };

  /* Tambah BAST baru (Admin) */
  const tambahBAST = (data) => {
    const newBAST = {
      id: `BAST-00${list.length + 1}`,
      no_bast: `0${list.length + 1}/BAST-BMN/ISBI/2026`,
      ...data,
      status: "Menunggu Approval",
      approved_by: "-",
      tgl_approve: "-",
    };
    setList(l => [...l, newBAST]);
    showNotif("BAST baru berhasil dibuat! Menunggu approval Pimpinan.");
    setShowForm(false);
  };

  const filtered = list.filter(b =>
    filterStatus === "Semua" || b.status === filterStatus
  );

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>
            {role === "pimpinan" ? "📋 Approval BAST Aset" : "📋 Berita Acara Serah Terima (BAST)"}
          </h2>
          <p style={{ margin: "4px 0 0", color: C.textMuted, fontSize: 13 }}>
            {role === "pimpinan"
              ? "Review dan setujui permohonan BAST dari Admin"
              : "Kelola serah terima aset BMN ke pegawai"}
          </p>
        </div>
        {role === "admin" && (
          <button onClick={() => setShowForm(true)} style={btnStyle(C.primary, true)}>
            ➕ Buat BAST Baru
          </button>
        )}
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total BAST",          val: list.length,                                            color: C.blue   },
          { label: "Aktif",               val: list.filter(b => b.status === "Aktif").length,          color: C.primary},
          { label: "Menunggu Approval",   val: list.filter(b => b.status === "Menunggu Approval").length, color: C.accent },
          { label: "Dikembalikan",        val: list.filter(b => b.status === "Dikembalikan").length,   color: C.textDim},
        ].map((s, i) => (
          <div key={i} style={{
            background: C.card, borderRadius: 12,
            border: `1px solid ${C.border}`,
            borderTop: `3px solid ${s.color}`,
            padding: "14px 16px", textAlign: "center",
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Filter ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["Semua", "Aktif", "Menunggu Approval", "Dikembalikan"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 12,
            background: filterStatus === f ? C.primary : C.card2,
            border: `1px solid ${filterStatus === f ? C.primary : C.border}`,
            color: filterStatus === f ? "white" : C.textMuted,
            cursor: "pointer", transition: "all 0.15s",
          }}>{f} {f !== "Semua" && `(${list.filter(b => b.status === f).length})`}</button>
        ))}
      </div>

      {/* ── Tabel BAST ── */}
      <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.card2 }}>
              {["No. BAST", "Nama Aset", "Penerima", "Jabatan/Unit", "Tgl Serah", "Status", "Aksi"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: C.textDim }}>
                  Tidak ada data BAST
                </td>
              </tr>
            ) : filtered.map((b, i) => (
              <tr key={b.id} style={{ borderTop: `1px solid ${C.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = C.card2}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ color: C.blue, fontWeight: 600, fontSize: 12 }}>{b.no_bast}</div>
                  <div style={{ color: C.textDim, fontSize: 10 }}>{b.id}</div>
                </td>
                <td style={{ padding: "12px 14px", fontWeight: 500 }}>{b.aset_nama}</td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: 500 }}>{b.penerima}</div>
                  <div style={{ color: C.textDim, fontSize: 11 }}>NIP: {b.nip}</div>
                </td>
                <td style={{ padding: "12px 14px", color: C.textMuted }}>
                  <div>{b.jabatan}</div>
                  <div style={{ fontSize: 11, color: C.textDim }}>{b.unit}</div>
                </td>
                <td style={{ padding: "12px 14px", color: C.textMuted, whiteSpace: "nowrap" }}>{b.tgl_serah}</td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: statusColor(b.status) + "22",
                    color: statusColor(b.status),
                  }}>{b.status}</span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setShowDetail(b)} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 11,
                      background: C.blueDim, border: `1px solid ${C.blue}44`,
                      color: C.blue, cursor: "pointer",
                    }}>👁️ Detail</button>

                    {/* Tombol Approve hanya untuk Pimpinan */}
                    {role === "pimpinan" && b.status === "Menunggu Approval" && (
                      <>
                        <button onClick={() => approve(b.id)} style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 11,
                          background: C.primaryDim, border: `1px solid ${C.primary}44`,
                          color: C.primary, cursor: "pointer",
                        }}>✅ Setuju</button>
                        <button onClick={() => tolak(b.id)} style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 11,
                          background: C.redDim, border: `1px solid ${C.red}44`,
                          color: C.red, cursor: "pointer",
                        }}>❌ Tolak</button>
                      </>
                    )}

                    {/* Tombol Kembalikan hanya untuk Admin */}
                    {role === "admin" && b.status === "Aktif" && (
                      <button onClick={() => kembalikan(b.id)} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11,
                        background: C.accentDim, border: `1px solid ${C.accent}44`,
                        color: C.accent, cursor: "pointer",
                      }}>↩️ Kembalikan</button>
                    )}

                    {/* Cetak BAST */}
                    {b.status === "Aktif" && (
                      <button onClick={() => showNotif("Cetak BAST " + b.no_bast)} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11,
                        background: C.purpleDim, border: `1px solid ${C.purple}44`,
                        color: C.purple, cursor: "pointer",
                      }}>🖨️ Cetak</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Modal Detail BAST ── */}
      {showDetail && (
        <ModalDetail
          bast={showDetail}
          role={role}
          onClose={() => setShowDetail(null)}
          onApprove={() => approve(showDetail.id)}
          onTolak={() => tolak(showDetail.id)}
          onKembalikan={() => kembalikan(showDetail.id)}
          showNotif={showNotif}
        />
      )}

      {/* ── Modal Form Buat BAST ── */}
      {showForm && (
        <ModalFormBAST
          onClose={() => setShowForm(false)}
          onSubmit={tambahBAST}
        />
      )}
    </div>
  );
}

/* ─── MODAL DETAIL ──────────────────────────────────────── */
function ModalDetail({ bast, role, onClose, onApprove, onTolak, onKembalikan, showNotif }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        animation: "fadeUp 0.3s ease",
      }} onClick={e => e.stopPropagation()}>

        {/* Header modal */}
        <div style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: `linear-gradient(135deg, ${C.primary}22, ${C.blue}11)`,
          borderRadius: "16px 16px 0 0",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>📋 Detail BAST</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>{bast.no_bast}</div>
          </div>
          <button onClick={onClose} style={{
            background: C.card2, border: `1px solid ${C.border}`,
            color: C.textMuted, borderRadius: 8, padding: "6px 12px",
            cursor: "pointer", fontSize: 13,
          }}>✕ Tutup</button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Status badge */}
          <div style={{
            textAlign: "center", marginBottom: 20,
            padding: "10px", borderRadius: 10,
            background: statusColor(bast.status) + "22",
            border: `1px solid ${statusColor(bast.status)}44`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: statusColor(bast.status) }}>
              Status: {bast.status}
            </span>
            {bast.status === "Aktif" && (
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>
                Disetujui oleh {bast.approved_by} · {bast.tgl_approve}
              </div>
            )}
          </div>

          {/* Info rows */}
          {[
            ["📦 Aset",         bast.aset_nama],
            ["🆔 Kode Aset",    bast.aset_id],
            ["👤 Penerima",     bast.penerima],
            ["🪪 NIP",          bast.nip],
            ["💼 Jabatan",      bast.jabatan],
            ["🏢 Unit Kerja",   bast.unit],
            ["📅 Tanggal Serah",bast.tgl_serah],
            ["🔍 Kondisi Aset", bast.kondisi],
            ["📝 Keterangan",   bast.keterangan],
          ].map(([label, val], i) => (
            <div key={i} style={{
              display: "flex", gap: 12,
              padding: "9px 0",
              borderBottom: i < 8 ? `1px solid ${C.border}` : "none",
              fontSize: 13,
            }}>
              <div style={{ color: C.textMuted, width: 140, flexShrink: 0 }}>{label}</div>
              <div style={{ color: C.text, fontWeight: 500 }}>{val}</div>
            </div>
          ))}

          {/* Aksi di modal */}
          <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
            {role === "pimpinan" && bast.status === "Menunggu Approval" && (
              <>
                <button onClick={onApprove} style={{ ...btnStyle(C.primary, true), flex: 1, justifyContent: "center" }}>
                  ✅ Setujui BAST
                </button>
                <button onClick={onTolak} style={{ ...btnStyle(C.red), flex: 1, justifyContent: "center" }}>
                  ❌ Tolak BAST
                </button>
              </>
            )}
            {role === "admin" && bast.status === "Aktif" && (
              <button onClick={onKembalikan} style={{ ...btnStyle(C.accent), flex: 1, justifyContent: "center" }}>
                ↩️ Kembalikan Aset
              </button>
            )}
            {bast.status === "Aktif" && (
              <button onClick={() => showNotif("Mencetak BAST " + bast.no_bast + "...")} style={{ ...btnStyle(C.purple), flex: 1, justifyContent: "center" }}>
                🖨️ Cetak BAST
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL FORM BUAT BAST BARU ─────────────────────────── */
function ModalFormBAST({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    aset_id: "", aset_nama: "",
    penerima: "", nip: "",
    jabatan: "", unit: "",
    tgl_serah: "", kondisi: "Baik",
    keterangan: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Filter aset yang bisa di-BAST berdasarkan kategori
  const asetBASTable = ASSETS.filter(a => KATEGORI_BAST.includes(a.kat) && a.status === "Tersedia");

  const handleSubmit = () => {
    if (!form.aset_id || !form.penerima || !form.nip || !form.tgl_serah) {
      alert("Lengkapi semua field yang wajib diisi!");
      return;
    }
    onSubmit(form);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,0.7)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: C.card, borderRadius: 16,
        border: `1px solid ${C.border}`,
        width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        animation: "fadeUp 0.3s ease",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: `linear-gradient(135deg, ${C.primary}22, ${C.blue}11)`,
          borderRadius: "16px 16px 0 0",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>➕ Buat BAST Baru</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Hanya aset kategori tertentu yang bisa di-BAST</div>
          </div>
          <button onClick={onClose} style={{
            background: C.card2, border: `1px solid ${C.border}`,
            color: C.textMuted, borderRadius: 8, padding: "6px 12px",
            cursor: "pointer", fontSize: 13,
          }}>✕ Tutup</button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Info kategori */}
          <div style={{
            background: C.blueDim, border: `1px solid ${C.blue}44`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12,
          }}>
            <div style={{ color: C.blue, fontWeight: 700, marginBottom: 4 }}>
              ℹ️ Kategori Aset yang Bisa di-BAST:
            </div>
            <div style={{ color: C.textMuted }}>
              {KATEGORI_BAST.join(" · ")}
            </div>
          </div>

          {/* Pilih Aset */}
          <FormField label="Pilih Aset *">
            <select
              value={form.aset_id}
              onChange={e => {
                const aset = asetBASTable.find(a => a.id === e.target.value);
                set("aset_id", e.target.value);
                set("aset_nama", aset?.name || "");
              }}
              style={inputStyle}
            >
              <option value="">-- Pilih Aset --</option>
              {asetBASTable.map(a => (
                <option key={a.id} value={a.id}>
                  [{a.id}] {a.name} — {a.kat}
                </option>
              ))}
            </select>
          </FormField>

          {/* Data Penerima */}
          <div style={{
            background: C.card2, borderRadius: 10, padding: 14,
            marginBottom: 14, border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, marginBottom: 10 }}>
              👤 Data Penerima Aset
            </div>
            <FormField label="Nama Lengkap *">
              <input type="text" placeholder="Contoh: Ahmad Fauzi, S.Sos"
                value={form.penerima} onChange={e => set("penerima", e.target.value)}
                style={inputStyle} />
            </FormField>
            <FormField label="NIP *">
              <input type="text" placeholder="18 digit NIP pegawai"
                value={form.nip} onChange={e => set("nip", e.target.value)}
                style={inputStyle} />
            </FormField>
            <FormField label="Jabatan">
              <input type="text" placeholder="Contoh: Pengelola BMN"
                value={form.jabatan} onChange={e => set("jabatan", e.target.value)}
                style={inputStyle} />
            </FormField>
            <FormField label="Unit Kerja">
              <input type="text" placeholder="Contoh: Bagian Umum"
                value={form.unit} onChange={e => set("unit", e.target.value)}
                style={inputStyle} />
            </FormField>
          </div>

          <FormField label="Tanggal Serah Terima *">
            <input type="date" value={form.tgl_serah}
              onChange={e => set("tgl_serah", e.target.value)}
              style={inputStyle} />
          </FormField>

          <FormField label="Kondisi Aset">
            <select value={form.kondisi} onChange={e => set("kondisi", e.target.value)} style={inputStyle}>
              <option>Baik</option>
              <option>Rusak Ringan</option>
              <option>Rusak Berat</option>
            </select>
          </FormField>

          <FormField label="Keterangan / Tujuan Penggunaan">
            <textarea rows={3} placeholder="Jelaskan tujuan penggunaan aset ini..."
              value={form.keterangan} onChange={e => set("keterangan", e.target.value)}
              style={{ ...inputStyle, resize: "vertical" }} />
          </FormField>

          {/* Info workflow */}
          <div style={{
            background: C.accentDim, border: `1px solid ${C.accent}44`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12,
          }}>
            <div style={{ color: C.accent, fontWeight: 700 }}>
              ⚠️ BAST akan dikirim ke Pimpinan untuk disetujui terlebih dahulu
            </div>
          </div>

          <button onClick={handleSubmit} style={{ ...btnStyle(C.primary, true), width: "100%", justifyContent: "center" }}>
            📤 Kirim BAST untuk Approval
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HELPERS ───────────────────────────────────────────── */
function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: C.textMuted, display: "block", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  background: C.bg, border: `1px solid ${C.border}`,
  color: C.text, fontSize: 13, outline: "none",
  boxSizing: "border-box",
};
