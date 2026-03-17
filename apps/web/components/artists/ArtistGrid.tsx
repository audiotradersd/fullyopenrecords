import ArtistCard from "./ArtistCard";

const artists = [
  { name: "Grzzly", description: "Raw underground hip hop.", slug: "grzzly" },
  { name: "Mira K", description: "Ambient electronic textures.", slug: "mira-k" },
  { name: "Noiser", description: "Industrial techno experiments.", slug: "noiser" }
];

export default function ArtistGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {artists.map((artist) => (
        <ArtistCard key={artist.slug} {...artist} />
      ))}
    </div>
  );
}
