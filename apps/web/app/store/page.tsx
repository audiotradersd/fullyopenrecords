import { Section } from "@fully-open-records/ui";
import { ProductCard } from "../../components/Cards";
import { getProducts } from "../../lib/api";


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
