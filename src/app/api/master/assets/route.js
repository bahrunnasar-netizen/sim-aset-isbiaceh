import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AssetCondition,
  AssetOwnershipType,
  AssetStatus,
  AssetType,
} from "@prisma/client";

export const dynamic = "force-dynamic";

const allowedOwnershipTypes = new Set(Object.values(AssetOwnershipType));
const allowedConditions = new Set(Object.values(AssetCondition));
const allowedStatuses = new Set(Object.values(AssetStatus));
const allowedAssetTypes = new Set(Object.values(AssetType));

const assetInclude = {
  ruangan: {
    include: {
      kampus: true,
      gedung: true,
    },
  },
  prodiOwner: {
    include: {
      jurusan: true,
    },
  },
  unitPenanggungJawab: true,
  photos: {
    orderBy: { sortOrder: "asc" },
  },
  vehicle: true,
};

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function parseNullableString(value) {
  if (value === undefined || value === null) return null;
  const parsed = String(value).trim();
  return parsed ? parsed : null;
}

function parseNullableInt(value, fieldName) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number.parseInt(String(value), 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} tidak valid.`);
  }
  return parsed;
}

function parseNullableDecimal(value, fieldName) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} tidak valid.`);
  }
  return parsed;
}

async function buildAssetPayload(body) {
  if (
    !body.code ||
    !body.name ||
    !body.category ||
    !body.assetType ||
    !body.ownershipType ||
    !body.condition ||
    !body.status
  ) {
    throw new Error("Field wajib aset belum lengkap.");
  }

  if (!allowedAssetTypes.has(body.assetType)) {
    throw new Error("Tipe aset tidak valid.");
  }

  if (!allowedOwnershipTypes.has(body.ownershipType)) {
    throw new Error("Tipe kepemilikan aset tidak valid.");
  }

  if (!allowedConditions.has(body.condition)) {
    throw new Error("Kondisi aset tidak valid.");
  }

  if (!allowedStatuses.has(body.status)) {
    throw new Error("Status aset tidak valid.");
  }

  if (body.assetType === AssetType.KENDARAAN) {
    throw new Error("CRUD Master Aset ini fokus untuk aset umum. Kendaraan dikelola di modul kendaraan.");
  }

  if (body.ownershipType === AssetOwnershipType.DEDICATED && !body.prodiOwnerId) {
    throw new Error("Aset dedicated wajib punya prodi pemilik.");
  }

  return {
    code: String(body.code).trim().toUpperCase(),
    nup: parseNullableString(body.nup),
    name: String(body.name).trim(),
    category: String(body.category).trim(),
    assetType: body.assetType,
    ownershipType: body.ownershipType,
    condition: body.condition,
    status: body.status,
    acquisitionValue: parseNullableDecimal(body.acquisitionValue, "Nilai perolehan"),
    acquisitionYear: parseNullableInt(body.acquisitionYear, "Tahun perolehan"),
    specification: parseNullableString(body.specification),
    sourceData: parseNullableString(body.sourceData),
    ruanganId: parseNullableString(body.ruanganId),
    prodiOwnerId:
      body.ownershipType === AssetOwnershipType.DEDICATED
        ? parseNullableString(body.prodiOwnerId)
        : null,
    unitPenanggungJawabId: parseNullableString(body.unitPenanggungJawabId),
  };
}

export async function GET() {
  try {
    const [assets, rooms, prodi, units] = await Promise.all([
      prisma.asset.findMany({
        where: {
          assetType: AssetType.UMUM,
        },
        include: assetInclude,
        orderBy: { name: "asc" },
      }),
      prisma.ruangan.findMany({
        include: {
          kampus: true,
          gedung: true,
        },
        orderBy: [{ kampus: { name: "asc" } }, { gedung: { name: "asc" } }, { name: "asc" }],
      }),
      prisma.prodi.findMany({
        include: { jurusan: true },
        orderBy: [{ jurusan: { name: "asc" } }, { name: "asc" }],
      }),
      prisma.unit.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ assets, rooms, prodi, units });
  } catch (error) {
    console.error("GET /api/master/assets failed:", error);
    return NextResponse.json(
      { error: "Gagal memuat data master aset." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = await buildAssetPayload(body);

    const asset = await prisma.asset.create({
      data: payload,
      include: assetInclude,
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error("POST /api/master/assets failed:", error);

    if (error?.code === "P2002") {
      return badRequest("Kode aset sudah digunakan.");
    }

    if (error?.code === "P2003") {
      return badRequest("Relasi ruangan, unit, atau prodi tidak valid.");
    }

    return badRequest(error?.message || "Gagal menambahkan aset.");
  }
}
