import Link from "next/link";

const links = [
  ["/", "Overview"],
  ["/artists", "Artists"],
  ["/releases", "Releases"],
  ["/products", "Products"],
  ["/faq", "FAQ"],
  ["/pages", "Pages"],
  ["/submissions", "Submissions"],
  ["/media", "Media"]
] as const;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
      <aside className="border-r border-white/10 p-6">
        <p className="font-display text-xl uppercase tracking-[0.3em]">FOR CMS</p>
        <nav className="mt-8 grid gap-3 text-sm text-fog">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="p-6 md:p-10">{children}</main>
    </div>
  );
}

