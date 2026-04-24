require("dotenv/config");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");
const {
  PrismaClient,
  UserRoleType,
  UnitType,
  RoomUsageType,
  RoomOwnershipStatus,
  DBRStatus,
  ManagerType,
  RoomUsageRole,
  AssetType,
  AssetOwnershipType,
  AssetCondition,
  AssetStatus,
  VehicleStatus,
} = require("@prisma/client");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL belum tersedia di environment.");
}

const sanitizedDatabaseUrl = process.env.DATABASE_URL.replace(/\?sslmode=require$/i, "");

const pool = new pg.Pool({
  connectionString: sanitizedDatabaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool, { disposeExternalPool: true });
const prisma = new PrismaClient({ adapter });

async function upsertRole(code, name, description) {
  return prisma.role.upsert({
    where: { code },
    update: { name, description },
    create: { code, name, description },
  });
}

async function upsertJurusan(code, name) {
  return prisma.jurusan.upsert({
    where: { code },
    update: { name, isActive: true },
    create: { code, name, isActive: true },
  });
}

async function upsertProdi(jurusanId, code, name, hasDedicatedStudioOrLab) {
  return prisma.prodi.upsert({
    where: { code },
    update: {
      jurusanId,
      name,
      hasDedicatedStudioOrLab,
      isActive: true,
    },
    create: {
      jurusanId,
      code,
      name,
      hasDedicatedStudioOrLab,
      isActive: true,
    },
  });
}

async function upsertUnit(code, name, type) {
  return prisma.unit.upsert({
    where: { code },
    update: { name, type, isActive: true },
    create: { code, name, type, isActive: true },
  });
}

async function upsertKampus(code, name, address) {
  return prisma.kampus.upsert({
    where: { code },
    update: { name, address, isActive: true },
    create: { code, name, address, isActive: true },
  });
}

async function upsertGedung(kampusId, code, name) {
  return prisma.gedung.upsert({
    where: { kampusId_code: { kampusId, code } },
    update: { name, isActive: true },
    create: { kampusId, code, name, isActive: true },
  });
}

async function upsertRoom(data) {
  return prisma.ruangan.upsert({
    where: { code: data.code },
    update: data,
    create: data,
  });
}

async function upsertRoomUsage(ruanganId, prodiId, usageRole, notes = null) {
  return prisma.roomProdiUsage.upsert({
    where: { ruanganId_prodiId: { ruanganId, prodiId } },
    update: {
      usageRole,
      isForAccreditation: true,
      notes,
    },
    create: {
      ruanganId,
      prodiId,
      usageRole,
      isForAccreditation: true,
      notes,
    },
  });
}

async function upsertAsset(data) {
  return prisma.asset.upsert({
    where: { code: data.code },
    update: data,
    create: data,
  });
}

async function upsertVehicle(assetId, data) {
  return prisma.vehicle.upsert({
    where: { assetId },
    update: data,
    create: {
      assetId,
      ...data,
    },
  });
}

async function upsertVehicleTaxHistory(vehicleId, taxPeriod, dueDate, paidDate, amount, notes) {
  return prisma.vehicleTaxHistory.upsert({
    where: { id: `tax-${vehicleId}-${taxPeriod}` },
    update: {
      taxPeriod,
      dueDate,
      paidDate,
      amount,
      notes,
    },
    create: {
      id: `tax-${vehicleId}-${taxPeriod}`,
      vehicleId,
      taxPeriod,
      dueDate,
      paidDate,
      amount,
      notes,
    },
  });
}

async function upsertVehicleServiceHistory(
  vehicleId,
  serviceDate,
  workshopName,
  workDescription,
  cost,
  conditionAfter,
  nextServiceDate,
  notes,
) {
  const id = `svc-${vehicleId}-${serviceDate.toISOString().slice(0, 10)}`;

  return prisma.vehicleServiceHistory.upsert({
    where: { id },
    update: {
      serviceDate,
      workshopName,
      workDescription,
      cost,
      conditionAfter,
      nextServiceDate,
      notes,
    },
    create: {
      id,
      vehicleId,
      serviceDate,
      workshopName,
      workDescription,
      cost,
      conditionAfter,
      nextServiceDate,
      notes,
    },
  });
}

async function main() {
  console.log("Seeding SIASET initial data...");

  const roleAdmin = await upsertRole(UserRoleType.ADMIN, "Admin", "Administrator sistem");
  const rolePJ = await upsertRole(UserRoleType.PJ_RUANGAN, "PJ Ruangan", "Penanggung jawab ruangan");
  const rolePeminjam = await upsertRole(UserRoleType.PEMINJAM, "Peminjam", "Pengguna peminjam aset");
  const rolePimpinan = await upsertRole(UserRoleType.PIMPINAN, "Pimpinan", "Pimpinan institusi");

  const jurusanSeniPertunjukan = await upsertJurusan("JSP", "Jurusan Seni Pertunjukan");
  const jurusanSeniRupaDesain = await upsertJurusan("JSRD", "Jurusan Seni Rupa dan Desain");

  const prodis = {};

  prodis.seniTari = await upsertProdi(jurusanSeniPertunjukan.id, "PST", "Seni Tari", true);
  prodis.seniKarawitan = await upsertProdi(jurusanSeniPertunjukan.id, "PSK", "Seni Karawitan", true);
  prodis.seniTeater = await upsertProdi(jurusanSeniPertunjukan.id, "PTE", "Seni Teater", true);
  prodis.kajianSastraBudaya = await upsertProdi(jurusanSeniPertunjukan.id, "PKSB", "Kajian Sastra dan Budaya", true);
  prodis.bahasaAceh = await upsertProdi(jurusanSeniPertunjukan.id, "PBA", "Bahasa Aceh", true);
  prodis.sejarah = await upsertProdi(jurusanSeniPertunjukan.id, "PSJ", "Sejarah", false);
  prodis.bahasaMandarin = await upsertProdi(jurusanSeniPertunjukan.id, "PBM", "Bahasa Mandarin", false);
  prodis.seniRupaMurni = await upsertProdi(jurusanSeniRupaDesain.id, "PSRM", "Seni Rupa Murni", true);
  prodis.kriyaSeni = await upsertProdi(jurusanSeniRupaDesain.id, "PKS", "Kriya Seni", true);
  prodis.dkv = await upsertProdi(jurusanSeniRupaDesain.id, "PDKV", "Desain Komunikasi Visual", true);
  prodis.desainInterior = await upsertProdi(jurusanSeniRupaDesain.id, "PDI", "Desain Interior", true);

  const units = {};

  units.sarpras = await upsertUnit("SARPRAS", "Bagian Perencanaan, Keuangan, dan Umum", UnitType.SARPRAS);
  units.akademik = await upsertUnit("AKD", "Bagian Akademik dan Kemahasiswaan", UnitType.ADMINISTRASI);
  units.upaBahasa = await upsertUnit("UPABHS", "UPA Bahasa", UnitType.UPA);
  units.upaTik = await upsertUnit("UPATIK", "UPA TIK", UnitType.UPA);
  units.perpustakaan = await upsertUnit("PERPUS", "Perpustakaan ISBI Aceh", UnitType.PERPUSTAKAAN);
  units.jsp = await upsertUnit("JSP", "Jurusan Seni Pertunjukan", UnitType.JURUSAN);
  units.jsrd = await upsertUnit("JSRD", "Jurusan Seni Rupa dan Desain", UnitType.JURUSAN);
  units.prodiSeniTari = await upsertUnit("UNIT-PST", "Prodi Seni Tari", UnitType.PRODI);
  units.prodiSeniKarawitan = await upsertUnit("UNIT-PSK", "Prodi Seni Karawitan", UnitType.PRODI);
  units.prodiSeniTeater = await upsertUnit("UNIT-PTE", "Prodi Seni Teater", UnitType.PRODI);
  units.prodiSeniRupaMurni = await upsertUnit("UNIT-PSRM", "Prodi Seni Rupa Murni", UnitType.PRODI);
  units.prodiKriyaSeni = await upsertUnit("UNIT-PKS", "Prodi Kriya Seni", UnitType.PRODI);
  units.prodiDKV = await upsertUnit("UNIT-PDKV", "Prodi DKV", UnitType.PRODI);
  units.prodiDesainInterior = await upsertUnit("UNIT-PDI", "Prodi Desain Interior", UnitType.PRODI);

  await prisma.user.upsert({
    where: { username: "admin.siaset" },
    update: {
      roleId: roleAdmin.id,
      unitId: units.sarpras.id,
      name: "Admin SIASET",
      email: "admin.siaset@isbiaceh.ac.id",
      isActive: true,
    },
    create: {
      roleId: roleAdmin.id,
      unitId: units.sarpras.id,
      name: "Admin SIASET",
      username: "admin.siaset",
      email: "admin.siaset@isbiaceh.ac.id",
      passwordHash: "CHANGE_ME",
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: { username: "pimpinan.isbi" },
    update: {
      roleId: rolePimpinan.id,
      unitId: units.sarpras.id,
      name: "Pimpinan ISBI Aceh",
      email: "pimpinan@isbiaceh.ac.id",
      isActive: true,
    },
    create: {
      roleId: rolePimpinan.id,
      unitId: units.sarpras.id,
      name: "Pimpinan ISBI Aceh",
      username: "pimpinan.isbi",
      email: "pimpinan@isbiaceh.ac.id",
      passwordHash: "CHANGE_ME",
      isActive: true,
    },
  });

  const kampusUtama = await upsertKampus("KU", "Kampus Utama", "ISBI Aceh - Gedung Utama");
  const kampusC = await upsertKampus("KC", "Kampus C", "ISBI Aceh - Kampus C");

  const gedungUtama = await upsertGedung(kampusUtama.id, "G1", "Gedung Utama");
  const gedungG13 = await upsertGedung(kampusC.id, "G13", "Gedung G13");

  const ruangKuliah = await upsertRoom({
    kampusId: kampusUtama.id,
    gedungId: gedungUtama.id,
    unitPenanggungJawabId: units.sarpras.id,
    lantai: "1",
    code: "G1-RK-01",
    name: "Ruang Kuliah",
    roomType: "Akademik",
    usageType: RoomUsageType.SHARED,
    areaM2: "72.00",
    capacity: 40,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Ruang Kuliah",
    managerType: ManagerType.INSTITUSI,
    managerReferenceId: null,
    isActive: true,
    notes: "Ruang pendukung umum untuk seluruh prodi",
  });

  const ruangDosen = await upsertRoom({
    kampusId: kampusUtama.id,
    gedungId: gedungUtama.id,
    unitPenanggungJawabId: units.sarpras.id,
    lantai: "1",
    code: "G1-RD-01",
    name: "Ruang Dosen",
    roomType: "Akademik",
    usageType: RoomUsageType.SHARED,
    areaM2: "60.00",
    capacity: 20,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Ruang Dosen",
    managerType: ManagerType.INSTITUSI,
    managerReferenceId: null,
    isActive: true,
    notes: "Ruang dosen bersama untuk lintas prodi",
  });

  const perpustakaan = await upsertRoom({
    kampusId: kampusUtama.id,
    gedungId: gedungUtama.id,
    unitPenanggungJawabId: units.perpustakaan.id,
    lantai: "1",
    code: "G1-PR-01",
    name: "Perpustakaan",
    roomType: "Akademik/Umum",
    usageType: RoomUsageType.SHARED,
    areaM2: "150.00",
    capacity: 80,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Perpustakaan",
    managerType: ManagerType.UNIT,
    managerReferenceId: units.perpustakaan.id,
    isActive: true,
    notes: "Ruang pendukung akademik untuk seluruh prodi",
  });

  const labBahasa = await upsertRoom({
    kampusId: kampusUtama.id,
    gedungId: gedungUtama.id,
    unitPenanggungJawabId: units.upaBahasa.id,
    lantai: "1",
    code: "G1-LB-01",
    name: "Lab Bahasa",
    roomType: "Laboratorium",
    usageType: RoomUsageType.MIXED,
    areaM2: "90.00",
    capacity: 30,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Lab Bahasa",
    managerType: ManagerType.UNIT,
    managerReferenceId: units.upaBahasa.id,
    isActive: true,
    notes: "Berbeda dari studio/lab di Gedung G13 Kampus C",
  });

  const smartClassroom = await upsertRoom({
    kampusId: kampusUtama.id,
    gedungId: gedungUtama.id,
    unitPenanggungJawabId: units.upaTik.id,
    lantai: "1",
    code: "G1-SC-01",
    name: "Smart Classroom",
    roomType: "Akademik",
    usageType: RoomUsageType.SHARED,
    areaM2: "85.00",
    capacity: 35,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Smart Classroom",
    managerType: ManagerType.UNIT,
    managerReferenceId: units.upaTik.id,
    isActive: true,
    notes: "Ruang pendukung teknologi pembelajaran",
  });

  const labTik = await upsertRoom({
    kampusId: kampusUtama.id,
    gedungId: gedungUtama.id,
    unitPenanggungJawabId: units.upaTik.id,
    lantai: "1",
    code: "G1-LT-01",
    name: "Lab TIK",
    roomType: "Laboratorium",
    usageType: RoomUsageType.SHARED,
    areaM2: "95.00",
    capacity: 32,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.SUDAH,
    responsiblePicName: "PIC Lab TIK",
    managerType: ManagerType.UNIT,
    managerReferenceId: units.upaTik.id,
    isActive: true,
    notes: "Lab TIK untuk kebutuhan umum kampus",
  });

  const studioTari = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiSeniTari.id,
    lantai: "1",
    code: "G13-ST-01",
    name: "Studio Tari",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "120.00",
    capacity: 35,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio Tari",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.seniTari.id,
    isActive: true,
    notes: "Ruang inti Prodi Seni Tari",
  });

  const studioKarawitan = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiSeniKarawitan.id,
    lantai: "1",
    code: "G13-SK-01",
    name: "Studio Karawitan",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "110.00",
    capacity: 30,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio Karawitan",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.seniKarawitan.id,
    isActive: true,
    notes: "Ruang inti Prodi Seni Karawitan",
  });

  const studioTeater = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiSeniTeater.id,
    lantai: "1",
    code: "G13-STR-01",
    name: "Studio Teater",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "125.00",
    capacity: 40,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio Teater",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.seniTeater.id,
    isActive: true,
    notes: "Ruang inti Prodi Seni Teater",
  });

  const studioLabBahasaKsb = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.jsp.id,
    lantai: "1",
    code: "G13-LBKSB-01",
    name: "Studio/Lab Bahasa dan Kajian Sastra Budaya",
    roomType: "Studio/Lab",
    usageType: RoomUsageType.MIXED,
    areaM2: "100.00",
    capacity: 28,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio/Lab Bahasa-KSB",
    managerType: ManagerType.JURUSAN,
    managerReferenceId: jurusanSeniPertunjukan.id,
    isActive: true,
    notes: "Ruang bersama untuk Bahasa Aceh dan Kajian Sastra dan Budaya di G13",
  });

  const studioSeniRupaMurni = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiSeniRupaMurni.id,
    lantai: "1",
    code: "G13-SRM-01",
    name: "Studio Seni Rupa Murni",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "130.00",
    capacity: 32,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio Seni Rupa Murni",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.seniRupaMurni.id,
    isActive: true,
    notes: "Ruang inti Prodi Seni Rupa Murni",
  });

  const studioKriyaSeni = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiKriyaSeni.id,
    lantai: "1",
    code: "G13-KS-01",
    name: "Studio Kriya Seni",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "128.00",
    capacity: 30,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio Kriya Seni",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.kriyaSeni.id,
    isActive: true,
    notes: "Ruang inti Prodi Kriya Seni",
  });

  const studioDkv = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiDKV.id,
    lantai: "1",
    code: "G13-DKV-01",
    name: "Studio DKV",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "118.00",
    capacity: 30,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio DKV",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.dkv.id,
    isActive: true,
    notes: "Ruang inti Prodi DKV",
  });

  const studioDesainInterior = await upsertRoom({
    kampusId: kampusC.id,
    gedungId: gedungG13.id,
    unitPenanggungJawabId: units.prodiDesainInterior.id,
    lantai: "1",
    code: "G13-DI-01",
    name: "Studio Desain Interior",
    roomType: "Studio",
    usageType: RoomUsageType.DEDICATED,
    areaM2: "122.00",
    capacity: 30,
    ownershipStatus: RoomOwnershipStatus.BMN,
    dbrStatus: DBRStatus.BELUM,
    responsiblePicName: "PIC Studio Desain Interior",
    managerType: ManagerType.PRODI,
    managerReferenceId: prodis.desainInterior.id,
    isActive: true,
    notes: "Ruang inti Prodi Desain Interior",
  });

  const sharedProdis = Object.values(prodis);
  for (const prodi of sharedProdis) {
    await upsertRoomUsage(ruangKuliah.id, prodi.id, RoomUsageRole.PENDUKUNG_AKREDITASI, "Ruang kuliah bersama");
    await upsertRoomUsage(ruangDosen.id, prodi.id, RoomUsageRole.PENDUKUNG_AKREDITASI, "Ruang dosen bersama");
    await upsertRoomUsage(perpustakaan.id, prodi.id, RoomUsageRole.PENDUKUNG_AKREDITASI, "Perpustakaan institusi");
  }

  await upsertRoomUsage(labBahasa.id, prodis.bahasaAceh.id, RoomUsageRole.PENGGUNA, "Pengguna utama Lab Bahasa");
  await upsertRoomUsage(labBahasa.id, prodis.kajianSastraBudaya.id, RoomUsageRole.PENGGUNA, "Pengguna bersama Lab Bahasa");
  await upsertRoomUsage(labTik.id, prodis.sejarah.id, RoomUsageRole.PENDUKUNG_AKREDITASI, "Lab TIK sebagai ruang pendukung");
  await upsertRoomUsage(labTik.id, prodis.bahasaMandarin.id, RoomUsageRole.PENDUKUNG_AKREDITASI, "Lab TIK sebagai ruang pendukung");
  await upsertRoomUsage(studioTari.id, prodis.seniTari.id, RoomUsageRole.UTAMA, "Studio inti Prodi Seni Tari");
  await upsertRoomUsage(studioKarawitan.id, prodis.seniKarawitan.id, RoomUsageRole.UTAMA, "Studio inti Prodi Seni Karawitan");
  await upsertRoomUsage(studioTeater.id, prodis.seniTeater.id, RoomUsageRole.UTAMA, "Studio inti Prodi Seni Teater");
  await upsertRoomUsage(studioLabBahasaKsb.id, prodis.bahasaAceh.id, RoomUsageRole.PENGGUNA, "Studio/lab bersama di G13");
  await upsertRoomUsage(studioLabBahasaKsb.id, prodis.kajianSastraBudaya.id, RoomUsageRole.PENGGUNA, "Studio/lab bersama di G13");
  await upsertRoomUsage(studioSeniRupaMurni.id, prodis.seniRupaMurni.id, RoomUsageRole.UTAMA, "Studio inti Prodi Seni Rupa Murni");
  await upsertRoomUsage(studioKriyaSeni.id, prodis.kriyaSeni.id, RoomUsageRole.UTAMA, "Studio inti Prodi Kriya Seni");
  await upsertRoomUsage(studioDkv.id, prodis.dkv.id, RoomUsageRole.UTAMA, "Studio inti Prodi DKV");
  await upsertRoomUsage(studioDesainInterior.id, prodis.desainInterior.id, RoomUsageRole.UTAMA, "Studio inti Prodi Desain Interior");

  const assetLaptop = await upsertAsset({
    code: "BMN-001",
    nup: "001/2022",
    name: "Laptop Dell Inspiron 15",
    category: "Peralatan TI",
    assetType: AssetType.UMUM,
    ownershipType: AssetOwnershipType.SHARED,
    condition: AssetCondition.BAIK,
    status: AssetStatus.TERSEDIA,
    acquisitionValue: "12500000",
    acquisitionYear: 2022,
    specification: "Laptop operasional inventaris",
    sourceData: "SEED",
    ruanganId: ruangDosen.id,
    unitPenanggungJawabId: units.sarpras.id,
  });

  const assetCamera = await upsertAsset({
    code: "BMN-005",
    nup: "005/2023",
    name: "Kamera Canon EOS 800D",
    category: "Peralatan Seni",
    assetType: AssetType.UMUM,
    ownershipType: AssetOwnershipType.DEDICATED,
    condition: AssetCondition.BAIK,
    status: AssetStatus.TERSEDIA,
    acquisitionValue: "9800000",
    acquisitionYear: 2023,
    specification: "Kamera dokumentasi akademik",
    sourceData: "SEED",
    ruanganId: studioLabBahasaKsb.id,
    prodiOwnerId: prodis.bahasaAceh.id,
    unitPenanggungJawabId: units.jsp.id,
  });

  const assetVehicle1 = await upsertAsset({
    code: "BMN-KDR-001",
    nup: "KDR/001/2020",
    name: "Toyota Avanza 2020",
    category: "Kendaraan Dinas",
    assetType: AssetType.KENDARAAN,
    ownershipType: AssetOwnershipType.SHARED,
    condition: AssetCondition.BAIK,
    status: AssetStatus.TERSEDIA,
    acquisitionValue: "215000000",
    acquisitionYear: 2020,
    specification: "Mobil dinas operasional",
    sourceData: "SEED",
    unitPenanggungJawabId: units.sarpras.id,
  });

  const assetVehicle2 = await upsertAsset({
    code: "BMN-KDR-002",
    nup: "KDR/002/2019",
    name: "Toyota Innova 2019",
    category: "Kendaraan Dinas",
    assetType: AssetType.KENDARAAN,
    ownershipType: AssetOwnershipType.SHARED,
    condition: AssetCondition.BAIK,
    status: AssetStatus.TERSEDIA,
    acquisitionValue: "325000000",
    acquisitionYear: 2019,
    specification: "Mobil dinas pimpinan/operasional",
    sourceData: "SEED",
    unitPenanggungJawabId: units.sarpras.id,
  });

  const vehicle1 = await upsertVehicle(assetVehicle1.id, {
    plateNumber: "BL 1234 AB",
    bpkbNumber: "BPKB-AVANZA-2020",
    stnkNumber: "STNK-AVANZA-2020",
    chassisNumber: "MHFM1BA3JK012345",
    engineNumber: "1NRF123456",
    brand: "Toyota",
    model: "Avanza 2020",
    manufactureYear: 2020,
    taxDueDate: new Date("2026-07-15T00:00:00.000Z"),
    stnkDueDate: new Date("2026-07-15T00:00:00.000Z"),
    lastServiceDate: new Date("2026-03-15T00:00:00.000Z"),
    nextServiceDate: new Date("2026-04-15T00:00:00.000Z"),
    vehicleStatus: VehicleStatus.AKTIF,
    parkingLocation: "Area parkir Gedung Utama",
    notes: "Contoh kendaraan BMN dengan reminder pajak prioritas",
  });

  const vehicle2 = await upsertVehicle(assetVehicle2.id, {
    plateNumber: "BL 5678 CD",
    bpkbNumber: "BPKB-INNOVA-2019",
    stnkNumber: "STNK-INNOVA-2019",
    chassisNumber: "MHFYX59G7K098765",
    engineNumber: "2KDF987654",
    brand: "Toyota",
    model: "Innova 2019",
    manufactureYear: 2019,
    taxDueDate: new Date("2026-08-20T00:00:00.000Z"),
    stnkDueDate: new Date("2026-08-20T00:00:00.000Z"),
    lastServiceDate: new Date("2026-04-01T00:00:00.000Z"),
    nextServiceDate: new Date("2026-05-01T00:00:00.000Z"),
    vehicleStatus: VehicleStatus.AKTIF,
    parkingLocation: "Area parkir pimpinan",
    notes: "Contoh kendaraan BMN dengan status pajak aman",
  });

  await upsertVehicleTaxHistory(
    vehicle1.id,
    "2026",
    new Date("2026-07-15T00:00:00.000Z"),
    null,
    "3500000",
    "Belum dibayar - contoh reminder H-30",
  );

  await upsertVehicleTaxHistory(
    vehicle2.id,
    "2026",
    new Date("2026-08-20T00:00:00.000Z"),
    new Date("2026-04-10T00:00:00.000Z"),
    "4200000",
    "Sudah dibayar lebih awal",
  );

  await upsertVehicleServiceHistory(
    vehicle1.id,
    new Date("2026-03-15T00:00:00.000Z"),
    "Bengkel Toyota Banda Aceh",
    "Service rutin, ganti oli, cek rem",
    "1250000",
    "Baik",
    new Date("2026-04-15T00:00:00.000Z"),
    "Service bulanan kendaraan operasional",
  );

  await upsertVehicleServiceHistory(
    vehicle2.id,
    new Date("2026-04-01T00:00:00.000Z"),
    "Bengkel Resmi Toyota",
    "Tune up dan pengecekan berkala",
    "980000",
    "Baik",
    new Date("2026-05-01T00:00:00.000Z"),
    "Kendaraan siap operasional",
  );

  await prisma.activityLog.create({
    data: {
      action: "SEED_INITIAL_DATA",
      entityType: "SYSTEM",
      entityId: null,
      description: "Seed awal SIASET berhasil dijalankan",
      metadata: {
        roles: 4,
        jurusan: 2,
        prodi: 11,
        units: Object.keys(units).length,
        rooms: 12,
        sampleAssets: 4,
        sampleVehicles: 2,
      },
    },
  });

  console.log("Seed selesai.");
  console.log({
    roles: [roleAdmin.name, rolePJ.name, rolePeminjam.name, rolePimpinan.name],
    jurusan: 2,
    prodi: 11,
    sampleAssets: [assetLaptop.code, assetCamera.code, assetVehicle1.code, assetVehicle2.code],
  });
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
