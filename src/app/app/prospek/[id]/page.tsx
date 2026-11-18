import { SEED_PROSPECTS } from "@/lib/seed";
import ProspectDetailClient from "./detail-client";

export function generateStaticParams() {
  return SEED_PROSPECTS.map((p) => ({ id: p.id }));
}

export default async function ProspectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // shellId = id file prerender ini (lihat detail-client).
  return <ProspectDetailClient shellId={id} />;
}
