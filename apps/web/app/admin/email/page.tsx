import AdminPanel from "../../../components/admin/AdminPanel";
import { noIndexMetadata } from "../../../lib/seo";

export const metadata = noIndexMetadata;
export default function AdminEmailPage() { return <AdminPanel section="email" />; }
