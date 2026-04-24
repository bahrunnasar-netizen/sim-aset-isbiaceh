# Struktur Tabel Database

## Modul Master Ruangan SIASET

Versi: 1.0  
Tanggal: 24 April 2026  
Status: Draft Struktur Database

Dokumen ini fokus pada struktur tabel untuk modul:

- master organisasi
- master lokasi
- master ruangan
- relasi ruangan dan prodi pengguna
- keterkaitan ruangan dengan aset
- ekstensi aset untuk kendaraan BMN

---

## 1. Prinsip Desain

- Satu prodi berada di bawah satu jurusan.
- Unit non-prodi seperti UPA harus dapat berdiri sendiri.
- Ruangan harus mendukung kategori `shared`, `dedicated`, dan `mixed`.
- Ruangan harus menyimpan `unit penanggung jawab ruang` dan `PIC penanggung jawab ruangan`.
- Satu ruangan dapat dipakai oleh banyak prodi.
- Prodi dapat tidak memiliki studio/lab khusus.
- `Lab Bahasa` di Gedung Utama harus terpisah dari studio/lab di Gedung G13 Kampus C.

---

## 2. Enumerasi yang Direkomendasikan

### 2.1 `jenis_penggunaan_ruang`

- `shared`
- `dedicated`
- `mixed`

### 2.2 `status_kepemilikan_ruang`

- `bmn`
- `pinjam_pakai`
- `hibah`
- `lainnya`

### 2.3 `status_dbr`

- `sudah`
- `belum`

### 2.4 `pengelola_tipe`

- `institusi`
- `jurusan`
- `prodi`
- `unit`

### 2.5 `peran_penggunaan_ruang`

- `utama`
- `pengguna`
- `pendukung_akreditasi`

### 2.6 `ownership_type_aset`

- `shared`
- `dedicated`

### 2.7 `asset_type`

- `umum`
- `kendaraan`

### 2.8 `vehicle_status`

- `aktif`
- `rusak`
- `dijual`
- `tidak_aktif`

---

## 3. Tabel Inti

### 3.1 `jurusan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kode_jurusan | varchar(20) | unik |
| nama_jurusan | varchar(150) | wajib |
| status_aktif | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.2 `prodi`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| jurusan_id | fk -> jurusan.id | wajib |
| kode_prodi | varchar(20) | unik |
| nama_prodi | varchar(150) | wajib |
| memiliki_studio_lab_khusus | boolean | default false |
| status_aktif | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.3 `unit`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kode_unit | varchar(30) | unik |
| nama_unit | varchar(150) | wajib |
| jenis_unit | varchar(50) | contoh: upa, sarpras, perpustakaan |
| status_aktif | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.4 `kampus`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kode_kampus | varchar(20) | unik |
| nama_kampus | varchar(150) | wajib |
| alamat | text | opsional |
| status_aktif | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.5 `gedung`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kampus_id | fk -> kampus.id | wajib |
| kode_gedung | varchar(20) | unik per kampus |
| nama_gedung | varchar(150) | wajib |
| status_aktif | boolean | default true |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.6 `ruangan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kampus_id | fk -> kampus.id | wajib |
| gedung_id | fk -> gedung.id | wajib |
| lantai | varchar(10) | contoh: 1, 2, GF |
| kode_ruangan | varchar(50) | unik |
| nama_ruangan | varchar(200) | wajib |
| jenis_ruang | varchar(100) | contoh: ruang kuliah, studio tari, lab bahasa |
| jenis_penggunaan | enum | shared/dedicated/mixed |
| luas_m2 | decimal(10,2) | opsional |
| kapasitas_orang | integer | opsional |
| status_kepemilikan | enum | bmn/pinjam_pakai/hibah/lainnya |
| status_dbr | enum | sudah/belum |
| unit_penanggung_jawab_id | fk -> unit.id | wajib |
| pic_penanggung_jawab_nama | varchar(150) | digunakan jika PIC belum menjadi user sistem |
| pic_penanggung_jawab_user_id | fk -> users.id nullable | opsional |
| pengelola_utama_tipe | enum | institusi/jurusan/prodi/unit |
| pengelola_utama_id | uuid / bigint | id entitas sesuai tipe |
| status_aktif | boolean | default true |
| keterangan | text | opsional |
| created_at | timestamp | |
| updated_at | timestamp | |

Catatan:
- `pengelola_utama_id` bersifat polymorphic secara logika aplikasi.
- Jika ingin lebih ketat di level database, dapat dipecah menjadi:
  - `pengelola_jurusan_id`
  - `pengelola_prodi_id`
  - `pengelola_unit_id`
  lalu divalidasi agar hanya satu yang terisi.

### 3.7 `ruangan_prodi_pengguna`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| ruangan_id | fk -> ruangan.id | wajib |
| prodi_id | fk -> prodi.id | wajib |
| peran_penggunaan | enum | utama/pengguna/pendukung_akreditasi |
| is_for_akreditasi | boolean | default true |
| catatan | text | opsional |
| created_at | timestamp | |
| updated_at | timestamp | |

Tujuan:
- menangani satu ruangan dipakai oleh banyak prodi
- menangani ruang mixed
- menangani prodi yang boleh menarik ruang tertentu pada laporan akreditasi

### 3.8 `aset`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kode_aset | varchar(50) | unik |
| nup | varchar(50) | opsional |
| nama_aset | varchar(200) | wajib |
| kategori_aset | varchar(100) | wajib |
| ownership_type | enum | shared/dedicated |
| asset_type | enum | umum/kendaraan |
| prodi_owner_id | fk -> prodi.id nullable | wajib jika dedicated |
| unit_penanggung_jawab_id | fk -> unit.id nullable | opsional |
| ruangan_id | fk -> ruangan.id nullable | lokasi aktif |
| kondisi | varchar(50) | baik/rusak ringan/rusak berat |
| status_aset | varchar(50) | tersedia/dipinjam/diserahkan/tidak aktif |
| nilai_perolehan | decimal(18,2) | opsional |
| tahun_perolehan | integer | opsional |
| spesifikasi | text | opsional |
| sumber_data | varchar(100) | siman/manual/import |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.9 `kendaraan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| aset_id | fk -> aset.id | wajib, unik |
| nomor_polisi | varchar(20) | unik |
| nomor_bpkb | varchar(100) | opsional |
| nomor_stnk | varchar(100) | opsional |
| nomor_rangka | varchar(100) | wajib |
| nomor_mesin | varchar(100) | wajib |
| merk | varchar(100) | wajib |
| tipe | varchar(150) | opsional |
| tahun | integer | opsional |
| tanggal_jatuh_tempo_pajak | date | wajib |
| tanggal_jatuh_tempo_stnk | date | opsional |
| tanggal_service_terakhir | date | opsional |
| tanggal_service_berikutnya | date | opsional |
| status_kendaraan | enum | aktif/rusak/dijual/tidak_aktif |
| lokasi_parkir | varchar(150) | opsional |
| catatan | text | opsional |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.10 `pajak_kendaraan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kendaraan_id | fk -> kendaraan.id | wajib |
| periode_pajak | varchar(20) | contoh: 2026 |
| tanggal_jatuh_tempo | date | wajib |
| tanggal_bayar | date | opsional |
| nominal | decimal(18,2) | opsional |
| keterangan | text | opsional |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.11 `service_kendaraan`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| kendaraan_id | fk -> kendaraan.id | wajib |
| tanggal_service | date | wajib |
| bengkel | varchar(150) | opsional |
| jenis_pekerjaan | text | wajib |
| biaya | decimal(18,2) | opsional |
| kondisi_setelah_service | varchar(100) | opsional |
| tanggal_service_berikutnya | date | opsional |
| catatan | text | opsional |
| created_at | timestamp | |
| updated_at | timestamp | |

### 3.12 `aset_foto`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| aset_id | fk -> aset.id | wajib |
| foto_url | text | wajib |
| urutan | smallint | 1-3 |
| public_id_cloudinary | varchar(255) | opsional |
| created_at | timestamp | |

Constraint:
- maksimal 3 foto per aset di level aplikasi

### 3.10 `history_pemindahan_aset`

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | uuid / bigint | PK |
| aset_id | fk -> aset.id | wajib |
| ruangan_asal_id | fk -> ruangan.id nullable | |
| ruangan_tujuan_id | fk -> ruangan.id nullable | |
| unit_asal_id | fk -> unit.id nullable | |
| unit_tujuan_id | fk -> unit.id nullable | |
| tanggal_pindah | timestamp | wajib |
| alasan | text | opsional |
| diproses_oleh_user_id | fk -> users.id nullable | |
| created_at | timestamp | |

---

## 4. Relasi Inti

- `jurusan` 1..n `prodi`
- `kampus` 1..n `gedung`
- `gedung` 1..n `ruangan`
- `unit` 1..n `ruangan`
- `ruangan` n..m `prodi` melalui `ruangan_prodi_pengguna`
- `ruangan` 1..n `aset`
- `aset` 1..1 `kendaraan` untuk aset bertipe kendaraan
- `kendaraan` 1..n `pajak_kendaraan`
- `kendaraan` 1..n `service_kendaraan`
- `aset` 1..n `aset_foto`
- `aset` 1..n `history_pemindahan_aset`

---

## 5. Validasi Bisnis yang Direkomendasikan

### 5.1 Ruangan

- semua ruangan wajib punya `unit_penanggung_jawab_id`
- semua ruangan wajib punya `pic_penanggung_jawab_nama` atau `pic_penanggung_jawab_user_id`
- jika `jenis_penggunaan = shared`, ruangan tidak boleh memiliki satu prodi eksklusif sebagai satu-satunya sumber kebenaran
- jika `jenis_penggunaan = dedicated`, minimal harus ada satu prodi di `ruangan_prodi_pengguna` dengan `peran_penggunaan = utama`
- jika `jenis_penggunaan = mixed`, boleh ada lebih dari satu prodi pengguna

### 5.2 Aset

- jika `ownership_type = dedicated`, maka `prodi_owner_id` wajib terisi
- jika `ownership_type = shared`, maka `prodi_owner_id` boleh kosong
- aset aktif sebaiknya punya `ruangan_id`
- jika `asset_type = kendaraan`, maka data `kendaraan` wajib ada

### 5.3 Kendaraan

- kendaraan wajib memiliki `nomor_polisi`, `nomor_rangka`, dan `nomor_mesin`
- reminder pajak harus dapat dihitung dari `tanggal_jatuh_tempo_pajak`
- reminder STNK dapat dihitung dari `tanggal_jatuh_tempo_stnk`
- reminder service dapat dihitung dari `tanggal_service_berikutnya`
- kendaraan dapat menggunakan maksimal 3 foto melalui tabel `aset_foto`

### 5.4 Laporan Akreditasi

- ruang dedicated tampil sebagai `ruang inti prodi`
- ruang mixed tampil sebagai `ruang bersama`
- ruang shared tampil sebagai `ruang pendukung umum`
- prodi tanpa studio/lab khusus tetap dapat menarik ruang shared dan mixed yang relevan

### 5.5 Laporan Kendaraan

- laporan biaya kendaraan berasal dari agregasi `service_kendaraan.biaya`
- history pajak tahunan berasal dari `pajak_kendaraan`
- dashboard pajak kendaraan menyorot H-90, H-30, H-7, H-0

---

## 6. Contoh Data Nyata yang Sudah Terkunci

### 6.1 Lab Bahasa

- kampus: Kampus Utama
- gedung: Gedung Utama
- nama_ruangan: Lab Bahasa
- jenis_penggunaan: mixed
- pengelola utama: UPA Bahasa
- prodi pengguna:
  - Bahasa Aceh
  - Kajian Sastra dan Budaya

### 6.2 Studio/Lab di Gedung G13 Kampus C

- kampus: Kampus C
- gedung: G13
- ruang dedicated:
  - Studio Tari
  - Studio Karawitan
  - Studio Teater
  - Studio Seni Rupa Murni
  - Studio Kriya Seni
  - Studio DKV
  - Studio Desain Interior
- ruang mixed:
  - studio/lab bersama Bahasa Aceh dan Kajian Sastra dan Budaya jika memang berbagi ruang yang sama

---

## 7. Catatan Implementasi

- Untuk Prisma, enum dapat dipetakan langsung dari daftar enumerasi di atas.
- Untuk PostgreSQL, pertimbangkan index pada:
  - `kode_ruangan`
  - `nama_ruangan`
  - `jenis_penggunaan`
  - `unit_penanggung_jawab_id`
  - `prodi_owner_id`
  - `ruangan_id`
  - `nomor_polisi`
  - `tanggal_jatuh_tempo_pajak`
  - `tanggal_service_berikutnya`
- Jika nanti user sistem sudah matang, `pic_penanggung_jawab_nama` bisa bertahap diganti penuh ke relasi user.
