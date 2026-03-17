import Link from "next/link";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function ReleaseCard({
  artist,
  title,
  genre
}: {
  artist: string;
  title: string;
  genre: string;
}) {
  return (
    <Card>
      <div className="cosmic-artwork mb-4 aspect-square rounded-xl" />
      <h3 className="text-lg font-semibold text-white">{artist}</h3>
      <p className="mt-1 text-2xl leading-none text-white">{title}</p>
      <p className="mt-2 text-sm text-fog">{genre}</p>
      <div className="mt-4 flex gap-2">
        <Link href="/radio">
          <Button size="sm">Listen</Button>
        </Link>
        <Link href="/store">
          <Button size="sm" variant="outline">
            Buy
          </Button>
        </Link>
      </div>
    </Card>
  );
}
