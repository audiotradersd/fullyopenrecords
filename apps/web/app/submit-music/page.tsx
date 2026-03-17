import { redirect } from "next/navigation";

export const runtime = "edge";

export default function SubmitMusicRedirectPage() {
  redirect("/get-heard");
}

