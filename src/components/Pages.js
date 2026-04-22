"use client";
import { useState } from "react";
import { C, ASSETS, PEMINJAMAN, ROLES, btnStyle } from "./constants";

/* ─── DASHBOARD ─────────────────────────────────────────── */
export function DashboardPage({ role, setPage }) {
  const stats = {
    admin: [
      { label:"Total Aset BMN",    val:"1.247",   icon:"📦", color:C.blue,   sub:"+12 bulan ini"      },
      { label:"Nilai Aset",        val:"Rp 4,8 M", icon:"💰", color:C.primary,sub:"Nilai perolehan"   },
      { label:"Dipinjam",          val:"23",        icon:"🤝", color:C.accent, sub:"Aktif saat ini"    },
      { label:"Perlu Perawatan",   val:"47",        icon:"🔧", color:C.red,    sub:"Rusak ringan/berat"},
    ],
    pj: [
      { label:"Aset Ruangan Saya", val:"34",  icon:"📦", color:C.blue,   sub:"Lab Komputer 1"     },
      { label:"Kondisi Baik",      val:"28",  icon:"✅", color:C.primary,sub:"82% dari total"     },
      { label:"Sedang Dipinjam",   val:"4",   icon:"🤝", color:C.accent, sub:"Perlu dikembalikan" },
      { label:"Perlu Perawatan",   val:"2",   icon:"🔧", color:C.red,    sub:"Segera ditangani"   },
    ],
    peminjam: [
      { label:"Pinjaman Aktif",      val:"2", icon:"📋", color:C.blue,   sub:"Sedang berlangsung" },
      { label:"Total Dipinjam",      val:"8", icon:"📦", color:C.primary,sub:"Riwayat semua"      },
      { label:"Menunggu Approval",   val:"1", icon:"⏳", color:C.accent, sub:"Segera diproses"    },
      { label:"Jatuh Tempo",         val:"1", icon:"⚠️", color:C.red,    sub:"Besok harus kembali"},
    ],
    pimpinan: [
      { label:"Total Aset",        val:"1.247",    icon:"🏛️", color:C.blue,   sub:"Seluruh unit"       },
      { label:"Nilai BMN",         val:"Rp 4,8 M", icon:"💰", color:C.primary,sub:"Nilai buku"         },
      { label:"Utilisasi Aset",    val:"78%",       icon:"📈", color:C.accent, sub:"Digunakan aktif"    },
      { label:"Usulan Pengadaan",  val:"5",          icon:"🛒", color:C.purple, sub:"Menunggu approval" },
    ],
  };

  const currentStats = stats[role] || stats.admin;

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin:0, fontSize:20, fontWeight:800 }}>Selamat datang 👋</h2>
        <p style={{ margin:"4px 0 0", color:C.textMuted, fontSize:14 }}>
          Rabu, 22 April 2026 · Berikut ringkasan terkini
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:24 }}>
        {currentStats.map((s,i) => (
          <div key={i} style={{
            background:C.card, borderRadius:14, border:`1px solid ${C.border}`,
            padding:"18px 20px", borderTop:`3px solid ${s.color}`,
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:11, color:C.textMuted, marginBottom:6 }}>{s.label}</div>
                <div style={{ fontSize:24, fontWeight:900, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:11, color:C.textDim, marginTop:4 }}>{s.sub}</div>
              </div>
              <div style={{ fontSize:24, background:s.color+"22", borderRadius:10, padding:8 }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
        <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>📊 Kondisi Aset</div>
          {[
            { label:"Baik",         pct:71, color:C.primary },
            { label:"Rusak Ringan", pct:18, color:C.accent  },
            { label:"Rusak Berat",  pct:7,  color:C.red     },
            { label:"Tidak Aktif",  pct:4,  color:C.textDim },
          ].map((b,i) => (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:12 }}>
                <span style={{ color:C.textMuted }}>{b.label}</span>
                <span style={{ color:b.color, fontWeight:700 }}>{b.pct}%</span>
              </div>
              <div style={{ background:C.card2, borderRadius:4, height:6 }}>
                <div style={{ background:b.color, width:`${b.pct}%`, height:6, borderRadius:4 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>🗂️ Kategori Aset</div>
          {[
            { label:"Furnitur & Mebel",  val:342, color:C.blue    },
            { label:"Peralatan TI",       val:287, color:C.primary },
            { label:"Alat Seni & Musik",  val:198, color:C.accent  },
            { label:"Peralatan Gedung",   val:156, color:C.purple  },
            { label:"Kendaraan",          val:12,  color:C.red     },
          ].map((k,i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"7px 10px", borderRadius:8, marginBottom:4, background:k.color+"11",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:13 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:k.color }} />
                <span style={{ color:C.textMuted }}>{k.label}</span>
              </div>
              <span style={{ fontWeight:700, color:k.color, fontSize:13 }}>{k.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700 }}>🕐 Aktivitas Terbaru</div>
          <button onClick={() => setPage("peminjaman")} style={{
            background:C.primaryDim, border:`1px solid ${C.primary}44`,
            color:C.primary, borderRadius:8, padding:"5px 12px", fontSize:12, cursor:"pointer",
          }}>Lihat Semua</button>
        </div>
        {[
          { time:"10:24", act:"Proyektor Epson dipinjam oleh Dr. Rasyid untuk Kuliah Tamu", icon:"🤝", color:C.accent  },
          { time:"09:15", act:"Import data SIMAN v2 berhasil — 1.247 aset tersinkronisasi",  icon:"🔄", color:C.primary },
          { time:"08:50", act:"Laporan KIR Lab Komputer 1 dicetak oleh PJ Ruangan",           icon:"📋", color:C.blue    },
          { time:"Kemarin",act:"Kamera Canon dikembalikan dalam kondisi baik",                icon:"✅", color:C.primary },
        ].map((a,i) => (
          <div key={i} style={{
            display:"flex", gap:12, alignItems:"flex-start",
            padding:"10px 0", borderBottom: i<3 ? `1px solid ${C.border}` : "none",
          }}>
            <div style={{
              background:a.color+"22", borderRadius:8,
              width:32, height:32, display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:14, flexShrink:0,
            }}>{a.icon}</div>
            <div>
              <div style={{ fontSize:13 }}>{a.act}</div>
              <div style={{ fontSize:11, color:C.textDim, marginTop:2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ASET ──────────────────────────────────────────────── */
export function AsetPage({ role, searchQ, showNotif }) {
  const [filter, setFilter] = useState("Semua");
  const filtered = ASSETS.filter(a =>
    (filter === "Semua" || a.kondisi === filter || a.status === filter) &&
    (a.name.toLowerCase().includes((searchQ||"").toLowerCase()) || a.id.includes(searchQ||""))
  );

  const kondisiColor = k => k==="Baik" ? C.primary : k==="Rusak Ringan" ? C.accent : C.red;
  const statusColor  = s => s==="Tersedia" ? C.primary : s==="Dipinjam" ? C.accent : C.red;

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>Data Aset BMN</h2>
          <p style={{ margin:"4px 0 0", color:C.textMuted, fontSize:13 }}>{filtered.length} aset · Sumber: SIMAN v2</p>
        </div>
        {role === "admin" && (
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => showNotif("QR Code dicetak!")} style={btnStyle(C.blue)}>🏷️ Cetak QR</button>
            <button onClick={() => showNotif("Export berhasil!")} style={btnStyle(C.primary)}>📥 Export Excel</button>
          </div>
        )}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {["Semua","Baik","Rusak Ringan","Rusak Berat","Tersedia","Dipinjam"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"5px 14px", borderRadius:20, fontSize:12,
            background: filter===f ? C.primary : C.card2,
            border:`1px solid ${filter===f ? C.primary : C.border}`,
            color: filter===f ? "white" : C.textMuted,
            cursor:"pointer", transition:"all 0.15s",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:C.card2 }}>
              {["Kode / NUP","Nama Aset","Kategori","Ruangan","Kondisi","Status","Nilai"].map(h => (
                <th key={h} style={{ padding:"12px 14px", textAlign:"left", color:C.textMuted, fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a,i) => (
              <tr key={a.id} style={{ borderTop:`1px solid ${C.border}`, cursor:"default" }}
                onMouseEnter={e => e.currentTarget.style.background=C.card2}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ color:C.blue, fontWeight:600 }}>{a.id}</div>
                  <div style={{ color:C.textDim, fontSize:11 }}>{a.nup}</div>
                </td>
                <td style={{ padding:"12px 14px", fontWeight:500 }}>{a.name}</td>
                <td style={{ padding:"12px 14px", color:C.textMuted }}>{a.kat}</td>
                <td style={{ padding:"12px 14px", color:C.textMuted }}>{a.ruang}</td>
                <td style={{ padding:"12px 14px" }}>
                  <Chip label={a.kondisi} color={kondisiColor(a.kondisi)} />
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <Chip label={a.status}  color={statusColor(a.status)}  />
                </td>
                <td style={{ padding:"12px 14px", fontWeight:600 }}>Rp {a.nilai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── IMPORT SIMAN ──────────────────────────────────────── */
export function ImportPage({ showNotif }) {
  const [step, setStep]         = useState(0);
  const [progress, setProgress] = useState(0);

  const startImport = () => {
    setStep(1);
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) { p = 100; clearInterval(t); setStep(2); }
      setProgress(Math.min(p, 100));
    }, 200);
  };

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <h2 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800 }}>Import Data SIMAN v2</h2>
      <p style={{ margin:"0 0 28px", color:C.textMuted, fontSize:13 }}>
        Sinkronisasi data BMN dari file Excel export SIMAN v2
      </p>

      {/* Step indicator */}
      <div style={{ display:"flex", alignItems:"center", marginBottom:32 }}>
        {["Export dari SIMAN","Upload File","Validasi Data","Simpan"].map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
            <div style={{ textAlign:"center", flex:1 }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", margin:"0 auto 6px",
                background: i<=step ? C.primary : C.card2,
                border:`2px solid ${i<=step ? C.primary : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, fontWeight:700, color: i<=step ? "white" : C.textDim,
              }}>{i<step ? "✓" : i+1}</div>
              <div style={{ fontSize:11, color: i<=step ? C.primary : C.textDim, whiteSpace:"nowrap" }}>{s}</div>
            </div>
            {i<3 && <div style={{ height:2, flex:"0 0 20px", background: i<step ? C.primary : C.border }} />}
          </div>
        ))}
      </div>

      {step===0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>📋 Panduan Export SIMAN v2</div>
            {["Buka aplikasi SIMAN v2","Login sebagai operator satker","Menu: Laporan → Export Data Aset","Pilih format: Excel (.xlsx)","Simpan file ke komputer","Kembali ke sini dan upload"].map((s,i) => (
              <div key={i} style={{ display:"flex", gap:10, padding:"7px 0", fontSize:13, color:C.textMuted, borderBottom: i<5 ? `1px dashed ${C.border}` : "none" }}>
                <span style={{
                  background:C.primary, color:"white", borderRadius:"50%",
                  width:20, height:20, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0,
                }}>{i+1}</span>
                {s}
              </div>
            ))}
          </div>
          <div style={{
            background:C.card, borderRadius:14,
            border:`2px dashed ${C.border}`, padding:24,
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center",
          }}>
            <div style={{ fontSize:48, marginBottom:12 }}>📁</div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:6 }}>Upload File Excel SIMAN v2</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:20 }}>Format: .xlsx / .csv · Maks. 10MB</div>
            <button onClick={startImport} style={btnStyle(C.primary, true)}>📤 Pilih & Upload File</button>
            <div style={{ fontSize:11, color:C.textDim, marginTop:12 }}>Atau drag & drop file di sini</div>
          </div>
        </div>
      )}

      {step===1 && (
        <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:40, textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>⚙️</div>
          <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>Memproses Data SIMAN v2...</div>
          <div style={{ fontSize:13, color:C.textMuted, marginBottom:24 }}>Validasi & mapping kolom data BMN</div>
          <div style={{ background:C.card2, borderRadius:8, height:10, maxWidth:400, margin:"0 auto 10px" }}>
            <div style={{ background:`linear-gradient(90deg,${C.primary},${C.blue})`, width:`${progress}%`, height:10, borderRadius:8, transition:"width 0.2s" }} />
          </div>
          <div style={{ fontSize:14, color:C.primary, fontWeight:700 }}>{Math.round(progress)}%</div>
        </div>
      )}

      {step===2 && (
        <div>
          <div style={{ background:C.primaryDim, border:`1px solid ${C.primary}44`, borderRadius:12, padding:"14px 20px", marginBottom:16, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:22 }}>✅</span>
            <div>
              <div style={{ fontWeight:700, color:C.primary }}>Validasi berhasil! Siap untuk disimpan.</div>
              <div style={{ fontSize:13, color:C.textMuted }}>1.247 data valid · 3 perlu review · 0 error kritis</div>
            </div>
          </div>
          <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20, marginBottom:16 }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>📊 Ringkasan Import</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
              {[["Total Baris","1.250",C.blue],["Data Valid","1.247",C.primary],["Perlu Review","3",C.accent],["Duplikat","0",C.red]].map(([l,v,c],i) => (
                <div key={i} style={{ textAlign:"center", padding:12, background:c+"11", borderRadius:10 }}>
                  <div style={{ fontSize:22, fontWeight:900, color:c }}>{v}</div>
                  <div style={{ fontSize:12, color:C.textMuted }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={() => { setStep(0); setProgress(0); }} style={btnStyle(C.textDim)}>🔄 Upload Ulang</button>
            <button onClick={() => { showNotif("1.247 data aset berhasil disimpan!"); setStep(0); setProgress(0); }} style={btnStyle(C.primary,true)}>
              💾 Simpan ke Database
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── PEMINJAMAN ─────────────────────────────────────────── */
export function PeminjamanPage({ role, showNotif }) {
  const [list, setList] = useState(PEMINJAMAN);
  const approve = (id) => { setList(l => l.map(p => p.id===id ? {...p,status:"Disetujui"} : p)); showNotif("Peminjaman disetujui!"); };
  const reject  = (id) => { setList(l => l.map(p => p.id===id ? {...p,status:"Ditolak"}  : p)); showNotif("Peminjaman ditolak.","error"); };
  const selesai = (id) => { setList(l => l.map(p => p.id===id ? {...p,status:"Selesai"}  : p)); showNotif("Aset ditandai kembali!"); };

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <h2 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800 }}>Manajemen Peminjaman Aset</h2>
      <p style={{ margin:"0 0 20px", color:C.textMuted, fontSize:13 }}>Daftar permohonan dan status peminjaman</p>
      <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:C.card2 }}>
              {["ID","Nama Aset","Peminjam","Tgl Pinjam","Tgl Kembali","Tujuan","Status","Aksi"].map(h => (
                <th key={h} style={{ padding:"12px 14px", textAlign:"left", color:C.textMuted, fontWeight:600, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p,i) => (
              <tr key={p.id} style={{ borderTop:`1px solid ${C.border}` }}
                onMouseEnter={e => e.currentTarget.style.background=C.card2}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}
              >
                <td style={{ padding:"12px 14px", color:C.blue, fontWeight:600 }}>{p.id}</td>
                <td style={{ padding:"12px 14px", fontWeight:500 }}>{p.aset}</td>
                <td style={{ padding:"12px 14px", color:C.textMuted }}>{p.peminjam}</td>
                <td style={{ padding:"12px 14px", color:C.textMuted }}>{p.tgl}</td>
                <td style={{ padding:"12px 14px", color:C.textMuted }}>{p.kembali}</td>
                <td style={{ padding:"12px 14px", color:C.textMuted, maxWidth:140 }}>{p.tujuan}</td>
                <td style={{ padding:"12px 14px" }}>
                  <Chip label={p.status} color={
                    p.status==="Disetujui" ? C.primary :
                    p.status==="Menunggu"  ? C.accent  :
                    p.status==="Ditolak"   ? C.red     : C.blue
                  } />
                </td>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {p.status==="Menunggu" && (role==="admin"||role==="pj") && <>
                      <MiniBtn label="✅ Setuju" color={C.primary} onClick={() => approve(p.id)} />
                      <MiniBtn label="❌ Tolak"  color={C.red}     onClick={() => reject(p.id)}  />
                    </>}
                    {p.status==="Disetujui" && (role==="admin"||role==="pj") &&
                      <MiniBtn label="↩ Kembali" color={C.blue} onClick={() => selesai(p.id)} />
                    }
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── PINJAM BARU ───────────────────────────────────────── */
export function PinjamBaruPage({ showNotif, setPage }) {
  const [form, setForm] = useState({ aset:"", tujuan:"", tgl_pinjam:"", tgl_kembali:"", ket:"" });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const submit = () => {
    if (!form.aset||!form.tujuan) { showNotif("Lengkapi form dulu!","error"); return; }
    showNotif("Permohonan terkirim! Menunggu approval.");
    setPage("peminjaman");
  };

  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <h2 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800 }}>Form Peminjaman Aset</h2>
      <p style={{ margin:"0 0 24px", color:C.textMuted, fontSize:13 }}>Ajukan permohonan peminjaman aset kampus</p>
      <div style={{ maxWidth:560 }}>
        <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:24 }}>
          {[
            { label:"Aset yang Dipinjam *",    key:"aset",       type:"text", ph:"Cari nama aset..." },
            { label:"Tujuan Peminjaman *",      key:"tujuan",     type:"text", ph:"Contoh: Kuliah Tamu, Praktikum..." },
            { label:"Tanggal Pinjam",           key:"tgl_pinjam", type:"date", ph:"" },
            { label:"Tanggal Kembali",          key:"tgl_kembali",type:"date", ph:"" },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, color:C.textMuted, display:"block", marginBottom:6 }}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={form[f.key]}
                onChange={e => set(f.key, e.target.value)}
                style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:C.card2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }}
              />
            </div>
          ))}
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:13, color:C.textMuted, display:"block", marginBottom:6 }}>Keterangan Tambahan</label>
            <textarea rows={3} placeholder="Informasi tambahan (opsional)..." value={form.ket}
              onChange={e => set("ket", e.target.value)}
              style={{ width:"100%", padding:"10px 14px", borderRadius:8, background:C.card2, border:`1px solid ${C.border}`, color:C.text, fontSize:13, outline:"none", resize:"vertical", boxSizing:"border-box" }}
            />
          </div>
          <button onClick={submit} style={{ ...btnStyle(C.primary,true), width:"100%", justifyContent:"center" }}>
            📤 Kirim Permohonan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── LAPORAN ───────────────────────────────────────────── */
export function LaporanPage({ showNotif }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <h2 style={{ margin:"0 0 6px", fontSize:18, fontWeight:800 }}>Laporan & Analitik</h2>
      <p style={{ margin:"0 0 24px", color:C.textMuted, fontSize:13 }}>Unduh dan cetak laporan aset</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
        {[
          { icon:"📋", title:"KIR Digital",          desc:"Kartu Inventaris Ruangan per lokasi",    color:C.blue,   btn:"Cetak KIR"      },
          { icon:"📊", title:"Rekap Inventaris",      desc:"Total aset per kategori & kondisi",      color:C.primary,btn:"Download Excel"  },
          { icon:"💰", title:"Laporan Nilai BMN",     desc:"Nilai perolehan & penyusutan aset",      color:C.accent, btn:"Lihat Laporan"  },
          { icon:"🔧", title:"Aset Perlu Perawatan",  desc:"Daftar aset rusak ringan & berat",       color:C.red,    btn:"Lihat Daftar"   },
          { icon:"📅", title:"Riwayat Peminjaman",    desc:"Histori peminjaman per periode",         color:C.purple, btn:"Export PDF"     },
          { icon:"🛒", title:"RKBMN / Pengadaan",     desc:"Rencana kebutuhan BMN tahunan",          color:C.blue,   btn:"Buat RKBMN"    },
        ].map((r,i) => (
          <div key={i} style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, padding:20 }}>
            <div style={{ fontSize:28, marginBottom:10 }}>{r.icon}</div>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{r.title}</div>
            <div style={{ fontSize:12, color:C.textMuted, marginBottom:16 }}>{r.desc}</div>
            <button onClick={() => showNotif(`${r.title} berhasil diproses!`)} style={btnStyle(r.color)}>{r.btn}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PENGGUNA ──────────────────────────────────────────── */
export function PenggunaPage({ showNotif }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>Manajemen Pengguna</h2>
        <button onClick={() => showNotif("Form tambah pengguna dibuka!")} style={btnStyle(C.primary,true)}>➕ Tambah User</button>
      </div>
      <div style={{ background:C.card, borderRadius:14, border:`1px solid ${C.border}`, overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ background:C.card2 }}>
              {["Nama","Email","Role","Unit","Status","Aksi"].map(h => (
                <th key={h} style={{ padding:"12px 14px", textAlign:"left", color:C.textMuted, fontWeight:600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Ahmad Fauzi, S.Sos","ahmad@isbiaceh.ac.id",  "Admin",    "Bagian Umum",       true ],
              ["Dr. Rasyid, M.Sn",  "rasyid@isbiaceh.ac.id","PJ Ruangan","Fak. Seni Rupa",   true ],
              ["Siti Rahayu",       "siti@isbiaceh.ac.id",  "Peminjam", "Mahasiswa",          true ],
              ["Rektor ISBI Aceh",  "rektor@isbiaceh.ac.id","Pimpinan", "Rektorat",           true ],
              ["Budi Santoso",      "budi@isbiaceh.ac.id",  "PJ Ruangan","Lab Komputer",      false],
            ].map(([name,email,role,unit,aktif],i) => {
              const r = ROLES.find(x => x.label.toLowerCase().includes(role.split(" ")[0].toLowerCase()));
              return (
                <tr key={i} style={{ borderTop:`1px solid ${C.border}` }}
                  onMouseEnter={e => e.currentTarget.style.background=C.card2}
                  onMouseLeave={e => e.currentTarget.style.background="transparent"}
                >
                  <td style={{ padding:"12px 14px", fontWeight:500 }}>{name}</td>
                  <td style={{ padding:"12px 14px", color:C.textMuted }}>{email}</td>
                  <td style={{ padding:"12px 14px" }}><Chip label={role} color={r?.color||C.blue} /></td>
                  <td style={{ padding:"12px 14px", color:C.textMuted }}>{unit}</td>
                  <td style={{ padding:"12px 14px" }}><Chip label={aktif?"Aktif":"Nonaktif"} color={aktif?C.primary:C.red} /></td>
                  <td style={{ padding:"12px 14px" }}>
                    <MiniBtn label="✏️ Edit" color={C.blue} onClick={() => showNotif(`Edit user ${name}`)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── PENGADAAN ─────────────────────────────────────────── */
export function PengadaanPage({ showNotif }) {
  return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div>
          <h2 style={{ margin:0, fontSize:18, fontWeight:800 }}>Rencana Pengadaan (RKBMN)</h2>
          <p style={{ margin:"4px 0 0", color:C.textMuted, fontSize:13 }}>Usulan kebutuhan barang tahun 2026</p>
        </div>
        <button onClick={() => showNotif("Form usulan pengadaan dibuka!")} style={btnStyle(C.primary,true)}>➕ Ajukan Usulan</button>
      </div>
      {[
        { nama:"Laptop untuk Lab Komputer",   qty:10, est:"Rp 85.000.000",  prio:"Tinggi", status:"Review"    },
        { nama:"Kamera Mirrorless Sony A7",    qty:3,  est:"Rp 60.000.000",  prio:"Sedang", status:"Diajukan"  },
        { nama:"Proyektor 4K untuk Aula",      qty:2,  est:"Rp 40.000.000",  prio:"Tinggi", status:"Disetujui" },
        { nama:"Alat Musik Gamelan Set",       qty:1,  est:"Rp 120.000.000", prio:"Sedang", status:"Review"    },
        { nama:"AC untuk Ruang Kelas",         qty:8,  est:"Rp 48.000.000",  prio:"Rendah", status:"Diajukan"  },
      ].map((p,i) => (
        <div key={i} style={{
          background:C.card, borderRadius:12, border:`1px solid ${C.border}`,
          padding:"16px 20px", marginBottom:10,
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, flexWrap:"wrap",
        }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{p.nama}</div>
            <div style={{ fontSize:12, color:C.textMuted }}>Qty: {p.qty} unit · Estimasi: {p.est}</div>
          </div>
          <Chip label={p.prio}   color={p.prio==="Tinggi"?C.red:p.prio==="Sedang"?C.accent:C.blue} />
          <Chip label={p.status} color={p.status==="Disetujui"?C.primary:p.status==="Review"?C.accent:C.blue} />
          {p.status==="Review" && <MiniBtn label="✅ Setujui" color={C.primary} onClick={() => showNotif(`${p.nama} disetujui!`)} />}
        </div>
      ))}
    </div>
  );
}

/* ─── SHARED COMPONENTS ─────────────────────────────────── */
function Chip({ label, color }) {
  return (
    <span style={{
      padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:600,
      background:color+"22", color,
    }}>{label}</span>
  );
}

function MiniBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600,
      background:color+"22", border:`1px solid ${color}44`, color,
      cursor:"pointer",
    }}>{label}</button>
  );
}
