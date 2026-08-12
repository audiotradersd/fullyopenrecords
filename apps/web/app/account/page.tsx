import ListenerAccount from "../../components/account/ListenerAccount";
import { noIndexMetadata } from "../../lib/seo";

export const runtime = "edge";
export const metadata = noIndexMetadata;

export default function AccountPage() {
  return <ListenerAccount />;
}
