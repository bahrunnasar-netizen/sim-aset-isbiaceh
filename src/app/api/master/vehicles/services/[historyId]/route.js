import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(_request, { params }) {
  const { historyId } = params;

  try {
    await prisma.vehicleServiceHistory.delete({
      where: { id: historyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/master/vehicles/services/${historyId} failed:`, error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Riwayat service tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Gagal menghapus riwayat service." },
      { status: 500 },
    );
  }
}
