"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import Container from "./Container";
import { Button } from "../ui/button";
import { useAuth } from "../auth/AuthProvider";

const logoUrl = "/new-logo-v2.png";

const links = [
  ["Artists", "/artists"],
  ["Releases", "/releases"],
  ["Radio", "/radio"],
  ["Get Heard", "/get-heard"]
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, openAuth, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(4,2,10,0.78)] backdrop-blur-xl">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Image
              src={logoUrl}
              alt="Fully Open Records"
              width={1200}
              height={400}
              className="h-16 w-auto object-contain md:h-20"
              priority
            />
          </Link>

          <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
            <nav className="flex items-center gap-6 text-sm uppercase tracking-[0.16em] text-fog">
              {links.map(([label, href]) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative inline-flex h-11 items-center transition ${
                      active ? "text-white" : "text-fog hover:text-white"
                    }`}
                  >
                    {label}
                    <span
                      className={`absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink transition ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/radio">
                <Button>Listen Live</Button>
              </Link>
              {loading ? null : user ? (
                <>
                  {user.accountType === "artist" ? (
                    <a href="/artist/dashboard">
                      <Button variant="outline">Dashboard</Button>
                    </a>
                  ) : (
                    <a href="/account">
                      <Button variant="outline">Account</Button>
                    </a>
                  )}
                  <Button variant="ghost" onClick={() => void logout()}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => openAuth("login")}>
                    Log in
                  </Button>
                  <Link href={"/signup" as Route}>
                    <Button>Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden">
            {user ? (
              user.accountType === "artist" ? (
                <a href="/artist/dashboard">
                  <Button size="sm">Studio</Button>
                </a>
              ) : (
                <a href="/account">
                  <Button size="sm">Account</Button>
                </a>
              )
            ) : (
              <Link href={"/signup" as Route}>
                <Button size="sm">Join</Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
