import Link from "next/link";

const GITHUB_URL = "https://github.com/dezzorigin/prospecting-engine";

function GithubMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white text-lg font-bold" aria-hidden>
        ⌖
      </span>
      <span className="leading-none">
        <span className="block text-[17px] font-bold tracking-tight text-ink">Prospecting Engine</span>
        <span className="block text-[11px] font-medium tracking-wide text-ink-soft">cari prospek · kirim demo · closing</span>
      </span>
    </Link>
  );
}

/** Preview produk di hero — tiruan statis dashboard (bukan data live). */
function ProductPreview() {
  const rows = [
    { nama: "Kopi Ulee Kareng", kat: "Kafe & Kopi", rating: "4.6 ★ (312)", stage: "Demo Siap", cls: "bg-violet-100 text-violet-800" },
    { nama: "Klinik Gigi Senyum Ceria", kat: "Klinik Gigi", rating: "4.8 ★ (154)", stage: "Follow-up", cls: "bg-amber-100 text-amber-800" },
    { nama: "Bakso Mas Joko", kat: "Kuliner", rating: "4.6 ★ (428)", stage: "Deal", cls: "bg-emerald-100 text-emerald-800" },
    { nama: "Bengkel Motor Barokah", kat: "Bengkel Motor", rating: "4.3 ★ (89)", stage: "Baru", cls: "bg-sky-100 text-sky-800" },
  ];
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-[0_24px_60px_-24px_rgba(28,25,23,0.35)] sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-semibold text-ink-soft">Dashboard — Pipeline</span>
        </div>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-deep">Mode demo</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { label: "Prospek aktif", value: "7" },
          { label: "Nilai pipeline", value: "Rp14,7 jt" },
          { label: "Demo dilihat", value: "1 dari 2" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-paper px-3 py-2.5">
            <p className="text-[11px] font-medium text-ink-soft">{s.label}</p>
            <p className="mt-0.5 text-base font-bold text-ink sm:text-lg">{s.value}</p>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.nama} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{r.nama}</p>
              <p className="truncate text-xs text-ink-soft">
                {r.kat} · {r.rating}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${r.cls}`}>{r.stage}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-ink-soft">
        Preview statis — buka dashboard untuk data interaktifnya.
      </p>
    </div>
  );
}

const FEATURES = [
  {
    icon: "◎",
    title: "Discover — cari usaha tanpa website",
    body: "Masukkan kata kunci dan kota, mesin akan mengumpulkan kandidat usaha lokal lengkap dengan rating, ulasan, dan nomor WhatsApp-nya. Usaha yang belum punya website langsung jadi target.",
  },
  {
    icon: "▦",
    title: "Pipeline — semua prospek dalam satu papan",
    body: "Delapan stage dari Baru sampai Deal: Demo Siap, Follow-up, Negosiasi, Ditolak, sampai Hilang Kontak. Setiap pindah stage tercatat otomatis sebagai aktivitas.",
  },
  {
    icon: "✦",
    title: "Demo website personal per prospek",
    body: "Pilih template (Kafe, Klinik, Jasa), dan dalam sekejap prospek punya halaman demo atas nama usahanya sendiri — lengkap dengan link /d/nama-usaha yang siap dikirim via WhatsApp.",
  },
  {
    icon: "◉",
    title: "Pantau siapa yang membuka demo",
    body: "Begitu pemilik usaha membuka link demo, statusnya tercatat: terkirim dan dilihat. Tidak ada lagi tebak-tebakan — follow-up dilakukan saat minatnya sedang panas.",
  },
  {
    icon: "☰",
    title: "Aktivitas & pengingat follow-up",
    body: "Catatan, panggilan, WA terkirim, dan demo dikirim tersusun rapi di linimasa tiap prospek — plus aksi berikutnya dan tanggal jatuh temponya.",
  },
  {
    icon: "⬡",
    title: "Skema Prisma siap produksi",
    body: "Model data Prospect, Activity, Template, Demo, dan DiscoverJob sudah didefinisikan di Prisma schema — tinggal sambungkan DATABASE_URL Postgres untuk mode server.",
  },
];

const STEPS = [
  { n: "1", title: "Discover", body: "Cari \"kopi\" di Banda Aceh — dapat daftar usaha beserta rating dan WA-nya." },
  { n: "2", title: "Buat demo", body: "Pilih template, demo website personal langsung jadi dengan slug sendiri." },
  { n: "3", title: "Kirim via WA", body: "Satu ketuk: link demo terkirim, status berubah jadi Demo Siap." },
  { n: "4", title: "Follow-up & closing", body: "Begitu demo dibuka, telepon pemiliknya dan bawa ke Negosiasi sampai Deal." },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-medium text-ink-soft md:flex">
            <a href="#fitur" className="hover:text-ink">Fitur</a>
            <a href="#cara-kerja" className="hover:text-ink">Cara kerja</a>
            <a href="#template" className="hover:text-ink">Template</a>
            <a href="/app" className="hover:text-ink">Dashboard</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lihat repo di GitHub"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-ink"
            >
              <GithubMark />
            </a>
            <Link
              href="/app"
              className="rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep"
            >
              Buka Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-brand-deep">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Untuk jasa pembuatan website — mode demo, tanpa daftar
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl">
              Cari usaha tanpa website, kirim demo, closing deal.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
              Prospecting Engine menemukan usaha lokal yang belum punya website,
              mengubahnya jadi demo website personal atas nama mereka, dan
              mencatat setiap langkah sampai deal — semua dari satu dashboard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-deep"
              >
                Coba dashboard demo →
              </Link>
              <Link
                href="/d/kopi-ulee-kareng"
                className="rounded-full border border-ink/20 bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:border-ink"
              >
                Lihat contoh demo
              </Link>
            </div>
            <p className="mt-4 text-sm text-ink-soft">
              Tanpa akun, tanpa kunci API. Data demo tersimpan di browsermu dan bisa di-reset kapan saja.
            </p>
          </div>
          <ProductPreview />
        </section>

        {/* Strip angka */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
            {[
              { v: "10", l: "prospek contoh siap dimainkan" },
              { v: "8", l: "stage pipeline penjualan" },
              { v: "3", l: "template demo siap pakai" },
              { v: "5", l: "model data di skema Prisma" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-3xl font-bold tracking-tight text-ink">{s.v}</p>
                <p className="mt-1 text-sm text-ink-soft">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Fitur */}
        <section id="fitur" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Satu mesin, dari cari sampai closing</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Bukan sekadar daftar kontak. Setiap fitur mengikuti alur kerja penjual jasa website sungguhan.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="rounded-2xl border border-line bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-xl text-brand-deep" aria-hidden>
                  {f.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Cara kerja */}
        <section id="cara-kerja" className="border-y border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-ink">Cara kerja</h2>
            <p className="mt-3 max-w-2xl text-lg text-ink-soft">
              Empat langkah dari usaha asing jadi klien yang membayar.
            </p>
            <ol className="mt-10 grid gap-5 md:grid-cols-4">
              {STEPS.map((s) => (
                <li key={s.n} className="rounded-2xl border border-line bg-paper p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Template */}
        <section id="template" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Template demo yang langsung terasa personal</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Setiap template membawa palet, copy hero, dan susunan section-nya sendiri — demo yang diterima pemilik usaha terasa dibuat khusus untuknya, bukan brosur massal.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { nama: "Kafe & Kuliner", desc: "Hangat dan menggoda selera — menu unggulan, jam & lokasi.", sw: ["#FFF8EE", "#B45309", "#2B1D0E"] },
              { nama: "Klinik & Kesehatan", desc: "Bersih dan menenangkan — layanan, jadwal praktik, booking.", sw: ["#F0FDFA", "#0F766E", "#134E4A"] },
              { nama: "Jasa & Bengkel", desc: "Tegas dan transparan — layanan & harga, garansi pengerjaan.", sw: ["#0F172A", "#F59E0B", "#F8FAFC"] },
            ].map((t) => (
              <article key={t.nama} className="rounded-2xl border border-line bg-white p-6">
                <div className="flex gap-2" aria-hidden>
                  {t.sw.map((c) => (
                    <span key={c} className="h-8 flex-1 rounded-lg border border-line" style={{ background: c }} />
                  ))}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{t.nama}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{t.desc}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-2xl bg-ink px-6 py-8 text-white sm:px-10">
            <h3 className="text-2xl font-bold tracking-tight">Siap mencoba alurnya?</h3>
            <p className="mt-2 max-w-xl text-white/70">
              Dashboard demo sudah berisi 10 prospek, 2 demo terkirim, dan 1 discover job selesai. Tambah prospek, buat demo, dan kirim — semuanya tersimpan di browsermu.
            </p>
            <Link
              href="/app"
              className="mt-5 inline-block rounded-full bg-white px-6 py-3 text-base font-semibold text-ink transition hover:bg-brand-soft"
            >
              Buka dashboard demo →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-base font-bold text-white" aria-hidden>⌖</span>
            <div className="text-sm">
              <p className="font-bold text-ink">Prospecting Engine</p>
              <p className="text-ink-soft">Mesin prospeksi jasa pembuatan website.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-ink-soft">
            <Link href="/app" className="hover:text-ink">Dashboard</Link>
            <Link href="/app/discover" className="hover:text-ink">Discover</Link>
            <Link href="/app/template" className="hover:text-ink">Template</Link>
            <a href="https://github.com/dezzorigin/prospecting-engine" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-ink">
              <GithubMark className="h-4 w-4" /> GitHub
            </a>
          </nav>
          <p className="w-full text-xs text-ink-soft sm:w-auto">
            Lisensi MIT · Dibangun dengan Next.js 16, Prisma &amp; Playwright · Data demo tersimpan lokal di browser
          </p>
        </div>
      </footer>
    </div>
  );
}
