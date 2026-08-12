import SignupPageContent from "../../components/auth/SignupPageContent";
import { noIndexMetadata } from "../../lib/seo";

export const runtime = "edge";
export const metadata = noIndexMetadata;

export default function SignupPage({
  searchParams
}: {
  searchParams?: { type?: string };
}) {
  const initialType = searchParams?.type === "artist" ? "artist" : "listener";

  return <SignupPageContent initialType={initialType} />;
}
