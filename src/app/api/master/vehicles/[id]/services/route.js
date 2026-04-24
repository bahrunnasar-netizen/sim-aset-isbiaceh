import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function parseOptionalString(value) {
  if (value === undefined || value === null) return null;
  const parsed = String(value).trim();
  return parsed ? parsed : null;
}

function parseOptionalDecimal(value, fieldName) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`${fieldName} tidak valid.`);
  }
  return parsed;
}

function parseRequiredDate(value, fieldName) {
  if (!value) throw new Error(`${fieldName} wajib diisi.`);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error(`${fieldName} tidak valid.`);
  return parsed;
}

function parseOptionalDate(value, fieldName) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new Error(`${fieldName} tidak valid.`);
  return parsed;
}

export async function POST(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    if (!body.serviceDate || !body.workDescription) {
      throw new Error("Tanggal service dan jenis pekerjaan wajib diisi.");
    }

    const history = await prisma.vehicleServiceHistory.create({
      data: {
        vehicleId: id,
        serviceDate: parseRequiredDate(body.serviceDate, "Tanggal service"),
        workshopName: parseOptionalString(body.workshopName),
        workDescription: String(body.workDescription).trim(),
        cost: parseOptionalDecimal(body.cost, "Biaya service"),
        conditionAfter: parseOptionalString(body.conditionAfter),
        nextServiceDate: parseOptionalDate(body.nextServiceDate, "Jadwal service berikutnya"),
        notes: parseOptionalString(body.notes),
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error(`POST /api/master/vehicles/${id}/services failed:`, error);

    if (error?.code === "P2003") {
      return badRequest("Kendaraan tidak valid.");
    }

    return badRequest(error?.message || "Gagal menambahkan riwayat service.");
  }
}
