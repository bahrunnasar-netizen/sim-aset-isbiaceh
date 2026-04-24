# Product Backlog

## SIASET ISBI Aceh

Versi: 1.0  
Tanggal: 24 April 2026  
Status: Draft Backlog Produk

---

## 1. Prinsip Prioritas

- `P1 / MVP`: wajib ada agar fondasi sistem berjalan.
- `P2 / Phase 2`: sangat penting setelah fondasi stabil.
- `P3 / Phase 3`: fitur penguatan, diferensiasi, dan integrasi lanjutan.

---

## 2. Backlog Fitur

| ID | Fitur | Deskripsi Singkat | Pengguna Utama | Prioritas | Dependensi |
|---|---|---|---|---|---|
| BL-001 | Rename SIMA menjadi SIASET | Penyesuaian nama sistem di UI, metadata, dokumen, dan branding | Semua pengguna | P1 | Tidak ada |
| BL-002 | Master Organisasi | Master jurusan, prodi, unit/UPA | Admin | P1 | Tidak ada |
| BL-003 | Master Lokasi | Master kampus, gedung, lantai, dan ruangan | Admin | P1 | BL-002 |
| BL-004 | Klasifikasi Ruangan | Shared, Dedicated, Mixed | Admin, Prodi, Pimpinan | P1 | BL-003 |
| BL-005 | Unit Penanggung Jawab Ruang | Menyimpan unit yang bertanggung jawab administratif atas ruang | Admin | P1 | BL-003 |
| BL-006 | PIC Penanggung Jawab Ruangan | Menyimpan penanggung jawab operasional per ruang | Admin | P1 | BL-003 |
| BL-007 | Master Aset | CRUD aset BMN/sarana/prasarana | Admin | P1 | BL-002, BL-003 |
| BL-008 | Aset Shared vs Dedicated | Penandaan aset shared atau dedicated per prodi/unit | Admin | P1 | BL-007 |
| BL-009 | Import SIMAN | Import aset dari Excel/CSV hasil SIMAN | Admin | P1 | BL-007 |
| BL-010 | QR Code per Aset | Generate QR berdasarkan identitas aset | Admin | P1 | BL-007 |
| BL-011 | Scanner QR / Barcode / NUP | Scan label SIMAN/QR/barcode dan tampilkan detail aset | Admin, PJ Ruang | P2 | BL-007, BL-010 |
| BL-012 | Upload Foto Aset | Upload maksimal 3 foto, kompres otomatis, simpan cloud | Admin | P2 | BL-007 |
| BL-013 | Dashboard Per Role | Dashboard admin, prodi, pimpinan, peminjam | Semua pengguna | P1 | BL-002, BL-007 |
| BL-014 | Manajemen Peminjaman | Pengajuan, approval, pengembalian, overdue | Admin, Peminjam | P1 | BL-007 |
| BL-015 | Approval Bertingkat | Persetujuan berjenjang untuk proses tertentu | Admin, Pimpinan | P2 | BL-014, BL-021 |
| BL-016 | BAST Aset | Serah terima aset, approval, cetak dokumen | Admin, Pimpinan | P1 | BL-007 |
| BL-017 | History Pemindahan Aset | Catatan perpindahan aset antar ruang/unit | Admin, PJ Ruang | P2 | BL-007, BL-003 |
| BL-018 | Jadwal Pemeliharaan | Penjadwalan pemeliharaan berkala aset | Admin | P2 | BL-007 |
| BL-019 | History Perbaikan | Catatan perbaikan dan tindakan teknis aset | Admin | P2 | BL-018 |
| BL-020 | Usulan Penghapusan Aset | Pengajuan penghapusan aset yang tidak layak | Admin, Pimpinan | P2 | BL-007 |
| BL-021 | Log Aktivitas Pengguna | Audit trail seluruh aksi penting | Admin, Auditor | P1 | Otentikasi |
| BL-022 | Laporan Kondisi Aset | Rekap aset baik, rusak ringan, rusak berat | Admin, Pimpinan | P1 | BL-007 |
| BL-023 | Laporan Aset Hilang | Rekap aset hilang/tidak ditemukan | Admin, Pimpinan | P2 | BL-007 |
| BL-024 | Rekap Nilai Aset Per Unit | Ringkasan nilai aset per unit/prodi/jurusan | Admin, Pimpinan | P2 | BL-002, BL-007 |
| BL-025 | Generate KIR | Kartu Inventaris Ruangan otomatis | Admin, PJ Ruang | P1 | BL-003, BL-007 |
| BL-026 | Laporan Sarpras Per Prodi | Laporan akreditasi prodi dari ruang dan aset | Prodi, Admin | P1 | BL-002, BL-003, BL-007 |
| BL-027 | Export Excel Akreditasi | Export data sarpras prodi ke Excel | Prodi, Admin | P2 | BL-026 |
| BL-028 | Export PDF Laporan Tahunan BMN | Laporan tahunan BMN dalam PDF | Admin, Pimpinan | P2 | BL-022, BL-024 |
| BL-029 | Export Format SIMAN v2 | Konversi/export data agar sesuai format SIMAN | Admin | P2 | BL-007 |
| BL-030 | Reminder Pemeliharaan | Notifikasi pemeliharaan berkala | Admin, PJ Ruang | P2 | BL-018 |
| BL-031 | Alert Aset Rusak | Peringatan aset bermasalah | Admin, Pimpinan | P2 | BL-022 |
| BL-032 | Alert Peminjaman Overdue | Peringatan pinjaman terlambat | Admin, Peminjam | P2 | BL-014 |
| BL-033 | Reminder PKS / Pinjam Pakai | Pengingat masa berlaku kerja sama atau pinjam pakai | Admin, Pimpinan | P3 | BL-003 |
| BL-034 | Integrasi WhatsApp Notifikasi | Kirim notifikasi terpilih via WhatsApp | Admin | P3 | BL-030, BL-031, BL-032 |
| BL-035 | Tracking Alat Pertunjukan | Menandai alat pertunjukan dipakai di event mana | Admin, Prodi | P3 | BL-007 |
| BL-036 | Booking Studio Per Prodi | Booking penggunaan studio/ruang khusus | Prodi, Admin | P3 | BL-003, BL-004 |
| BL-037 | Inventaris Kostum dan Properti | Pendataan kostum dan properti pertunjukan | Admin, Prodi | P3 | BL-007 |
| BL-038 | Dokumentasi Event | Simpan foto kegiatan dan aset yang dipakai | Admin, Prodi | P3 | BL-035 |
| BL-039 | Master Data Kendaraan BMN | CRUD kendaraan BMN dengan identitas lengkap | Admin | P1 | BL-007 |
| BL-040 | Reminder Pajak dan STNK | Alert H-90, H-30, H-7, H-0 sebelum jatuh tempo | Admin, Pimpinan | P1 | BL-039 |
| BL-041 | Dashboard Pajak Kendaraan | Dashboard status pajak kendaraan dan jatuh tempo | Admin, Pimpinan | P1 | BL-039, BL-040 |
| BL-042 | History Pembayaran Pajak Kendaraan | Riwayat pembayaran pajak tahunan per kendaraan | Admin | P2 | BL-039 |
| BL-043 | Reminder Service Kendaraan | Reminder service bulanan atau tanggal tertentu | Admin, PJ Ruang | P1 | BL-039 |
| BL-044 | History Service dan Perbaikan Kendaraan | Catat service, bengkel, biaya, dan kondisi pasca service | Admin | P2 | BL-039 |
| BL-045 | Laporan Biaya Kendaraan | Rekap biaya pemeliharaan per kendaraan | Admin, Pimpinan | P2 | BL-044 |
| BL-046 | Upload Foto Kendaraan | Upload maksimal 3 foto kendaraan | Admin | P2 | BL-039 |
| BL-047 | Export Audit Kendaraan | Export laporan kendaraan untuk audit | Admin, Auditor | P2 | BL-039, BL-042, BL-044 |

---

## 3. MVP yang Direkomendasikan

Fitur inti yang sebaiknya masuk rilis awal:

- BL-001 Rename SIMA menjadi SIASET
- BL-002 Master Organisasi
- BL-003 Master Lokasi
- BL-004 Klasifikasi Ruangan
- BL-005 Unit Penanggung Jawab Ruang
- BL-006 PIC Penanggung Jawab Ruangan
- BL-007 Master Aset
- BL-008 Aset Shared vs Dedicated
- BL-009 Import SIMAN
- BL-010 QR Code per Aset
- BL-013 Dashboard Per Role
- BL-014 Manajemen Peminjaman
- BL-016 BAST Aset
- BL-021 Log Aktivitas Pengguna
- BL-022 Laporan Kondisi Aset
- BL-025 Generate KIR
- BL-026 Laporan Sarpras Per Prodi
- BL-039 Master Data Kendaraan BMN
- BL-040 Reminder Pajak dan STNK
- BL-041 Dashboard Pajak Kendaraan
- BL-043 Reminder Service Kendaraan

---

## 4. Fitur Kritis untuk Akreditasi

- BL-002 Master Organisasi
- BL-003 Master Lokasi
- BL-004 Klasifikasi Ruangan
- BL-005 Unit Penanggung Jawab Ruang
- BL-006 PIC Penanggung Jawab Ruangan
- BL-007 Master Aset
- BL-008 Aset Shared vs Dedicated
- BL-025 Generate KIR
- BL-026 Laporan Sarpras Per Prodi
- BL-027 Export Excel Akreditasi

---

## 5. Fitur Khas Institut Seni

- BL-035 Tracking Alat Pertunjukan
- BL-036 Booking Studio Per Prodi
- BL-037 Inventaris Kostum dan Properti
- BL-038 Dokumentasi Event

## 6. Fitur Kendaraan BMN

- BL-039 Master Data Kendaraan BMN
- BL-040 Reminder Pajak dan STNK
- BL-041 Dashboard Pajak Kendaraan
- BL-042 History Pembayaran Pajak Kendaraan
- BL-043 Reminder Service Kendaraan
- BL-044 History Service dan Perbaikan Kendaraan
- BL-045 Laporan Biaya Kendaraan
- BL-046 Upload Foto Kendaraan
- BL-047 Export Audit Kendaraan
