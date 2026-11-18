import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prospecting Engine — Cari Usaha Tanpa Website, Kirim Demo, Closing Deal",
  description:
    "Mesin prospeksi untuk jasa pembuatan website: temukan usaha lokal tanpa website, kelola pipeline penjualan, buat demo website personal, dan pantau siapa yang membukanya — semua dari satu dashboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
