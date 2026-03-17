import { Shell } from "../../components/Shell";
import { CrudPage } from "../../components/CrudPage";

export default function PagesPage() {
  return (
    <Shell>
      <CrudPage
        title="Pages"
        endpoint="/admin/pages"
        fields={[
          { name: "title", label: "Title" },
          { name: "slug", label: "Slug" },
          { name: "seoTitle", label: "SEO title" },
          { name: "seoDescription", label: "SEO description" },
          {
            name: "blocks",
            label: "Blocks JSON",
            placeholder: '[{"type":"hero","data":{"title":"Home"}}]'
          }
        ]}
      />
    </Shell>
  );
}

