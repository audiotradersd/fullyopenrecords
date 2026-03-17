import { Shell } from "../../components/Shell";
import { CrudPage } from "../../components/CrudPage";

export default function FAQPage() {
  return (
    <Shell>
      <CrudPage
        title="FAQ"
        endpoint="/admin/faq"
        fields={[
          { name: "question", label: "Question" },
          { name: "answer", label: "Answer" },
          { name: "order", label: "Order" }
        ]}
      />
    </Shell>
  );
}

