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

    return NextResponse.json(buildVehicleReminderDigest(vehicles));
  } catch (error) {
    console.error("GET /api/reminders/vehicles failed:", error);
    return NextResponse.json(
      { error: "Gagal memuat reminder kendaraan." },
      { status: 500 },
    );
  }
}
