import { inflateRawSync } from "node:zlib";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AssetCondition, AssetOwnershipType, AssetStatus, AssetType } from "@/generated/prisma";

export const dynamic = "force-dynamic";

const TEXT_DECODER = new TextDecoder("utf-8");

function badRequest(message, details = {}) {
  return NextResponse.json({ error: message, ...details }, { status: 400 });
}

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeKey(value) {
  return normalize(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function parseNumber(value) {
  const raw = normalize(value);
  if (!raw) return null;
  const normalized = raw.replace(/[^\d,-]/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseYear(value) {
  const raw = normalize(value);
  const year = raw.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year) return Number(year);

  if (/^\d+(\.\d+)?$/.test(raw)) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + Number(raw) * 24 * 60 * 60 * 1000);
    const parsedYear = date.getUTCFullYear();
    return parsedYear >= 1900 && parsedYear <= 2200 ? parsedYear : null;
  }

  return null;
}

function decodeXml(value) {
  return String(value ?? "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        i += 1;
      } else if (char === "\"") {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === "\"") quoted = true;
    else if (char === "," || char === ";") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((item) => item.some((cellValue) => normalize(cellValue)));
}

function readZipEntries(buffer) {
  const entries = new Map();
  let offset = 0;

  while (offset < buffer.length - 30) {
    const signature = buffer.readUInt32LE(offset);
    if (signature !== 0x04034b50) {
      offset += 1;
      continue;
    }

    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const fileNameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const nameStart = offset + 30;
    const dataStart = nameStart + fileNameLength + extraLength;
    const fileName = buffer.subarray(nameStart, nameStart + fileNameLength).toString("utf8");
    const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

    if (method === 0) entries.set(fileName, compressed);
    if (method === 8) entries.set(fileName, inflateRawSync(compressed));

    offset = dataStart + compressedSize;
  }

  return entries;
}

function columnIndex(cellRef) {
  const letters = cellRef.match(/[A-Z]+/)?.[0] ?? "A";
  return [...letters].reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function parseSharedStrings(xml) {
  return [...xml.matchAll(/<si\b[\s\S]*?<\/si>/g)].map(([item]) => {
    const texts = [...item.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((match) => decodeXml(match[1]));
    return texts.join("");
  });
}

function parseWorksheetRows(xml, sharedStrings) {
  const rows = [];
  const rowMatches = xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g);

  for (const rowMatch of rowMatches) {
    const values = [];
    const cellMatches = rowMatch[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g);

    for (const cellMatch of cellMatches) {
      const attrs = cellMatch[1];
      const body = cellMatch[2];
      const ref = attrs.match(/\br="([^"]+)"/)?.[1] ?? "A";
      const type = attrs.match(/\bt="([^"]+)"/)?.[1] ?? "";
      const index = columnIndex(ref);
      const rawValue = body.match(/<v[^>]*>([\s\S]*?)<\/v>/)?.[1] ?? "";
      const inlineValue = [...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)]
        .map((match) => decodeXml(match[1]))
        .join("");

      if (type === "s") values[index] = sharedStrings[Number(rawValue)] ?? "";
      else if (type === "inlineStr") values[index] = inlineValue;
      else values[index] = decodeXml(rawValue);
    }

    rows.push(values.map((value) => normalize(value)));
  }

  return rows.filter((item) => item.some(Boolean));
}

function parseXlsx(buffer) {
  const entries = readZipEntries(Buffer.from(buffer));
  const sheetName = [...entries.keys()].find((name) => /^xl\/worksheets\/sheet\d+\.xml$/.test(name));

  if (!sheetName) throw new Error("Worksheet Excel tidak ditemukan.");

  const sharedXml = entries.has("xl/sharedStrings.xml")
    ? entries.get("xl/sharedStrings.xml").toString("utf8")
    : "";
  const sheetXml = entries.get(sheetName).toString("utf8");
  return parseWorksheetRows(sheetXml, parseSharedStrings(sharedXml));
}

function findHeaderRow(rows) {
  let best = { index: -1, score: 0 };

  rows.forEach((row, index) => {
    const keys = row.map(normalizeKey);
    const hasCode = keys.some((key) => key.includes("kodebarang") || key.includes("kodeaset") || key.includes("kodebmn"));
    const hasName = keys.some((key) => key.includes("namabarang") || key.includes("namaaset"));
    const hasNup = keys.some((key) => key === "nup");
    if (!hasCode || (!hasName && !hasNup)) return;

    const score = [
      hasCode,
      hasName,
      hasNup,
      keys.some((key) => key.includes("nilaibmn") || key.includes("nilaiperolehan") || key.includes("nilai")),
      keys.some((key) => key.includes("tahunperolehan") || key === "tahun"),
    ].filter(Boolean).length;

    if (score > best.score) best = { index, score };
  });

  if (best.score < 2) throw new Error("Header kolom SIMAN tidak dikenali.");
  return best.index;
}

function valueByAliases(row, header, aliases) {
  const wanted = aliases.map(normalizeKey);
  const index = header.findIndex((label) => {
    const key = normalizeKey(label);
    return wanted.some((alias) => key === alias || key.includes(alias));
  });
  return index >= 0 ? normalize(row[index]) : "";
}

function looksLikeVehicle(code, category, name) {
  if (normalize(code).startsWith("30201")) return true;
  return /\b(kendaraan|sepeda motor|sedan|pick up|mini bus|micro bus|mobil dinas|bus)\b/i.test(
    `${category} ${name}`,
  );
}

function buildCode(row, header) {
  const direct = valueByAliases(row, header, ["kode aset", "kodeaset", "kode bmn", "kodebmn", "kode"]);
  if (direct && !/^\d+$/.test(direct)) return direct.toUpperCase();

  const codeBarang = valueByAliases(row, header, ["kode barang", "kodebarang"]);
  const nup = valueByAliases(row, header, ["nup"]);
  if (codeBarang && nup) return `SIMAN-${codeBarang}-${nup}`.toUpperCase();
  if (direct) return `SIMAN-${direct}`.toUpperCase();
  return "";
}

function mapRowsToAssets(rows) {
  const headerIndex = findHeaderRow(rows);
  const header = rows[headerIndex];
  const dataRows = rows.slice(headerIndex + 1);
  const assets = [];
  const errors = [];
  const skipped = [];
  const seen = new Set();

  dataRows.forEach((row, rowOffset) => {
    const rowNumber = headerIndex + rowOffset + 2;
    const firstCell = normalize(row[0]).toUpperCase();
    const normalizedCells = row.map(normalizeKey);
    const isSubHeader = normalizedCells.some((cell) => ["mesin", "rangka", "polisi"].includes(cell));
    const isNumberingRow = row.filter((cell, index) => normalize(cell) === String(index + 1)).length >= 4;
    if (!row.some((cell) => normalize(cell)) || firstCell === "TOTAL") return;
    if (isSubHeader || isNumberingRow) return;

    const codeBarang = valueByAliases(row, header, ["kode barang", "kodebarang"]);
    const code = buildCode(row, header);
    const name = valueByAliases(row, header, ["nama barang", "namabarang", "nama aset", "namaaset", "nama"]);
    const category = valueByAliases(row, header, ["kategori", "jenis barang", "jenisbarang", "nama barang", "namabarang"]) || "Aset BMN";
    const nup = valueByAliases(row, header, ["nup"]);
    const value = valueByAliases(row, header, ["nilai bmn", "nilaibmn", "nilai perolehan", "nilaiperolehan", "nilai"]);
    const year = valueByAliases(row, header, [
      "tanggal perolehan",
      "tanggalperolehan",
      "tahun perolehan",
      "tahunperolehan",
      "tahun",
    ]);
    const room = valueByAliases(row, header, ["ruangan", "lokasi", "nama ruang", "namaruang"]);
    const condition = valueByAliases(row, header, ["kondisi"]);
    const status = valueByAliases(row, header, ["status"]);

    if (!code || !name) {
      errors.push({ rowNumber, message: "Kode aset atau nama aset kosong." });
      return;
    }

    if (seen.has(code)) {
      errors.push({ rowNumber, message: `Kode aset duplikat di file: ${code}.` });
      return;
    }
    seen.add(code);

    if (looksLikeVehicle(codeBarang, category, name)) {
      skipped.push({ rowNumber, code, name, reason: "Kendaraan dikelola di modul Kendaraan BMN." });
      return;
    }

    const merk = valueByAliases(row, header, ["merek", "merk", "merek tipe", "merek/tipe"]);
    const noPolisi = valueByAliases(row, header, ["no polisi", "nopol", "nomor polisi"]);
    const noDokumen = valueByAliases(row, header, ["no dokumen", "nomor dokumen"]);
    const noBpkp = valueByAliases(row, header, ["no bpkp"]);
    const noPsp = valueByAliases(row, header, ["no psp"]);
    const alamat = valueByAliases(row, header, ["alamat"]);
    const pengguna = valueByAliases(row, header, ["pengguna"]);
    const noIdentitas = valueByAliases(row, header, ["no identitas", "nomor identitas"]);
    const namaPengguna = valueByAliases(row, header, ["nama pengguna"]);
    const statusPmk = valueByAliases(row, header, ["status pmk"]);
    const hentiGuna = valueByAliases(row, header, ["henti guna"]);
    const nilaiPenyusutan = valueByAliases(row, header, ["nilai penyusutan"]);
    const nilaiBuku = valueByAliases(row, header, ["nilai buku"]);

    assets.push({
      rowNumber,
      code,
      nup: nup || null,
      name,
      category,
      assetType: AssetType.UMUM,
      ownershipType: AssetOwnershipType.SHARED,
      condition: /rusak\s*berat/i.test(condition)
        ? AssetCondition.RUSAK_BERAT
        : /rusak/i.test(condition)
          ? AssetCondition.RUSAK_RINGAN
          : AssetCondition.BAIK,
      status: /hilang/i.test(status)
        ? AssetStatus.HILANG
        : /tidak\s*aktif|hapus/i.test(status)
          ? AssetStatus.TIDAK_AKTIF
          : /ya/i.test(hentiGuna)
            ? AssetStatus.TIDAK_AKTIF
          : AssetStatus.TERSEDIA,
      acquisitionValue: parseNumber(value),
      acquisitionYear: parseYear(year),
      sourceData: "SIMAN_V2_IMPORT",
      ruanganName: room,
      specification: [
        codeBarang ? `Kode Barang: ${codeBarang}` : "",
        merk ? `Merek/Tipe: ${merk}` : "",
        noPolisi && noPolisi !== "-" ? `No Polisi: ${noPolisi}` : "",
        noDokumen ? `No Dokumen: ${noDokumen}` : "",
        noBpkp ? `No BPKP: ${noBpkp}` : "",
        noPsp ? `No PSP: ${noPsp}` : "",
        nilaiPenyusutan ? `Nilai Penyusutan: ${nilaiPenyusutan}` : "",
        nilaiBuku ? `Nilai Buku: ${nilaiBuku}` : "",
        alamat ? `Alamat: ${alamat}` : "",
        room ? `Lokasi SIMAN: ${room}` : "",
        pengguna ? `Pengguna: ${pengguna}` : "",
        noIdentitas ? `No Identitas: ${noIdentitas}` : "",
        namaPengguna ? `Nama Pengguna: ${namaPengguna}` : "",
        statusPmk ? `Status PMK: ${statusPmk}` : "",
        hentiGuna ? `Henti Guna: ${hentiGuna}` : "",
        `Sumber import: SIMAN v2`,
      ]
        .filter(Boolean)
        .join("; "),
    });
  });

  return { assets, errors, skipped, headerRow: headerIndex + 1 };
}

async function readRowsFromFile(file) {
  const buffer = await file.arrayBuffer();
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) return parseCsv(TEXT_DECODER.decode(buffer));
  if (name.endsWith(".xlsx")) return parseXlsx(buffer);
  throw new Error("Format file belum didukung. Gunakan .xlsx atau .csv.");
}

async function roomMapByName() {
  const rooms = await prisma.ruangan.findMany({ select: { id: true, name: true, code: true } });
  const map = new Map();

  for (const room of rooms) {
    map.set(normalizeKey(room.name), room.id);
    map.set(normalizeKey(room.code), room.id);
  }

  return map;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const commit = formData.get("commit") === "true";

    if (!file || typeof file.arrayBuffer !== "function") {
      return badRequest("File SIMAN wajib diunggah.");
    }

    const rows = await readRowsFromFile(file);
    const { assets, errors, skipped, headerRow } = mapRowsToAssets(rows);
    const preview = assets.slice(0, 10);

    if (!commit) {
      return NextResponse.json({
        mode: "preview",
        fileName: file.name,
        headerRow,
        totalRows: rows.length,
        validRows: assets.length,
        skippedRows: skipped.length,
        errorRows: errors.length,
        preview,
        skipped: skipped.slice(0, 10),
        errors: errors.slice(0, 10),
      });
    }

    if (errors.length > 0) {
      return badRequest("Masih ada data error. Perbaiki file sebelum disimpan.", {
        errors: errors.slice(0, 10),
      });
    }

    const rooms = await roomMapByName();
    const result = { created: 0, updated: 0, skipped: skipped.length };

    await prisma.$transaction(async (tx) => {
      for (const asset of assets) {
        const ruanganId = asset.ruanganName ? rooms.get(normalizeKey(asset.ruanganName)) ?? null : null;
        const existing = await tx.asset.findUnique({ where: { code: asset.code }, select: { id: true } });
        const data = {
          code: asset.code,
          nup: asset.nup,
          name: asset.name,
          category: asset.category,
          assetType: asset.assetType,
          ownershipType: asset.ownershipType,
          condition: asset.condition,
          status: asset.status,
          acquisitionValue: asset.acquisitionValue,
          acquisitionYear: asset.acquisitionYear,
          specification: asset.specification,
          sourceData: asset.sourceData,
          ruanganId,
          prodiOwnerId: null,
          unitPenanggungJawabId: null,
        };

        await tx.asset.upsert({
          where: { code: asset.code },
          create: data,
          update: data,
        });

        if (existing) result.updated += 1;
        else result.created += 1;
      }
    });

    return NextResponse.json({
      mode: "commit",
      totalImported: assets.length,
      ...result,
      skipped,
      message: `${result.created} aset baru, ${result.updated} aset diperbarui.`,
    });
  } catch (error) {
    console.error("POST /api/master/assets/import failed:", error);
    return badRequest(error?.message || "Gagal mengimpor data SIMAN.");
  }
}
