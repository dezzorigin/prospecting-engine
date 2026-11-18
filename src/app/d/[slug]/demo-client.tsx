"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { usePathSegment, useStore } from "@/lib/store";
import { seedState } from "@/lib/seed";
import { waLink } from "@/lib/types";

/** Halaman demo publik: mini-website atas nama satu prospek.
 *  Dibuka pemilik usaha dari link WA. Saat dibuka, demo dicatat
 *  "dilihat" (markDemoViewed) — sinyal follow-up terpanas di pipeline.
 *
 *  Render awal memakai seed (sinkron) supaya halaman seed punya konten
 *  di HTML statis; begitu store termuat dari localStorage, sumber data
 *  beralih ke state live. Penandaan "dilihat" baru jalan setelah
 *  store termuat — supaya tidak tertimpa pemuatan localStorage. */
export default function DemoClient() {
  const slug = usePathSegment();
  const { state, loaded, markDemoViewed } = useStore();
  const seed = useMemo(() => seedState(), []);
  const marked = useRef(false);

  const source = loaded ? state : seed;
  const demo = useMemo(
    () => (slug ? source.demos.find((d) => d.slug === slug) : undefined),
    [slug, source.demos]
  );
  const prospect = useMemo(
    () => (demo ? source.prospects.find((p) => p.id === demo.prospectId) : undefined),
    [demo, source.prospects]
  );
  const template = useMemo(
    () => (demo ? source.templates.find((t) => t.id === demo.templateId) : undefined),
    [demo, source.templates]
  );

  useEffect(() => {
    if (loaded && demo && !marked.current) {
      marked.current = true;
      markDemoViewed(demo.slug);
    }
  }, [loaded, demo, markDemoViewed]);

  if (!slug || (!loaded && !demo)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-paper">
        <p className="text-sm text-ink-soft">Memuat demo…</p>
      </main>
    );
  }

  if (!demo || !prospect || !template) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
        <p className="text-4xl" aria-hidden>⌖</p>
        <h1 className="mt-4 text-2xl font-bold text-ink">Demo tidak ditemukan</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
          Link demo ini dibuat di browser lain — data demo hanya tersimpan di browser
          pembuatnya (mode demo). Minta pengirim mengirim ulang linknya, atau buka
          contoh demo yang tersedia di semua browser.
        </p>
        <Link
          href="/d/kopi-ulee-kareng"
          className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
        >
          Lihat contoh demo →
        </Link>
        <Link href="/" className="mt-3 text-sm font-medium text-ink-soft hover:text-ink">
          ← Kembali ke beranda
        </Link>
      </main>
    );
  }

  const p = template.config.palette;
  const wa = waLink(
    prospect.waNumber,
    `Halo! Saya dari ${prospect.nama}. Saya tertarik dengan contoh websitenya — boleh info lebih lanjut?`
  );

  return (
    <main className="min-h-screen" style={{ background: p.bg, color: p.ink }}>
      {/* Nav mini */}
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
        <span className="text-lg font-bold tracking-tight">{prospect.nama}</span>
        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: p.accent, color: p.accentInk }}>
          Contoh website
        </span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pb-12 pt-6 sm:px-6">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {demo.data.headline}
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed" style={{ color: p.muted }}>
          {demo.data.subheadline}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3.5 text-base font-semibold"
              style={{ background: p.accent, color: p.accentInk }}
            >
              {demo.data.ctaText} →
            </a>
          )}
          {prospect.mapsUrl && (
            <a
              href={prospect.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-6 py-3.5 text-base font-semibold ring-1"
              style={{ borderColor: p.muted }}
            >
              Lihat di Google Maps
            </a>
          )}
        </div>
        {prospect.rating != null && (
          <p className="mt-5 text-sm font-medium" style={{ color: p.muted }}>
            ★ {prospect.rating.toFixed(1)} dari {prospect.reviewCount ?? 0} ulasan Google
            {prospect.alamat ? ` · ${prospect.alamat}` : ""}
          </p>
        )}
      </section>

      {/* Sections */}
      <section className="mx-auto grid max-w-4xl gap-4 px-4 pb-16 sm:grid-cols-2 sm:px-6">
        {demo.data.sections.map((s) => (
          <article key={s.title} className="rounded-2xl p-6" style={{ background: p.surface }}>
            <h2 className="text-xl font-bold">{s.title}</h2>
            <ul className="mt-3 space-y-2">
              {s.items.map((item) => (
                <li key={item} className="flex gap-2 text-[15px] leading-relaxed" style={{ color: p.muted }}>
                  <span aria-hidden style={{ color: p.accent }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {/* Footer demo */}
      <footer className="border-t px-4 py-8 text-center text-xs" style={{ borderColor: p.muted, color: p.muted }}>
        <p>
          Halaman contoh ini dibuat untuk {prospect.nama} dengan Prospecting Engine
          {template ? ` (template ${template.nama})` : ""}.
        </p>
        <p className="mt-1">
          <Link href="/" className="font-semibold underline">
            prospecting-engine
          </Link>{" "}
          · demo website personal untuk usaha lokal
        </p>
      </footer>
    </main>
  );
}
