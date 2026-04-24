"use client";

import { useEffect, useMemo, useState } from "react";
import { C, btnStyle } from "./constants";

const roomUsageTypes = ["SHARED", "DEDICATED", "MIXED"];
const ownershipStatuses = ["BMN", "PINJAM_PAKAI", "HIBAH", "LAINNYA"];
const dbrStatuses = ["SUDAH", "BELUM"];
const managerTypes = ["INSTITUSI", "JURUSAN", "PRODI", "UNIT"];
const usageRoles = ["UTAMA", "PENGGUNA", "PENDUKUNG_AKREDITASI"];

const initialRoomForm = {
  kampusId: "",
  gedungId: "",
  unitPenanggungJawabId: "",
  picPenanggungJawabUserId: "",
  lantai: "",
  code: "",
  name: "",
  roomType: "",
  usageType: "SHARED",
  areaM2: "",
  capacity: "",
  ownershipStatus: "BMN",
  dbrStatus: "BELUM",
  responsiblePicName: "",
  managerType: "UNIT",
  managerReferenceId: "",
  isActive: true,
  notes: "",
  prodiUsages: [],
};

const initialUsageForm = {
  prodiId: "",
  usageRole: "PENGGUNA",
  isForAccreditation: true,
  notes: "",
};

export default function MasterRoomPage({ showNotif }) {
  const [data, setData] = useState({
    rooms: [],
    kampus: [],
    gedungs: [],
    units: [],
    prodi: [],
    users: [],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialRoomForm);
  const [usageForm, setUsageForm] = useState(initialUsageForm);
  const [filter, setFilter] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/master/rooms", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat data master ruangan.");
      }

      setData(result);

      if (!editingId && !form.kampusId && result.kampus[0]) {
        setForm((prev) => ({
          ...prev,
          kampusId: result.kampus[0]?.id || "",
          gedungId:
            result.gedungs.find((item) => item.kampusId === result.kampus[0]?.id)?.id || "",
          unitPenanggungJawabId: result.units[0]?.id || "",
        }));
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

  const availableGedungs = useMemo(
    () => data.gedungs.filter((item) => item.kampusId === form.kampusId),
    [data.gedungs, form.kampusId],
  );

  const filteredRooms = useMemo(() => {
    const keyword = filter.trim().toLowerCase();
    if (!keyword) return data.rooms;

    return data.rooms.filter((room) => {
      const haystack = [
        room.code,
        room.name,
        room.roomType,
        room.kampus?.name,
        room.gedung?.name,
        room.unitPenanggungJawab?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [data.rooms, filter]);

  function updateField(field, value) {
    setForm((prev) => {
      if (field === "kampusId") {
        const nextGedung = data.gedungs.find((item) => item.kampusId === value)?.id || "";
        return { ...prev, kampusId: value, gedungId: nextGedung };
      }

      return { ...prev, [field]: value };
    });
  }

  function resetForm() {
    setEditingId(null);
    setUsageForm(initialUsageForm);
    setForm({
      ...initialRoomForm,
      kampusId: data.kampus[0]?.id || "",
      gedungId: data.gedungs.find((item) => item.kampusId === data.kampus[0]?.id)?.id || "",
      unitPenanggungJawabId: data.units[0]?.id || "",
    });
  }

  function startEdit(room) {
    setEditingId(room.id);
    setUsageForm(initialUsageForm);
    setForm({
      kampusId: room.kampusId,
      gedungId: room.gedungId,
      unitPenanggungJawabId: room.unitPenanggungJawabId,
      picPenanggungJawabUserId: room.picPenanggungJawabUserId || "",
      lantai: room.lantai || "",
      code: room.code,
      name: room.name,
      roomType: room.roomType,
      usageType: room.usageType,
      areaM2: room.areaM2 || "",
      capacity: room.capacity || "",
      ownershipStatus: room.ownershipStatus,
      dbrStatus: room.dbrStatus,
      responsiblePicName: room.responsiblePicName || "",
      managerType: room.managerType,
      managerReferenceId: room.managerReferenceId || "",
      isActive: room.isActive,
      notes: room.notes || "",
      prodiUsages: room.prodiUsages.map((usage) => ({
        prodiId: usage.prodiId,
        usageRole: usage.usageRole,
        isForAccreditation: usage.isForAccreditation,
        notes: usage.notes || "",
      })),
    });
  }

  function addUsage() {
    if (!usageForm.prodiId) {
      showNotif("Pilih prodi pengguna ruangan dulu.", "error");
      return;
    }

    setForm((prev) => {
      const existing = prev.prodiUsages.find((item) => item.prodiId === usageForm.prodiId);
      const nextUsages = existing
        ? prev.prodiUsages.map((item) =>
            item.prodiId === usageForm.prodiId ? { ...usageForm } : item,
          )
        : [...prev.prodiUsages, { ...usageForm }];

      return { ...prev, prodiUsages: nextUsages };
    });

    setUsageForm(initialUsageForm);
  }

  function removeUsage(prodiId) {
    setForm((prev) => ({
      ...prev,
      prodiUsages: prev.prodiUsages.filter((item) => item.prodiId !== prodiId),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        editingId ? `/api/master/rooms/${editingId}` : "/api/master/rooms",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan ruangan.");
      }

      showNotif(editingId ? "Ruangan berhasil diperbarui." : "Ruangan berhasil ditambahkan.");
      resetForm();
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus data ruangan ini?")) return;

    try {
      const response = await fetch(`/api/master/rooms/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus ruangan.");
      }

      if (editingId === id) resetForm();
      showNotif("Ruangan berhasil dihapus.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Master Lokasi & Ruangan</h2>
        <p style={{ margin: "6px 0 0", color: C.textMuted, fontSize: 13 }}>
          Kelola ruangan, penanggung jawab, status DBR, dan relasi penggunaan prodi.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 420px) minmax(0, 1fr)", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, alignSelf: "start" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{editingId ? "Edit Ruangan" : "Tambah Ruangan"}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: C.textMuted }}>
              Form ini mengikuti aturan `shared`, `dedicated`, dan `mixed` yang sudah kita kunci.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 12 }}>
              <SelectField label="Kampus" value={form.kampusId} onChange={(value) => updateField("kampusId", value)} options={data.kampus.map((item) => ({ value: item.id, label: item.name }))} />
              <SelectField label="Gedung" value={form.gedungId} onChange={(value) => updateField("gedungId", value)} options={availableGedungs.map((item) => ({ value: item.id, label: `${item.code} - ${item.name}` }))} />
              <InputField label="Lantai" value={form.lantai} onChange={(value) => updateField("lantai", value)} placeholder="Contoh: 1" />
              <InputField label="Kode Ruangan" value={form.code} onChange={(value) => updateField("code", value)} placeholder="Contoh: G13-ST-01" />
              <InputField label="Nama Ruangan" value={form.name} onChange={(value) => updateField("name", value)} placeholder="Contoh: Studio Tari" />
              <InputField label="Jenis Ruang" value={form.roomType} onChange={(value) => updateField("roomType", value)} placeholder="Contoh: Studio / Laboratorium / Akademik" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <SelectField label="Jenis Penggunaan" value={form.usageType} onChange={(value) => updateField("usageType", value)} options={roomUsageTypes.map((item) => ({ value: item, label: item }))} />
                <SelectField label="Status Kepemilikan" value={form.ownershipStatus} onChange={(value) => updateField("ownershipStatus", value)} options={ownershipStatuses.map((item) => ({ value: item, label: item }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <InputField label="Luas (m²)" type="number" value={form.areaM2} onChange={(value) => updateField("areaM2", value)} placeholder="Contoh: 72" />
                <InputField label="Kapasitas" type="number" value={form.capacity} onChange={(value) => updateField("capacity", value)} placeholder="Contoh: 30" />
              </div>
              <SelectField label="Unit Penanggung Jawab Ruang" value={form.unitPenanggungJawabId} onChange={(value) => updateField("unitPenanggungJawabId", value)} options={data.units.map((item) => ({ value: item.id, label: `${item.name} (${item.type})` }))} />
              <SelectField label="PIC User Sistem" value={form.picPenanggungJawabUserId} onChange={(value) => updateField("picPenanggungJawabUserId", value)} options={data.users.map((item) => ({ value: item.id, label: `${item.name}${item.nip ? ` - ${item.nip}` : ""}` }))} />
              <InputField label="PIC Penanggung Jawab (teks bebas)" value={form.responsiblePicName} onChange={(value) => updateField("responsiblePicName", value)} placeholder="Contoh: Koordinator Studio Tari" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <SelectField label="Tipe Pengelola Utama" value={form.managerType} onChange={(value) => updateField("managerType", value)} options={managerTypes.map((item) => ({ value: item, label: item }))} />
                <InputField label="ID Referensi Pengelola" value={form.managerReferenceId} onChange={(value) => updateField("managerReferenceId", value)} placeholder="Opsional" />
              </div>
              <SelectField label="Status DBR" value={form.dbrStatus} onChange={(value) => updateField("dbrStatus", value)} options={dbrStatuses.map((item) => ({ value: item, label: item }))} />
              <TextAreaField label="Catatan" value={form.notes} onChange={(value) => updateField("notes", value)} placeholder="Catatan tambahan ruangan..." />
              <SwitchField label="Ruangan Aktif" checked={form.isActive} onChange={(value) => updateField("isActive", value)} />
            </div>

            <div style={{ marginTop: 16, padding: 14, borderRadius: 12, background: C.card2, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Prodi Pengguna Ruangan</div>
              <div style={{ display: "grid", gap: 10 }}>
                <SelectField label="Prodi" value={usageForm.prodiId} onChange={(value) => setUsageForm((prev) => ({ ...prev, prodiId: value }))} options={data.prodi.map((item) => ({ value: item.id, label: `${item.name} - ${item.jurusan?.name || "-"}` }))} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <SelectField label="Peran Penggunaan" value={usageForm.usageRole} onChange={(value) => setUsageForm((prev) => ({ ...prev, usageRole: value }))} options={usageRoles.map((item) => ({ value: item, label: item }))} />
                  <SwitchField label="Masuk Akreditasi" checked={usageForm.isForAccreditation} onChange={(value) => setUsageForm((prev) => ({ ...prev, isForAccreditation: value }))} />
                </div>
                <TextAreaField label="Catatan Penggunaan" value={usageForm.notes} onChange={(value) => setUsageForm((prev) => ({ ...prev, notes: value }))} placeholder="Opsional" />
                <button type="button" onClick={addUsage} style={btnStyle(C.accent)}>
                  Tambah Prodi Pengguna
                </button>
              </div>

              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                {form.prodiUsages.length === 0 ? (
                  <div style={{ fontSize: 12, color: C.textMuted }}>Belum ada prodi pengguna yang ditambahkan.</div>
                ) : (
                  form.prodiUsages.map((usage) => {
                    const matchedProdi = data.prodi.find((item) => item.id === usage.prodiId);
                    return (
                      <div key={usage.prodiId} style={{ padding: "10px 12px", borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{matchedProdi?.name || usage.prodiId}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>
                            {usage.usageRole} · {usage.isForAccreditation ? "Akreditasi" : "Non-akreditasi"}
                          </div>
                        </div>
                        <button type="button" onClick={() => removeUsage(usage.prodiId)} style={miniButton(C.red)}>
                          Hapus
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button type="submit" disabled={submitting} style={btnStyle(C.primary, true)}>
                {submitting ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={resetForm} style={btnStyle(C.textDim)}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Daftar Ruangan</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Total {filteredRooms.length} ruangan</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Cari ruangan..." style={{ ...inputStyle, width: 180 }} />
              <button type="button" onClick={loadData} style={btnStyle(C.blue)}>
                Muat Ulang
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.card2 }}>
                  {["Kode", "Ruangan", "Lokasi", "Penggunaan", "Penanggung Jawab", "Prodi Pengguna", "Aksi"].map((header) => (
                    <th key={header} style={{ padding: "12px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <EmptyState text="Memuat data ruangan..." />
                ) : filteredRooms.length === 0 ? (
                  <EmptyState text="Belum ada data ruangan." />
                ) : (
                  filteredRooms.map((room) => (
                    <tr key={room.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 700, color: C.blue }}>{room.code}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>DBR: {room.dbrStatus}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600 }}>{room.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{room.roomType}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div>{room.kampus?.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          {room.gedung?.name}
                          {room.lantai ? ` · Lt ${room.lantai}` : ""}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Chip color={room.usageType === "SHARED" ? C.blue : room.usageType === "DEDICATED" ? C.primary : C.accent}>
                          {room.usageType}
                        </Chip>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div>{room.unitPenanggungJawab?.name || "-"}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          {room.responsiblePicName || room.picPenanggungJawabUser?.name || "-"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "grid", gap: 4 }}>
                          {room.prodiUsages.length === 0 ? (
                            <span style={{ color: C.textMuted }}>-</span>
                          ) : (
                            room.prodiUsages.map((usage) => (
                              <span key={usage.id} style={{ fontSize: 12 }}>
                                {usage.prodi?.name} ({usage.usageRole})
                              </span>
                            ))
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" onClick={() => startEdit(room)} style={miniButton(C.blue)}>Edit</button>
                          <button type="button" onClick={() => handleDelete(room.id)} style={miniButton(C.red)}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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

function SwitchField({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", borderRadius: 10, background: C.card2, border: `1px solid ${C.border}` }}>
      <span style={{ fontSize: 12, color: C.textMuted }}>{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
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

function EmptyState({ text }) {
  return (
    <tr>
      <td colSpan={7} style={{ padding: 24, textAlign: "center", color: C.textMuted }}>
        {text}
      </td>
    </tr>
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
