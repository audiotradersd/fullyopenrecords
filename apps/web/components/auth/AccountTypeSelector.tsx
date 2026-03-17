"use client";

import { Headphones, Mic2 } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "./AuthProvider";

type AccountType = "listener" | "artist";

type Props = {
  selected: AccountType;
  onSelect: (type: AccountType) => void;
};

const cards = [
  {
    type: "listener" as const,
    icon: Headphones,
    title: "Listener Account",
    description: "Discover new music and support independent artists.",
    button: "Join as Listener"
  },
  {
    type: "artist" as const,
    icon: Mic2,
    title: "Artist Account",
    description: "Create your own artist page and share your music with the Fully Open community.",
    button: "Join as Artist"
  }
];

export default function AccountTypeSelector({ selected, onSelect }: Props) {
  const { openAuth } = useAuth();

  function handleSelect(type: AccountType) {
    onSelect(type);
    openAuth("register", type);
  }

  return (
    <section className="py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const active = selected === card.type;

          return (
            <div
              key={card.type}
              className={[
                "flex h-full flex-col rounded-xl border bg-white/5 p-8 backdrop-blur-md transition duration-200",
                active
                  ? "border-pink/60 shadow-[0_0_30px_rgba(209,74,139,0.18)]"
                  : "border-white/10 hover:border-pink/30"
              ].join(" ")}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,rgba(209,74,139,0.3),rgba(58,27,92,0.9))] text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-white">{card.title}</h2>
              <p className="mt-4 max-w-md text-base leading-7 text-fog">{card.description}</p>
              <div className="mt-auto pt-8">
                <Button onClick={() => handleSelect(card.type)}>{card.button}</Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
