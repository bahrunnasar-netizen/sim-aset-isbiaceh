import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AssetCondition,
  AssetOwnershipType,
  AssetStatus,
  AssetType,
  VehicleStatus,
} from "@prisma/client";
import { buildVehicleReminderDigest, computeVehicleSummary } from "@/lib/vehicle-reminders";

const allowedOwnershipTypes = new Set(Object.values(AssetOwnershipType));
const allowedConditions = new Set(Object.values(AssetCondition));
const allowedStatuses = new Set(Object.values(AssetStatus));
const allowedVehicleStatuses = new Set(Object.values(VehicleStatus));

const vehicleInclude = {
  asset: {
    include: {
      unitPenanggungJawab: true,
    },
  },
  taxHistories: {
    orderBy: [{ dueDate: "desc" }, { createdAt: "desc" }],
  },
  serviceHistories: {
    orderBy: [{ serviceDate: "desc" }, { createdAt: "desc" }],
  },
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

function parseRequiredDate(value, fieldName) {
  if (!value) {
    throw new Error(`${fieldName} wajib diisi.`);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} tidak valid.`);
  }

  return parsed;
}

function parseOptionalDate(value, fieldName) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} tidak valid.`);
  }
  return parsed;
}

async function buildVehiclePayload(body) {
  if (
    !body.assetCode ||
    !body.assetName ||
    !body.category ||
    !body.ownershipType ||
    !body.condition ||
    !body.assetStatus ||
    !body.plateNumber ||
    !body.chassisNumber ||
    !body.engineNumber ||
    !body.brand ||
    !body.taxDueDate ||
    !body.vehicleStatus
  ) {
    throw new Error("Field wajib kendaraan belum lengkap.");
  }

  if (!allowedOwnershipTypes.has(body.ownershipType)) {
    throw new Error("Tipe kepemilikan kendaraan tidak valid.");
  }

  if (!allowedConditions.has(body.condition)) {
    throw new Error("Kondisi kendaraan tidak valid.");
  }

  if (!allowedStatuses.has(body.assetStatus)) {
    throw new Error("Status aset kendaraan tidak valid.");
  }

  if (!allowedVehicleStatuses.has(body.vehicleStatus)) {
    throw new Error("Status kendaraan tidak valid.");
  }

  return {
    assetData: {
      code: String(body.assetCode).trim().toUpperCase(),
      nup: parseNullableString(body.nup),
      name: String(body.assetName).trim(),
      category: String(body.category).trim(),
      assetType: AssetType.KENDARAAN,
      ownershipType: body.ownershipType,
      condition: body.condition,
      status: body.assetStatus,
      acquisitionValue: parseNullableDecimal(body.acquisitionValue, "Nilai perolehan"),
      acquisitionYear: parseNullableInt(body.acquisitionYear, "Tahun perolehan"),
      specification: parseNullableString(body.specification),
      sourceData: parseNullableString(body.sourceData),
      unitPenanggungJawabId: parseNullableString(body.unitPenanggungJawabId),
      ruanganId: null,
      prodiOwnerId: null,
    },
    vehicleData: {
      plateNumber: String(body.plateNumber).trim().toUpperCase(),
      bpkbNumber: parseNullableString(body.bpkbNumber),
      stnkNumber: parseNullableString(body.stnkNumber),
      chassisNumber: String(body.chassisNumber).trim(),
      engineNumber: String(body.engineNumber).trim(),
      brand: String(body.brand).trim(),
      model: parseNullableString(body.model),
      manufactureYear: parseNullableInt(body.manufactureYear, "Tahun kendaraan"),
      taxDueDate: parseRequiredDate(body.taxDueDate, "Jatuh tempo pajak"),
      stnkDueDate: parseOptionalDate(body.stnkDueDate, "Jatuh tempo STNK"),
      lastServiceDate: parseOptionalDate(body.lastServiceDate, "Service terakhir"),
      nextServiceDate: parseOptionalDate(body.nextServiceDate, "Service berikutnya"),
      vehicleStatus: body.vehicleStatus,
      parkingLocation: parseNullableString(body.parkingLocation),
      notes: parseNullableString(body.notes),
    },
  };
}

export async function GET() {
  try {
    const [vehicles, units] = await Promise.all([
      prisma.vehicle.findMany({
        include: vehicleInclude,
        orderBy: [{ taxDueDate: "asc" }, { plateNumber: "asc" }],
      }),
      prisma.unit.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      vehicles,
      units,
      summary: computeVehicleSummary(vehicles),
      reminders: buildVehicleReminderDigest(vehicles),
    });
  } catch (error) {
    console.error("GET /api/master/vehicles failed:", error);
    return NextResponse.json(
      { error: "Gagal memuat data kendaraan BMN." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const payload = await buildVehiclePayload(body);

    const vehicle = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: payload.assetData,
      });

      return tx.vehicle.create({
        data: {
          assetId: asset.id,
          ...payload.vehicleData,
        },
        include: vehicleInclude,
      });
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    console.error("POST /api/master/vehicles failed:", error);

    if (error?.code === "P2002") {
      return badRequest("Kode aset atau nomor polisi sudah digunakan.");
    }

    if (error?.code === "P2003") {
      return badRequest("Unit penanggung jawab kendaraan tidak valid.");
    }

    return badRequest(error?.message || "Gagal menambahkan kendaraan.");
  }
}
