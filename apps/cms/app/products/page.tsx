import { Shell } from "../../components/Shell";
import { CrudPage } from "../../components/CrudPage";

export default function ProductsPage() {
  return (
    <Shell>
      <CrudPage
        title="Products"
        endpoint="/admin/products"
        fields={[
          { name: "title", label: "Title" },
          { name: "slug", label: "Slug" },
          { name: "description", label: "Description" },
          { name: "price", label: "Price in pence" },
          { name: "currency", label: "Currency", placeholder: "GBP" },
          { name: "category", label: "Category" },
          { name: "images", label: "Image URL" },
          { name: "inventory", label: "Inventory" },
          { name: "stripePriceId", label: "Stripe price ID" }
        ]}
      />
    </Shell>
  );
}

