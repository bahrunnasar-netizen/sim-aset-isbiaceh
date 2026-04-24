import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildVehicleReminderDigest } from "@/lib/vehicle-reminders";

const vehicleInclude = {
  asset: {
    include: {
      unitPenanggungJawab: true,
    },
  },
};

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: vehicleInclude,
      orderBy: [{ taxDueDate: "asc" }, { plateNumber: "asc" }],
    });

    const digest = buildVehicleReminderDigest(vehicles);

    return NextResponse.json({
      ok: true,
      message: "Cron reminder kendaraan berhasil dijalankan.",
      ...digest,
    });
  } catch (error) {
    console.error("GET /api/cron/vehicle-reminders failed:", error);
    return NextResponse.json(
      { ok: false, error: "Cron reminder kendaraan gagal dijalankan." },
      { status: 500 },
    );
  }
}
