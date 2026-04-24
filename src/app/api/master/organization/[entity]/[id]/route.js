import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UnitType } from "@/generated/prisma";

export const dynamic = "force-dynamic";

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

const allowedUnitTypes = new Set(Object.values(UnitType));

export async function PUT(request, { params }) {
  const { entity, id } = params;

  try {
    const body = await request.json();

    if (entity === "jurusan") {
      if (!body.code || !body.name) {
        return badRequest("Kode dan nama jurusan wajib diisi.");
      }

      const jurusan = await prisma.jurusan.update({
        where: { id },
        data: {
          code: body.code.trim().toUpperCase(),
          name: body.name.trim(),
          isActive: body.isActive ?? true,
        },
      });

      return NextResponse.json(jurusan);
    }

    if (entity === "prodi") {
      if (!body.code || !body.name || !body.jurusanId) {
        return badRequest("Kode, nama, dan jurusan prodi wajib diisi.");
      }

      const prodi = await prisma.prodi.update({
        where: { id },
        data: {
          code: body.code.trim().toUpperCase(),
          name: body.name.trim(),
          jurusanId: body.jurusanId,
          hasDedicatedStudioOrLab: Boolean(body.hasDedicatedStudioOrLab),
          isActive: body.isActive ?? true,
        },
        include: { jurusan: true },
      });

      return NextResponse.json(prodi);
    }

    if (entity === "unit") {
      if (!body.code || !body.name || !body.type) {
        return badRequest("Kode, nama, dan jenis unit wajib diisi.");
      }

      if (!allowedUnitTypes.has(body.type)) {
        return badRequest("Jenis unit tidak valid.");
      }

      const unit = await prisma.unit.update({
        where: { id },
        data: {
          code: body.code.trim().toUpperCase(),
          name: body.name.trim(),
          type: body.type,
          isActive: body.isActive ?? true,
        },
      });

      return NextResponse.json(unit);
    }

    return badRequest("Entitas organisasi tidak dikenali.");
  } catch (error) {
    console.error(`PUT /api/master/organization/${entity}/${id} failed:`, error);

    if (error?.code === "P2002") {
      return badRequest("Data dengan kode yang sama sudah ada.");
    }

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Gagal memperbarui data organisasi." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  const { entity, id } = params;

  try {
    if (entity === "jurusan") {
      await prisma.jurusan.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (entity === "prodi") {
      await prisma.prodi.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    if (entity === "unit") {
      await prisma.unit.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return badRequest("Entitas organisasi tidak dikenali.");
  } catch (error) {
    console.error(`DELETE /api/master/organization/${entity}/${id} failed:`, error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
    }

    if (error?.code === "P2003") {
      return badRequest("Data masih dipakai oleh modul lain dan tidak bisa dihapus.");
    }

    return NextResponse.json(
      { error: "Gagal menghapus data organisasi." },
      { status: 500 },
    );
  }
}
