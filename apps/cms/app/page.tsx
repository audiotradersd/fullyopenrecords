import { Shell } from "../components/Shell";

export default function DashboardPage() {
  return (
    <Shell>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          "Artists",
          "Releases",
          "Products",
          "Pages",
          "FAQ",
          "Submissions"
        ].map((card) => (
          <div key={card} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-fog">{card}</p>
            <p className="mt-4 font-display text-3xl">Manage</p>
          </div>
        ))}
      </div>
    </Shell>
  );
}

