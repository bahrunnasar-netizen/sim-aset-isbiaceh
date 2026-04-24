export const TAX_REMINDER_STAGES = [90, 30, 7, 0];
export const STNK_REMINDER_STAGES = [90, 30, 7, 0];
export const SERVICE_REMINDER_STAGES = [30, 7, 0];

function startOfDay(dateLike = new Date()) {
  const date = new Date(dateLike);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function daysUntil(dateValue, fromDate = new Date()) {
  if (!dateValue) return null;
  const today = startOfDay(fromDate);
  const target = startOfDay(dateValue);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function findStage(diffDays, stages) {
  return stages.find((stage) => diffDays === stage) ?? null;
}

function buildReminderItem(type, vehicle, dateField, stages, fromDate = new Date()) {
  const dueDate = vehicle[dateField];
  const diffDays = daysUntil(dueDate, fromDate);
  const stage = diffDays === null ? null : findStage(diffDays, stages);

  if (stage === null) return null;

  return {
    reminderType: type,
    vehicleId: vehicle.id,
    assetId: vehicle.assetId,
    assetCode: vehicle.asset?.code ?? null,
    assetName: vehicle.asset?.name ?? null,
    plateNumber: vehicle.plateNumber,
    brand: vehicle.brand,
    model: vehicle.model,
    dueDate,
    diffDays,
    stage,
    unitName: vehicle.asset?.unitPenanggungJawab?.name ?? null,
  };
}

export function buildVehicleReminderDigest(vehicles, fromDate = new Date()) {
  const pajak = [];
  const stnk = [];
  const service = [];

  for (const vehicle of vehicles) {
    const pajakReminder = buildReminderItem(
      "PAJAK",
      vehicle,
      "taxDueDate",
      TAX_REMINDER_STAGES,
      fromDate,
    );
    if (pajakReminder) pajak.push(pajakReminder);

    const stnkReminder = buildReminderItem(
      "STNK",
      vehicle,
      "stnkDueDate",
      STNK_REMINDER_STAGES,
      fromDate,
    );
    if (stnkReminder) stnk.push(stnkReminder);

    const serviceReminder = buildReminderItem(
      "SERVICE",
      vehicle,
      "nextServiceDate",
      SERVICE_REMINDER_STAGES,
      fromDate,
    );
    if (serviceReminder) service.push(serviceReminder);
  }

  const all = [...pajak, ...stnk, ...service].sort((a, b) => {
    if (a.diffDays !== b.diffDays) return a.diffDays - b.diffDays;
    return (a.plateNumber || "").localeCompare(b.plateNumber || "");
  });

  return {
    generatedAt: new Date(fromDate).toISOString(),
    summary: {
      total: all.length,
      pajak: pajak.length,
      stnk: stnk.length,
      service: service.length,
      h90: all.filter((item) => item.stage === 90).length,
      h30: all.filter((item) => item.stage === 30).length,
      h7: all.filter((item) => item.stage === 7).length,
      h0: all.filter((item) => item.stage === 0).length,
    },
    groups: {
      pajak,
      stnk,
      service,
    },
    all,
  };
}

function dueWithin(targetDate, days, fromDate = new Date()) {
  const diff = daysUntil(targetDate, fromDate);
  return diff !== null && diff >= 0 && diff <= days;
}

export function computeVehicleSummary(vehicles, fromDate = new Date()) {
  return {
    total: vehicles.length,
    pajakOk: vehicles.filter((item) => !dueWithin(item.taxDueDate, 90, fromDate)).length,
    perluBayarPajak: vehicles.filter((item) => dueWithin(item.taxDueDate, 90, fromDate)).length,
    serviceBulanIni: vehicles.filter((item) => dueWithin(item.nextServiceDate, 30, fromDate)).length,
    urgentTax: vehicles.filter((item) => dueWithin(item.taxDueDate, 7, fromDate)).length,
  };
}
