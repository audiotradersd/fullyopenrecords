import SignupPageContent from "../../components/auth/SignupPageContent";
import { noIndexMetadata } from "../../lib/seo";

export const metadata = noIndexMetadata;

export default async function SignupPage({
  searchParams
}: {
  searchParams?: Promise<{ type?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const initialType = resolvedSearchParams?.type === "artist" ? "artist" : "listener";

  return <SignupPageContent initialType={initialType} />;
}
