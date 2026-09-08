import AdminPanel from "../../../components/admin/AdminPanel";
import { noIndexMetadata } from "../../../lib/seo";

export const metadata = noIndexMetadata;
export default function AdminRadioPage() { return <AdminPanel section="radio" />; }
