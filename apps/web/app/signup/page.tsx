import SignupPageContent from "../../components/auth/SignupPageContent";

export const runtime = "edge";

export default function SignupPage({
  searchParams
}: {
  searchParams?: { type?: string };
}) {
  const initialType = searchParams?.type === "artist" ? "artist" : "listener";

  return <SignupPageContent initialType={initialType} />;
}
