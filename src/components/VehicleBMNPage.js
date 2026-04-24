"use client";

import { useEffect, useMemo, useState } from "react";
import { C, btnStyle } from "./constants";

const ownershipTypes = ["SHARED", "DEDICATED"];
const assetConditions = ["BAIK", "RUSAK_RINGAN", "RUSAK_BERAT"];
const assetStatuses = ["TERSEDIA", "DIPINJAM", "DISERAHKAN_BAST", "TIDAK_AKTIF", "HILANG"];
const vehicleStatuses = ["AKTIF", "RUSAK", "DIJUAL", "TIDAK_AKTIF"];

const initialVehicleForm = {
  assetCode: "",
  nup: "",
  assetName: "",
  category: "Kendaraan Dinas",
  ownershipType: "SHARED",
  condition: "BAIK",
  assetStatus: "TERSEDIA",
  acquisitionValue: "",
  acquisitionYear: "",
  specification: "",
  sourceData: "MANUAL",
  unitPenanggungJawabId: "",
  plateNumber: "",
  bpkbNumber: "",
  stnkNumber: "",
  chassisNumber: "",
  engineNumber: "",
  brand: "",
  model: "",
  manufactureYear: "",
  taxDueDate: "",
  stnkDueDate: "",
  lastServiceDate: "",
  nextServiceDate: "",
  vehicleStatus: "AKTIF",
  parkingLocation: "",
  notes: "",
};

const initialTaxForm = {
  taxPeriod: "",
  dueDate: "",
  paidDate: "",
  amount: "",
  notes: "",
};

const initialServiceForm = {
  serviceDate: "",
  workshopName: "",
  workDescription: "",
  cost: "",
  conditionAfter: "",
  nextServiceDate: "",
  notes: "",
};

function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function daysUntil(dateValue) {
  if (!dateValue) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateValue);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function taxAlertColor(diffDays) {
  if (diffDays === null) return C.textDim;
  if (diffDays <= 0) return C.red;
  if (diffDays <= 7) return C.red;
  if (diffDays <= 30) return C.accent;
  if (diffDays <= 90) return C.blue;
  return C.primary;
}

function dueLabel(diffDays) {
  if (diffDays === null) return "Belum diatur";
  if (diffDays < 0) return `Terlambat ${Math.abs(diffDays)} hari`;
  if (diffDays === 0) return "Hari ini";
  return `${diffDays} hari lagi`;
}

export default function VehicleBMNPage({ showNotif, searchQ }) {
  const [data, setData] = useState({
    vehicles: [],
    units: [],
    summary: null,
    reminders: { summary: {}, all: [], groups: { pajak: [], stnk: [], service: [] } },
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
  const [taxForm, setTaxForm] = useState(initialTaxForm);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [filter, setFilter] = useState("Semua");

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/master/vehicles", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat kendaraan.");
      }

      setData(result);

      if (!editingId && !vehicleForm.unitPenanggungJawabId) {
        setVehicleForm((prev) => ({
          ...prev,
          unitPenanggungJawabId: result.units[0]?.id || "",
        }));
      }

      if (!selectedVehicleId && result.vehicles[0]?.id) {
        setSelectedVehicleId(result.vehicles[0].id);
      }
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredVehicles = useMemo(() => {
    const keyword = (searchQ || "").trim().toLowerCase();

    return data.vehicles.filter((vehicle) => {
      const taxDiff = daysUntil(vehicle.taxDueDate);
      const bucket =
        taxDiff !== null && taxDiff <= 7
          ? "URGENT"
          : taxDiff !== null && taxDiff <= 90
            ? "PERLU_PAJAK"
            : "PAJAK_OK";

      const haystack = [
        vehicle.plateNumber,
        vehicle.brand,
        vehicle.model,
        vehicle.asset?.code,
        vehicle.asset?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (filter === "Semua" || filter === vehicle.vehicleStatus || filter === bucket) &&
        (!keyword || haystack.includes(keyword))
      );
    });
  }, [data.vehicles, filter, searchQ]);

  const selectedVehicle =
    data.vehicles.find((item) => item.id === selectedVehicleId) || filteredVehicles[0] || null;

  function updateVehicleField(field, value) {
    setVehicleForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetVehicleForm() {
    setEditingId(null);
    setVehicleForm({
      ...initialVehicleForm,
      unitPenanggungJawabId: data.units[0]?.id || "",
    });
  }

  function startEdit(vehicle) {
    setEditingId(vehicle.id);
    setSelectedVehicleId(vehicle.id);
    setVehicleForm({
      assetCode: vehicle.asset?.code || "",
      nup: vehicle.asset?.nup || "",
      assetName: vehicle.asset?.name || "",
      category: vehicle.asset?.category || "Kendaraan Dinas",
      ownershipType: vehicle.asset?.ownershipType || "SHARED",
      condition: vehicle.asset?.condition || "BAIK",
      assetStatus: vehicle.asset?.status || "TERSEDIA",
      acquisitionValue: vehicle.asset?.acquisitionValue || "",
      acquisitionYear: vehicle.asset?.acquisitionYear || "",
      specification: vehicle.asset?.specification || "",
      sourceData: vehicle.asset?.sourceData || "MANUAL",
      unitPenanggungJawabId: vehicle.asset?.unitPenanggungJawabId || "",
      plateNumber: vehicle.plateNumber || "",
      bpkbNumber: vehicle.bpkbNumber || "",
      stnkNumber: vehicle.stnkNumber || "",
      chassisNumber: vehicle.chassisNumber || "",
      engineNumber: vehicle.engineNumber || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      manufactureYear: vehicle.manufactureYear || "",
      taxDueDate: vehicle.taxDueDate ? new Date(vehicle.taxDueDate).toISOString().slice(0, 10) : "",
      stnkDueDate: vehicle.stnkDueDate ? new Date(vehicle.stnkDueDate).toISOString().slice(0, 10) : "",
      lastServiceDate: vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toISOString().slice(0, 10) : "",
      nextServiceDate: vehicle.nextServiceDate ? new Date(vehicle.nextServiceDate).toISOString().slice(0, 10) : "",
      vehicleStatus: vehicle.vehicleStatus || "AKTIF",
      parkingLocation: vehicle.parkingLocation || "",
      notes: vehicle.notes || "",
    });
  }

  async function handleVehicleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        editingId ? `/api/master/vehicles/${editingId}` : "/api/master/vehicles",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleForm),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan kendaraan.");
      }

      showNotif(editingId ? "Kendaraan berhasil diperbarui." : "Kendaraan berhasil ditambahkan.");
      resetVehicleForm();
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVehicleDelete(id) {
    if (!window.confirm("Hapus data kendaraan ini?")) return;

    try {
      const response = await fetch(`/api/master/vehicles/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus kendaraan.");
      }

      if (editingId === id) resetVehicleForm();
      if (selectedVehicleId === id) setSelectedVehicleId(null);
      showNotif("Kendaraan berhasil dihapus.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  async function handleTaxSubmit(event) {
    event.preventDefault();
    if (!selectedVehicle) {
      showNotif("Pilih kendaraan dulu.", "error");
      return;
    }

    try {
      const response = await fetch(`/api/master/vehicles/${selectedVehicle.id}/taxes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taxForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan riwayat pajak.");
      }

      setTaxForm(initialTaxForm);
      showNotif("Riwayat pajak berhasil ditambahkan.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  async function handleServiceSubmit(event) {
    event.preventDefault();
    if (!selectedVehicle) {
      showNotif("Pilih kendaraan dulu.", "error");
      return;
    }

    try {
      const response = await fetch(`/api/master/vehicles/${selectedVehicle.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menambahkan riwayat service.");
      }

      setServiceForm(initialServiceForm);
      showNotif("Riwayat service berhasil ditambahkan.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  async function deleteTax(historyId) {
    try {
      const response = await fetch(`/api/master/vehicles/taxes/${historyId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menghapus riwayat pajak.");
      showNotif("Riwayat pajak dihapus.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  async function deleteService(historyId) {
    try {
      const response = await fetch(`/api/master/vehicles/services/${historyId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menghapus riwayat service.");
      showNotif("Riwayat service dihapus.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Kendaraan BMN</h2>
        <p style={{ margin: "6px 0 0", color: C.textMuted, fontSize: 13 }}>
          Kelola kendaraan BMN, reminder pajak/STNK, service bulanan, dan histori biaya pemeliharaan.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 18 }}>
        {[
          ["Total Kendaraan", data.summary?.total ?? 0, C.blue],
          ["Pajak OK", data.summary?.pajakOk ?? 0, C.primary],
          ["Perlu Bayar Pajak", data.summary?.perluBayarPajak ?? 0, C.accent],
          ["Service 30 Hari", data.summary?.serviceBulanIni ?? 0, C.red],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: "16px 18px", borderTop: `3px solid ${color}` }}>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Reminder Otomatis Pajak / STNK / Service</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              Mesin reminder aktif untuk `H-90`, `H-30`, `H-7`, dan `H-0`, serta siap dipanggil oleh cron Vercel harian.
            </div>
          </div>
          <Chip color={C.blue}>
            Total Trigger Hari Ini: {data.reminders?.summary?.total ?? 0}
          </Chip>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10, marginBottom: 14 }}>
          {[
            ["H-90", data.reminders?.summary?.h90 ?? 0, C.blue],
            ["H-30", data.reminders?.summary?.h30 ?? 0, C.accent],
            ["H-7", data.reminders?.summary?.h7 ?? 0, C.red],
            ["H-0", data.reminders?.summary?.h0 ?? 0, C.red],
            ["Pajak", data.reminders?.summary?.pajak ?? 0, C.primary],
            ["STNK", data.reminders?.summary?.stnk ?? 0, C.purple],
            ["Service", data.reminders?.summary?.service ?? 0, C.accent],
          ].map(([label, value, color]) => (
            <div key={label} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          {(data.reminders?.all ?? []).length === 0 ? (
            <div style={{ color: C.textMuted }}>Belum ada trigger reminder untuk hari ini.</div>
          ) : (
            data.reminders.all.slice(0, 8).map((reminder) => (
              <div key={`${reminder.reminderType}-${reminder.vehicleId}-${reminder.stage}`} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>
                    {reminder.reminderType} · {reminder.plateNumber} · H-{reminder.stage}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {reminder.brand} {reminder.model || ""} · Jatuh tempo {formatDate(reminder.dueDate)} · {reminder.unitName || "-"}
                  </div>
                </div>
                <Chip color={taxAlertColor(reminder.diffDays)}>
                  {dueLabel(reminder.diffDays)}
                </Chip>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(380px,430px) minmax(0,1fr)", gap: 16 }}>
        <div style={{ display: "grid", gap: 16, alignSelf: "start" }}>
          <Card title={editingId ? "Edit Kendaraan" : "Tambah Kendaraan"} subtitle="Fokus utama modul ini adalah pajak, STNK, dan service berkala.">
            <form onSubmit={handleVehicleSubmit}>
              <div style={{ display: "grid", gap: 12 }}>
                <InputField label="Kode Aset" value={vehicleForm.assetCode} onChange={(value) => updateVehicleField("assetCode", value)} placeholder="BMN-KDR-003" />
                <InputField label="NUP" value={vehicleForm.nup} onChange={(value) => updateVehicleField("nup", value)} placeholder="KDR/003/2026" />
                <InputField label="Nama Kendaraan" value={vehicleForm.assetName} onChange={(value) => updateVehicleField("assetName", value)} placeholder="Toyota Avanza 2022" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InputField label="Merk" value={vehicleForm.brand} onChange={(value) => updateVehicleField("brand", value)} placeholder="Toyota" />
                  <InputField label="Model / Tipe" value={vehicleForm.model} onChange={(value) => updateVehicleField("model", value)} placeholder="Avanza" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InputField label="Nomor Polisi" value={vehicleForm.plateNumber} onChange={(value) => updateVehicleField("plateNumber", value)} placeholder="BL 1234 AB" />
                  <InputField label="Tahun Kendaraan" type="number" value={vehicleForm.manufactureYear} onChange={(value) => updateVehicleField("manufactureYear", value)} placeholder="2022" />
                </div>
                <InputField label="Nomor Rangka" value={vehicleForm.chassisNumber} onChange={(value) => updateVehicleField("chassisNumber", value)} placeholder="Nomor rangka" />
                <InputField label="Nomor Mesin" value={vehicleForm.engineNumber} onChange={(value) => updateVehicleField("engineNumber", value)} placeholder="Nomor mesin" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InputField label="Nomor BPKB" value={vehicleForm.bpkbNumber} onChange={(value) => updateVehicleField("bpkbNumber", value)} placeholder="Opsional" />
                  <InputField label="Nomor STNK" value={vehicleForm.stnkNumber} onChange={(value) => updateVehicleField("stnkNumber", value)} placeholder="Opsional" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <SelectField label="Status Kendaraan" value={vehicleForm.vehicleStatus} onChange={(value) => updateVehicleField("vehicleStatus", value)} options={vehicleStatuses.map((item) => ({ value: item, label: item }))} />
                  <SelectField label="Status Aset" value={vehicleForm.assetStatus} onChange={(value) => updateVehicleField("assetStatus", value)} options={assetStatuses.map((item) => ({ value: item, label: item }))} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <SelectField label="Kondisi" value={vehicleForm.condition} onChange={(value) => updateVehicleField("condition", value)} options={assetConditions.map((item) => ({ value: item, label: item }))} />
                  <SelectField label="Kepemilikan" value={vehicleForm.ownershipType} onChange={(value) => updateVehicleField("ownershipType", value)} options={ownershipTypes.map((item) => ({ value: item, label: item }))} />
                </div>
                <SelectField label="Unit Penanggung Jawab" value={vehicleForm.unitPenanggungJawabId} onChange={(value) => updateVehicleField("unitPenanggungJawabId", value)} options={data.units.map((item) => ({ value: item.id, label: `${item.name} (${item.type})` }))} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InputField label="Jatuh Tempo Pajak" type="date" value={vehicleForm.taxDueDate} onChange={(value) => updateVehicleField("taxDueDate", value)} />
                  <InputField label="Jatuh Tempo STNK" type="date" value={vehicleForm.stnkDueDate} onChange={(value) => updateVehicleField("stnkDueDate", value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InputField label="Service Terakhir" type="date" value={vehicleForm.lastServiceDate} onChange={(value) => updateVehicleField("lastServiceDate", value)} />
                  <InputField label="Service Berikutnya" type="date" value={vehicleForm.nextServiceDate} onChange={(value) => updateVehicleField("nextServiceDate", value)} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <InputField label="Nilai Perolehan" type="number" value={vehicleForm.acquisitionValue} onChange={(value) => updateVehicleField("acquisitionValue", value)} placeholder="215000000" />
                  <InputField label="Tahun Perolehan" type="number" value={vehicleForm.acquisitionYear} onChange={(value) => updateVehicleField("acquisitionYear", value)} placeholder="2020" />
                </div>
                <InputField label="Lokasi Parkir" value={vehicleForm.parkingLocation} onChange={(value) => updateVehicleField("parkingLocation", value)} placeholder="Area parkir Gedung Utama" />
                <TextAreaField label="Spesifikasi Aset" value={vehicleForm.specification} onChange={(value) => updateVehicleField("specification", value)} placeholder="Spesifikasi kendaraan..." />
                <TextAreaField label="Catatan Kendaraan" value={vehicleForm.notes} onChange={(value) => updateVehicleField("notes", value)} placeholder="Catatan reminder / kondisi khusus..." />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <button type="submit" disabled={submitting} style={btnStyle(C.primary, true)}>
                  {submitting ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
                </button>
                <button type="button" onClick={resetVehicleForm} style={btnStyle(C.textDim)}>
                  Reset
                </button>
              </div>
            </form>
          </Card>

          <Card title="Tambah Riwayat Pajak">
            <form onSubmit={handleTaxSubmit} style={{ display: "grid", gap: 10 }}>
              <InputField label="Periode Pajak" value={taxForm.taxPeriod} onChange={(value) => setTaxForm((prev) => ({ ...prev, taxPeriod: value }))} placeholder="2026" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <InputField label="Jatuh Tempo" type="date" value={taxForm.dueDate} onChange={(value) => setTaxForm((prev) => ({ ...prev, dueDate: value }))} />
                <InputField label="Tanggal Bayar" type="date" value={taxForm.paidDate} onChange={(value) => setTaxForm((prev) => ({ ...prev, paidDate: value }))} />
              </div>
              <InputField label="Nominal" type="number" value={taxForm.amount} onChange={(value) => setTaxForm((prev) => ({ ...prev, amount: value }))} placeholder="3500000" />
              <TextAreaField label="Catatan Pajak" value={taxForm.notes} onChange={(value) => setTaxForm((prev) => ({ ...prev, notes: value }))} placeholder="Catatan..." />
              <button type="submit" style={btnStyle(C.accent, true)}>Simpan Pajak</button>
            </form>
          </Card>

          <Card title="Tambah Riwayat Service">
            <form onSubmit={handleServiceSubmit} style={{ display: "grid", gap: 10 }}>
              <InputField label="Tanggal Service" type="date" value={serviceForm.serviceDate} onChange={(value) => setServiceForm((prev) => ({ ...prev, serviceDate: value }))} />
              <InputField label="Nama Bengkel" value={serviceForm.workshopName} onChange={(value) => setServiceForm((prev) => ({ ...prev, workshopName: value }))} placeholder="Bengkel resmi / umum" />
              <TextAreaField label="Pekerjaan" value={serviceForm.workDescription} onChange={(value) => setServiceForm((prev) => ({ ...prev, workDescription: value }))} placeholder="Ganti oli, tune up, cek rem..." />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <InputField label="Biaya" type="number" value={serviceForm.cost} onChange={(value) => setServiceForm((prev) => ({ ...prev, cost: value }))} placeholder="1250000" />
                <InputField label="Kondisi Setelah Service" value={serviceForm.conditionAfter} onChange={(value) => setServiceForm((prev) => ({ ...prev, conditionAfter: value }))} placeholder="Baik" />
              </div>
              <InputField label="Service Berikutnya" type="date" value={serviceForm.nextServiceDate} onChange={(value) => setServiceForm((prev) => ({ ...prev, nextServiceDate: value }))} />
              <TextAreaField label="Catatan Service" value={serviceForm.notes} onChange={(value) => setServiceForm((prev) => ({ ...prev, notes: value }))} placeholder="Catatan..." />
              <button type="submit" style={btnStyle(C.red, true)}>Simpan Service</button>
            </form>
          </Card>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <Card title="Dashboard Kendaraan" subtitle="Status pajak, service, dan kondisi operasional">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
              <select value={filter} onChange={(event) => setFilter(event.target.value)} style={{ ...inputStyle, width: 170 }}>
                {["Semua", "PAJAK_OK", "PERLU_PAJAK", "URGENT", ...vehicleStatuses].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <button type="button" onClick={loadData} style={btnStyle(C.blue)}>Muat Ulang</button>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {loading ? (
                <div style={{ color: C.textMuted }}>Memuat kendaraan...</div>
              ) : filteredVehicles.length === 0 ? (
                <div style={{ color: C.textMuted }}>Belum ada data kendaraan.</div>
              ) : (
                filteredVehicles.map((vehicle) => {
                  const taxDiff = daysUntil(vehicle.taxDueDate);
                  const serviceDiff = daysUntil(vehicle.nextServiceDate);
                  const taxColor = taxAlertColor(taxDiff);

                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicleId(vehicle.id)}
                      style={{
                        background: selectedVehicleId === vehicle.id ? C.card2 : C.bg,
                        border: `1px solid ${selectedVehicleId === vehicle.id ? C.primary : C.border}`,
                        borderRadius: 12,
                        padding: "16px 18px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800 }}>
                            {vehicle.plateNumber} - {vehicle.brand} {vehicle.model || ""}
                          </div>
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
                            {vehicle.asset?.code} · {vehicle.asset?.name}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Chip color={taxColor}>{dueLabel(taxDiff)}</Chip>
                          <Chip color={vehicle.vehicleStatus === "AKTIF" ? C.primary : vehicle.vehicleStatus === "RUSAK" ? C.red : C.accent}>
                            {vehicle.vehicleStatus}
                          </Chip>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Pajak</div>
                          <div style={{ fontSize: 13, color: taxColor }}>{formatDate(vehicle.taxDueDate)}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>Service Berikutnya</div>
                          <div style={{ fontSize: 13, color: serviceDiff !== null && serviceDiff <= 30 ? C.accent : C.text }}>
                            {vehicle.nextServiceDate ? `${formatDate(vehicle.nextServiceDate)} · ${dueLabel(serviceDiff)}` : "-"}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                        <button type="button" onClick={(event) => { event.stopPropagation(); startEdit(vehicle); }} style={miniButton(C.blue)}>
                          Edit
                        </button>
                        <button type="button" onClick={(event) => { event.stopPropagation(); handleVehicleDelete(vehicle.id); }} style={miniButton(C.red)}>
                          Hapus
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card title="Detail Kendaraan">
            {!selectedVehicle ? (
              <div style={{ color: C.textMuted }}>Pilih kendaraan untuk melihat histori pajak dan service.</div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                  {[
                    ["Nomor Polisi", selectedVehicle.plateNumber],
                    ["Unit", selectedVehicle.asset?.unitPenanggungJawab?.name || "-"],
                    ["Jatuh Tempo Pajak", formatDate(selectedVehicle.taxDueDate)],
                    ["Jatuh Tempo STNK", formatDate(selectedVehicle.stnkDueDate)],
                    ["Service Terakhir", formatDate(selectedVehicle.lastServiceDate)],
                    ["Service Berikutnya", formatDate(selectedVehicle.nextServiceDate)],
                  ].map(([label, value]) => (
                    <div key={label} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ fontSize: 11, color: C.textMuted }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{value}</div>
                    </div>
                  ))}
                </div>

                <HistorySection
                  title="Riwayat Pajak"
                  empty="Belum ada riwayat pajak."
                  items={selectedVehicle.taxHistories}
                  renderItem={(history) => (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Periode {history.taxPeriod || "-"}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        Jatuh tempo {formatDate(history.dueDate)} · Bayar {history.paidDate ? formatDate(history.paidDate) : "Belum"}
                      </div>
                    </div>
                  )}
                  renderMeta={(history) => (
                    <span style={{ fontSize: 12, color: C.accent }}>
                      {history.amount ? `Rp ${Number(history.amount).toLocaleString("id-ID")}` : "-"}
                    </span>
                  )}
                  onDelete={deleteTax}
                />

                <HistorySection
                  title="Riwayat Service"
                  empty="Belum ada riwayat service."
                  items={selectedVehicle.serviceHistories}
                  renderItem={(history) => (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{history.workDescription}</div>
                      <div style={{ fontSize: 11, color: C.textMuted }}>
                        {formatDate(history.serviceDate)} · {history.workshopName || "Bengkel tidak dicatat"}
                      </div>
                    </div>
                  )}
                  renderMeta={(history) => (
                    <span style={{ fontSize: 12, color: C.primary }}>
                      {history.cost ? `Rp ${Number(history.cost).toLocaleString("id-ID")}` : "-"}
                    </span>
                  )}
                  onDelete={deleteService}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
        {subtitle ? <div style={{ marginTop: 4, fontSize: 12, color: C.textMuted }}>{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}

function HistorySection({ title, empty, items, renderItem, renderMeta, onDelete }) {
  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{title}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.length === 0 ? (
          <div style={{ color: C.textMuted }}>{empty}</div>
        ) : (
          items.map((item) => (
            <div key={item.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              {renderItem(item)}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {renderMeta(item)}
                <button type="button" onClick={() => onDelete(item.id)} style={miniButton(C.red)}>
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label style={{ display: "grid", gap: 5 }}>
      <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <label style={{ display: "grid", gap: 5 }}>
      <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label style={{ display: "grid", gap: 5 }}>
      <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={inputStyle}>
        <option value="">Pilih...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Chip({ children, color }) {
  return (
    <span style={{ padding: "4px 10px", borderRadius: 999, background: `${color}22`, color, fontSize: 11, fontWeight: 700 }}>
      {children}
    </span>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  background: C.card2,
  border: `1px solid ${C.border}`,
  color: C.text,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const miniButton = (color) => ({
  padding: "5px 10px",
  borderRadius: 8,
  background: `${color}22`,
  border: `1px solid ${color}44`,
  color,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
});
