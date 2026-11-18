"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/discover", label: "Discover" },
  { href: "/app/template", label: "Template" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { resetDemo } = useStore();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white" aria-hidden>
              ⌖
            </span>
            <span className="leading-none">
              <span className="block text-[17px] font-bold tracking-tight text-ink">Prospecting Engine</span>
              <span className="block text-[11px] font-medium tracking-wide text-ink-soft">dashboard demo</span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-2 transition ${
                    active ? "bg-ink text-white" : "text-ink-soft hover:bg-white hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset semua data demo ke seed awal? Perubahanmu akan hilang.")) resetDemo();
              }}
              className="rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
            >
              Reset demo
            </button>
            <Link
              href="/"
              className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep sm:block"
            >
              ← Landing
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-ink-soft sm:px-6">
          <p>Mode demo — data tersimpan di localStorage browser ini, bukan di server.</p>
          <p>
            Skema data: <span className="font-mono">prisma/schema.prisma</span> · Lisensi MIT
          </p>
        </div>
      </footer>
    </div>
  );
}
