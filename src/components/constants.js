"use client";

export const C = {
  bg: "#0F1923",
  card: "#162030",
  card2: "#1C2B3A",
  border: "#243447",
  primary: "#00C896",
  primaryDim: "#00C89622",
  primaryHover: "#00A87E",
  accent: "#F5A623",
  accentDim: "#F5A62322",
  blue: "#3B9EFF",
  blueDim: "#3B9EFF22",
  red: "#FF5C5C",
  redDim: "#FF5C5C22",
  purple: "#A78BFA",
  purpleDim: "#A78BFA22",
  text: "#E8F0F8",
  textMuted: "#7A92A8",
  textDim: "#4A6278",
};

export const ROLES = [
  { id: "admin",    label: "Admin / Operator",  icon: "🛡️", color: C.blue },
  { id: "pj",       label: "PJ Ruangan",        icon: "🏢", color: C.primary },
  { id: "peminjam", label: "Peminjam Aset",      icon: "📦", color: C.accent },
  { id: "pimpinan", label: "Pimpinan Unit",      icon: "👔", color: C.purple },
];

export const ASSETS = [
  { id:"BMN-001", name:"Laptop Dell Inspiron 15",   kat:"Peralatan TI",      ruang:"Lab Komputer 1",  kondisi:"Baik",         status:"Tersedia",   nilai:"12.500.000", nup:"001/2022" },
  { id:"BMN-002", name:"Proyektor Epson EB-X51",    kat:"Alat Presentasi",   ruang:"Ruang Rapat A",   kondisi:"Baik",         status:"Dipinjam",   nilai:"8.750.000",  nup:"002/2022" },
  { id:"BMN-003", name:"Meja Kerja Kayu Jati",      kat:"Furnitur",          ruang:"Ruang Dekan",     kondisi:"Baik",         status:"Tersedia",   nilai:"3.200.000",  nup:"003/2021" },
  { id:"BMN-004", name:"AC Split Daikin 1.5 PK",    kat:"Peralatan Gedung",  ruang:"Lab Tari",        kondisi:"Rusak Ringan", status:"Tersedia",   nilai:"5.400.000",  nup:"004/2021" },
  { id:"BMN-005", name:"Kamera Canon EOS 800D",     kat:"Peralatan Seni",    ruang:"Studio Foto",     kondisi:"Baik",         status:"Dipinjam",   nilai:"9.800.000",  nup:"005/2023" },
  { id:"BMN-006", name:"Piano Yamaha P-125",        kat:"Alat Musik",        ruang:"Ruang Musik",     kondisi:"Baik",         status:"Tersedia",   nilai:"18.500.000", nup:"006/2023" },
  { id:"BMN-007", name:"Printer HP LaserJet Pro",   kat:"Peralatan TI",      ruang:"Tata Usaha",      kondisi:"Rusak Berat",  status:"Tidak Aktif",nilai:"4.200.000",  nup:"007/2020" },
  { id:"BMN-008", name:"Kursi Kuliah Chitose",      kat:"Furnitur",          ruang:"Aula Utama",      kondisi:"Baik",         status:"Tersedia",   nilai:"650.000",    nup:"008/2021" },
];

export const PEMINJAMAN = [
  { id:"PJM-001", aset:"Proyektor Epson EB-X51",  peminjam:"Dr. Rasyid, M.Sn",   tgl:"20 Apr 2026", kembali:"23 Apr 2026", status:"Disetujui", tujuan:"Kuliah Tamu Seni Rupa"    },
  { id:"PJM-002", aset:"Kamera Canon EOS 800D",   peminjam:"Mahasiswa Fotografi", tgl:"21 Apr 2026", kembali:"22 Apr 2026", status:"Menunggu",  tujuan:"Tugas Akhir Fotografi"    },
  { id:"PJM-003", aset:"Laptop Dell Inspiron",    peminjam:"Staff Keuangan",      tgl:"18 Apr 2026", kembali:"18 Apr 2026", status:"Selesai",   tujuan:"Presentasi Anggaran"      },
  { id:"PJM-004", aset:"Mikrofon Shure SM58",     peminjam:"UKM Paduan Suara",    tgl:"22 Apr 2026", kembali:"24 Apr 2026", status:"Menunggu",  tujuan:"Latihan Pementasan"       },
];

export const MENU_ITEMS = {
  admin: [
    { id:"dashboard",  icon:"🏠", label:"Dashboard"       },
    { id:"aset",       icon:"📦", label:"Data Aset BMN"   },
    { id:"import",     icon:"🔄", label:"Import SIMAN v2" },
    { id:"peminjaman", icon:"🤝", label:"Peminjaman"      },
    { id:"laporan",    icon:"📊", label:"Laporan"         },
    { id:"pengguna",   icon:"👥", label:"Pengguna"        },
  ],
  pj: [
    { id:"dashboard",  icon:"🏠", label:"Dashboard"          },
    { id:"aset",       icon:"📦", label:"Aset Ruangan Saya"  },
    { id:"peminjaman", icon:"🤝", label:"Peminjaman"         },
    { id:"laporan",    icon:"📊", label:"Laporan KIR"        },
  ],
  peminjam: [
    { id:"dashboard",   icon:"🏠", label:"Dashboard"      },
    { id:"pinjam_baru", icon:"➕", label:"Pinjam Aset"    },
    { id:"peminjaman",  icon:"📋", label:"Riwayat Pinjam" },
  ],
  pimpinan: [
    { id:"dashboard",  icon:"🏠", label:"Dashboard Eksekutif" },
    { id:"aset",       icon:"📦", label:"Ringkasan Aset"      },
    { id:"laporan",    icon:"📊", label:"Laporan & Analitik"  },
    { id:"pengadaan",  icon:"🛒", label:"Pengadaan"           },
  ],
};

export const btnStyle = (color, primary = false) => ({
  padding: primary ? "10px 20px" : "7px 14px",
  borderRadius: 8,
  background: primary ? color : color + "22",
  border: `1px solid ${color}44`,
  color: primary ? "white" : color,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  transition: "all 0.2s",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
});
