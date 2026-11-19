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
  metadataBase: new URL("https://prospectingengine.pages.dev"),
  title: "Prospecting Engine — Cari Usaha Tanpa Website, Kirim Demo, Closing Deal",
  description:
    "Mesin prospeksi untuk jasa pembuatan website: temukan usaha lokal tanpa website, kelola pipeline penjualan, buat demo website personal, dan pantau siapa yang membukanya — semua dari satu dashboard.",
  openGraph: {
    title: "Prospecting Engine — Cari Usaha Tanpa Website, Kirim Demo, Closing Deal",
    description:
      "Mesin prospeksi untuk jasa pembuatan website: temukan usaha lokal tanpa website, kelola pipeline penjualan, buat demo website personal, dan pantau siapa yang membukanya — semua dari satu dashboard.",
    url: "https://prospectingengine.pages.dev",
    siteName: "Prospecting Engine",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Landing Prospecting Engine — dashboard pipeline prospek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prospecting Engine — Cari Usaha Tanpa Website, Kirim Demo, Closing Deal",
    description:
      "Mesin prospeksi untuk jasa pembuatan website: temukan usaha lokal tanpa website, kelola pipeline penjualan, buat demo website personal, dan pantau siapa yang membukanya — semua dari satu dashboard.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
