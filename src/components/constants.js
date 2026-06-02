"use client";

export const C = {
  bg: "#F4F7FB",
  shell: "#E8EEF6",
  sidebar: "#111827",
  sidebar2: "#1B2432",
  card: "#FFFFFF",
  card2: "#F8FAFC",
  border: "#DDE6F0",
  primary: "#0F9F6E",
  primaryDim: "#E7F7F0",
  primaryHover: "#087F5B",
  accent: "#D97706",
  accentDim: "#FFF4E5",
  blue: "#2563EB",
  blueDim: "#EAF1FF",
  red: "#DC2626",
  redDim: "#FDECEC",
  purple: "#7C3AED",
  purpleDim: "#F1EAFE",
  text: "#162033",
  textMuted: "#64748B",
  textDim: "#94A3B8",
  inverseText: "#F8FAFC",
  shadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
};

export const ROLES = [
  { id: "admin", label: "Admin / Operator", icon: "AD", color: C.blue },
  { id: "pj", label: "PJ Ruangan", icon: "PJ", color: C.primary },
  { id: "peminjam", label: "Peminjam Aset", icon: "PM", color: C.accent },
  { id: "pimpinan", label: "Pimpinan Unit", icon: "PI", color: C.purple },
];

export const ASSETS = [
  { id: "BMN-001", name: "Laptop Dell Inspiron 15", kat: "Peralatan TI", ruang: "Lab Komputer 1", kondisi: "Baik", status: "Tersedia", nilai: "12.500.000", nup: "001/2022" },
  { id: "BMN-002", name: "Proyektor Epson EB-X51", kat: "Alat Presentasi", ruang: "Ruang Rapat A", kondisi: "Baik", status: "Dipinjam", nilai: "8.750.000", nup: "002/2022" },
  { id: "BMN-003", name: "Meja Kerja Kayu Jati", kat: "Furnitur", ruang: "Ruang Dekan", kondisi: "Baik", status: "Tersedia", nilai: "3.200.000", nup: "003/2021" },
  { id: "BMN-004", name: "AC Split Daikin 1.5 PK", kat: "Peralatan Gedung", ruang: "Lab Tari", kondisi: "Rusak Ringan", status: "Tersedia", nilai: "5.400.000", nup: "004/2021" },
  { id: "BMN-005", name: "Kamera Canon EOS 800D", kat: "Peralatan Seni", ruang: "Studio Foto", kondisi: "Baik", status: "Dipinjam", nilai: "9.800.000", nup: "005/2023" },
  { id: "BMN-006", name: "Piano Yamaha P-125", kat: "Alat Musik", ruang: "Ruang Musik", kondisi: "Baik", status: "Tersedia", nilai: "18.500.000", nup: "006/2023" },
  { id: "BMN-007", name: "Printer HP LaserJet Pro", kat: "Peralatan TI", ruang: "Tata Usaha", kondisi: "Rusak Berat", status: "Tidak Aktif", nilai: "4.200.000", nup: "007/2020" },
  { id: "BMN-008", name: "Kursi Kuliah Chitose", kat: "Furnitur", ruang: "Aula Utama", kondisi: "Baik", status: "Tersedia", nilai: "650.000", nup: "008/2021" },
];

export const PEMINJAMAN = [
  { id: "PJM-001", aset: "Proyektor Epson EB-X51", peminjam: "Dr. Rasyid, M.Sn", tgl: "20 Apr 2026", kembali: "23 Apr 2026", status: "Disetujui", tujuan: "Kuliah Tamu Seni Rupa" },
  { id: "PJM-002", aset: "Kamera Canon EOS 800D", peminjam: "Mahasiswa Fotografi", tgl: "21 Apr 2026", kembali: "22 Apr 2026", status: "Menunggu", tujuan: "Tugas Akhir Fotografi" },
  { id: "PJM-003", aset: "Laptop Dell Inspiron", peminjam: "Staff Keuangan", tgl: "18 Apr 2026", kembali: "18 Apr 2026", status: "Selesai", tujuan: "Presentasi Anggaran" },
  { id: "PJM-004", aset: "Mikrofon Shure SM58", peminjam: "UKM Paduan Suara", tgl: "22 Apr 2026", kembali: "24 Apr 2026", status: "Menunggu", tujuan: "Latihan Pementasan" },
];

export const KATEGORI_BAST = [
  "Peralatan TI",
  "Peralatan Seni",
  "Alat Musik",
  "Kendaraan Dinas",
  "Peralatan Kantor Personal",
];

export const DATA_BAST = [
  {
    id: "BAST-001",
    no_bast: "01/BAST-BMN/ISBI/2024",
    aset_id: "BMN-001",
    aset_nama: "Laptop Dell Inspiron 15",
    penerima: "Bahrun Nasar, S.Sos",
    nip: "198801012015041001",
    jabatan: "Pengelola BMN",
    unit: "Bagian Umum",
    tgl_serah: "15 Jan 2024",
    kondisi: "Baik",
    status: "Aktif",
    approved_by: "Rektor ISBI Aceh",
    tgl_approve: "16 Jan 2024",
    keterangan: "Untuk keperluan pengelolaan BMN kampus",
  },
  {
    id: "BAST-002",
    no_bast: "02/BAST-BMN/ISBI/2024",
    aset_id: "BMN-005",
    aset_nama: "Kamera Canon EOS 800D",
    penerima: "Dr. Rasyid, M.Sn",
    nip: "197503122005011002",
    jabatan: "Dosen Seni Rupa",
    unit: "Fakultas Seni Rupa",
    tgl_serah: "20 Feb 2024",
    kondisi: "Baik",
    status: "Menunggu Approval",
    approved_by: "-",
    tgl_approve: "-",
    keterangan: "Untuk dokumentasi kegiatan akademik",
  },
  {
    id: "BAST-003",
    no_bast: "03/BAST-BMN/ISBI/2024",
    aset_id: "BMN-006",
    aset_nama: "Piano Yamaha P-125",
    penerima: "Sari Indah, M.Mus",
    nip: "198205252010122003",
    jabatan: "Dosen Musik",
    unit: "Fakultas Seni Musik",
    tgl_serah: "01 Mar 2024",
    kondisi: "Baik",
    status: "Dikembalikan",
    approved_by: "Rektor ISBI Aceh",
    tgl_approve: "02 Mar 2024",
    keterangan: "Dikembalikan karena mutasi jabatan",
  },
];

export const MENU_ITEMS = {
  admin: [
    { id: "dashboard", icon: "DB", label: "Dashboard" },
    { id: "organisasi", icon: "OR", label: "Master Organisasi" },
    { id: "ruangan", icon: "RG", label: "Master Ruangan" },
    { id: "aset", icon: "AS", label: "Data Aset BMN" },
    { id: "kendaraan", icon: "KD", label: "Kendaraan BMN" },
    { id: "bast", icon: "BA", label: "BAST Aset" },
    { id: "import", icon: "IM", label: "Import SIMAN v2" },
    { id: "peminjaman", icon: "PJ", label: "Peminjaman" },
    { id: "laporan", icon: "LP", label: "Laporan" },
    { id: "pengguna", icon: "PG", label: "Pengguna" },
  ],
  pj: [
    { id: "dashboard", icon: "DB", label: "Dashboard" },
    { id: "aset", icon: "AS", label: "Aset Ruangan Saya" },
    { id: "peminjaman", icon: "PJ", label: "Peminjaman" },
    { id: "laporan", icon: "LP", label: "Laporan KIR" },
  ],
  peminjam: [
    { id: "dashboard", icon: "DB", label: "Dashboard" },
    { id: "pinjam_baru", icon: "PB", label: "Pinjam Aset" },
    { id: "peminjaman", icon: "RP", label: "Riwayat Pinjam" },
  ],
  pimpinan: [
    { id: "dashboard", icon: "DB", label: "Dashboard Eksekutif" },
    { id: "aset", icon: "AS", label: "Ringkasan Aset" },
    { id: "bast", icon: "BA", label: "Approval BAST" },
    { id: "laporan", icon: "LA", label: "Laporan & Analitik" },
    { id: "pengadaan", icon: "PN", label: "Pengadaan" },
  ],
};

export const btnStyle = (color, primary = false) => ({
  padding: primary ? "10px 20px" : "7px 14px",
  borderRadius: 8,
  background: primary ? color : `${color}14`,
  border: `1px solid ${primary ? color : `${color}2E`}`,
  color: primary ? "white" : color,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 700,
  transition: "all 0.2s",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  boxShadow: primary ? `0 10px 24px ${color}26` : "none",
});
