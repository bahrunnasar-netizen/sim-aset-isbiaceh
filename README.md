# 🏛️ SIMA – Sistem Informasi Manajemen Aset ISBI Aceh

Aplikasi pengelolaan aset BMN (Barang Milik Negara) berbasis web untuk Institut Seni Budaya Indonesia Aceh.

---

## 🚀 Cara Deploy ke Vercel (GRATIS, 15 Menit)

### Langkah 1 – Buat Akun GitHub (jika belum punya)
1. Buka https://github.com
2. Klik **Sign up** → isi email, password, username
3. Verifikasi email

### Langkah 2 – Upload Project ke GitHub
1. Login ke GitHub
2. Klik tombol **+** (pojok kanan atas) → **New repository**
3. Nama repository: `sima-isbi-aceh`
4. Pilih **Public**
5. Klik **Create repository**
6. Di halaman repository baru, klik **uploading an existing file**
7. Drag & drop semua file folder ini ke halaman tersebut
8. Klik **Commit changes**

### Langkah 3 – Deploy ke Vercel
1. Buka https://vercel.com
2. Klik **Sign Up** → pilih **Continue with GitHub**
3. Authorize Vercel untuk akses GitHub
4. Klik **Add New Project**
5. Pilih repository `sima-isbi-aceh` → klik **Import**
6. Biarkan semua setting default
7. Klik **Deploy** 🚀
8. Tunggu 2-3 menit...
9. ✅ SELESAI! URL aplikasi Anda: `https://sima-isbi-aceh.vercel.app`

---

## 👤 Role / Pengguna

| Role | Deskripsi |
|------|-----------|
| 🛡️ Admin/Operator | Kelola semua aset, import SIMAN, laporan |
| 🏢 PJ Ruangan | Monitor aset ruangan, approve peminjaman |
| 📦 Peminjam | Ajukan & tracking peminjaman aset |
| 👔 Pimpinan | Dashboard eksekutif & pengadaan |

---

## 📦 Fitur Utama

- ✅ Dashboard statistik per role
- ✅ Data aset BMN (terintegrasi SIMAN v2 via import Excel)
- ✅ Import data SIMAN v2 (Excel/CSV)
- ✅ Manajemen peminjaman aset (approve/tolak/selesai)
- ✅ Form permohonan peminjaman online
- ✅ Laporan & KIR Digital
- ✅ Manajemen pengguna
- ✅ Rencana pengadaan (RKBMN)

---

## 🛠️ Jalankan di Komputer Lokal

```bash
# Install Node.js dulu dari https://nodejs.org

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka browser: http://localhost:3000
```

---

## 📁 Struktur Project

```
sima-isbi-aceh/
├── src/
│   ├── app/
│   │   ├── layout.js      # Root layout
│   │   ├── page.js        # Halaman utama
│   │   └── globals.css    # CSS global
│   └── components/
│       ├── SimaApp.js     # Komponen utama
│       ├── LoginScreen.js # Halaman login
│       ├── Sidebar.js     # Menu sidebar
│       ├── Pages.js       # Semua halaman
│       └── constants.js   # Data & konfigurasi
├── package.json
├── next.config.mjs
└── jsconfig.json
```

---

## 📞 Kontak & Pengembangan

Dikembangkan secara mandiri untuk kebutuhan internal ISBI Aceh.  
Untuk pengembangan lebih lanjut (backend, database, auth nyata), hubungi tim IT kampus.

---

*SIMA ISBI Aceh v1.0 · 2026*
