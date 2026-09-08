import AdminPanel from "../../../components/admin/AdminPanel";
import { noIndexMetadata } from "../../../lib/seo";

export const metadata = noIndexMetadata;
export default function AdminAccountsPage() { return <AdminPanel section="accounts" />; }
