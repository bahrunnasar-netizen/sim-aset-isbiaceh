"use client";

import { useEffect, useMemo, useState } from "react";
import { C, btnStyle } from "./constants";

const initialForms = {
  jurusan: { code: "", name: "", isActive: true },
  prodi: {
    code: "",
    name: "",
    jurusanId: "",
    hasDedicatedStudioOrLab: false,
    isActive: true,
  },
  unit: {
    code: "",
    name: "",
    type: "ADMINISTRASI",
    isActive: true,
  },
};

const entityConfig = {
  jurusan: { label: "Jurusan", endpoint: "jurusan", empty: "Belum ada data jurusan." },
  prodi: { label: "Prodi", endpoint: "prodi", empty: "Belum ada data prodi." },
  unit: { label: "Unit / UPA", endpoint: "unit", empty: "Belum ada data unit." },
};

const unitTypeOptions = [
  "UPA",
  "SARPRAS",
  "PERPUSTAKAAN",
  "JURUSAN",
  "PRODI",
  "ADMINISTRASI",
  "LAINNYA",
];

export default function MasterOrganizationPage({ showNotif }) {
  const [activeTab, setActiveTab] = useState("jurusan");
  const [data, setData] = useState({ jurusan: [], prodi: [], units: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [forms, setForms] = useState(initialForms);

  const currentConfig = entityConfig[activeTab];

  async function loadData() {
    setLoading(true);
    try {
      const response = await fetch("/api/master/organization", { cache: "no-store" });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal memuat organisasi.");
      }

      setData(result);
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const currentItems = useMemo(() => {
    if (activeTab === "jurusan") return data.jurusan;
    if (activeTab === "prodi") return data.prodi;
    return data.units;
  }, [activeTab, data]);

  function updateForm(key, field, value) {
    setForms((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  }

  function resetActiveForm() {
    setForms((prev) => ({ ...prev, [activeTab]: initialForms[activeTab] }));
    setEditingId(null);
  }

  function startEdit(item) {
    if (activeTab === "jurusan") {
      setForms((prev) => ({
        ...prev,
        jurusan: { code: item.code, name: item.name, isActive: item.isActive },
      }));
    }

    if (activeTab === "prodi") {
      setForms((prev) => ({
        ...prev,
        prodi: {
          code: item.code,
          name: item.name,
          jurusanId: item.jurusanId,
          hasDedicatedStudioOrLab: item.hasDedicatedStudioOrLab,
          isActive: item.isActive,
        },
      }));
    }

    if (activeTab === "unit") {
      setForms((prev) => ({
        ...prev,
        unit: {
          code: item.code,
          name: item.name,
          type: item.type,
          isActive: item.isActive,
        },
      }));
    }

    setEditingId(item.id);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = forms[activeTab];
      const response = await fetch(
        editingId
          ? `/api/master/organization/${currentConfig.endpoint}/${editingId}`
          : `/api/master/organization/${currentConfig.endpoint}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan data.");
      }

      showNotif(
        editingId
          ? `${currentConfig.label} berhasil diperbarui.`
          : `${currentConfig.label} berhasil ditambahkan.`,
      );
      resetActiveForm();
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Hapus ${currentConfig.label.toLowerCase()} ini?`)) return;

    try {
      const response = await fetch(
        `/api/master/organization/${currentConfig.endpoint}/${id}`,
        { method: "DELETE" },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menghapus data.");
      }

      if (editingId === id) resetActiveForm();
      showNotif(`${currentConfig.label} berhasil dihapus.`);
      await loadData();
    } catch (error) {
      showNotif(error.message, "error");
    }
  }

  function renderForm() {
    if (activeTab === "jurusan") {
      const form = forms.jurusan;
      return (
        <>
          <InputField label="Kode Jurusan" value={form.code} onChange={(value) => updateForm("jurusan", "code", value)} placeholder="Contoh: JSP" />
          <InputField label="Nama Jurusan" value={form.name} onChange={(value) => updateForm("jurusan", "name", value)} placeholder="Contoh: Jurusan Seni Pertunjukan" />
          <SwitchField label="Aktif" checked={form.isActive} onChange={(value) => updateForm("jurusan", "isActive", value)} />
        </>
      );
    }

    if (activeTab === "prodi") {
      const form = forms.prodi;
      return (
        <>
          <InputField label="Kode Prodi" value={form.code} onChange={(value) => updateForm("prodi", "code", value)} placeholder="Contoh: BAHASA_ACEH" />
          <InputField label="Nama Prodi" value={form.name} onChange={(value) => updateForm("prodi", "name", value)} placeholder="Contoh: Bahasa Aceh" />
          <SelectField label="Jurusan" value={form.jurusanId} onChange={(value) => updateForm("prodi", "jurusanId", value)} options={data.jurusan.map((item) => ({ value: item.id, label: item.name }))} />
          <SwitchField label="Punya Studio/Lab Dedicated" checked={form.hasDedicatedStudioOrLab} onChange={(value) => updateForm("prodi", "hasDedicatedStudioOrLab", value)} />
          <SwitchField label="Aktif" checked={form.isActive} onChange={(value) => updateForm("prodi", "isActive", value)} />
        </>
      );
    }

    const form = forms.unit;
    return (
      <>
        <InputField label="Kode Unit" value={form.code} onChange={(value) => updateForm("unit", "code", value)} placeholder="Contoh: UPA_BAHASA" />
        <InputField label="Nama Unit" value={form.name} onChange={(value) => updateForm("unit", "name", value)} placeholder="Contoh: UPA Bahasa" />
        <SelectField label="Jenis Unit" value={form.type} onChange={(value) => updateForm("unit", "type", value)} options={unitTypeOptions.map((item) => ({ value: item, label: item }))} />
        <SwitchField label="Aktif" checked={form.isActive} onChange={(value) => updateForm("unit", "isActive", value)} />
      </>
    );
  }

  function renderRows() {
    if (loading) return <EmptyState text="Memuat data organisasi..." colSpan={6} />;
    if (currentItems.length === 0) return <EmptyState text={currentConfig.empty} colSpan={6} />;

    if (activeTab === "jurusan") {
      return currentItems.map((item) => (
        <TableRow key={item.id} columns={[item.code, item.name, item.isActive ? "Aktif" : "Nonaktif"]} onEdit={() => startEdit(item)} onDelete={() => handleDelete(item.id)} />
      ));
    }

    if (activeTab === "prodi") {
      return currentItems.map((item) => (
        <TableRow key={item.id} columns={[item.code, item.name, item.jurusan?.name || "-", item.hasDedicatedStudioOrLab ? "Ada" : "Tidak", item.isActive ? "Aktif" : "Nonaktif"]} onEdit={() => startEdit(item)} onDelete={() => handleDelete(item.id)} />
      ));
    }

    return currentItems.map((item) => (
      <TableRow key={item.id} columns={[item.code, item.name, item.type, item.isActive ? "Aktif" : "Nonaktif"]} onEdit={() => startEdit(item)} onDelete={() => handleDelete(item.id)} />
    ));
  }

  const headers =
    activeTab === "jurusan"
      ? ["Kode", "Nama Jurusan", "Status", "Aksi"]
      : activeTab === "prodi"
        ? ["Kode", "Nama Prodi", "Jurusan", "Studio/Lab", "Status", "Aksi"]
        : ["Kode", "Nama Unit", "Jenis", "Status", "Aksi"];

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Master Organisasi</h2>
        <p style={{ margin: "6px 0 0", color: C.textMuted, fontSize: 13 }}>
          Kelola jurusan, prodi, dan unit penanggung jawab sebagai fondasi data SIASET.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {Object.entries(entityConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key);
              setEditingId(null);
            }}
            style={{
              padding: "7px 14px",
              borderRadius: 20,
              fontSize: 12,
              background: activeTab === key ? C.primary : C.card2,
              color: activeTab === key ? "white" : C.textMuted,
              border: `1px solid ${activeTab === key ? C.primary : C.border}`,
              cursor: "pointer",
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 380px) minmax(0, 1fr)", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, alignSelf: "start" }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{editingId ? `Edit ${currentConfig.label}` : `Tambah ${currentConfig.label}`}</div>
            <div style={{ marginTop: 4, fontSize: 12, color: C.textMuted }}>
              Form sederhana untuk menjaga master data tetap rapi sejak awal.
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gap: 12 }}>{renderForm()}</div>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <button type="submit" disabled={submitting} style={btnStyle(C.primary, true)}>
                {submitting ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={resetActiveForm} style={btnStyle(C.textDim)}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Daftar {currentConfig.label}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Total {currentItems.length} data</div>
            </div>
            <button type="button" onClick={loadData} style={btnStyle(C.blue)}>
              Muat Ulang
            </button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.card2 }}>
                  {headers.map((header) => (
                    <th key={header} style={{ padding: "12px 14px", textAlign: "left", color: C.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderRows()}</tbody>
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

function TableRow({ columns, onEdit, onDelete }) {
  return (
    <tr style={{ borderTop: `1px solid ${C.border}` }}>
      {columns.map((column, index) => (
        <td key={index} style={{ padding: "12px 14px", color: C.text }}>
          {column}
        </td>
      ))}
      <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={onEdit} style={miniButton(C.blue)}>Edit</button>
          <button type="button" onClick={onDelete} style={miniButton(C.red)}>Hapus</button>
        </div>
      </td>
    </tr>
  );
}

function EmptyState({ text, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 24, textAlign: "center", color: C.textMuted }}>
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
