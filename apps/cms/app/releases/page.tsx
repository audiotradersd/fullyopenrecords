import { Shell } from "../../components/Shell";
import { CrudPage } from "../../components/CrudPage";

export default function ReleasesPage() {
  return (
    <Shell>
      <CrudPage
        title="Releases"
        endpoint="/admin/releases"
        fields={[
          { name: "title", label: "Title" },
          { name: "artistId", label: "Artist ID" },
          { name: "type", label: "Type" },
          { name: "artwork", label: "Artwork URL" },
          { name: "releaseDate", label: "Release date" },
          { name: "description", label: "Description" }
        ]}
      />
    </Shell>
  );
}

