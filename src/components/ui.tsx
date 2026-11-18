import type { ReactNode } from "react";
import { STAGE_LABEL, type Stage } from "@/lib/types";

const STAGE_STYLE: Record<Stage, string> = {
  baru: "bg-sky-100 text-sky-800 ring-sky-200",
  demo_siap: "bg-violet-100 text-violet-800 ring-violet-200",
  follow_up: "bg-amber-100 text-amber-800 ring-amber-200",
  negosiasi: "bg-orange-100 text-orange-800 ring-orange-200",
  deal: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  ditolak: "bg-rose-100 text-rose-800 ring-rose-200",
  hilang_kontak: "bg-zinc-200 text-zinc-700 ring-zinc-300",
  ditunda: "bg-stone-100 text-stone-600 ring-stone-200",
};

export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STAGE_STYLE[stage]}`}
    >
      {STAGE_LABEL[stage]}
    </span>
  );
}

export function Stars({ rating }: { rating: number | null }) {
  if (rating == null) return <span className="text-zinc-400 text-sm">—</span>;
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-800">
      <span aria-hidden className="text-amber-500">★</span>
      {rating.toFixed(1)}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(28,25,23,0.05)] ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{body}</p>
    </div>
  );
}
