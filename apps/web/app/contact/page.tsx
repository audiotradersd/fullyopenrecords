import { Section } from "@fully-open-records/ui";
import { ApiForm } from "../../components/Forms";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({ title: "Contact Fully Open Records", description: "Get in touch with Fully Open Records about independent music, artist opportunities, radio and the community.", path: "/contact" });

export default function ContactPage() {
  return (
    <Section className="max-w-3xl">
      <h1 className="font-display text-5xl">Contact</h1>
      <div className="mt-8">
        <ApiForm
          endpoint="/contact"
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "message", label: "Message", required: true }
          ]}
        />
      </div>
    </Section>
  );
}

