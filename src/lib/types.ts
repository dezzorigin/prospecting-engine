// Tipe data Prospecting Engine — cerminan 1:1 dari prisma/schema.prisma.
// Mode demo (yang di-deploy di Cloudflare Pages) menyimpan semua data di
// localStorage browser; skema Prisma adalah kontrak data untuk mode
// Postgres lokal (lihat docs/SCHEMA.md). Jangan ubah tipe ini tanpa
// mengubah schema.prisma juga.

export type Stage =
  | "baru"
  | "demo_siap"
  | "follow_up"
  | "negosiasi"
  | "deal"
  | "ditolak"
  | "hilang_kontak"
  | "ditunda";

export const STAGES: Stage[] = [
  "baru",
  "demo_siap",
  "follow_up",
  "negosiasi",
  "deal",
  "ditolak",
  "hilang_kontak",
  "ditunda",
];

export const STAGE_LABEL: Record<Stage, string> = {
  baru: "Baru",
  demo_siap: "Demo Siap",
  follow_up: "Follow-up",
  negosiasi: "Negosiasi",
  deal: "Deal",
  ditolak: "Ditolak",
  hilang_kontak: "Hilang Kontak",
  ditunda: "Ditunda",
};

// Stage yang masih "terbuka" (masuk pipeline aktif & nilai deal).
export const OPEN_STAGES: Stage[] = ["baru", "demo_siap", "follow_up", "negosiasi"];

export type ActivityType =
  | "catatan"
  | "wa_terkirim"
  | "demo_dikirim"
  | "demo_dilihat"
  | "panggilan"
  | "perubahan_stage";

export const ACTIVITY_LABEL: Record<ActivityType, string> = {
  catatan: "Catatan",
  wa_terkirim: "WA Terkirim",
  demo_dikirim: "Demo Dikirim",
  demo_dilihat: "Demo Dilihat",
  panggilan: "Panggilan",
  perubahan_stage: "Pindah Stage",
};

export interface Prospect {
  id: string;
  nama: string;
  kategori: string | null;
  kota: string | null;
  alamat: string | null;
  waNumber: string | null;
  rating: number | null;
  reviewCount: number | null;
  mapsUrl: string | null;
  /** null = belum punya website (target prospek utama). */
  website: string | null;
  source: string; // manual | discover
  stage: Stage;
  nextAction: string | null;
  dueAt: string | null; // ISO date
  /** dalam ribu rupiah. */
  dealValue: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  prospectId: string;
  type: ActivityType;
  content: string;
  createdAt: string;
}

export interface TemplatePalette {
  bg: string;
  surface: string;
  ink: string;
  muted: string;
  accent: string;
  accentInk: string;
}

export interface TemplateConfig {
  palette: TemplatePalette;
  heroCopy: { title: string; subtitle: string; cta: string };
  sections: { type: string; title: string; items: string[] }[];
}

export interface Template {
  id: string;
  nama: string;
  kategori: string;
  config: TemplateConfig;
  createdAt: string;
}

export interface DemoData {
  headline: string;
  subheadline: string;
  ctaText: string;
  sections: { type: string; title: string; items: string[] }[];
}

export interface Demo {
  id: string;
  prospectId: string;
  templateId: string;
  slug: string;
  data: DemoData;
  createdAt: string;
  sentAt: string | null;
  viewedAt: string | null;
}

export type DiscoverStatus = "pending" | "running" | "done" | "error";

export interface DiscoverResult {
  nama: string;
  kategori: string;
  kota: string;
  alamat: string;
  waNumber: string | null;
  rating: number | null;
  reviewCount: number | null;
  mapsUrl: string;
  website: string | null;
}

export interface DiscoverJob {
  id: string;
  keyword: string;
  kota: string;
  status: DiscoverStatus;
  error: string | null;
  results: DiscoverResult[] | null;
  createdAt: string;
  doneAt: string | null;
}

export interface StoreState {
  prospects: Prospect[];
  activities: Activity[];
  templates: Template[];
  demos: Demo[];
  jobs: DiscoverJob[];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function formatRupiahRibu(nilaiRibu: number | null | undefined): string {
  if (nilaiRibu == null) return "—";
  return `Rp${(nilaiRibu * 1000).toLocaleString("id-ID")}`;
}

export function waLink(waNumber: string | null, text: string): string | null {
  if (!waNumber) return null;
  const digits = waNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
