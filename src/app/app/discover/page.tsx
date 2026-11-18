"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { Card, EmptyState, PageHeader } from "@/components/ui";

export default function DiscoverPage() {
  const { state, loaded, runDiscover, importDiscoverResults } = useStore();
  const [keyword, setKeyword] = useState("kopi");
  const [kota, setKota] = useState("Banda Aceh");
  const [importMsg, setImportMsg] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!keyword.trim() || !kota.trim()) return;
    setImportMsg("");
    runDiscover(keyword.trim(), kota.trim());
  }

  const latest = state.jobs[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Discover"
        subtitle="Cari usaha lokal berdasarkan kata kunci dan kota — kandidat tanpa website langsung jadi target prospek."
      />

      <Card className="p-6">
        <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm font-medium text-ink">
            Kata kunci usaha
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="cth. kopi, bakso, klinik, bengkel"
              aria-label="Kata kunci usaha"
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <label className="flex-1 text-sm font-medium text-ink">
            Kota
            <input
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              placeholder="cth. Banda Aceh"
              aria-label="Kota"
              className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand"
            />
          </label>
          <button
            type="submit"
            disabled={latest?.status === "running"}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep disabled:opacity-50"
          >
            {latest?.status === "running" ? "Mencari…" : "Jalankan Discover"}
          </button>
        </form>
        <p className="mt-3 text-xs leading-relaxed text-ink-soft">
          Mode demo: tanpa kunci Google Maps Places API, hasil dibangkitkan dari data contoh dan{" "}
          <strong>dilabeli sebagai contoh</strong> — pola produksinya (Places API + Playwright)
          didokumentasikan di docs/SDD.md. Jangan pakai hasil contoh ini untuk outreach sungguhan.
        </p>
      </Card>

      {loaded && latest && (
        <section>
          <h2 className="text-lg font-bold text-ink">
            Hasil: “{latest.keyword}” di {latest.kota}
          </h2>
          <p className="mt-0.5 text-sm text-ink-soft">
            Status:{" "}
            {latest.status === "running" ? (
              <span className="font-semibold text-amber-700">mencari… (sekitar 2 detik)</span>
            ) : (
              <span className="font-semibold text-emerald-700">selesai</span>
            )}
            {latest.doneAt &&
              ` · ${new Date(latest.doneAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}`}
          </p>
          {latest.status === "done" && latest.results && (
            <>
              <Card className="mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-soft">
                        <th className="px-4 py-3 font-semibold">Usaha</th>
                        <th className="px-4 py-3 font-semibold">Rating</th>
                        <th className="px-4 py-3 font-semibold">Website</th>
                        <th className="px-4 py-3 font-semibold">WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latest.results.map((r) => (
                        <tr key={r.nama} className="border-b border-line last:border-0">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-ink">{r.nama}</p>
                            <p className="text-xs text-ink-soft">{r.alamat}</p>
                          </td>
                          <td className="px-4 py-3">
                            {r.rating != null ? (
                              <span className="font-semibold text-ink">★ {r.rating.toFixed(1)}</span>
                            ) : (
                              "—"
                            )}
                            {r.reviewCount != null && <span className="ml-1 text-xs text-ink-soft">({r.reviewCount})</span>}
                          </td>
                          <td className="px-4 py-3">
                            {r.website ? (
                              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">sudah punya</span>
                            ) : (
                              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">belum punya ✓</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-ink">{r.waNumber ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const n = importDiscoverResults(latest.id);
                    setImportMsg(
                      n > 0
                        ? `${n} prospek baru ditambahkan ke pipeline (stage Baru).`
                        : "Semua hasil sudah ada di pipeline — tidak ada yang ditambahkan."
                    );
                  }}
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
                >
                  + Import ke pipeline
                </button>
                {importMsg && <p className="text-sm font-medium text-brand-deep">{importMsg}</p>}
                <Link href="/app" className="text-sm font-semibold text-brand hover:underline">
                  Lihat di dashboard →
                </Link>
              </div>
            </>
          )}
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-ink">Riwayat Discover job</h2>
        {state.jobs.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Belum ada job" body="Jalankan Discover pertama dari form di atas." />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.jobs.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-white px-4 py-3 text-sm">
                <span>
                  <strong className="text-ink">“{j.keyword}”</strong> di {j.kota}
                  <span className="text-ink-soft">
                    {" "}
                    · {new Date(j.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </span>
                <span className="text-ink-soft">
                  {j.status === "done" ? `${j.results?.length ?? 0} hasil` : j.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
