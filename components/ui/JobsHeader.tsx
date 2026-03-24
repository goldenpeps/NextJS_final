"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOffreStore } from "@/store/offre.store";

export default function JobsHeader() {
  const pinnedCount = useOffreStore((state) => state.pinnedOffers.length);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="jobs-topbar">
      <div className="jobs-topbar__inner">
        <Link href="/homepage" className="jobs-brand" aria-label="Retour accueil">
          <span className="jobs-brand__icon">◌</span>
          <span>DEV</span>
        </Link>

        <Link href="/profil" className="jobs-profile" aria-label="Aller au profil">
          <span>⊙</span>
          <span className="jobs-profile__pinned">{isMounted ? pinnedCount : 0}</span>
        </Link>
      </div>
    </header>
  );
}
