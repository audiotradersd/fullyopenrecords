import { Shell } from "../../components/Shell";
import { CrudPage } from "../../components/CrudPage";

export default function ArtistsPage() {
  return (
    <Shell>
      <CrudPage
        title="Artists"
        endpoint="/admin/artists"
        fields={[
          { name: "name", label: "Name" },
          { name: "slug", label: "Slug" },
          { name: "bio", label: "Biography" },
          { name: "heroImage", label: "Hero image URL" },
          { name: "galleryImages", label: "Gallery image URL" },
          { name: "embeddedPlayer", label: "Embedded player HTML" },
          { name: "genres", label: "Genres", placeholder: "Electronic, Ambient" }
        ]}
      />
    </Shell>
  );
}

