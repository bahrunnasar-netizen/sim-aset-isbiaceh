"use client";
import { C, btnStyle } from "./constants";

export function CetakBAST({ bast, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date();
  const hariList = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const bulanList = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const angkaList = ["","Satu","Dua","Tiga","Empat","Lima","Enam","Tujuh","Delapan","Sembilan","Sepuluh","Sebelas","Dua Belas","Tiga Belas","Empat Belas","Lima Belas","Enam Belas","Tujuh Belas","Delapan Belas","Sembilan Belas","Dua Puluh","Dua Puluh Satu","Dua Puluh Dua","Dua Puluh Tiga","Dua Puluh Empat","Dua Puluh Lima","Dua Puluh Enam","Dua Puluh Tujuh","Dua Puluh Delapan","Dua Puluh Sembilan","Tiga Puluh","Tiga Puluh Satu"];
  const tahunTeks = (y) => {
    const ribuan = Math.floor(y/1000);
    const ratusan = Math.floor((y%1000)/100);
    const puluhan = y%100;
    let hasil = "";
    if(ribuan) hasil += angkaList[ribuan]+" Ribu ";
    if(ratusan) hasil += angkaList[ratusan]+" Ratus ";
    if(puluhan) hasil += angkaList[puluhan];
    return hasil.trim();
  };

  const tglHari  = hariList[today.getDay()];
  const tglTgl   = angkaList[today.getDate()];
  const tglBulan = bulanList[today.getMonth()];
  const tglTahun = tahunTeks(today.getFullYear());
  const tglTA    = today.getFullYear();

  return (
    <>
      {/* CSS Print */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #cetak-bast, #cetak-bast * { visibility: visible !important; }
          #cetak-bast { position: fixed !important; top: 0; left: 0; width: 100%; z-index: 99999; background: white !important; }
          .no-print { display: none !important; }
        }
        #cetak-bast {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          color: #000;
          background: white;
          padding: 0;
        }
        .bast-page {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 25mm 25mm 20mm 30mm;
          background: white;
          color: black;
          box-sizing: border-box;
        }
        .bast-tabel { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .bast-tabel td, .bast-tabel th {
          border: 1px solid #000;
          padding: 5px 8px;
          font-size: 11pt;
          vertical-align: top;
        }
        .bast-tabel th { text-align: center; font-weight: bold; background: #f0f0f0; }
        .ttd-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .ttd-table td { padding: 5px 10px; vertical-align: top; width: 33.3%; text-align: center; }
      `}</style>

      {/* Overlay */}
      <div style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"rgba(0,0,0,0.85)",
        display:"flex", flexDirection:"column",
        alignItems:"center", overflowY:"auto",
        padding:"20px",
      }}>
        {/* Tombol aksi */}
        <div className="no-print" style={{
          display:"flex", gap:12, marginBottom:20,
          position:"sticky", top:0, zIndex:10000,
          background:"rgba(0,0,0,0.7)", padding:"10px 20px",
          borderRadius:12, backdropFilter:"blur(4px)",
        }}>
          <button onClick={handlePrint} style={btnStyle(C.primary, true)}>
            🖨️ Cetak / Print
          </button>
          <button onClick={onClose} style={btnStyle(C.red)}>
            ✕ Tutup
          </button>
          <span style={{ color:"#aaa", fontSize:12, alignSelf:"center" }}>
            💡 Gunakan Ctrl+P untuk print, pilih "Save as PDF" untuk simpan
          </span>
        </div>

        {/* Dokumen BAST */}
        <div id="cetak-bast">
          <div className="bast-page">

            {/* KOP SURAT */}
            <table style={{ width:"100%", borderCollapse:"collapse", borderBottom:"3px solid #000", paddingBottom:8, marginBottom:8 }}>
              <tbody>
                <tr>
                  <td style={{ width:80, textAlign:"center", verticalAlign:"middle" }}>
                    {/* Logo ISBI placeholder */}
                    <div style={{
                      width:70, height:70, border:"2px solid #000",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:10, textAlign:"center", margin:"0 auto",
                      fontWeight:"bold",
                    }}>LOGO<br/>ISBI</div>
                  </td>
                  <td style={{ textAlign:"center", verticalAlign:"middle", paddingLeft:10 }}>
                    <div style={{ fontSize:"13pt", fontWeight:"bold", textTransform:"uppercase" }}>
                      KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET DAN TEKNOLOGI
                    </div>
                    <div style={{ fontSize:"14pt", fontWeight:"bold", textTransform:"uppercase", marginTop:2 }}>
                      INSTITUT SENI BUDAYA INDONESIA ACEH
                    </div>
                    <div style={{ fontSize:"10pt", marginTop:2 }}>
                      Jl. Transmigrasi No.6, Gampong Jawa, Kec. Kuta Raja, Kota Banda Aceh 23121
                    </div>
                    <div style={{ fontSize:"10pt" }}>
                      Laman: www.isbiaceh.ac.id · Email: info@isbiaceh.ac.id
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* JUDUL */}
            <div style={{ textAlign:"center", margin:"16px 0 8px" }}>
              <div style={{ fontSize:"13pt", fontWeight:"bold", textDecoration:"underline", textTransform:"uppercase" }}>
                BERITA ACARA SERAH TERIMA BARANG MILIK NEGARA
              </div>
              <div style={{ fontSize:"12pt", marginTop:4 }}>
                Nomor : {bast.no_bast}
              </div>
            </div>

            {/* PEMBUKA */}
            <div style={{ margin:"16px 0", textAlign:"justify", lineHeight:1.8 }}>
              <p style={{ margin:"0 0 10px" }}>
                Pada hari ini <strong>{tglHari}</strong> tanggal <strong>{tglTgl}</strong> bulan <strong>{tglBulan}</strong> tahun <strong>{tglTahun}</strong>, Kami yang bertanda tangan dibawah ini :
              </p>
            </div>

            {/* PIHAK */}
            <table style={{ width:"100%", marginBottom:12 }}>
              <tbody>
                <tr>
                  <td style={{ width:120, verticalAlign:"top", paddingBottom:8 }}>Nama</td>
                  <td style={{ width:10, verticalAlign:"top", paddingBottom:8 }}>:</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8, fontWeight:"bold" }}>
                    Ika Ariyanti, S.Si.,M.Si.
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>Jabatan</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>:</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>
                    Kepala Subbagian Umum, Bagian Perencanaan, Keuangan, dan Umum
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ paddingBottom:12 }}>
                    Selanjutnya disebut <strong>PIHAK PERTAMA</strong>
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>Nama</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>:</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8, fontWeight:"bold" }}>
                    {bast.penerima}
                  </td>
                </tr>
                <tr>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>Jabatan</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>:</td>
                  <td style={{ verticalAlign:"top", paddingBottom:8 }}>{bast.jabatan}</td>
                </tr>
                <tr>
                  <td colSpan={3} style={{ paddingBottom:12 }}>
                    Selanjutnya disebut <strong>PIHAK KEDUA</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PERNYATAAN */}
            <p style={{ margin:"0 0 12px", lineHeight:1.8, textAlign:"justify" }}>
              PIHAK PERTAMA menyerahkan barang kepada PIHAK KEDUA, dan PIHAK KEDUA menyatakan telah menerima barang dari PIHAK PERTAMA berupa:
            </p>

            {/* TABEL BARANG */}
            <table className="bast-tabel">
              <thead>
                <tr>
                  <th style={{ width:30 }}>No</th>
                  <th>Nama Barang</th>
                  <th>Merk / Spesifikasi</th>
                  <th style={{ width:40 }}>Jlh</th>
                  <th style={{ width:50 }}>Satuan</th>
                  <th style={{ width:50 }}>T.A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign:"center" }}>1.</td>
                  <td>{bast.aset_nama}</td>
                  <td>{bast.spesifikasi || `NUP: ${bast.aset_id} · Kondisi: ${bast.kondisi}`}</td>
                  <td style={{ textAlign:"center" }}>1</td>
                  <td style={{ textAlign:"center" }}>Unit</td>
                  <td style={{ textAlign:"center" }}>{tglTA}</td>
                </tr>
                {/* Baris kosong tambahan */}
                {[1,2].map(i => (
                  <tr key={i}>
                    <td style={{ height:24 }}>&nbsp;</td>
                    <td></td><td></td><td></td><td></td><td></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* KETENTUAN */}
            <div style={{ margin:"16px 0", lineHeight:1.8 }}>
              <p style={{ margin:"0 0 8px" }}>Adapun ketentuan bahwa :</p>
              <table style={{ width:"100%" }}>
                <tbody>
                  <tr>
                    <td style={{ width:24, verticalAlign:"top" }}>1.</td>
                    <td style={{ textAlign:"justify" }}>
                      Berita acara serah terima barang ini di perbuat oleh kedua belah pihak, dan barang-barang tersebut dalam keadaan baik dan cukup, sejak penandatanganan berita acara ini, maka barang tersebut, menjadi tanggung jawab PIHAK KEDUA dan tetap melakukan Koordinasi dengan PIHAK PERTAMA, memelihara dan merawat dengan baik serta dipergunakan untuk keperluan operasional Kedinasan Institut Seni Budaya Indonesia Aceh.
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign:"top" }}>2.</td>
                    <td style={{ textAlign:"justify" }}>
                      Barang Milik Negara ini diserahkan dalam bentuk pinjam pakai untuk keperluan kedinasan dan akan di ambil kembali dikemudian hari sesuai dengan ketentuan yang berlaku.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TANDA TANGAN */}
            <table className="ttd-table">
              <tbody>
                <tr>
                  <td style={{ textAlign:"center" }}>
                    <div>Yang Menerima</div>
                    <div><strong>PIHAK KEDUA</strong></div>
                    <div style={{ marginTop:70, borderTop:"1px solid #000", paddingTop:4 }}>
                      <strong>{bast.penerima}</strong>
                    </div>
                    <div style={{ fontSize:"10pt" }}>NIP. {bast.nip}</div>
                  </td>
                  <td style={{ textAlign:"center" }}>
                    <div>Yang Menyerahkan</div>
                    <div><strong>PIHAK PERTAMA</strong></div>
                    <div style={{ marginTop:70, borderTop:"1px solid #000", paddingTop:4 }}>
                      <strong>Ika Ariyanti, S.Si.,M.Si.</strong>
                    </div>
                    <div style={{ fontSize:"10pt" }}>NIP. 198408152019032011</div>
                  </td>
                  <td style={{ textAlign:"center" }}>
                    <div>Mengetahui,</div>
                    <div style={{ fontSize:"10pt", textTransform:"uppercase", fontWeight:"bold" }}>
                      KABAG PERENCANAAN,<br/>KEUANGAN, DAN UMUM
                    </div>
                    <div style={{ marginTop:55, borderTop:"1px solid #000", paddingTop:4 }}>
                      <strong>Al Munzir, S.Pd.I.,M.Si.</strong>
                    </div>
                    <div style={{ fontSize:"10pt" }}>NIP. 198202222003121004</div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </>
  );
}
