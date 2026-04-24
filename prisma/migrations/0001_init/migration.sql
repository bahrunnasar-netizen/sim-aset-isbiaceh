-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RoomUsageType" AS ENUM ('SHARED', 'DEDICATED', 'MIXED');

-- CreateEnum
CREATE TYPE "RoomOwnershipStatus" AS ENUM ('BMN', 'PINJAM_PAKAI', 'HIBAH', 'LAINNYA');

-- CreateEnum
CREATE TYPE "DBRStatus" AS ENUM ('SUDAH', 'BELUM');

-- CreateEnum
CREATE TYPE "ManagerType" AS ENUM ('INSTITUSI', 'JURUSAN', 'PRODI', 'UNIT');

-- CreateEnum
CREATE TYPE "RoomUsageRole" AS ENUM ('UTAMA', 'PENGGUNA', 'PENDUKUNG_AKREDITASI');

-- CreateEnum
CREATE TYPE "AssetOwnershipType" AS ENUM ('SHARED', 'DEDICATED');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('TERSEDIA', 'DIPINJAM', 'DISERAHKAN_BAST', 'TIDAK_AKTIF', 'HILANG');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('UMUM', 'KENDARAAN');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AKTIF', 'RUSAK', 'DIJUAL', 'TIDAK_AKTIF');

-- CreateEnum
CREATE TYPE "UserRoleType" AS ENUM ('ADMIN', 'PJ_RUANGAN', 'PEMINJAM', 'PIMPINAN');

-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('UPA', 'SARPRAS', 'PERPUSTAKAAN', 'JURUSAN', 'PRODI', 'ADMINISTRASI', 'LAINNYA');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "code" "UserRoleType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "unitId" TEXT,
    "jurusanId" TEXT,
    "prodiId" TEXT,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "nip" TEXT,
    "passwordHash" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jurusan" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jurusan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prodi" (
    "id" TEXT NOT NULL,
    "jurusanId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hasDedicatedStudioOrLab" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "UnitType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kampus" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kampus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gedung" (
    "id" TEXT NOT NULL,
    "kampusId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gedung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ruangan" (
    "id" TEXT NOT NULL,
    "kampusId" TEXT NOT NULL,
    "gedungId" TEXT NOT NULL,
    "unitPenanggungJawabId" TEXT NOT NULL,
    "picPenanggungJawabUserId" TEXT,
    "lantai" TEXT,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "roomType" TEXT NOT NULL,
    "usageType" "RoomUsageType" NOT NULL,
    "areaM2" DECIMAL(10,2),
    "capacity" INTEGER,
    "ownershipStatus" "RoomOwnershipStatus" NOT NULL,
    "dbrStatus" "DBRStatus" NOT NULL,
    "responsiblePicName" TEXT,
    "managerType" "ManagerType" NOT NULL,
    "managerReferenceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ruangan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomProdiUsage" (
    "id" TEXT NOT NULL,
    "ruanganId" TEXT NOT NULL,
    "prodiId" TEXT NOT NULL,
    "usageRole" "RoomUsageRole" NOT NULL,
    "isForAccreditation" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomProdiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "ruanganId" TEXT,
    "prodiOwnerId" TEXT,
    "unitPenanggungJawabId" TEXT,
    "code" TEXT NOT NULL,
    "nup" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL DEFAULT 'UMUM',
    "ownershipType" "AssetOwnershipType" NOT NULL,
    "condition" "AssetCondition" NOT NULL,
    "status" "AssetStatus" NOT NULL,
    "acquisitionValue" DECIMAL(18,2),
    "acquisitionYear" INTEGER,
    "specification" TEXT,
    "sourceData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "bpkbNumber" TEXT,
    "stnkNumber" TEXT,
    "chassisNumber" TEXT NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT,
    "manufactureYear" INTEGER,
    "taxDueDate" TIMESTAMP(3) NOT NULL,
    "stnkDueDate" TIMESTAMP(3),
    "lastServiceDate" TIMESTAMP(3),
    "nextServiceDate" TIMESTAMP(3),
    "vehicleStatus" "VehicleStatus" NOT NULL DEFAULT 'AKTIF',
    "parkingLocation" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleTaxHistory" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "taxPeriod" TEXT,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "amount" DECIMAL(18,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleTaxHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleServiceHistory" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "workshopName" TEXT,
    "workDescription" TEXT NOT NULL,
    "cost" DECIMAL(18,2),
    "conditionAfter" TEXT,
    "nextServiceDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleServiceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetPhoto" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "cloudinaryPublicId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetTransferHistory" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "fromRoomId" TEXT,
    "toRoomId" TEXT,
    "fromUnitId" TEXT,
    "toUnitId" TEXT,
    "handledByUserId" TEXT,
    "movedAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetTransferHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "User_unitId_idx" ON "User"("unitId");

-- CreateIndex
CREATE INDEX "User_jurusanId_idx" ON "User"("jurusanId");

-- CreateIndex
CREATE INDEX "User_prodiId_idx" ON "User"("prodiId");

-- CreateIndex
CREATE UNIQUE INDEX "Jurusan_code_key" ON "Jurusan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Prodi_code_key" ON "Prodi"("code");

-- CreateIndex
CREATE INDEX "Prodi_jurusanId_idx" ON "Prodi"("jurusanId");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_code_key" ON "Unit"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Kampus_code_key" ON "Kampus"("code");

-- CreateIndex
CREATE INDEX "Gedung_kampusId_idx" ON "Gedung"("kampusId");

-- CreateIndex
CREATE UNIQUE INDEX "Gedung_kampusId_code_key" ON "Gedung"("kampusId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Ruangan_code_key" ON "Ruangan"("code");

-- CreateIndex
CREATE INDEX "Ruangan_kampusId_idx" ON "Ruangan"("kampusId");

-- CreateIndex
CREATE INDEX "Ruangan_gedungId_idx" ON "Ruangan"("gedungId");

-- CreateIndex
CREATE INDEX "Ruangan_unitPenanggungJawabId_idx" ON "Ruangan"("unitPenanggungJawabId");

-- CreateIndex
CREATE INDEX "Ruangan_picPenanggungJawabUserId_idx" ON "Ruangan"("picPenanggungJawabUserId");

-- CreateIndex
CREATE INDEX "Ruangan_usageType_idx" ON "Ruangan"("usageType");

-- CreateIndex
CREATE INDEX "Ruangan_name_idx" ON "Ruangan"("name");

-- CreateIndex
CREATE INDEX "RoomProdiUsage_prodiId_idx" ON "RoomProdiUsage"("prodiId");

-- CreateIndex
CREATE UNIQUE INDEX "RoomProdiUsage_ruanganId_prodiId_key" ON "RoomProdiUsage"("ruanganId", "prodiId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");

-- CreateIndex
CREATE INDEX "Asset_ruanganId_idx" ON "Asset"("ruanganId");

-- CreateIndex
CREATE INDEX "Asset_prodiOwnerId_idx" ON "Asset"("prodiOwnerId");

-- CreateIndex
CREATE INDEX "Asset_unitPenanggungJawabId_idx" ON "Asset"("unitPenanggungJawabId");

-- CreateIndex
CREATE INDEX "Asset_assetType_idx" ON "Asset"("assetType");

-- CreateIndex
CREATE INDEX "Asset_ownershipType_idx" ON "Asset"("ownershipType");

-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status");

-- CreateIndex
CREATE INDEX "Asset_condition_idx" ON "Asset"("condition");

-- CreateIndex
CREATE INDEX "Asset_name_idx" ON "Asset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_assetId_key" ON "Vehicle"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE INDEX "Vehicle_taxDueDate_idx" ON "Vehicle"("taxDueDate");

-- CreateIndex
CREATE INDEX "Vehicle_stnkDueDate_idx" ON "Vehicle"("stnkDueDate");

-- CreateIndex
CREATE INDEX "Vehicle_nextServiceDate_idx" ON "Vehicle"("nextServiceDate");

-- CreateIndex
CREATE INDEX "Vehicle_vehicleStatus_idx" ON "Vehicle"("vehicleStatus");

-- CreateIndex
CREATE INDEX "VehicleTaxHistory_vehicleId_idx" ON "VehicleTaxHistory"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleTaxHistory_dueDate_idx" ON "VehicleTaxHistory"("dueDate");

-- CreateIndex
CREATE INDEX "VehicleTaxHistory_paidDate_idx" ON "VehicleTaxHistory"("paidDate");

-- CreateIndex
CREATE INDEX "VehicleServiceHistory_vehicleId_idx" ON "VehicleServiceHistory"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleServiceHistory_serviceDate_idx" ON "VehicleServiceHistory"("serviceDate");

-- CreateIndex
CREATE INDEX "VehicleServiceHistory_nextServiceDate_idx" ON "VehicleServiceHistory"("nextServiceDate");

-- CreateIndex
CREATE INDEX "AssetPhoto_assetId_idx" ON "AssetPhoto"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "AssetPhoto_assetId_sortOrder_key" ON "AssetPhoto"("assetId", "sortOrder");

-- CreateIndex
CREATE INDEX "AssetTransferHistory_assetId_idx" ON "AssetTransferHistory"("assetId");

-- CreateIndex
CREATE INDEX "AssetTransferHistory_fromRoomId_idx" ON "AssetTransferHistory"("fromRoomId");

-- CreateIndex
CREATE INDEX "AssetTransferHistory_toRoomId_idx" ON "AssetTransferHistory"("toRoomId");

-- CreateIndex
CREATE INDEX "AssetTransferHistory_handledByUserId_idx" ON "AssetTransferHistory"("handledByUserId");

-- CreateIndex
CREATE INDEX "AssetTransferHistory_movedAt_idx" ON "AssetTransferHistory"("movedAt");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "Jurusan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prodi" ADD CONSTRAINT "Prodi_jurusanId_fkey" FOREIGN KEY ("jurusanId") REFERENCES "Jurusan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gedung" ADD CONSTRAINT "Gedung_kampusId_fkey" FOREIGN KEY ("kampusId") REFERENCES "Kampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_kampusId_fkey" FOREIGN KEY ("kampusId") REFERENCES "Kampus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_gedungId_fkey" FOREIGN KEY ("gedungId") REFERENCES "Gedung"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_unitPenanggungJawabId_fkey" FOREIGN KEY ("unitPenanggungJawabId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruangan" ADD CONSTRAINT "Ruangan_picPenanggungJawabUserId_fkey" FOREIGN KEY ("picPenanggungJawabUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProdiUsage" ADD CONSTRAINT "RoomProdiUsage_ruanganId_fkey" FOREIGN KEY ("ruanganId") REFERENCES "Ruangan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomProdiUsage" ADD CONSTRAINT "RoomProdiUsage_prodiId_fkey" FOREIGN KEY ("prodiId") REFERENCES "Prodi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_ruanganId_fkey" FOREIGN KEY ("ruanganId") REFERENCES "Ruangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_prodiOwnerId_fkey" FOREIGN KEY ("prodiOwnerId") REFERENCES "Prodi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_unitPenanggungJawabId_fkey" FOREIGN KEY ("unitPenanggungJawabId") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleTaxHistory" ADD CONSTRAINT "VehicleTaxHistory_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleServiceHistory" ADD CONSTRAINT "VehicleServiceHistory_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPhoto" ADD CONSTRAINT "AssetPhoto_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransferHistory" ADD CONSTRAINT "AssetTransferHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransferHistory" ADD CONSTRAINT "AssetTransferHistory_fromRoomId_fkey" FOREIGN KEY ("fromRoomId") REFERENCES "Ruangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransferHistory" ADD CONSTRAINT "AssetTransferHistory_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Ruangan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetTransferHistory" ADD CONSTRAINT "AssetTransferHistory_handledByUserId_fkey" FOREIGN KEY ("handledByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
