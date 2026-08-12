import AdminPanel from "../../components/admin/AdminPanel";
import { noIndexMetadata } from "../../lib/seo";
export const runtime = "edge";
export const metadata = noIndexMetadata;
export default function AdminPage() { return <AdminPanel />; }
