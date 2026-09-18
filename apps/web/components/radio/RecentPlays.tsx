import Link from "next/link";

type HistoryItem = {
  id: number;
  artistName: string;
  title: string;
  coverImage?: string | null;
  artistHref?: string | null;
  playedAt: string;
};

export default function RecentPlays({ items }: { items: HistoryItem[] }) {
  return <section><div className="mb-3 flex items-center justify-between"><h2 className="text-xl font-semibold uppercase tracking-[.04em] text-white">Just Played</h2><Link href="#history" className="text-sm text-[#94c8f5]">View full history&nbsp; →</Link></div>{items.length ? <div id="history" className="grid grid-flow-col auto-cols-[132px] gap-3 overflow-x-auto pb-2 md:auto-cols-[calc((100%-84px)/8)]">{items.map((item) => <article key={`${item.id}-${item.playedAt}`} className="min-w-0">{item.artistHref ? <Link href={item.artistHref} className="group block" aria-label={`View ${item.artistName}'s artist page`}><HistoryArtwork item={item} /><HistoryText item={item} linked /></Link> : <><HistoryArtwork item={item} /><HistoryText item={item} /></>}</article>)}</div> : <p className="text-sm text-fog">Track history will appear here as the station plays.</p>}</section>;
}

function HistoryArtwork({ item }: { item: HistoryItem }) {
  return <div className="aspect-square overflow-hidden rounded-md border border-[#24435e] bg-[#0b1929] transition group-hover:border-[#76bcf7]">{item.coverImage ? <img src={item.coverImage} alt={`${item.artistName} artwork`} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle,#254e75,transparent_52%),linear-gradient(145deg,#091525,#102b45)]"><img src="/favicon.ico" alt="" className="h-9 w-9 object-contain opacity-80" /></div>}</div>;
}

function HistoryText({ item, linked = false }: { item: HistoryItem; linked?: boolean }) {
  return <><p className={`mt-2 truncate text-xs font-semibold ${linked ? "text-white group-hover:text-[#91cbff]" : "text-white"}`}>{item.artistName}</p><p className="mt-0.5 truncate text-xs text-[#b9c9d7]">{item.title}</p><p className="mt-1 text-[10px] text-[#93a9bd]">{new Date(item.playedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></>;
}
