import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function ArtistCard({
  name,
  description,
  slug
}: {
  name: string;
  description: string;
  slug: string;
}) {
  return (
    <Card>
      <div className="mx-auto mb-4 h-28 w-28 rounded-full border border-pink/30 bg-[radial-gradient(circle_at_35%_30%,rgba(227,106,156,0.9),transparent_28%),radial-gradient(circle_at_65%_40%,rgba(209,74,139,0.7),transparent_32%),linear-gradient(135deg,#1e0d3a_0%,#3a1b5c_48%,#a12c6a_100%)]" />
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="mt-2 text-sm text-fog">{description}</p>
      <div className="mt-4 flex gap-2">
        <Link href="/radio">
          <Button size="sm">Listen</Button>
        </Link>
        <Link href={`/${slug}`}>
          <Button size="sm" variant="outline">
            Artist Page
          </Button>
        </Link>
      </div>
    </Card>
  );
}
