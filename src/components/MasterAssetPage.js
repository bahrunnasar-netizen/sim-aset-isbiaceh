"use client";

import { useEffect, useMemo, useState } from "react";
import { C, btnStyle } from "./constants";

const ownershipTypes = ["SHARED", "DEDICATED"];
const conditions = ["BAIK", "RUSAK_RINGAN", "RUSAK_BERAT"];
const statuses = ["TERSEDIA", "DIPINJAM", "DISERAHKAN_BAST", "TIDAK_AKTIF", "HILANG"];

const initialForm = {
  code: "",
  nup: "",
  name: "",
  category: "",
  assetType: "UMUM",
  ownershipType: "SHARED",
  condition: "BAIK",
  status: "TERSEDIA",
  acquisitionValue: "",
  acquisitionYear: "",
  specification: "",
  sourceData: "MANUAL",
  ruanganId: "",
  prodiOwnerId: "",
  unitPenanggungJawabId: "",
};

export default function MasterAssetPage({ showNotif, searchQ }) {
  const [data, setData] = useState({ assets: [], rooms: [], prodi: [], units: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [filter, setFilter] = useState("Semua");

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/master/assets", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat data aset.");
      }

      setData(result);

      if (!editingId && !form.unitPenanggungJawabId) {
        setForm((prev) => ({
          ...prev,
          unitPenanggungJawabId: result.units[0]?.id || "",
          ruanganId: result.rooms[0]?.id || "",
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

  const filteredAssets = useMemo(() => {
    const keyword = (searchQ || "").trim().toLowerCase();

    return data.assets.filter((asset) => {
      const matchesFilter =
        filter === "Semua" ||
        asset.condition === filter ||
        asset.status === filter ||
        asset.ownershipType === filter;

      const haystack = [
        asset.code,
        asset.nup,
        asset.name,
        asset.category,
        asset.ruangan?.name,
        asset.prodiOwner?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!keyword || haystack.includes(keyword));
    });
  }, [data.assets, filter, searchQ]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "ownershipType" && value === "SHARED" ? { prodiOwnerId: "" } : {}),
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...initialForm,
      unitPenanggungJawabId: data.units[0]?.id || "",
      ruanganId: data.rooms[0]?.id || "",
    });
  }

  function startEdit(asset) {
    setEditingId(asset.id);
    setForm({
      code: asset.code,
      nup: asset.nup || "",
      name: asset.name,
      category: asset.category,
      assetType: asset.assetType,
      ownershipType: asset.ownershipType,
      condition: asset.condition,
      status: asset.status,
      acquisitionValue: asset.acquisitionValue || "",
      acquisitionYear: asset.acquisitionYear || "",
      specification: asset.specification || "",
      sourceData: asset.sourceData || "",
      ruanganId: asset.ruanganId || "",
      prodiOwnerId: asset.prodiOwnerId || "",
      unitPenanggungJawabId: asset.unitPenanggungJawabId || "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(
        editingId ? `/api/master/assets/${editingId}` : "/api/master/assets",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan aset.");
      }

      showNotif(editingId ? "Aset berhasil diperbarui." : "Aset berhasil ditambahkan.");
      resetForm();
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Hapus data aset ini?")) return;

    try {
      const response = await fetch(`/api/master/assets/${id}`, { method: "DELETE" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus aset.");
      }

      if (editingId === id) resetForm();
      showNotif("Aset berhasil dihapus.");
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Master Aset</h2>
        <p style={{ margin: "6px 0 0", color: C.textMuted, fontSize: 13 }}>
          Kelola aset umum berbasis database, termasuk relasi ruangan, unit, dan prodi pemilik.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 420px) minmax(0, 1fr)", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, alignSelf: "start" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{editingId ? "Edit Aset" : "Tambah Aset"}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: C.textMuted }}>
              Versi ini fokus ke aset umum. Kendaraan tetap kita kelola di modul kendaraan BMN.
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 12 }}>
              <InputField label="Kode Aset" value={form.code} onChange={(value) => updateField("code", value)} placeholder="Contoh: BMN-009" />
              <InputField label="NUP" value={form.nup} onChange={(value) => updateField("nup", value)} placeholder="Contoh: 009/2026" />
              <InputField label="Nama Aset" value={form.name} onChange={(value) => updateField("name", value)} placeholder="Contoh: Proyektor Epson EB-X51" />
              <InputField label="Kategori" value={form.category} onChange={(value) => updateField("category", value)} placeholder="Contoh: Alat Presentasi" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <SelectField label="Kepemilikan" value={form.ownershipType} onChange={(value) => updateField("ownershipType", value)} options={ownershipTypes.map((item) => ({ value: item, label: item }))} />
                <SelectField label="Kondisi" value={form.condition} onChange={(value) => updateField("condition", value)} options={conditions.map((item) => ({ value: item, label: item }))} />
              </div>
              <SelectField label="Status" value={form.status} onChange={(value) => updateField("status", value)} options={statuses.map((item) => ({ value: item, label: item }))} />
              <SelectField label="Ruangan" value={form.ruanganId} onChange={(value) => updateField("ruanganId", value)} options={data.rooms.map((item) => ({ value: item.id, label: `${item.code} - ${item.name}` }))} />
              <SelectField label="Unit Penanggung Jawab" value={form.unitPenanggungJawabId} onChange={(value) => updateField("unitPenanggungJawabId", value)} options={data.units.map((item) => ({ value: item.id, label: `${item.name} (${item.type})` }))} />
              {form.ownershipType === "DEDICATED" && (
                <SelectField label="Prodi Pemilik" value={form.prodiOwnerId} onChange={(value) => updateField("prodiOwnerId", value)} options={data.prodi.map((item) => ({ value: item.id, label: `${item.name} - ${item.jurusan?.name || "-"}` }))} />
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <InputField label="Nilai Perolehan" type="number" value={form.acquisitionValue} onChange={(value) => updateField("acquisitionValue", value)} placeholder="Contoh: 12500000" />
                <InputField label="Tahun Perolehan" type="number" value={form.acquisitionYear} onChange={(value) => updateField("acquisitionYear", value)} placeholder="Contoh: 2026" />
              </div>
              <InputField label="Sumber Data" value={form.sourceData} onChange={(value) => updateField("sourceData", value)} placeholder="Contoh: SIMAN / MANUAL" />
              <TextAreaField label="Spesifikasi / Catatan" value={form.specification} onChange={(value) => updateField("specification", value)} placeholder="Spesifikasi singkat aset..." />
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
              <div style={{ fontSize: 15, fontWeight: 700 }}>Daftar Aset</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Total {filteredAssets.length} aset</div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <select value={filter} onChange={(event) => setFilter(event.target.value)} style={{ ...inputStyle, width: 160 }}>
                {["Semua", ...conditions, ...statuses, ...ownershipTypes].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button type="button" onClick={loadData} style={btnStyle(C.blue)}>
                Muat Ulang
              </button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.card2 }}>
                  {["Kode / NUP", "Nama Aset", "Kategori", "Ruangan", "Kondisi", "Status", "Aksi"].map((header) => (
                    <th key={header} style={{ padding: "12px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <EmptyState text="Memuat data aset..." />
                ) : filteredAssets.length === 0 ? (
                  <EmptyState text="Belum ada data aset." />
                ) : (
                  filteredAssets.map((asset) => (
                    <tr key={asset.id} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 700, color: C.blue }}>{asset.code}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{asset.nup || "-"}</div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ fontWeight: 600 }}>{asset.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          {asset.ownershipType === "DEDICATED"
                            ? `Dedicated - ${asset.prodiOwner?.name || "-"}`
                            : "Shared"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>{asset.category}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <div>{asset.ruangan?.name || "-"}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          {asset.unitPenanggungJawab?.name || "-"}
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Chip color={asset.condition === "BAIK" ? C.primary : asset.condition === "RUSAK_RINGAN" ? C.accent : C.red}>
                          {asset.condition}
                        </Chip>
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <Chip color={asset.status === "TERSEDIA" ? C.primary : asset.status === "DIPINJAM" ? C.accent : C.blue}>
                          {asset.status}
                        </Chip>
                      </td>
                      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" onClick={() => startEdit(asset)} style={miniButton(C.blue)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => handleDelete(asset.id)} style={miniButton(C.red)}>
                            Hapus
                          </button>
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
