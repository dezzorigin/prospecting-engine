"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useStore } from "@/lib/store";
import { formatRupiahRibu, OPEN_STAGES, STAGES, STAGE_LABEL, type Prospect, type Stage } from "@/lib/types";
import { Card, EmptyState, PageHeader, StageBadge, Stars } from "@/components/ui";

function isOverdue(dueAt: string | null): boolean {
  if (!dueAt) return false;
  return new Date(dueAt).getTime() < Date.now();
}

function dueLabel(dueAt: string | null): string {
  if (!dueAt) return "—";
  const d = new Date(dueAt);
  return d.toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function DashboardPage() {
  const { state, addProspect } = useStore();
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "semua">("semua");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nama: "", kategori: "", kota: "Banda Aceh", alamat: "", waNumber: "", website: "", dealValue: "", nextAction: "" });

  const stats = useMemo(() => {
    const aktif = state.prospects.filter((p) => OPEN_STAGES.includes(p.stage));
    const pipeline = aktif.reduce((sum, p) => sum + (p.dealValue ?? 0), 0);
    const deal = state.prospects.filter((p) => p.stage === "deal");
    const dealNilai = deal.reduce((sum, p) => sum + (p.dealValue ?? 0), 0);
    const followUp = state.prospects.filter((p) => p.stage === "follow_up" || isOverdue(p.dueAt));
    const dilihat = state.demos.filter((d) => d.viewedAt).length;
    return { aktif: aktif.length, pipeline, deal: deal.length, dealNilai, followUp: followUp.length, dilihat, totalDemo: state.demos.length };
  }, [state.prospects, state.demos]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.prospects.filter((p) => {
      if (stageFilter !== "semua" && p.stage !== stageFilter) return false;
      if (!q) return true;
      return [p.nama, p.kategori ?? "", p.kota ?? "", p.alamat ?? ""].join(" ").toLowerCase().includes(q);
    });
  }, [state.prospects, query, stageFilter]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.nama.trim()) return;
    addProspect({
      nama: form.nama.trim(),
      kategori: form.kategori.trim() || null,
      kota: form.kota.trim() || null,
      alamat: form.alamat.trim() || null,
      waNumber: form.waNumber.trim() || null,
      rating: null,
      reviewCount: null,
      mapsUrl: null,
      website: form.website.trim() || null,
      source: "manual",
      stage: "baru",
      nextAction: form.nextAction.trim() || null,
      dueAt: null,
      dealValue: form.dealValue ? Number(form.dealValue) : null,
    });
    setForm({ nama: "", kategori: "", kota: "Banda Aceh", alamat: "", waNumber: "", website: "", dealValue: "", nextAction: "" });
    setShowForm(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Pipeline penjualan jasa website — dari prospek baru sampai deal."
        action={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            {showForm ? "Tutup form" : "+ Tambah prospek"}
          </button>
        }
      />

      {/* Statistik */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Prospek aktif", value: String(stats.aktif), sub: `${state.prospects.length} total prospek` },
          { label: "Nilai pipeline", value: formatRupiahRibu(stats.pipeline), sub: "stage terbuka" },
          { label: "Deal menang", value: `${stats.deal} · ${formatRupiahRibu(stats.dealNilai)}`, sub: "sudah closing" },
          { label: "Demo dilihat", value: `${stats.dilihat} dari ${stats.totalDemo}`, sub: `${stats.followUp} butuh follow-up` },
        ].map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-sm font-medium text-ink-soft">{s.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{s.value}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Form tambah prospek */}
      {showForm && (
        <Card className="p-6">
          <h2 className="text-lg font-bold text-ink">Prospek baru</h2>
          <p className="mt-1 text-sm text-ink-soft">Isi yang kamu tahu — sisanya bisa dilengkapi dari halaman detail.</p>
          <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-ink">
              Nama usaha *
              <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="cth. Kopi Pagi Ceria" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink">
              Kategori
              <input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="cth. Kafe & Kopi" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink">
              Kota
              <input value={form.kota} onChange={(e) => setForm({ ...form, kota: e.target.value })} className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink">
              Nomor WhatsApp
              <input value={form.waNumber} onChange={(e) => setForm({ ...form, waNumber: e.target.value })} placeholder="62812xxxxxxx" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink">
              Alamat
              <input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Jl. …" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink">
              Website (kalau sudah punya)
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://…" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink">
              Nilai deal (ribu rupiah)
              <input type="number" min="0" value={form.dealValue} onChange={(e) => setForm({ ...form, dealValue: e.target.value })} placeholder="2500 = Rp2,5 jt" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <label className="block text-sm font-medium text-ink sm:col-span-2">
              Aksi berikutnya
              <input value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} placeholder="cth. Buatkan demo dari template Kafe" className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 font-normal outline-none focus:border-brand" />
            </label>
            <div className="sm:col-span-2">
              <button type="submit" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep">
                Simpan prospek
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Kanban pipeline */}
      <section>
        <h2 className="text-lg font-bold text-ink">Pipeline</h2>
        <p className="mt-0.5 text-sm text-ink-soft">Klik kartu untuk membuka detail, ubah stage, dan buat demo.</p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {STAGES.map((stage) => {
            const items = state.prospects.filter((p) => p.stage === stage);
            return (
              <div key={stage} className="w-64 shrink-0 rounded-2xl border border-line bg-paper p-3">
                <div className="flex items-center justify-between px-1 pb-2">
                  <span className="text-sm font-bold text-ink">{STAGE_LABEL[stage]}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-ink-soft ring-1 ring-line">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((p: Prospect) => (
                    <Link key={p.id} href={`/app/prospek/${p.id}`} className="block rounded-xl border border-line bg-white p-3 transition hover:border-brand hover:shadow-sm">
                      <p className="text-sm font-semibold leading-snug text-ink">{p.nama}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {p.kategori ?? "—"} · {p.kota ?? "—"}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <Stars rating={p.rating} />
                        <span className="text-xs font-semibold text-ink">{formatRupiahRibu(p.dealValue)}</span>
                      </div>
                      {p.dueAt && (
                        <p className={`mt-1.5 text-xs font-medium ${isOverdue(p.dueAt) && OPEN_STAGES.includes(p.stage) ? "text-rose-600" : "text-ink-soft"}`}>
                          ⏰ {dueLabel(p.dueAt)}
                          {isOverdue(p.dueAt) && OPEN_STAGES.includes(p.stage) ? " — lewat tenggat" : ""}
                        </p>
                      )}
                    </Link>
                  ))}
                  {items.length === 0 && <p className="px-1 py-3 text-center text-xs text-ink-soft">Belum ada prospek</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tabel prospek */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">Semua prospek</h2>
          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, kategori, kota…"
              aria-label="Cari prospek"
              className="w-56 rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand"
            />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as Stage | "semua")}
              aria-label="Filter stage"
              className="rounded-full border border-line bg-white px-4 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="semua">Semua stage</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABEL[s]}</option>
              ))}
            </select>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Tidak ada prospek yang cocok" body="Ubah kata kunci atau filter stage, atau tambah prospek baru." />
          </div>
        ) : (
          <Card className="mt-4 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-soft">
                    <th className="px-4 py-3 font-semibold">Usaha</th>
                    <th className="px-4 py-3 font-semibold">Rating</th>
                    <th className="px-4 py-3 font-semibold">Website</th>
                    <th className="px-4 py-3 font-semibold">Stage</th>
                    <th className="px-4 py-3 font-semibold">Nilai deal</th>
                    <th className="px-4 py-3 font-semibold">Aksi berikut</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper/70">
                      <td className="px-4 py-3">
                        <Link href={`/app/prospek/${p.id}`} className="font-semibold text-ink hover:text-brand">
                          {p.nama}
                        </Link>
                        <p className="text-xs text-ink-soft">
                          {p.kategori ?? "—"} · {p.kota ?? "—"} · {p.source === "discover" ? "dari Discover" : "manual"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Stars rating={p.rating} />
                        {p.reviewCount != null && <span className="ml-1 text-xs text-ink-soft">({p.reviewCount})</span>}
                      </td>
                      <td className="px-4 py-3">
                        {p.website ? (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">sudah punya</span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">belum punya ✓ target</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StageBadge stage={p.stage} />
                      </td>
                      <td className="px-4 py-3 font-medium text-ink">{formatRupiahRibu(p.dealValue)}</td>
                      <td className="px-4 py-3 text-xs text-ink-soft">{p.nextAction ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
