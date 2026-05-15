"use client";

import { useState } from "react";
import { C, btnStyle } from "./constants";

export default function ImportSimanPage({ showNotif }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [busy, setBusy] = useState(false);

  async function uploadSiman(commit = false) {
    if (!file) {
      showNotif("Pilih file SIMAN dulu.", "error");
      return;
    }

    setBusy(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("commit", commit ? "true" : "false");

      const response = await fetch("/api/master/assets/import", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Import SIMAN gagal.");
      }

      if (commit) {
        showNotif(result.message || "Data SIMAN berhasil disimpan.");
        setPreview(null);
        setFile(null);
      } else {
        setPreview(result);
        showNotif("Preview import berhasil dibuat.");
      }
    } catch (error) {
      showNotif(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  const activeStep = preview ? 2 : file ? 1 : 0;

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 800 }}>Import Data SIMAN v2</h2>
      <p style={{ margin: "0 0 28px", color: C.textMuted, fontSize: 13 }}>
        Import file Excel/CSV hasil ekspor SIMAN v2 ke master aset BMN.
      </p>

      <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
        {["Export SIMAN", "Upload", "Validasi", "Simpan"].map((label, index) => (
          <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  margin: "0 auto 6px",
                  background: index <= activeStep ? C.primary : C.card2,
                  border: `2px solid ${index <= activeStep ? C.primary : C.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: index <= activeStep ? "white" : C.textDim,
                }}
              >
                {index < activeStep ? "OK" : index + 1}
              </div>
              <div style={{ fontSize: 11, color: index <= activeStep ? C.primary : C.textDim, whiteSpace: "nowrap" }}>
                {label}
              </div>
            </div>
            {index < 3 && (
              <div style={{ height: 2, flex: "0 0 20px", background: index < activeStep ? C.primary : C.border }} />
            )}
          </div>
        ))}
      </div>

      {!preview ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,1fr) minmax(280px,1fr)", gap: 16 }}>
          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Panduan Singkat</div>
            {[
              "Buka SIMAN v2 dan masuk sebagai operator satker.",
              "Buka laporan atau daftar aset BMN.",
              "Export data ke Excel (.xlsx) atau CSV.",
              "Pastikan kolom kode barang, NUP, nama barang, tahun, dan nilai ikut terbawa.",
              "Upload file di panel kanan untuk preview.",
              "Periksa preview, lalu simpan ke database.",
            ].map((item, index) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "7px 0",
                  fontSize: 13,
                  color: C.textMuted,
                  borderBottom: index < 5 ? `1px dashed ${C.border}` : "none",
                }}
              >
                <span
                  style={{
                    background: C.primary,
                    color: "white",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              background: C.card,
              borderRadius: 14,
              border: `2px dashed ${C.border}`,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12, color: C.blue, fontWeight: 900 }}>XLSX</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Upload File SIMAN v2</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Format: .xlsx / .csv</div>
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                setPreview(null);
              }}
              style={{
                width: "100%",
                maxWidth: 360,
                padding: 10,
                borderRadius: 8,
                background: C.card2,
                border: `1px solid ${C.border}`,
                color: C.text,
              }}
            />
            {file && (
              <div style={{ marginTop: 12, fontSize: 12, color: C.textMuted }}>
                File dipilih: <span style={{ color: C.text }}>{file.name}</span>
              </div>
            )}
            <button
              disabled={busy || !file}
              onClick={() => uploadSiman(false)}
              style={{ ...btnStyle(C.primary, true), marginTop: 18, opacity: busy || !file ? 0.65 : 1 }}
            >
              {busy ? "Memproses..." : "Preview & Validasi"}
            </button>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 12 }}>
              Data kendaraan akan dilewati karena sudah dikelola di modul Kendaraan BMN.
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              background: preview.errorRows ? C.accentDim : C.primaryDim,
              border: `1px solid ${preview.errorRows ? C.accent : C.primary}44`,
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 22 }}>{preview.errorRows ? "!" : "✓"}</span>
            <div>
              <div style={{ fontWeight: 700, color: preview.errorRows ? C.accent : C.primary }}>
                {preview.errorRows ? "Ada baris yang perlu diperbaiki." : "Validasi berhasil. Siap disimpan."}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                {preview.validRows} valid - {preview.skippedRows} dilewati - {preview.errorRows} error
              </div>
            </div>
          </div>

          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Ringkasan Import</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
              {[
                ["Baris Terbaca", preview.totalRows, C.blue],
                ["Data Valid", preview.validRows, C.primary],
                ["Dilewati", preview.skippedRows, C.accent],
                ["Error", preview.errorRows, C.red],
              ].map(([label, value, color]) => (
                <div key={label} style={{ textAlign: "center", padding: 12, background: `${color}11`, borderRadius: 10 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, overflowX: "auto", marginBottom: 16 }}>
            <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 14, fontWeight: 700 }}>
              Preview Data Valid
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: C.card2 }}>
                  {["Baris", "Kode", "NUP", "Nama Aset", "Kategori", "Nilai", "Tahun"].map((header) => (
                    <th key={header} style={{ padding: "10px 12px", textAlign: "left", color: C.textMuted, whiteSpace: "nowrap" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(preview.preview || []).map((item) => (
                  <tr key={`${item.rowNumber}-${item.code}`} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "10px 12px" }}>{item.rowNumber}</td>
                    <td style={{ padding: "10px 12px", color: C.blue, fontWeight: 700 }}>{item.code}</td>
                    <td style={{ padding: "10px 12px", color: C.textMuted }}>{item.nup || "-"}</td>
                    <td style={{ padding: "10px 12px" }}>{item.name}</td>
                    <td style={{ padding: "10px 12px", color: C.textMuted }}>{item.category}</td>
                    <td style={{ padding: "10px 12px" }}>
                      {item.acquisitionValue ? `Rp ${Number(item.acquisitionValue).toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{item.acquisitionYear || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(preview.errors?.length > 0 || preview.skipped?.length > 0) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12, marginBottom: 16 }}>
              {preview.errors?.length > 0 && (
                <NoticeList title="Error" color={C.red} items={preview.errors.map((item) => `Baris ${item.rowNumber}: ${item.message}`)} />
              )}
              {preview.skipped?.length > 0 && (
                <NoticeList
                  title="Dilewati"
                  color={C.accent}
                  items={preview.skipped.map((item) => `Baris ${item.rowNumber}: ${item.name} (${item.reason})`)}
                />
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => { setFile(null); setPreview(null); }} style={btnStyle(C.textDim)}>
              Upload Ulang
            </button>
            <button
              disabled={busy || preview.errorRows > 0 || preview.validRows === 0}
              onClick={() => uploadSiman(true)}
              style={{ ...btnStyle(C.primary, true), opacity: busy || preview.errorRows > 0 || preview.validRows === 0 ? 0.65 : 1 }}
            >
              {busy ? "Menyimpan..." : "Simpan ke Database"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NoticeList({ title, color, items }) {
  return (
    <div style={{ background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontWeight: 700, color, marginBottom: 8 }}>{title}</div>
      {items.map((item) => (
        <div key={item} style={{ fontSize: 12, color: C.textMuted, marginBottom: 5 }}>
          {item}
        </div>
      ))}
    </div>
  );
}
