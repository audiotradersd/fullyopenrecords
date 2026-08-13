import { Section } from "@fully-open-records/ui";
import { getFaq } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({ title: "Fully Open FAQ — Artists, Radio & Music Submissions", description: "Answers about Fully Open artist pages, submitting music, radio consideration and discovering independent artists.", path: "/faq" });

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
