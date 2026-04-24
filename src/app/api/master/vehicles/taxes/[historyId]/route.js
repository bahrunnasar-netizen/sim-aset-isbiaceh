import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request, { params }) {
  const { historyId } = params;

  try {
    await prisma.vehicleTaxHistory.delete({
      where: { id: historyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/master/vehicles/taxes/${historyId} failed:`, error);

    if (error?.code === "P2025") {
      return NextResponse.json({ error: "Riwayat pajak tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Gagal menghapus riwayat pajak." },
      { status: 500 },
    );
  }
}
