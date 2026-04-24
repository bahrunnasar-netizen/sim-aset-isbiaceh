# Product Requirements Document (PRD)

## SIASET ISBI Aceh

Versi: 1.1  
Tanggal: 24 April 2026  
Status: Draft Awal Produk  
Dokumen ini menjadi acuan pengembangan Sistem Informasi Aset (SIASET) untuk Institut Seni Budaya Indonesia Aceh.

---

## 1. Ringkasan Produk

SIASET ISBI Aceh adalah sistem informasi berbasis web untuk mendukung pengelolaan aset BMN, sarana, prasarana, ruangan, dan operasional ruang akademik di lingkungan ISBI Aceh. Sistem ini ditujukan untuk membantu proses pendataan aset, pemantauan kondisi aset, peminjaman aset, serah terima aset melalui BAST, pelaporan, pengelolaan pengguna, perencanaan pengadaan, serta dukungan data sarpras untuk kebutuhan akreditasi program studi.

Pada kondisi saat ini, implementasi aplikasi masih berupa prototipe frontend interaktif. PRD ini mendefinisikan kebutuhan produk secara utuh agar sistem dapat dikembangkan menjadi aplikasi operasional yang siap digunakan secara institusional.

---

## 2. Latar Belakang

Pengelolaan aset di lingkungan perguruan tinggi sering menghadapi beberapa kendala:

- Data aset tersebar di banyak file dan sulit dipantau secara real-time.
- Proses serah terima aset ke pegawai belum terdokumentasi secara terstruktur.
- Peminjaman aset berisiko tidak tertib tanpa workflow persetujuan dan pengembalian.
- Pelaporan kondisi aset, KIR, dan utilisasi aset memerlukan waktu lama jika dilakukan manual.
- Rencana pengadaan belum selalu berbasis data kondisi dan kebutuhan riil di lapangan.

SIASET dibutuhkan sebagai satu platform terpadu yang memusatkan data dan proses pengelolaan aset agar lebih tertib, terukur, akuntabel, dan sesuai kebutuhan institusi seni yang memiliki studio, lab, ruang bersama, dan aset pertunjukan.

---

## 3. Tujuan Produk

### 3.1 Tujuan Utama

- Menjadi pusat data aset BMN internal ISBI Aceh.
- Menstandarkan proses peminjaman dan serah terima aset.
- Mempermudah monitoring aset berdasarkan unit, ruangan, dan penanggung jawab.
- Mempercepat penyusunan laporan operasional dan eksekutif.
- Menjadi dasar pengambilan keputusan pengadaan dan penataan aset.

### 3.2 Sasaran Bisnis

- Mengurangi pencatatan manual aset.
- Meningkatkan ketertelusuran aset yang dipinjam atau diserahkan ke pegawai.
- Meningkatkan kepatuhan dokumen serah terima aset.
- Menyediakan dashboard eksekutif bagi pimpinan.
- Menyediakan histori aktivitas yang dapat diaudit.

### 3.3 Sasaran Pengguna

- Admin dapat mengelola data aset lebih cepat dan konsisten.
- PJ Ruangan dapat memonitor aset di ruang tanggung jawabnya.
- Peminjam dapat mengajukan dan memantau pinjaman dengan mudah.
- Pimpinan dapat meninjau approval dan melihat ringkasan aset secara cepat.

---

## 4. Ruang Lingkup

### 4.1 In Scope

- Login dan manajemen hak akses berbasis peran.
- Dashboard berbeda per peran.
- Manajemen master organisasi kampus: jurusan, prodi, unit/UPA.
- Manajemen master lokasi: kampus, gedung, lantai, ruangan.
- Klasifikasi penggunaan ruangan: shared, dedicated, mixed.
- Pengelolaan unit penanggung jawab ruang dan PIC penanggung jawab ruangan.
- Manajemen master aset BMN.
- Pengelolaan data aset per prodi dan aset shared.
- Modul kendaraan BMN.
- Upload foto aset.
- QR code aset dan scanner QR/NUP/label SIMAN.
- Import data aset dari SIMAN melalui file Excel/CSV.
- Pengelolaan peminjaman aset.
- Pengajuan pinjam aset oleh pengguna.
- Approval peminjaman sesuai alur bisnis.
- Pengelolaan BAST aset ke pegawai.
- Approval BAST oleh pimpinan.
- Cetak dokumen BAST.
- Pengelolaan pemeliharaan aset.
- History pemindahan aset.
- Laporan sarpras per prodi untuk akreditasi.
- Pengelolaan pengguna.
- Pelaporan dan KIR digital.
- Modul rencana pengadaan aset.
- Riwayat aktivitas dan notifikasi sistem.

### 4.2 Out of Scope untuk Rilis Awal

- Integrasi langsung API ke SIMAN pemerintah.
- Tanda tangan elektronik tersertifikasi.
- Integrasi SSO kampus.
- Aplikasi mobile native.
- Workflow penghapusan aset dan lelang.
- Integrasi barcode scanner perangkat keras khusus.
- Integrasi penuh ke sistem akademik kampus.

---

## 5. Pemangku Kepentingan

- Unit Umum / Pengelola BMN
- Unit Sarpras / Bagian Umum
- Jurusan
- Program Studi
- UPA Bahasa / unit penunjang
- Pimpinan ISBI Aceh
- PJ Ruangan / unit kerja
- Pegawai peminjam / penerima aset
- Tim IT internal
- Auditor internal / pemeriksa administrasi aset

---

## 6. Persona Pengguna

### 6.1 Admin / Operator

Tanggung jawab:
- Mengelola master data aset.
- Mengimpor data aset dari sumber resmi.
- Memproses pengajuan peminjaman.
- Membuat BAST untuk serah terima aset.
- Menyusun laporan operasional.

Kebutuhan:
- Input cepat.
- Data lengkap dan mudah dicari.
- Workflow approval yang jelas.
- Kemudahan cetak dokumen.
- Kemudahan menarik laporan sarpras per prodi dan ruangan.

### 6.2 PJ Ruangan

Tanggung jawab:
- Memantau aset yang berada di ruangan/unit tertentu.
- Mengetahui kondisi aset.
- Mengawasi pemakaian aset di area tanggung jawab.

Kebutuhan:
- Filter aset per ruangan.
- Ringkasan kondisi aset.
- Laporan KIR ruangan.
- Kejelasan unit penanggung jawab ruang dan PIC ruang.

### 6.3 Peminjam

Tanggung jawab:
- Mengajukan peminjaman aset.
- Mengikuti status pengajuan.
- Mengembalikan aset tepat waktu.

Kebutuhan:
- Form pengajuan sederhana.
- Status pinjaman transparan.
- Riwayat peminjaman pribadi.

### 6.4 Pimpinan

Tanggung jawab:
- Menyetujui BAST dan pengadaan.
- Melihat ringkasan strategis aset.
- Mengawasi kondisi dan utilisasi aset.

Kebutuhan:
- Dashboard singkat dan jelas.
- Approval cepat.
- Laporan yang mendukung keputusan.

### 6.5 Prodi / Pengelola Akreditasi

Tanggung jawab:
- Mengakses data sarana dan prasarana prodi untuk kebutuhan akreditasi.
- Memverifikasi ruang inti prodi, ruang bersama, dan aset pendukung.
- Menarik rekap aset dan ruang per prodi.

Kebutuhan:
- Filter data per prodi.
- Pemisahan ruang dedicated, mixed, dan shared.
- Export Excel/PDF yang siap dipakai.

---

## 7. Problem Statement

Tanpa sistem terintegrasi, pengelolaan aset rawan mengalami:

- Duplikasi data.
- Kesalahan status aset.
- Sulitnya melacak siapa yang memegang aset tertentu.
- Dokumen serah terima tidak terdokumentasi dengan baik.
- Keterlambatan pengembalian aset pinjaman.
- Sulitnya melihat kebutuhan pengadaan berbasis data.

SIMA harus menyelesaikan masalah ini dengan satu sumber data yang konsisten dan workflow yang tertib.

---

## 8. Nilai Produk

- Transparansi: status aset selalu terlihat.
- Akuntabilitas: setiap perpindahan tanggung jawab aset tercatat.
- Efisiensi: proses input, approval, dan pelaporan lebih cepat.
- Keterlacakan: histori aset, pinjaman, dan BAST dapat ditelusuri.
- Dukungan keputusan: pimpinan memiliki data ringkas yang relevan.
- Dukungan akreditasi: data sarpras prodi dapat ditarik tanpa input ulang manual.

---

## 9. Fitur Utama

### 9.1 Login dan Hak Akses

Deskripsi:
Sistem menyediakan autentikasi pengguna dan pembatasan akses berdasarkan peran.

Peran:
- Admin / Operator
- PJ Ruangan
- Peminjam
- Pimpinan

Kebutuhan fungsional:
- Pengguna login dengan akun yang valid.
- Sistem menentukan role pengguna setelah login.
- Menu dan halaman yang tampil harus mengikuti role.
- Pengguna dapat logout.

### 9.2 Dashboard

Deskripsi:
Dashboard menampilkan informasi ringkas yang berbeda sesuai peran pengguna.

Kebutuhan fungsional:
- Admin melihat statistik aset, nilai aset, pinjaman aktif, aset perlu perawatan, dan aktivitas terbaru.
- PJ Ruangan melihat jumlah aset ruangan, kondisi aset, aset dipinjam, dan kebutuhan perawatan.
- Peminjam melihat pinjaman aktif, riwayat pinjaman, permintaan menunggu, dan jatuh tempo.
- Pimpinan melihat total aset, nilai BMN, utilisasi aset, dan usulan pengadaan.

### 9.3 Manajemen Data Aset

Deskripsi:
Modul untuk melihat, mencari, memfilter, menambah, mengubah, dan memantau data aset BMN.

Data minimum aset:
- Kode aset / ID internal
- NUP
- Nama aset
- Kategori
- Ruangan
- Unit kerja
- Kondisi
- Status
- Nilai
- Tahun perolehan
- Sumber perolehan
- Spesifikasi
- Keterangan

Status aset minimum:
- Tersedia
- Dipinjam
- Diserahkan via BAST
- Tidak Aktif
- Rusak Ringan
- Rusak Berat

Kebutuhan fungsional:
- Admin dapat melihat seluruh aset.
- PJ Ruangan hanya melihat aset sesuai tanggung jawabnya.
- Pimpinan melihat ringkasan aset, bukan pengelolaan operasional detail.
- Pencarian berdasarkan nama aset, kode, NUP, kategori, ruangan, atau status.
- Filter berdasarkan kondisi, status, kategori, ruangan, dan unit.
- Ekspor data aset ke Excel/PDF.
- Cetak QR atau label aset.
- Sistem membedakan aset `shared` dan `dedicated`.
- Aset dedicated dapat dihubungkan langsung ke prodi pemilik.
- Aset shared tetap memiliki lokasi fisik dan unit penanggung jawab.
- Setiap aset dapat menyimpan maksimal 3 foto.
- Sistem mendukung upload foto terkompresi dan penyimpanan cloud.

### 9.3E Modul Kendaraan BMN

Deskripsi:
Modul khusus untuk pengelolaan kendaraan BMN yang membutuhkan identitas kendaraan lengkap, pengingat pajak/STNK, service berkala, histori perbaikan, dan rekap biaya pemeliharaan.

Data minimum kendaraan:
- Nomor polisi
- Kode aset / ID internal
- NUP
- Merk
- Tipe / model
- Tahun kendaraan
- Nomor BPKB
- Nomor STNK
- Nomor rangka
- Nomor mesin
- Tanggal jatuh tempo pajak
- Tanggal jatuh tempo STNK
- Tanggal service terakhir
- Tanggal service berikutnya
- Status kendaraan
- Kondisi kendaraan
- Unit penanggung jawab
- Ruangan / lokasi parkir

Status kendaraan minimum:
- Aktif
- Rusak
- Dijual
- Tidak Aktif

Kebutuhan fungsional:
- Admin dapat menambah dan mengubah master data kendaraan BMN.
- Sistem mendukung upload maksimal 3 foto kendaraan.
- Sistem menampilkan dashboard kendaraan BMN.
- Sistem menampilkan kendaraan yang pajaknya akan jatuh tempo.
- Sistem menyimpan histori pembayaran pajak.
- Sistem memberikan alert H-90, H-30, H-7, dan H-0 sebelum jatuh tempo pajak/STNK.
- Sistem memberikan reminder service berkala bulanan atau berdasarkan tanggal tertentu.
- Sistem menyimpan histori service/perbaikan kendaraan.
- Sistem mencatat bengkel, jenis pekerjaan, biaya service, dan kondisi setelah service.
- Sistem menyediakan laporan rekap biaya pemeliharaan per kendaraan.
- Sistem menyediakan laporan history pajak tahunan.
- Sistem menyediakan export laporan kendaraan untuk audit.

### 9.3A Master Organisasi

Deskripsi:
Modul untuk mengelola struktur organisasi kampus yang menjadi fondasi relasi data ruang dan aset.

Entitas minimum:
- Jurusan
- Prodi
- Unit/UPA

Data minimum jurusan:
- Kode jurusan
- Nama jurusan
- Status aktif

Data minimum prodi:
- Kode prodi
- Nama prodi
- Jurusan
- Status aktif
- Indikator memiliki studio/lab atau tidak

Data minimum unit:
- Kode unit
- Nama unit
- Jenis unit
- Status aktif

Kebutuhan fungsional:
- Admin dapat mengelola data jurusan, prodi, dan unit.
- Satu prodi harus terhubung ke satu jurusan.
- Unit dapat berdiri sendiri di luar jurusan.
- Struktur ini harus bisa dipakai oleh modul ruangan, aset, laporan, dan akreditasi.

### 9.3B Master Lokasi dan Master Ruangan

Deskripsi:
Modul untuk mengelola hierarki lokasi kampus dan data ruangan beserta pola penggunaannya.

Hierarki lokasi:
- Kampus
- Gedung
- Lantai
- Ruangan

Jenis penggunaan ruangan:
- Shared
- Dedicated
- Mixed

Data minimum ruangan:
- Kampus
- Gedung
- Lantai
- Kode ruangan
- Nama ruangan
- Jenis ruang
- Luas meter persegi
- Kapasitas orang
- Jenis penggunaan
- Pengelola utama
- Unit penanggung jawab ruang
- PIC penanggung jawab ruangan
- Status kepemilikan
- Status DBR
- Keterangan

Kebutuhan fungsional:
- Admin dapat menambah, mengubah, dan menonaktifkan data ruangan.
- Sistem harus membedakan `shared`, `dedicated`, dan `mixed`.
- `Lab Bahasa` di Gedung Utama harus tercatat sebagai ruang berbeda dari studio/lab di Gedung G13 Kampus C.
- Sistem harus mendukung satu ruangan dipakai banyak prodi.
- Sistem harus mendukung prodi tanpa studio/lab khusus.
- Sistem harus menyimpan unit penanggung jawab ruang dan PIC ruang secara terpisah.
- Ruangan dapat ditandai sebagai ruang inti prodi, ruang bersama, atau ruang pendukung umum pada laporan.
- Sistem harus dapat memantau status DBR per ruang.

### 9.3C Laporan Sarpras Prodi dan Akreditasi

Deskripsi:
Modul pelaporan untuk menarik data ruang dan aset per prodi secara otomatis untuk kebutuhan akreditasi.

Kebutuhan fungsional:
- Laporan dapat difilter berdasarkan jurusan, prodi, kampus, gedung, dan jenis penggunaan ruang.
- Laporan harus memisahkan ruang inti prodi, ruang mixed, dan ruang shared.
- Laporan harus mendukung prodi yang tidak memiliki studio/lab khusus.
- Sistem dapat menampilkan aset dedicated prodi dan aset shared yang mendukung prodi.
- Hasil export tersedia dalam Excel dan PDF.

### 9.3D QR, Barcode, dan Scanner Aset

Deskripsi:
Modul identifikasi cepat aset melalui label QR, barcode, atau NUP.

Kebutuhan fungsional:
- Sistem dapat menghasilkan QR code per aset.
- Sistem dapat memindai QR/label SIMAN/barcode/NUP.
- Hasil scan langsung menampilkan detail aset, lokasi, kondisi, dan status.
- Scanner dapat digunakan untuk kebutuhan inventarisasi lapangan.

### 9.4 Import Data SIMAN

Deskripsi:
Admin mengimpor data aset dari hasil ekspor SIMAN melalui file Excel/CSV.

Kebutuhan fungsional:
- Admin dapat mengunggah file `.xlsx` atau `.csv`.
- Sistem memvalidasi format file dan kolom wajib.
- Sistem menampilkan preview data sebelum impor final.
- Sistem menandai baris valid, duplikat, dan error.
- Sistem menyimpan hasil impor ke database.
- Sistem mencatat log impor: tanggal, pengguna, jumlah data sukses, jumlah error.

Kebutuhan non-fungsional:
- Proses impor harus mampu menangani file minimal 5.000 baris tanpa crash.

### 9.5 Peminjaman Aset

Deskripsi:
Modul untuk pengajuan, persetujuan, peminjaman aktif, pengembalian, dan histori peminjaman aset.

Kebutuhan fungsional:
- Peminjam dapat membuat permohonan pinjam aset.
- Pengajuan memuat aset, tujuan, tanggal pinjam, tanggal kembali, dan identitas peminjam.
- Admin atau pihak berwenang dapat menyetujui atau menolak pengajuan.
- Aset yang sedang dipinjam tidak dapat dipinjam ganda.
- Sistem memperbarui status aset saat dipinjam dan dikembalikan.
- Sistem menyimpan histori pengajuan dan keputusan.
- Sistem dapat menandai keterlambatan pengembalian.

Status pinjaman minimum:
- Menunggu
- Disetujui
- Ditolak
- Dipinjam
- Selesai
- Terlambat

### 9.6 Pengajuan Pinjam Baru

Deskripsi:
Halaman khusus bagi peminjam untuk mengajukan pinjaman baru secara mandiri.

Kebutuhan fungsional:
- Pengguna hanya dapat memilih aset yang tersedia.
- Pengguna melihat detail dasar aset sebelum mengajukan.
- Setelah submit, pengguna mendapat nomor permohonan.
- Pengguna dapat melihat status pengajuan pada riwayat pinjam.

### 9.7 BAST Aset

Deskripsi:
Modul inti untuk serah terima aset BMN kepada pegawai atau pihak penerima internal melalui dokumen Berita Acara Serah Terima.

Tujuan:
- Mendokumentasikan perpindahan tanggung jawab aset.
- Menyediakan workflow approval sebelum aset aktif diserahkan.
- Menyediakan dokumen cetak resmi.

Data minimum BAST:
- ID BAST
- Nomor BAST
- Tanggal serah
- Aset yang diserahkan
- Penerima
- NIP penerima
- Jabatan
- Unit kerja
- Kondisi aset
- Keterangan / tujuan penggunaan
- Status BAST
- Approver
- Tanggal approval

Kategori aset yang dapat di-BAST:
- Peralatan TI
- Peralatan Seni
- Alat Musik
- Kendaraan Dinas
- Peralatan Kantor Personal

Workflow:
1. Admin memilih aset yang memenuhi syarat BAST.
2. Admin mengisi data penerima dan detail serah terima.
3. Sistem membuat draft BAST.
4. BAST masuk ke status menunggu approval.
5. Pimpinan meninjau detail BAST.
6. Pimpinan menyetujui atau menolak.
7. Jika disetujui, status aset berubah menjadi diserahkan via BAST.
8. Dokumen BAST dapat dicetak.
9. Jika aset dikembalikan, admin menandai status BAST sebagai dikembalikan dan status aset diperbarui.

Status BAST minimum:
- Draft
- Menunggu Approval
- Aktif
- Ditolak
- Dikembalikan

Kebutuhan fungsional:
- Admin dapat membuat BAST baru.
- Pimpinan dapat menyetujui atau menolak BAST.
- Admin dapat melihat daftar seluruh BAST.
- Pimpinan hanya melihat BAST yang relevan untuk approval dan monitoring.
- Sistem menyimpan histori perubahan status BAST.
- Sistem menyediakan detail BAST dalam tampilan layar.
- Sistem menyediakan template cetak resmi BAST.
- Sistem dapat menandai aset kembali ke inventaris.

### 9.8 Cetak BAST

Deskripsi:
Modul untuk menampilkan dokumen BAST siap cetak atau simpan PDF.

Kebutuhan fungsional:
- Dokumen menggunakan format resmi institusi.
- Menampilkan nomor BAST, data pihak pertama, pihak kedua, data barang, ketentuan, dan tanda tangan.
- Pengguna dapat mencetak langsung melalui browser.
- Pengguna dapat menyimpan hasil cetak sebagai PDF.

Kebutuhan dokumen:
- KOP institusi
- Nomor dokumen
- Tanggal
- Data pihak pertama dan pihak kedua
- Tabel barang
- Ketentuan serah terima
- Area tanda tangan

### 9.9 Laporan dan KIR Digital

Deskripsi:
Modul pelaporan operasional dan administrasi aset.

Jenis laporan minimum:
- Daftar aset per unit
- Daftar aset per ruangan
- Rekap kondisi aset
- Riwayat peminjaman
- Daftar BAST aktif
- Daftar BAST dikembalikan
- KIR digital
- Ringkasan nilai aset

Kebutuhan fungsional:
- Filter laporan berdasarkan periode, unit, ruangan, kategori, dan status.
- Ekspor laporan ke PDF dan Excel.
- Cetak laporan langsung dari sistem.

### 9.10 Manajemen Pengguna

Deskripsi:
Admin mengelola data akun pengguna dan perannya.

Kebutuhan fungsional:
- Tambah pengguna.
- Ubah data pengguna.
- Nonaktifkan pengguna.
- Atur role pengguna.
- Reset password.
- Hubungkan pengguna dengan unit atau ruangan tertentu jika diperlukan.

Data minimum pengguna:
- Nama
- Username / email
- NIP / identitas
- Role
- Unit kerja
- Status akun

### 9.11 Rencana Pengadaan

Deskripsi:
Modul untuk mengelola usulan kebutuhan pengadaan berdasarkan kondisi aset dan kebutuhan unit.

Kebutuhan fungsional:
- Admin atau unit mengajukan usulan pengadaan.
- Setiap usulan memuat nama barang, qty, estimasi biaya, prioritas, alasan, dan unit pengusul.
- Pimpinan dapat meninjau dan menyetujui usulan.
- Status usulan dapat berubah dari diajukan ke review, disetujui, atau ditolak.

### 9.12 Notifikasi dan Aktivitas

Deskripsi:
Sistem menampilkan notifikasi internal dan log aktivitas penting.

Kebutuhan fungsional:
- Notifikasi untuk approval BAST baru.
- Notifikasi untuk pengajuan pinjaman baru.
- Notifikasi pengembalian mendekati jatuh tempo.
- Notifikasi hasil approval.
- Aktivitas terbaru tampil di dashboard sesuai hak akses.
- Reminder pemeliharaan berkala.
- Alert aset rusak.
- Alert peminjaman overdue.
- Reminder masa berlaku PKS atau pinjam pakai lokasi tertentu.
- Reminder pajak kendaraan dan STNK.
- Reminder service berkala kendaraan.
- Integrasi WhatsApp notifikasi untuk kasus yang disetujui pada tahap implementasi lanjutan.

### 9.13 Manajemen Pemeliharaan

Deskripsi:
Modul untuk menjadwalkan pemeliharaan, mencatat riwayat perbaikan, dan mengelola usulan penghapusan aset.

Kebutuhan fungsional:
- Admin dapat membuat jadwal pemeliharaan aset.
- Sistem menyimpan history pemeliharaan dan perbaikan.
- Sistem dapat menandai aset yang memerlukan perbaikan.
- Sistem dapat menyimpan usulan penghapusan aset.
- Riwayat pemeliharaan harus terhubung ke aset dan unit penanggung jawab.
- Riwayat pemeliharaan kendaraan harus mendukung biaya, bengkel, dan kondisi hasil service.

### 9.14 History Pemindahan Aset

Deskripsi:
Modul untuk melacak perpindahan aset antar ruangan, unit, atau penanggung jawab.

Kebutuhan fungsional:
- Sistem mencatat ruangan asal dan ruangan tujuan.
- Sistem mencatat waktu perpindahan, alasan, dan pelaksana.
- Sistem memperbarui lokasi aktif aset.
- Sistem menyimpan histori perpindahan untuk kebutuhan audit.

### 9.15 Fitur Khusus Institut Seni

Deskripsi:
Modul khusus yang menyesuaikan kebutuhan kampus seni.

Kebutuhan fungsional:
- Sistem dapat melacak alat pertunjukan dipakai untuk event mana.
- Sistem dapat mendukung booking studio per prodi.
- Sistem dapat mengelola inventaris kostum dan properti.
- Sistem dapat menyimpan dokumentasi event beserta aset yang dipakai.

---

## 10. Kebutuhan Fungsional Detail

### 10.1 Otentikasi

- Sistem harus memverifikasi username dan password.
- Sistem harus menolak login tidak valid.
- Sistem harus menyimpan sesi login secara aman.
- Sistem harus mendukung logout.

### 10.2 Otorisasi

- Sistem harus menerapkan pembatasan akses berdasarkan role.
- Setiap menu, aksi, dan data harus divalidasi ulang di backend, bukan hanya di frontend.

### 10.3 Audit Trail

- Setiap perubahan data penting harus dicatat.
- Data audit minimum:
  - siapa yang melakukan
  - kapan dilakukan
  - aksi apa
  - data apa yang berubah

### 10.4 Pencarian dan Filter

- Sistem harus menyediakan pencarian cepat pada daftar aset, pinjaman, pengguna, dan BAST.
- Sistem harus menyediakan pencarian cepat pada daftar ruangan, lokasi, jurusan, prodi, dan unit.
- Filter harus tetap responsif pada data besar.

### 10.5 Ekspor dan Cetak

- Sistem harus mendukung ekspor PDF dan Excel pada modul utama.
- Hasil cetak harus rapi pada kertas A4.
- Laporan sarpras prodi harus dapat diunduh tanpa perlu penyusunan ulang manual.

---

## 11. Kebutuhan Non-Fungsional

### 11.1 Performa

- Waktu muat dashboard awal maksimal 3 detik pada koneksi kantor normal.
- Pencarian tabel utama harus responsif pada data minimal 10.000 aset.
- Proses cetak dokumen tidak boleh merusak layout.

### 11.2 Keamanan

- Password disimpan dalam bentuk hash.
- Validasi akses dilakukan di backend.
- Aktivitas sensitif dicatat di audit trail.
- Input pengguna harus tervalidasi untuk mencegah injection dan manipulasi data.

### 11.3 Ketersediaan

- Sistem tersedia pada jam kerja operasional.
- Backup data dilakukan secara berkala.

### 11.4 Usability

- Antarmuka harus mudah dipahami pengguna non-teknis.
- Tugas inti seperti membuat BAST atau menyetujui pinjaman harus selesai dalam sedikit langkah.

### 11.5 Maintainability

- Kode harus modular.
- Struktur data dan API harus terdokumentasi.
- Template dokumen harus mudah diperbarui.

### 11.6 Responsiveness

- Sistem harus dapat digunakan di desktop dan mobile browser.
- Fitur utama tetap dapat diakses pada layar kecil.

---

## 12. Aturan Bisnis

- Aset yang statusnya `Dipinjam` tidak bisa diajukan pinjam lagi.
- Aset yang sudah `Diserahkan via BAST` tidak tersedia untuk peminjaman umum.
- Hanya role `Admin` yang dapat membuat BAST.
- Hanya role `Pimpinan` yang dapat menyetujui atau menolak BAST.
- Hanya aset dengan kategori tertentu yang dapat di-BAST.
- Pengembalian aset dari BAST hanya dapat dilakukan oleh Admin.
- Pengajuan pinjaman harus memiliki tanggal pinjam dan tanggal kembali.
- Laporan yang diekspor harus mengikuti filter aktif.
- Perubahan status aset harus sinkron dengan transaksi pinjaman dan BAST.
- Semua ruangan harus memiliki unit penanggung jawab ruang.
- Semua ruangan harus memiliki PIC penanggung jawab ruangan minimal satu.
- Ruangan `shared` tidak boleh diklaim sebagai milik eksklusif satu prodi.
- Ruangan `dedicated` harus memiliki satu prodi utama.
- Ruangan `mixed` boleh dipakai oleh lebih dari satu prodi dan/atau dikelola unit tertentu.
- Prodi dapat tidak memiliki studio/lab khusus.
- Lab Bahasa di Gedung Utama adalah ruang yang berbeda dari studio/lab di Gedung G13 Kampus C.
- Kendaraan BMN wajib memiliki identitas kendaraan yang lengkap minimal nopol, nomor rangka, dan nomor mesin.
- Reminder pajak kendaraan harus mendukung H-90, H-30, H-7, dan H-0.
- Reminder service kendaraan dapat diatur bulanan atau berdasarkan tanggal service berikutnya.

---

## 13. Alur Pengguna

### 13.1 Alur Login

1. Pengguna membuka aplikasi.
2. Pengguna memasukkan kredensial.
3. Sistem memverifikasi kredensial.
4. Sistem mengarahkan pengguna ke dashboard sesuai role.

### 13.2 Alur Import Aset

1. Admin membuka menu import.
2. Admin mengunggah file ekspor SIMAN.
3. Sistem memvalidasi format dan isi.
4. Sistem menampilkan hasil validasi.
5. Admin menyimpan hasil impor.
6. Sistem memperbarui master aset.

### 13.3 Alur Peminjaman

1. Peminjam memilih menu pinjam aset.
2. Peminjam mengisi form pengajuan.
3. Sistem menyimpan pengajuan dengan status menunggu.
4. Admin/PJ meninjau pengajuan.
5. Pengajuan disetujui atau ditolak.
6. Saat aset dikembalikan, status transaksi menjadi selesai dan status aset diperbarui.

### 13.4 Alur BAST

1. Admin membuka modul BAST.
2. Admin memilih aset yang eligible.
3. Admin mengisi data penerima.
4. Sistem membuat BAST menunggu approval.
5. Pimpinan meninjau detail.
6. Pimpinan setuju atau tolak.
7. Jika disetujui, dokumen dapat dicetak dan aset tercatat diserahkan.
8. Jika aset kembali, admin menandai dikembalikan.

### 13.5 Alur Pengadaan

1. Unit atau admin membuat usulan.
2. Sistem menyimpan usulan.
3. Pimpinan mereview prioritas.
4. Status usulan diperbarui.

---

## 14. Data Model Konseptual

### 14.1 Entitas Utama

- User
- Role
- Jurusan
- Prodi
- Unit
- Kampus
- Gedung
- Lantai
- Ruangan
- RuanganProdiPengguna
- UnitKerja
- Ruangan
- Aset
- Kendaraan
- PajakKendaraan
- ServiceKendaraan
- KategoriAset
- ImportLog
- Peminjaman
- BAST
- BASTItem
- Pengadaan
- Notifikasi
- ActivityLog

### 14.2 Relasi Umum

- Satu user memiliki satu role.
- Satu prodi memiliki satu jurusan.
- Satu unit dapat menjadi penanggung jawab banyak ruangan.
- Satu ruangan berada dalam satu gedung dan satu kampus.
- Satu ruangan dapat dipakai oleh banyak prodi.
- Satu user dapat terkait ke satu unit kerja.
- Satu ruangan memiliki banyak aset.
- Satu aset dapat memiliki banyak histori peminjaman.
- Satu aset dapat memiliki banyak histori BAST secara berurutan, tetapi tidak aktif bersamaan.
- Satu aset dapat diklasifikasikan sebagai kendaraan BMN.
- Satu kendaraan memiliki banyak histori pajak.
- Satu kendaraan memiliki banyak histori service.
- Satu BAST minimal memiliki satu item aset.
- Satu pengajuan pengadaan berasal dari satu unit kerja.

### 14.3 Field Kritis Aset

- id
- kode_aset
- nup
- nama
- kategori_id
- ruangan_id
- unit_id
- kondisi
- status
- nilai_perolehan
- tahun_perolehan
- spesifikasi
- sumber_data
- ownership_type
- prodi_owner_id
- unit_penanggung_jawab_id
- ruangan_id
- created_at
- updated_at

### 14.3A Field Kritis Ruangan

- id
- kampus_id
- gedung_id
- lantai
- kode_ruangan
- nama_ruangan
- jenis_ruang
- jenis_penggunaan
- luas_m2
- kapasitas_orang
- status_kepemilikan
- status_dbr
- unit_penanggung_jawab_id
- pic_penanggung_jawab_user_id atau pic_penanggung_jawab_nama
- pengelola_utama_tipe
- pengelola_utama_id
- status_aktif
- keterangan

### 14.3B Field Kritis RuanganProdiPengguna

- id
- ruangan_id
- prodi_id
- peran_penggunaan
- is_for_akreditasi
- catatan

### 14.3C Field Kritis Kendaraan

- id
- aset_id
- nomor_polisi
- nomor_bpkb
- nomor_stnk
- nomor_rangka
- nomor_mesin
- merk
- tipe
- tahun
- tanggal_jatuh_tempo_pajak
- tanggal_jatuh_tempo_stnk
- tanggal_service_terakhir
- tanggal_service_berikutnya
- status_kendaraan
- lokasi_parkir

### 14.3D Field Kritis Pajak Kendaraan

- id
- kendaraan_id
- periode_pajak
- tanggal_jatuh_tempo
- tanggal_bayar
- nominal
- keterangan

### 14.3E Field Kritis Service Kendaraan

- id
- kendaraan_id
- tanggal_service
- bengkel
- jenis_pekerjaan
- biaya
- kondisi_setelah_service
- tanggal_service_berikutnya

### 14.4 Field Kritis BAST

- id
- nomor_bast
- aset_id
- penerima_nama
- penerima_nip
- jabatan
- unit_id
- tanggal_serah
- kondisi_saat_serah
- keterangan
- status
- approved_by
- approved_at
- returned_at
- created_by

---

## 15. Kebutuhan Integrasi

### 15.1 Integrasi Rilis Awal

- Import file Excel/CSV hasil ekspor SIMAN.
- Ekspor PDF dan Excel.

### 15.2 Integrasi Rilis Lanjutan

- Integrasi API dengan sistem sumber data aset bila tersedia.
- Integrasi email atau WhatsApp notifikasi.
- Integrasi tanda tangan elektronik.
- Integrasi SSO akun kampus.

---

## 16. KPI dan Ukuran Keberhasilan

### 16.1 KPI Operasional

- 100% aset aktif tercatat di sistem.
- 100% ruang aktif tercatat dengan kampus, gedung, kode, unit penanggung jawab, dan status DBR.
- 100% kendaraan BMN aktif tercatat dengan identitas lengkap dan jadwal pajak.
- 100% BAST baru terdokumentasi di sistem.
- Minimal 90% pengajuan pinjaman diproses melalui sistem.
- Waktu pencarian data aset turun signifikan dibanding cara manual.
- Laporan sarpras prodi dapat dihasilkan otomatis tanpa input ulang manual.

### 16.2 KPI Adopsi

- Semua admin menggunakan sistem untuk pendataan harian.
- PJ Ruangan aktif memantau aset melalui dashboard dan laporan.
- Pimpinan menggunakan dashboard dan approval digital secara rutin.

### 16.3 KPI Kualitas Data

- Duplikasi data aset di bawah 2%.
- Data aset tanpa kategori atau ruangan di bawah 1%.
- Semua transaksi BAST memiliki status dan approver yang jelas.

---

## 17. Prioritas Rilis

### 17.1 MVP

- Login dan role-based access
- Master organisasi kampus
- Master lokasi dan master ruangan
- Dashboard dasar per role
- Master data aset
- Modul kendaraan BMN dasar
- Reminder pajak dan STNK kendaraan
- Klasifikasi shared/dedicated/mixed
- Import SIMAN via file
- Peminjaman dasar
- BAST dasar
- Approval BAST
- Cetak BAST
- Laporan dasar
- Laporan sarpras prodi

### 17.2 Rilis 2

- Audit trail lengkap
- Notifikasi otomatis
- Manajemen pengguna penuh
- Laporan lanjutan dan ekspor lebih lengkap
- Modul pengadaan yang lebih matang
- Upload foto aset
- Reminder service kendaraan
- History pajak kendaraan
- History service kendaraan
- History pemindahan aset
- Jadwal pemeliharaan dan history perbaikan
- QR/barcode scanner

### 17.3 Rilis 3

- Integrasi eksternal
- Tanda tangan elektronik
- Workflow disposisi/approval lebih kompleks
- Analitik aset lanjutan
- Dashboard kendaraan BMN lanjutan
- Integrasi notifikasi kendaraan ke WhatsApp
- Booking studio
- Inventaris kostum dan properti
- Dokumentasi event
- Integrasi WhatsApp notifikasi

---

## 18. Risiko Produk

- Data awal tidak bersih sehingga proses impor menghasilkan banyak error.
- Pengguna terbiasa dengan proses manual dan lambat beradaptasi.
- Template dokumen resmi belum final dari institusi.
- Akses role bisa rancu jika aturan organisasi belum dibakukan.
- Jika status aset tidak sinkron dengan transaksi, kepercayaan pengguna bisa turun.

Mitigasi:
- Sediakan validasi impor dan preview data.
- Buat SOP penggunaan sistem.
- Finalkan template dokumen bersama unit terkait.
- Definisikan role dan otorisasi sejak awal.
- Bangun aturan status aset yang konsisten di backend.

---

## 19. Dependensi

- Kejelasan struktur organisasi dan kewenangan approval.
- Kejelasan master kampus, gedung, ruangan, unit penanggung jawab, dan PIC ruang.
- Ketersediaan data aset awal dari sumber resmi.
- Ketersediaan data DBR ruangan yang valid dan mutakhir.
- Ketersediaan data kendaraan BMN beserta informasi pajak/STNK awal.
- Keputusan format dokumen BAST resmi.
- Infrastruktur hosting dan database.
- Dukungan tim IT untuk pemeliharaan sistem.

---

## 20. Asumsi Produk

- ISBI Aceh membutuhkan sistem web internal yang dapat diakses melalui browser modern.
- Data aset awal tersedia dari hasil ekspor SIMAN atau sumber administrasi resmi.
- Data ruangan awal tersedia dari daftar keterangan ruangan dan DBR internal kampus.
- Data kendaraan awal tersedia dari dokumen inventaris kendaraan BMN internal.
- Proses approval tetap dilakukan oleh pimpinan internal.
- Dokumen BAST cetak masih menjadi kebutuhan utama, meskipun nantinya bisa berkembang ke format digital penuh.

---

## 21. Kebutuhan Teknis Awal

Rekomendasi arsitektur untuk implementasi produksi:

- Frontend: Next.js
- Backend: Next.js API Routes atau service backend terpisah
- Database: PostgreSQL atau MySQL
- ORM: Prisma atau setara
- Auth: session-based auth atau JWT dengan role permissions
- Storage: penyimpanan file untuk dokumen ekspor/import
- PDF: generator PDF server-side atau print-friendly HTML

---

## 22. Tech Stack yang Direkomendasikan

Bagian ini mendefinisikan stack teknologi yang disarankan untuk pengembangan SIMA agar stabil, mudah dirawat, dan sesuai dengan kebutuhan sistem internal institusi.

### 22.1 Frontend

- Framework: Next.js 14+
- Library UI: React 18+
- Styling:
  - Opsi 1: CSS Modules untuk komponen yang sederhana dan stabil
  - Opsi 2: Tailwind CSS jika tim ingin pengembangan UI lebih cepat dan konsisten
- State management:
  - React built-in state untuk state lokal UI
  - Zustand untuk state global ringan jika kompleksitas meningkat
- Form handling:
  - React Hook Form
  - Zod untuk validasi schema form

Alasan:
- Next.js sudah sesuai dengan prototipe yang ada sekarang.
- React memudahkan pengembangan UI modular.
- React Hook Form dan Zod cocok untuk form administratif yang banyak field dan validasi.

### 22.2 Backend

- Opsi utama: Next.js Route Handlers / API Routes
- Opsi alternatif jika sistem membesar: NestJS atau Express.js service terpisah
- Validasi API: Zod
- Authentication service:
  - NextAuth/Auth.js atau custom auth berbasis session

Alasan:
- Untuk tahap awal, backend yang menyatu dengan Next.js akan mempercepat delivery.
- Jika kebutuhan integrasi dan workflow makin kompleks, backend terpisah lebih mudah diskalakan.

### 22.3 Database

- Rekomendasi utama: PostgreSQL
- Alternatif: MySQL
- ORM: Prisma
- Migration tool: Prisma Migrate

Alasan:
- PostgreSQL kuat untuk data relasional dan query pelaporan.
- Prisma cocok untuk tim pengembangan modern karena skema jelas dan produktif.

### 22.4 Authentication dan Authorization

- Authentication:
  - Auth.js / NextAuth
  - Session-based login
- Authorization:
  - Role-Based Access Control (RBAC)
  - Middleware dan backend permission checks

Role minimum:
- Admin
- PJ Ruangan
- Peminjam
- Pimpinan

Alasan:
- Sistem ini sangat bergantung pada kontrol hak akses per peran.
- Validasi permission harus dilakukan di server, bukan hanya di tampilan frontend.

### 22.5 File Handling dan Dokumen

- Upload file:
  - Native upload handler Next.js
  - Validasi file dengan MIME/type dan ukuran maksimum
- Parsing Excel/CSV:
  - `xlsx`
  - `papaparse` untuk CSV bila diperlukan
- PDF / dokumen cetak:
  - Tahap awal: print-friendly HTML/CSS
  - Tahap lanjut: `@react-pdf/renderer` atau generator PDF server-side

Alasan:
- Modul import SIMAN dan cetak BAST bergantung pada file processing yang stabil.
- Print-friendly HTML cocok untuk implementasi cepat dokumen administratif.

### 22.6 Reporting dan Export

- Excel export:
  - `xlsx`
- PDF export:
  - HTML print
  - atau library PDF server-side
- Chart/dashboard:
  - Recharts
  - atau Chart.js

Alasan:
- Dashboard pimpinan dan laporan operasional membutuhkan visualisasi dasar.
- Export laporan adalah kebutuhan inti sistem.

### 22.7 UI Component dan Design System

- Opsi ringan:
  - Komponen internal buatan sendiri
- Opsi percepatan:
  - shadcn/ui untuk komponen dasar

Komponen prioritas:
- Table data
- Modal
- Form input
- Badge status
- Toast notification
- Tabs
- Drawer/mobile navigation

Alasan:
- Sistem administratif lebih membutuhkan konsistensi dan kejelasan daripada visual yang dekoratif.

### 22.8 Logging, Audit, dan Monitoring

- App logging:
  - Pino atau Winston
- Audit trail:
  - tabel audit internal di database
- Error monitoring:
  - Sentry pada tahap lanjut

Alasan:
- Sistem aset membutuhkan jejak aktivitas yang rapi dan dapat ditelusuri.

### 22.9 Testing

- Unit test:
  - Vitest atau Jest
- Component test:
  - React Testing Library
- End-to-end test:
  - Playwright

Prioritas test:
- Login dan role access
- Import data
- Workflow peminjaman
- Workflow approval BAST
- Cetak dokumen BAST

### 22.10 Deployment dan Infrastruktur

- Hosting aplikasi:
  - Vercel untuk tahap awal
  - VPS / cloud server internal jika institusi membutuhkan kontrol lebih besar
- Database hosting:
  - Supabase Postgres
  - Neon Postgres
  - atau server database internal
- File storage:
  - Local/private storage pada server
  - atau object storage seperti S3-compatible storage

Alasan:
- Tahap awal perlu deployment yang cepat.
- Tahap produksi institusional mungkin memerlukan kontrol infrastruktur yang lebih ketat.

### 22.11 DevOps dan Quality Tools

- Package manager:
  - npm
  - atau pnpm jika tim ingin instalasi lebih efisien
- Linting:
  - ESLint
- Formatting:
  - Prettier
- Git workflow:
  - GitHub
  - branch-based development

### 22.12 Rekomendasi Stack Final untuk MVP

Stack MVP yang disarankan:

- Next.js 14
- React 18
- CSS Modules atau Tailwind CSS
- Prisma
- PostgreSQL
- Auth.js / NextAuth
- React Hook Form
- Zod
- xlsx
- Recharts
- Playwright
- Vercel

### 22.13 Catatan Kesesuaian dengan Repo Saat Ini

Repo yang ada saat ini sudah menggunakan:

- Next.js
- React
- CSS global dan inline styling

Agar transisi dari prototipe ke production lebih mulus, langkah teknis yang direkomendasikan:

- Pertahankan Next.js sebagai fondasi utama.
- Mulai pindahkan data statis ke database.
- Pisahkan komponen UI, domain logic, dan service/data access.
- Tambahkan auth nyata dan RBAC.
- Ubah import dan cetak dari simulasi menjadi proses nyata.

---

## 23. Acceptance Criteria Tingkat Sistem

Sistem dinyatakan memenuhi kebutuhan dasar jika:

- Pengguna dapat login dan hanya melihat fitur sesuai rolenya.
- Admin dapat mengelola master organisasi, lokasi, dan ruangan.
- Sistem dapat membedakan ruang shared, dedicated, dan mixed.
- Sistem dapat menyimpan unit penanggung jawab ruang dan PIC ruang.
- Admin dapat melihat dan mengelola daftar aset.
- Admin dapat melihat dan mengelola daftar kendaraan BMN.
- Sistem dapat menghasilkan reminder pajak/STNK kendaraan.
- Admin dapat mengimpor data aset dari file dan hasilnya tersimpan.
- Peminjam dapat mengajukan pinjam aset.
- Transaksi pinjam dapat disetujui, ditolak, dan diselesaikan.
- Admin dapat membuat BAST baru.
- Pimpinan dapat menyetujui atau menolak BAST.
- BAST yang disetujui dapat dicetak dalam format resmi.
- Status aset berubah konsisten mengikuti proses pinjam atau BAST.
- Laporan dasar dapat ditampilkan dan diekspor.
- Laporan sarpras prodi dapat dihasilkan berdasarkan relasi prodi, ruang, dan aset.

---

## 24. Gap dengan Implementasi Saat Ini

Berdasarkan prototipe yang ada saat ini, kondisi implementasi masih:

- Berbasis frontend saja.
- Data masih statis dan disimpan di state lokal.
- Belum ada database.
- Belum ada autentikasi nyata.
- Import file masih simulasi.
- Approval masih simulasi lokal.
- Belum ada audit trail.
- Belum ada notifikasi sungguhan.

Artinya, prototipe saat ini sudah baik sebagai validasi alur UI/UX, terutama untuk:

- dashboard per role
- daftar aset
- peminjaman dasar
- workflow BAST
- cetak BAST

Namun masih perlu tahap implementasi backend dan hardening agar sesuai dengan PRD ini.

---

## 25. Rekomendasi Tahap Lanjut

Tahap 1:
- Rapikan struktur kode dan pisahkan modul per fitur.
- Finalkan kebutuhan data dan status bisnis.
- Buat skema database.

Tahap 2:
- Implementasi autentikasi dan otorisasi.
- Implementasi CRUD aset, pinjaman, BAST, dan pengguna.
- Implementasi import file yang nyata.

Tahap 3:
- Implementasi laporan, audit trail, dan notifikasi.
- Validasi dokumen cetak dengan format resmi institusi.
- UAT bersama pengguna internal.

---

## 26. Lampiran Istilah

- BMN: Barang Milik Negara
- SIMAN: Sistem Informasi Manajemen Aset Negara
- BAST: Berita Acara Serah Terima
- KIR: Kartu Inventaris Ruangan
- PJ Ruangan: Penanggung Jawab Ruangan
- MVP: Minimum Viable Product
- UAT: User Acceptance Test
