"use client";

import { useState } from "react";
import { Button, Section } from "@fully-open-records/ui";
import { useEffect } from "react";

export const runtime = "edge";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787"}/products/${params.slug}`)
      .then((response) => response.json())
      .then(setProduct);
  }, [params.slug]);

  async function handleCheckout() {
    if (!product) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8787"}/checkout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              quantity: 1,
              title: product.title,
              stripePriceId: product.stripePriceId,
              unitAmount: product.price
            }
          ],
          successUrl: `${window.location.origin}/store?success=1`,
          cancelUrl: window.location.href
        })
      }
    );

    const data = await response.json();
    if (data.url) window.location.href = data.url;
  }

  if (!product) {
    return <Section>Loading…</Section>;
  }

  return (
    <Section className="grid gap-8 md:grid-cols-[1fr_0.8fr]">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10" />
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-ember">{product.category}</p>
        <h1 className="mt-4 font-display text-5xl">{product.title}</h1>
        <p className="mt-4 text-fog">{product.description}</p>
        <p className="mt-6 text-lg text-sand">£{(product.price / 100).toFixed(2)}</p>
        <Button className="mt-8" onClick={handleCheckout}>
          Checkout with Stripe
        </Button>
      </div>
    </Section>
  );
}
