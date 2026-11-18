"use client";

import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import type { Template, TemplatePalette } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";

const PRESETS: { nama: string; palette: TemplatePalette }[] = [
  {
    nama: "Krem hangat",
    palette: { bg: "#FFF8EE", surface: "#FFFFFF", ink: "#2B1D0E", muted: "#8A6D4B", accent: "#B45309", accentInk: "#FFFFFF" },
  },
  {
    nama: "Teal bersih",
    palette: { bg: "#F0FDFA", surface: "#FFFFFF", ink: "#134E4A", muted: "#5F7A77", accent: "#0F766E", accentInk: "#FFFFFF" },
  },
  {
    nama: "Gelap tegas",
    palette: { bg: "#0F172A", surface: "#1E293B", ink: "#F8FAFC", muted: "#94A3B8", accent: "#F59E0B", accentInk: "#0F172A" },
  },
];

function TemplatePreview({ template }: { template: Template }) {
  const p = template.config.palette;
  return (
    <div className="overflow-hidden rounded-xl border border-line" style={{ background: p.bg }}>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: p.accent }}>
          {template.kategori}
        </p>
        <p className="mt-1 text-lg font-bold leading-snug" style={{ color: p.ink }}>
          {template.config.heroCopy.title.replace("{nama}", "Nama Usaha").replace("{kota}", "Kotamu")}
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: p.muted }}>
          {template.config.heroCopy.subtitle}
        </p>
        <span
          className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold"
          style={{ background: p.accent, color: p.accentInk }}
        >
          {template.config.heroCopy.cta}
        </span>
      </div>
      <div className="space-y-2 px-5 pb-5">
        {template.config.sections.map((s) => (
          <div key={s.title} className="rounded-lg p-3" style={{ background: p.surface }}>
            <p className="text-xs font-bold" style={{ color: p.ink }}>{s.title}</p>
            <p className="mt-0.5 text-xs" style={{ color: p.muted }}>{s.items[0]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TemplatePage() {
  const { state } = useStore();
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [preset, setPreset] = useState(0);
  const [msg, setMsg] = useState("");

  // Template baru disimpan ke state lokal halaman ini saja (mode demo
  // tidak mempersist template kustom — lihat docs/SDD.md). Seed template
  // tetap yang utama.
  const [custom, setCustom] = useState<Template[]>([]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !kategori.trim()) return;
    const p = PRESETS[preset];
    const t: Template = {
      id: `tpl-custom-${Date.now().toString(36)}`,
      nama: nama.trim(),
      kategori: kategori.trim(),
      createdAt: new Date().toISOString(),
      config: {
        palette: p.palette,
        heroCopy: {
          title: "{nama} — Solusi Tepercaya di {kota}",
          subtitle: "Layanan profesional dengan harga transparan. Hubungi kami hari ini.",
          cta: "Chat WhatsApp",
        },
        sections: [
          { type: "layanan", title: "Layanan Kami", items: ["Layanan unggulan 1", "Layanan unggulan 2", "Layanan unggulan 3"] },
          { type: "info", title: "Jam & Lokasi", items: ["Buka Senin–Sabtu 08.00–18.00 WIB", "Lokasi strategis, mudah dijangkau"] },
        ],
      },
    };
    setCustom((c) => [t, ...c]);
    setMsg(`Template “${t.nama}” dibuat untuk sesi ini (tidak tersimpan permanen di mode demo).`);
    setNama("");
    setKategori("");
  }

  const all = [...custom, ...state.templates];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Template demo"
        subtitle="Setiap template membawa palet, copy hero, dan susunan section sendiri — demo terasa dibuat khusus untuk tiap usaha."
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {all.map((t) => (
          <Card key={t.id} className="overflow-hidden">
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-ink">{t.nama}</h2>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-ink-soft ring-1 ring-line">
                  {t.kategori}
                </span>
              </div>
              <div className="mt-3 flex gap-2" aria-label={`Palet ${t.nama}`}>
                {Object.values(t.config.palette).map((c) => (
                  <span key={c} className="h-6 flex-1 rounded-md border border-line" style={{ background: c }} title={c} />
                ))}
              </div>
            </div>
            <div className="p-5">
              <TemplatePreview template={t} />
              <p className="mt-3 text-xs text-ink-soft">
                Dipakai {state.demos.filter((d) => d.templateId === t.id).length} demo · dibuat{" "}
                {new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-bold text-ink">Buat template baru (sesi ini)</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Template kustom hanya hidup selama sesi browser ini — mode demo belum mempersist template ke penyimpanan.
          Template permanen didefinisikan di seed / database (lihat docs/SCHEMA.md).
        </p>
        <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-medium text-ink">
            Nama template
            <input value={nama} onChange={(e) => setNama(e.target.value)} placeholder="cth. Toko & Retail" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
          </label>
          <label className="text-sm font-medium text-ink">
            Kategori
            <input value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="cth. Retail" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
          </label>
          <label className="text-sm font-medium text-ink">
            Palet warna
            <select value={preset} onChange={(e) => setPreset(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand">
              {PRESETS.map((p, i) => (
                <option key={p.nama} value={i}>{p.nama}</option>
              ))}
            </select>
          </label>
          <div className="sm:col-span-3">
            <button type="submit" className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700">
              + Buat template
            </button>
            {msg && <p className="mt-2 text-sm font-medium text-brand-deep">{msg}</p>}
          </div>
        </form>
      </Card>
    </div>
  );
}
