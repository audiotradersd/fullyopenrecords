"use client";

import { useState } from "react";
import SignupHero from "./SignupHero";
import AccountTypeSelector from "./AccountTypeSelector";
import BenefitsPanel from "./BenefitsPanel";

type AccountType = "listener" | "artist";

export default function SignupPageContent({
  initialType
}: {
  initialType: AccountType;
}) {
  const [selected, setSelected] = useState<AccountType>(initialType);

  return (
    <>
      <SignupHero />
      <div className="mx-auto max-w-6xl px-6">
        <AccountTypeSelector selected={selected} onSelect={setSelected} />
        <BenefitsPanel selected={selected} />
      </div>
    </>
  );
}
