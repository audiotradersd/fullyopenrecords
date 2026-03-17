"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAuth } from "./AuthProvider";

type JoinArtistButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
};

export default function JoinArtistButton({
  children,
  className,
  variant = "default"
}: JoinArtistButtonProps) {
  const router = useRouter();
  const { user, openAuth } = useAuth();

  function handleClick() {
    if (user) {
      router.push("/artist/dashboard");
      return;
    }

    openAuth("register", "artist");
  }

  return (
    <Button onClick={handleClick} className={className} variant={variant}>
      {children}
    </Button>
  );
}
