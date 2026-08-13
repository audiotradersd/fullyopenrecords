import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/artist/${slug}`);
}
