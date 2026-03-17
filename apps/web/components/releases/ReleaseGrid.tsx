import ReleaseCard from "./ReleaseCard";

const releases = [
  { artist: "Grzzly", title: "Sonny Boy", genre: "Experimental Hip Hop" },
  { artist: "Mira K", title: "Echowave", genre: "Ambient Electronic" },
  { artist: "Noiser", title: "Obsidian Engine", genre: "Industrial Techno" }
];

export default function ReleaseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {releases.map((release) => (
        <ReleaseCard key={`${release.artist}-${release.title}`} {...release} />
      ))}
    </div>
  );
}
