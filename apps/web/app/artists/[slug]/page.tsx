import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  redirect(`/featured/${params.slug}`);
}
