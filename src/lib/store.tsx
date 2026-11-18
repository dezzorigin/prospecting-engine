// Store mode demo: seluruh state hidup di localStorage browser.
// Dipakai semua halaman /app/* dan /d/[slug]. Reset mengembalikan seed.
//
// Catatan jujur: ini BUKAN sinkronisasi server. Data yang dibuat di satu
// browser tidak muncul di browser lain — itu batas mode demo yang
// didokumentasikan di docs/ARCHITECTURE.md. Mode Postgres (Prisma)
// adalah jalur server-nya; lihat docs/SCHEMA.md.

"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { seedState } from "./seed";
import {
  slugify,
  STAGE_LABEL,
  type Activity,
  type ActivityType,
  type Demo,
  type DiscoverJob,
  type DiscoverResult,
  type Prospect,
  type Stage,
  type StoreState,
} from "./types";

const STORAGE_KEY = "pe-store-v1";

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreState;
      if (Array.isArray(parsed.prospects) && Array.isArray(parsed.templates)) return parsed;
    }
  } catch {
    // localStorage rusak / tidak tersedia — jatuh ke seed.
  }
  return seedState();
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------------------------------------------------------------
// Discover simulasi (mode demo): tanpa API Google Maps, hasil dibangkitkan
// deterministik dari kata kunci + kota dan DILABELI data contoh.
// Lihat docs/SDD.md — Discover asli butuh Places API + Playwright.
// ---------------------------------------------------------------------------
const NAMA_POOL: Record<string, string[]> = {
  kopi: ["Kopi Pagi Ceria", "Warkop Dua Saudara", "Kopi Gayo Asli", "Kedai Kopi Lampoh", "Kopi Sanger 88"],
  bakso: ["Bakso Urat Jaya", "Bakso Bakar Simpang", "Mie Bakso Family", "Bakso Ikan Lampineung"],
  klinik: ["Klinik Pratama Sehat", "Klinik Gigi Family Care", "Apotek & Klinik Medika"],
  bengkel: ["Bengkel Las Jaya Motor", "Bengkel Mobil Amanah", "Tambal Ban 24 Jam Barokah"],
  salon: ["Salon Muslimah Ayu", "Barbershop Potong Rapi", "Salon Kecantikan Mawar"],
  laundry: ["Laundry Kiloan Express", "Laundry & Dry Clean Bersih", "Cuci Sepatu Kinclong"],
  default: ["Toko Serba Ada Maju", "Warung Makan Sederhana", "Jasa Jahit Rapi", "Toko Bangunan Kokoh"],
};

export function discoverPool(keyword: string): string[] {
  const k = keyword.toLowerCase();
  for (const key of Object.keys(NAMA_POOL)) {
    if (key !== "default" && k.includes(key)) return NAMA_POOL[key];
  }
  return NAMA_POOL.default;
}

export function buildDiscoverResults(keyword: string, kota: string): DiscoverResult[] {
  const pool = discoverPool(keyword);
  // Deterministik dari keyword+kota supaya hasil bisa diuji ulang.
  let h = 0;
  for (const ch of `${keyword}|${kota}`) h = (h * 31 + ch.charCodeAt(0)) % 997;
  const count = 4 + (h % 3); // 4–6 hasil
  const picked = [...pool].sort((a, b) => ((h + a.length) % 7) - ((h + b.length) % 7)).slice(0, count);
  return picked.map((nama, i) => {
    const hasSite = (h + i) % 4 === 0;
    return {
      nama,
      kategori: keyword.trim() ? keyword.trim()[0].toUpperCase() + keyword.trim().slice(1) : "Usaha Lokal",
      kota,
      alamat: `Jl. Contoh No. ${((h + i * 7) % 90) + 1}, ${kota}`,
      waNumber: `62811000${String(2000 + ((h + i * 13) % 900)).padStart(4, "0")}`,
      rating: Math.round((3.9 + ((h + i * 11) % 11) / 10) * 10) / 10,
      reviewCount: 20 + ((h + i * 37) % 400),
      mapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${nama} ${kota}`)}`,
      website: hasSite ? `https://${slugify(nama)}.example` : null,
    };
  });
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
interface StoreApi {
  state: StoreState;
  loaded: boolean;
  addProspect: (input: Omit<Prospect, "id" | "createdAt" | "updatedAt">) => Prospect;
  updateProspect: (id: string, patch: Partial<Prospect>) => void;
  deleteProspect: (id: string) => void;
  setStage: (id: string, stage: Stage) => void;
  addActivity: (prospectId: string, type: ActivityType, content: string) => void;
  createDemo: (prospectId: string, templateId: string) => Demo;
  markDemoSent: (demoId: string) => void;
  markDemoViewed: (slug: string) => void;
  runDiscover: (keyword: string, kota: string) => DiscoverJob;
  importDiscoverResults: (jobId: string) => number;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => seedState());
  const [loaded, setLoaded] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Muat state tersimpan SETELAH mount: server selalu me-render seed,
    // jadi pemuatan di sini menghindari hydration mismatch. Dijalankan
    // lewat queueMicrotask agar efek tetap sinkronisasi, bukan pemicu
    // render berantai (aturan react-hooks/set-state-in-effect).
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setState(loadState());
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage penuh / privat — data tetap hidup selama sesi.
    }
  }, [state, loaded]);

  const addActivity = useCallback((prospectId: string, type: ActivityType, content: string) => {
    const activity: Activity = {
      id: uid("a"),
      prospectId,
      type,
      content,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, activities: [activity, ...s.activities] }));
  }, []);

  const addProspect = useCallback(
    (input: Omit<Prospect, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const p: Prospect = { ...input, id: uid("p"), createdAt: now, updatedAt: now };
      setState((s) => ({ ...s, prospects: [p, ...s.prospects] }));
      return p;
    },
    []
  );

  const updateProspect = useCallback((id: string, patch: Partial<Prospect>) => {
    setState((s) => ({
      ...s,
      prospects: s.prospects.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  const deleteProspect = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      prospects: s.prospects.filter((p) => p.id !== id),
      activities: s.activities.filter((a) => a.prospectId !== id),
      demos: s.demos.filter((d) => d.prospectId !== id),
    }));
  }, []);

  const setStage = useCallback(
    (id: string, stage: Stage) => {
      setState((s) => {
        const p = s.prospects.find((x) => x.id === id);
        if (!p || p.stage === stage) return s;
        const activity: Activity = {
          id: uid("a"),
          prospectId: id,
          type: "perubahan_stage",
          content: `Stage berubah: ${STAGE_LABEL[p.stage]} → ${STAGE_LABEL[stage]}.`,
          createdAt: new Date().toISOString(),
        };
        return {
          ...s,
          prospects: s.prospects.map((x) =>
            x.id === id ? { ...x, stage, updatedAt: new Date().toISOString() } : x
          ),
          activities: [activity, ...s.activities],
        };
      });
    },
    []
  );

  const createDemo = useCallback(
    (prospectId: string, templateId: string) => {
      const template = state.templates.find((t) => t.id === templateId);
      const prospect = state.prospects.find((p) => p.id === prospectId);
      if (!template || !prospect) throw new Error("Template atau prospek tidak ditemukan");
      const slug = `${slugify(prospect.nama)}-${Math.random().toString(36).slice(2, 6)}`;
      const demo: Demo = {
        id: uid("d"),
        prospectId,
        templateId,
        slug,
        createdAt: new Date().toISOString(),
        sentAt: null,
        viewedAt: null,
        data: {
          headline: template.config.heroCopy.title
            .replaceAll("{nama}", prospect.nama)
            .replaceAll("{kota}", prospect.kota ?? "kotamu"),
          subheadline: template.config.heroCopy.subtitle,
          ctaText: template.config.heroCopy.cta,
          sections: template.config.sections,
        },
      };
      setState((s) => {
        const activity: Activity = {
          id: uid("a"),
          prospectId,
          type: "catatan",
          content: `Demo website dibuat dari template ${template.nama} (/${demo.slug}).`,
          createdAt: new Date().toISOString(),
        };
        const prospects = s.prospects.map((p) =>
          p.id === prospectId && p.stage === "baru"
            ? { ...p, stage: "demo_siap" as Stage, updatedAt: new Date().toISOString() }
            : p
        );
        return { ...s, demos: [demo, ...s.demos], prospects, activities: [activity, ...s.activities] };
      });
      return demo;
    },
    [state.templates, state.prospects]
  );

  const markDemoSent = useCallback((demoId: string) => {
    setState((s) => {
      const demo = s.demos.find((d) => d.id === demoId);
      if (!demo) return s;
      const activity: Activity = {
        id: uid("a"),
        prospectId: demo.prospectId,
        type: "demo_dikirim",
        content: `Link demo /d/${demo.slug} dikirim via WA.`,
        createdAt: new Date().toISOString(),
      };
      return {
        ...s,
        demos: s.demos.map((d) => (d.id === demoId ? { ...d, sentAt: new Date().toISOString() } : d)),
        activities: [activity, ...s.activities],
      };
    });
  }, []);

  const markDemoViewed = useCallback((slug: string) => {
    setState((s) => {
      const demo = s.demos.find((d) => d.slug === slug);
      if (!demo || demo.viewedAt) return s;
      const activity: Activity = {
        id: uid("a"),
        prospectId: demo.prospectId,
        type: "demo_dilihat",
        content: "Pemilik membuka link demo.",
        createdAt: new Date().toISOString(),
      };
      return {
        ...s,
        demos: s.demos.map((d) => (d.slug === slug ? { ...d, viewedAt: new Date().toISOString() } : d)),
        activities: [activity, ...s.activities],
      };
    });
  }, []);

  const runDiscover = useCallback((keyword: string, kota: string) => {
    const job: DiscoverJob = {
      id: uid("job"),
      keyword,
      kota,
      status: "running",
      error: null,
      results: null,
      createdAt: new Date().toISOString(),
      doneAt: null,
    };
    setState((s) => ({ ...s, jobs: [job, ...s.jobs] }));
    const t = setTimeout(() => {
      setState((s) => ({
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === job.id
            ? { ...j, status: "done", results: buildDiscoverResults(keyword, kota), doneAt: new Date().toISOString() }
            : j
        ),
      }));
    }, 1800);
    timers.current.push(t);
    return job;
  }, []);

  const importDiscoverResults = useCallback(
    (jobId: string) => {
      const job = state.jobs.find((j) => j.id === jobId);
      if (!job?.results) return 0;
      const existing = new Set(state.prospects.map((p) => `${p.nama}|${p.kota}`));
      const fresh = job.results.filter((r) => !existing.has(`${r.nama}|${r.kota}`));
      if (fresh.length === 0) return 0;
      const now = new Date().toISOString();
      const added: Prospect[] = fresh.map((r) => ({
        id: uid("p"),
        nama: r.nama,
        kategori: r.kategori,
        kota: r.kota,
        alamat: r.alamat,
        waNumber: r.waNumber,
        rating: r.rating,
        reviewCount: r.reviewCount,
        mapsUrl: r.mapsUrl,
        website: r.website,
        source: "discover",
        stage: "baru",
        nextAction: "Buatkan demo dari template yang cocok",
        dueAt: null,
        dealValue: null,
        createdAt: now,
        updatedAt: now,
      }));
      setState((s) => ({ ...s, prospects: [...added, ...s.prospects] }));
      return added.length;
    },
    [state.jobs, state.prospects]
  );

  const resetDemo = useCallback(() => {
    const fresh = seedState();
    setState(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // abaikan
    }
  }, []);

  const api = useMemo<StoreApi>(
    () => ({
      state,
      loaded,
      addProspect,
      updateProspect,
      deleteProspect,
      setStage,
      addActivity,
      createDemo,
      markDemoSent,
      markDemoViewed,
      runDiscover,
      importDiscoverResults,
      resetDemo,
    }),
    [
      state,
      loaded,
      addProspect,
      updateProspect,
      deleteProspect,
      setStage,
      addActivity,
      createDemo,
      markDemoSent,
      markDemoViewed,
      runDiscover,
      importDiscoverResults,
      resetDemo,
    ]
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore harus dipakai di dalam <StoreProvider>");
  return ctx;
}

/** Ambil segmen terakhir path — dipakai halaman dinamis
 *  (/app/prospek/[id], /d/[slug]) supaya deep link yang disajikan worker
 *  dari shell seed tetap memuat record yang benar dari id di URL.
 *
 *  Sengaja memakai usePathname() (next/navigation), BUKAN
 *  window.location di initializer useState: saat navigasi client-side,
 *  komponen rute baru di-render React SEBELUM window.location berubah,
 *  sehingga initializer akan mengunci segmen dari URL lama ("" untuk "/")
 *  dan tidak pernah diperbarui. usePathname bersifat reaktif terhadap
 *  state router sehingga selalu benar. */
export function usePathSegment(): string | null {
  const pathname = usePathname();
  if (!pathname) return null;
  const parts = pathname.replace(/\/$/, "").split("/");
  const seg = parts[parts.length - 1] ?? "";
  return seg ? decodeURIComponent(seg) : null;
}
