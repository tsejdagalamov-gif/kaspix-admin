import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaspix - Удостоверение личности",
  description: "Загрузка документов и реквизитов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
