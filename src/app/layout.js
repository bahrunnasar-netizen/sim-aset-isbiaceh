import "./globals.css";

export const metadata = {
  title: "SIMA - ISBI Aceh",
  description: "Sistem Informasi Manajemen Aset Institut Seni Budaya Indonesia Aceh",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
