"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { usePathSegment, useStore } from "@/lib/store";
import { seedState } from "@/lib/seed";
import {
  ACTIVITY_LABEL,
  formatRupiahRibu,
  STAGES,
  STAGE_LABEL,
  waLink,
  type ActivityType,
  type Stage,
} from "@/lib/types";
import { Card, EmptyState, StageBadge, Stars } from "@/components/ui";

export default function ProspectDetailClient() {
  const id = usePathSegment();
  const router = useRouter();
  const { state, loaded, setStage, addActivity, createDemo, markDemoSent, deleteProspect } = useStore();
  const [templateId, setTemplateId] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("catatan");
  const [activityText, setActivityText] = useState("");
  const [demoMsg, setDemoMsg] = useState("");

  // Render awal memakai seed (sinkron) supaya halaman seed punya konten
  // di HTML statis; begitu store termuat, sumber beralih ke state live.
  const seed = useMemo(() => seedState(), []);
  const source = loaded ? state : seed;

  const prospect = useMemo(
    () => (id ? source.prospects.find((p) => p.id === id) : undefined),
    [id, source.prospects]
  );
  const activities = useMemo(
    () => (id ? source.activities.filter((a) => a.prospectId === id) : []),
    [id, source.activities]
  );
  const demos = useMemo(
    () => (id ? source.demos.filter((d) => d.prospectId === id) : []),
    [id, source.demos]
  );

  if (!id || (!loaded && !prospect)) {
    // suppressHydrationWarning: lihat penjelasan di d/[slug]/demo-client.tsx
    // — shell prerender berisi konten prospek seed.
    return <p suppressHydrationWarning className="py-16 text-center text-sm text-ink-soft">Memuat prospek…</p>;
  }
  if (!prospect) {
    return (
      <div suppressHydrationWarning className="py-8">
        <EmptyState
          title="Prospek tidak ditemukan"
          body="Mungkin sudah dihapus, atau link dibuka di browser lain (data demo hanya tersimpan di browser pembuatnya)."
        />
        <p className="mt-4 text-center">
          <Link href="/app" className="text-sm font-semibold text-brand hover:underline">
            ← Kembali ke dashboard
          </Link>
        </p>
      </div>
    );
  }

  // Path relatif saat SSR (window belum ada); origin lengkap di browser.
  const demoLink = (slug: string) =>
    typeof window === "undefined" ? `/d/${slug}` : `${window.location.origin}/d/${slug}`;

  function submitActivity(e: FormEvent) {
    e.preventDefault();
    if (!activityText.trim()) return;
    addActivity(prospect!.id, activityType, activityText.trim());
    setActivityText("");
  }

  function handleCreateDemo() {
    if (!templateId) {
      setDemoMsg("Pilih template dulu.");
      return;
    }
    const demo = createDemo(prospect!.id, templateId);
    setDemoMsg(`Demo dibuat: /d/${demo.slug} — salin linknya dan kirim via WA.`);
  }

  const wa = waLink(prospect.waNumber, `Halo ${prospect.nama}! Saya buatkan contoh website untuk usaha Anda: ${demos[0] ? demoLink(demos[0].slug) : ""} — boleh dicek dulu, gratis.`);
  const nextStageIdx = STAGES.indexOf(prospect.stage);

  return (
    <div suppressHydrationWarning className="space-y-6">
      <p className="text-sm">
        <Link href="/app" className="font-medium text-ink-soft hover:text-ink">
          ← Dashboard
        </Link>
      </p>

      {/* Kepala prospek */}
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink">{prospect.nama}</h1>
            <p className="mt-1 text-sm text-ink-soft">
              {prospect.kategori ?? "—"} · {prospect.kota ?? "—"}
              {prospect.alamat ? ` · ${prospect.alamat}` : ""}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StageBadge stage={prospect.stage} />
              <Stars rating={prospect.rating} />
              {prospect.reviewCount != null && (
                <span className="text-xs text-ink-soft">({prospect.reviewCount} ulasan)</span>
              )}
              <span className="text-xs text-ink-soft">· sumber: {prospect.source === "discover" ? "Discover" : "manual"}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Nilai deal</p>
            <p className="text-2xl font-bold text-ink">{formatRupiahRibu(prospect.dealValue)}</p>
            {prospect.dueAt && (
              <p className="mt-1 text-xs text-ink-soft">
                Tenggat aksi:{" "}
                {new Date(prospect.dueAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        </div>
        <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">WhatsApp</dt>
            <dd className="mt-0.5 font-medium text-ink">{prospect.waNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">Website</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {prospect.website ? (
                <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                  {prospect.website}
                </a>
              ) : (
                "Belum punya — target prospek"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-ink-soft">Google Maps</dt>
            <dd className="mt-0.5 font-medium text-ink">
              {prospect.mapsUrl ? (
                <a href={prospect.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                  Buka di Maps →
                </a>
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
        {prospect.nextAction && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-100">
            <span className="font-bold">Aksi berikutnya: </span>
            {prospect.nextAction}
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            Stage:
            <select
              value={prospect.stage}
              onChange={(e) => setStage(prospect.id, e.target.value as Stage)}
              aria-label="Ubah stage"
              className="rounded-full border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          {nextStageIdx >= 0 && nextStageIdx < STAGES.indexOf("deal") && (
            <button
              type="button"
              onClick={() => setStage(prospect.id, STAGES[nextStageIdx + 1])}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Maju ke {STAGE_LABEL[STAGES[nextStageIdx + 1]]} →
            </button>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => addActivity(prospect.id, "wa_terkirim", "Membuka chat WhatsApp ke pemilik usaha.")}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Chat WhatsApp
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Hapus prospek ${prospect.nama} beserta aktivitas dan demonya?`)) {
                deleteProspect(prospect.id);
                router.push("/app");
              }
            }}
            className="ml-auto rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
          >
            Hapus prospek
          </button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Demo */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-ink">Demo website</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Demo adalah halaman mini atas nama usaha ini — link-nya yang dikirim ke pemilik via WA.
          </p>
          {demos.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft">Belum ada demo untuk prospek ini.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {demos.map((d) => {
                const tpl = state.templates.find((t) => t.id === d.templateId);
                return (
                  <li key={d.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-ink">
                        <Link href={`/d/${d.slug}`} className="hover:text-brand">
                          /d/{d.slug}
                        </Link>
                      </p>
                      <span className="text-xs text-ink-soft">{tpl?.nama ?? d.templateId}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                      Dibuat {new Date(d.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      {d.sentAt ? " · terkirim ✓" : " · belum dikirim"}
                      {d.viewedAt ? " · dilihat oleh pemilik ✓" : " · belum dibuka"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard?.writeText(demoLink(d.slug)).catch(() => undefined)}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink"
                      >
                        Salin link
                      </button>
                      <button
                        type="button"
                        onClick={() => markDemoSent(d.id)}
                        className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-deep"
                      >
                        Tandai terkirim via WA
                      </button>
                      <Link
                        href={`/d/${d.slug}`}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink"
                      >
                        Pratinjau demo →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-5 border-t border-line pt-4">
            <label className="block text-sm font-medium text-ink">
              Buat demo baru dari template
              <select
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                aria-label="Pilih template demo"
                className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:border-brand"
              >
                <option value="">— pilih template —</option>
                {state.templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama} ({t.kategori})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleCreateDemo}
              className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              + Buat demo
            </button>
            {demoMsg && <p className="mt-2 text-sm font-medium text-brand-deep">{demoMsg}</p>}
          </div>
        </Card>

        {/* Aktivitas */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-ink">Linimasa aktivitas</h2>
          <p className="mt-1 text-sm text-ink-soft">Semua interaksi dengan prospek ini, terbaru dulu.</p>
          <form onSubmit={submitActivity} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as ActivityType)}
              aria-label="Jenis aktivitas"
              className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
            >
              {(Object.keys(ACTIVITY_LABEL) as ActivityType[])
                .filter((t) => t !== "perubahan_stage" && t !== "demo_dilihat")
                .map((t) => (
                  <option key={t} value={t}>
                    {ACTIVITY_LABEL[t]}
                  </option>
                ))}
            </select>
            <input
              value={activityText}
              onChange={(e) => setActivityText(e.target.value)}
              placeholder="Tulis catatan, hasil telepon, isi WA…"
              aria-label="Isi aktivitas"
              className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
            />
            <button type="submit" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep">
              Tambah
            </button>
          </form>
          {activities.length === 0 ? (
            <p className="mt-5 text-sm text-ink-soft">Belum ada aktivitas. Catat interaksi pertamamu di atas.</p>
          ) : (
            <ol className="mt-5 space-y-3">
              {activities.map((a) => (
                <li key={a.id} className="flex gap-3 rounded-xl border border-line p-3">
                  <span className="mt-0.5 shrink-0 rounded-full bg-paper px-2.5 py-1 text-[11px] font-bold text-ink-soft ring-1 ring-line">
                    {ACTIVITY_LABEL[a.type]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-ink">{a.content}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {new Date(a.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}
