import { SEED_DEMOS } from "@/lib/seed";
import DemoClient from "./demo-client";

export function generateStaticParams() {
  return SEED_DEMOS.map((d) => ({ slug: d.slug }));
}

export default function DemoPage() {
  return <DemoClient />;
}
