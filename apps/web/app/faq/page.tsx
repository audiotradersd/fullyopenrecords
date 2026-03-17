import { Section } from "@fully-open-records/ui";
import { getFaq } from "../../lib/api";

export const runtime = "edge";

export default async function FAQPage() {
  const faq = await getFaq();

  return (
    <Section className="max-w-3xl">
      <h1 className="font-display text-5xl">FAQ</h1>
      <div className="mt-10 space-y-4">
        {faq.map((item) => (
          <details key={String(item.id)} className="rounded-[1.5rem] border border-white/10 p-5">
            <summary className="cursor-pointer text-lg text-sand">{String(item.question)}</summary>
            <p className="mt-3 text-fog">{String(item.answer)}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
