import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UnitType } from "@prisma/client";

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

const allowedUnitTypes = new Set(Object.values(UnitType));

export async function POST(request, { params }) {
  const { entity } = params;

  try {
    const body = await request.json();

    if (entity === "jurusan") {
      if (!body.code || !body.name) {
        return badRequest("Kode dan nama jurusan wajib diisi.");
      }

      const jurusan = await prisma.jurusan.create({
        data: {
          code: body.code.trim().toUpperCase(),
          name: body.name.trim(),
          isActive: body.isActive ?? true,
        },
      });

      return NextResponse.json(jurusan, { status: 201 });
    }

    if (entity === "prodi") {
      if (!body.code || !body.name || !body.jurusanId) {
        return badRequest("Kode, nama, dan jurusan prodi wajib diisi.");
      }

      const prodi = await prisma.prodi.create({
        data: {
          code: body.code.trim().toUpperCase(),
          name: body.name.trim(),
          jurusanId: body.jurusanId,
          hasDedicatedStudioOrLab: Boolean(body.hasDedicatedStudioOrLab),
          isActive: body.isActive ?? true,
        },
        include: { jurusan: true },
      });

      return NextResponse.json(prodi, { status: 201 });
    }

    if (entity === "unit") {
      if (!body.code || !body.name || !body.type) {
        return badRequest("Kode, nama, dan jenis unit wajib diisi.");
      }

      if (!allowedUnitTypes.has(body.type)) {
        return badRequest("Jenis unit tidak valid.");
      }

      const unit = await prisma.unit.create({
        data: {
          code: body.code.trim().toUpperCase(),
          name: body.name.trim(),
          type: body.type,
          isActive: body.isActive ?? true,
        },
      });

      return NextResponse.json(unit, { status: 201 });
    }

    return badRequest("Entitas organisasi tidak dikenali.");
  } catch (error) {
    console.error(`POST /api/master/organization/${entity} failed:`, error);

    if (error?.code === "P2002") {
      return badRequest("Data dengan kode yang sama sudah ada.");
    }

    return NextResponse.json(
      { error: "Gagal menambahkan data organisasi." },
      { status: 500 },
    );
  }
}
