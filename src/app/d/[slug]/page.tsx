import { SEED_DEMOS } from "@/lib/seed";
import DemoClient from "./demo-client";

export function generateStaticParams() {
  return SEED_DEMOS.map((d) => ({ slug: d.slug }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // shellSlug = slug file prerender ini. Dipakai render pertama klien
  // (lihat demo-client) supaya cocok dengan HTML shell saat deep link.
  return <DemoClient shellSlug={slug} />;
}
