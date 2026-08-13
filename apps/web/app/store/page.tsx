import { Section } from "@fully-open-records/ui";
import { ProductCard } from "../../components/Cards";
import { getProducts } from "../../lib/api";
import { pageMetadata } from "../../lib/seo";

export const metadata = pageMetadata({ title: "Fully Open Records Store — Independent Music & Merch", description: "Shop records, merchandise and limited releases from Fully Open and its independent artist community.", path: "/store" });

export default async function StorePage() {
  const products = await getProducts();

  return (
    <Section>
      <h1 className="font-display text-5xl">Store</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={String(product.id)} product={product} />
        ))}
      </div>
    </Section>
  );
}
