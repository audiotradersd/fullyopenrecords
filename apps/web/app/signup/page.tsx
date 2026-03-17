import SignupPageContent from "../../components/auth/SignupPageContent";


export default async function SignupPage({
  searchParams
}: {
  searchParams?: Promise<{ type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialType = resolvedParams?.type === "artist" ? "artist" : "listener";

  return <SignupPageContent initialType={initialType} />;
}
