import { Section } from "@fully-open-records/ui";
import { ApiForm } from "../../components/Forms";

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

