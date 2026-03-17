import { redirect } from "next/navigation";


export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/featured/${slug}`);
}
