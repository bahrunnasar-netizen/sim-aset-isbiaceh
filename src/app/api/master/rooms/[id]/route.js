import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  DBRStatus,
  ManagerType,
  RoomOwnershipStatus,
  RoomUsageRole,
  RoomUsageType,
} from "@/generated/prisma";

export const dynamic = "force-dynamic";

const allowedUsageTypes = new Set(Object.values(RoomUsageType));
const allowedOwnershipStatuses = new Set(Object.values(RoomOwnershipStatus));
const allowedDBRStatuses = new Set(Object.values(DBRStatus));
const allowedManagerTypes = new Set(Object.values(ManagerType));
const allowedUsageRoles = new Set(Object.values(RoomUsageRole));

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function parseNullableString(value) {
  if (value === undefined || value === null) return null;
  const parsed = String(value).trim();
  return parsed ? parsed : null;
}

function parseNullableNumber(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} tidak valid.`);
  }

  return parsed;
}

function normalizeProdiUsages(usages = []) {
  const deduped = new Map();

  for (const usage of usages) {
    if (!usage?.prodiId) continue;

    const usageRole = usage.usageRole || RoomUsageRole.PENGGUNA;
    if (!allowedUsageRoles.has(usageRole)) {
      throw new Error("Peran penggunaan prodi tidak valid.");
    }

    deduped.set(usage.prodiId, {
      prodiId: usage.prodiId,
      usageRole,
      isForAccreditation: usage.isForAccreditation ?? true,
      notes: parseNullableString(usage.notes),
    });
  }

  return [...deduped.values()];
}

async function buildRoomPayload(body) {
  if (
    !body.kampusId ||
    !body.gedungId ||
    !body.unitPenanggungJawabId ||
    !body.code ||
    !body.name ||
    !body.roomType ||
    !body.usageType ||
    !body.ownershipStatus ||
    !body.dbrStatus ||
    !body.managerType
  ) {
    throw new Error("Field wajib ruangan belum lengkap.");
  }

  if (!allowedUsageTypes.has(body.usageType)) {
    throw new Error("Jenis penggunaan ruangan tidak valid.");
  }

  if (!allowedOwnershipStatuses.has(body.ownershipStatus)) {
    throw new Error("Status kepemilikan ruangan tidak valid.");
  }

  if (!allowedDBRStatuses.has(body.dbrStatus)) {
    throw new Error("Status DBR ruangan tidak valid.");
  }

  if (!allowedManagerTypes.has(body.managerType)) {
    throw new Error("Tipe pengelola utama ruangan tidak valid.");
  }

  const gedung = await prisma.gedung.findUnique({
    where: { id: body.gedungId },
    select: { id: true, kampusId: true },
  });

  if (!gedung) {
    throw new Error("Gedung tidak ditemukan.");
  }

  if (gedung.kampusId !== body.kampusId) {
    throw new Error("Gedung tidak berada di kampus yang dipilih.");
  }

  const usages = normalizeProdiUsages(body.prodiUsages);

  if (body.usageType === RoomUsageType.DEDICATED && usages.length !== 1) {
    throw new Error("Ruangan dedicated harus terhubung ke tepat 1 prodi.");
  }

  return {
    data: {
      kampusId: body.kampusId,
      gedungId: body.gedungId,
      unitPenanggungJawabId: body.unitPenanggungJawabId,
      picPenanggungJawabUserId: parseNullableString(body.picPenanggungJawabUserId),
      lantai: parseNullableString(body.lantai),
      code: String(body.code).trim().toUpperCase(),
      name: String(body.name).trim(),
      roomType: String(body.roomType).trim(),
      usageType: body.usageType,
      areaM2: parseNullableNumber(body.areaM2, "Luas ruangan"),
      capacity: parseNullableNumber(body.capacity, "Kapasitas ruangan"),
      ownershipStatus: body.ownershipStatus,
      dbrStatus: body.dbrStatus,
      responsiblePicName: parseNullableString(body.responsiblePicName),
      managerType: body.managerType,
      managerReferenceId: parseNullableString(body.managerReferenceId),
      isActive: body.isActive ?? true,
      notes: parseNullableString(body.notes),
    },
    usages,
  };
}

const roomInclude = {
  kampus: true,
  gedung: true,
  unitPenanggungJawab: true,
  picPenanggungJawabUser: {
    select: { id: true, name: true, username: true, nip: true },
  },
  prodiUsages: {
    include: {
      prodi: {
        include: {
          jurusan: true,
        },
      },
    },
    orderBy: [{ usageRole: "asc" }, { prodi: { name: "asc" } }],
  },
};

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();
    const payload = await buildRoomPayload(body);

    const room = await prisma.$transaction(async (tx) => {
      await tx.ruangan.update({
        where: { id },
        data: payload.data,
      });

      await tx.roomProdiUsage.deleteMany({
        where: { ruanganId: id },
      });

      if (payload.usages.length > 0) {
        await tx.roomProdiUsage.createMany({
          data: payload.usages.map((usage) => ({
            ...usage,
            ruanganId: id,
          })),
        });
      }

      return tx.ruangan.findUnique({
        where: { id },
        include: roomInclude,
      });
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error(`PUT /api/master/rooms/${id} failed:`, error);

    if (error?.code === "P2002") {
      return badRequest("Kode ruangan sudah digunakan.");
    }

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Ruangan tidak ditemukan." }, { status: 404 });
    }

    return badRequest(error?.message || "Gagal memperbarui ruangan.");
  }
}

export async function DELETE(_request, { params }) {
  const { id } = params;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.roomProdiUsage.deleteMany({
        where: { ruanganId: id },
      });

      await tx.ruangan.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/master/rooms/${id} failed:`, error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Ruangan tidak ditemukan." }, { status: 404 });
    }

    if (error?.code === "P2003") {
      return badRequest("Ruangan masih dipakai aset atau histori pemindahan.");
    }

    return NextResponse.json(
      { error: "Gagal menghapus ruangan." },
      { status: 500 },
    );
  }
}
