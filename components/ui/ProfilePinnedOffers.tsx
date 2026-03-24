"use client";

import { useEffect, useMemo, useState } from "react";
import JobCard from "@/components/ui/JobCard";
import { useOffreStore } from "@/store/offre.store";

export default function ProfilePinnedOffers() {
  const pinnedOffers = useOffreStore((state) => state.pinnedOffers);
  const [isMounted, setIsMounted] = useState(false);

  const sortedPinnedOffers = useMemo(
    () => [...pinnedOffers].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [pinnedOffers],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <p className="jobs-empty">Chargement...</p>;
  }

  if (sortedPinnedOffers.length === 0) {
    return <p className="jobs-empty">Aucune annonce epinglee pour le moment.</p>;
  }

  return (
    <div className="jobs-grid">
      {sortedPinnedOffers.map((offer) => (
        <JobCard key={offer.uid} offer={offer} />
      ))}
    </div>
  );
}
