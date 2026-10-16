import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/marketing/PageShell";
import MarketingHero from "@/components/marketing/MarketingHero";
import Container from "@/components/ui/Container";

/** No invented client projects or metrics. Publish real studies after approval. */
export const metadata: Metadata = {
  title: "Solution Examples",
  description: "Explore illustrative ways connected websites, CRM and automation can help service businesses. Examples are not verified customer results.",
  alternates: {canonical: "/case-studies"},
  robots: {index: false, follow: true},
};
const examples = [
  {title:"Professional services client intake",problem:"New inquiries arrive through calls, website forms and email without a consistent intake process.", system:"A responsive services website, structured form, CRM pipeline and follow-up reminders.", outcome:"Designed to keep requests organized, assign responsibility and reduce missed follow-ups."},
  {title:"Home service quote workflow",problem:"Prospective customers request estimates with incomplete project and location details.",system:"A mobile quote form, service-area information, CRM workflow and scheduling reminders.",outcome:"Designed to make follow-up more predictable and give staff useful details before a call."},
  {title:"Bilingual appointment journey",problem:"Customers searching in Spanish find English-only experiences and cannot easily schedule appointments.",system:"Dedicated English and Spanish pages, language-aware forms, booking links and bilingual communications.",outcome:"Designed to reduce language friction and make the next step clearer for each visitor."},
];
export default function Page(){return <PageShell><MarketingHero eyebrow="Illustrative workflows · Not client testimonials" title="What a connected business system can look like" description="These are representative solution examples—not completed client case studies or measured outcomes. Verified client stories will be published only with permission and documented results." primaryHref="/contact" primaryLabel="Discuss Your Workflow"/><section className="py-20"><Container><div className="grid gap-6 lg:grid-cols-3">{examples.map(x=><article key={x.title} className="rounded-2xl border border-vx-line bg-vx-bg2 p-7"><h2 className="text-2xl font-semibold">{x.title}</h2><h3 className="mt-7 font-semibold text-vx-cyan">The challenge</h3><p className="mt-2 leading-7 text-vx-muted">{x.problem}</p><h3 className="mt-6 font-semibold text-vx-cyan">Potential solution</h3><p className="mt-2 leading-7 text-vx-muted">{x.system}</p><h3 className="mt-6 font-semibold text-vx-cyan">Intended benefit</h3><p className="mt-2 leading-7 text-vx-muted">{x.outcome}</p></article>)}</div><p className="mt-10 text-center text-sm text-vx-muted">Interested in a similar solution? <Link href="/contact" className="font-semibold text-vx-cyan underline">Talk to VYNTEX</Link>.</p></Container></section></PageShell>}
