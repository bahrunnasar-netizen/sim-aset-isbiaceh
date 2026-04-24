import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [jurusan, prodi, units] = await Promise.all([
      prisma.jurusan.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.prodi.findMany({
        include: { jurusan: true },
        orderBy: { name: "asc" },
      }),
      prisma.unit.findMany({
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({ jurusan, prodi, units });
  } catch (error) {
    console.error("GET /api/master/organization failed:", error);
    return NextResponse.json(
      { error: "Gagal memuat data master organisasi." },
      { status: 500 },
    );
  }
}
