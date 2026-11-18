import { SEED_PROSPECTS } from "@/lib/seed";
import ProspectDetailClient from "./detail-client";

export function generateStaticParams() {
  return SEED_PROSPECTS.map((p) => ({ id: p.id }));
}

export default function ProspectDetailPage() {
  return <ProspectDetailClient />;
}
