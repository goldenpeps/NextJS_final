"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOffreStore } from "@/store/offre.store";

export type JobOffer = {
  uid: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  tags: string[];
  publishedAt: string;
  applicationsCount: number;
  isSaved?: boolean;
};

type JobCardProps = {
  offer: JobOffer;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR").format(date);
}

function toTagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function JobCard({ offer }: JobCardProps) {
  const togglePinned = useOffreStore((state) => state.togglePinned);
  const isPinned = useOffreStore((state) => state.isPinned(offer.uid));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pinned = isMounted ? isPinned : false;

  return (
    <article className="job-card">
      <header className="job-card__head">
        <h2>
          <Link href={`/single/${offer.uid}`}>{offer.title}</Link>
        </h2>
        <button
          type="button"
          className={`job-card__save ${pinned ? "job-card__save--active" : ""}`}
          aria-label={pinned ? "Retirer des epingles" : "Epingler cette annonce"}
          onClick={() => togglePinned(offer)}
        >
          ◫
        </button>
      </header>

      <p className="job-card__date">◷ {formatDate(offer.publishedAt)}</p>

      {offer.tags.length > 0 && (
        <div className="job-card__tags" aria-label="Tags">
          {offer.tags.map((tag) => (
            <Link key={tag} href={`/tag/${toTagSlug(tag)}`}>
              {tag}
            </Link>
          ))}
        </div>
      )}
      {/* bride a 20 caracteres */}
      <p className="job-card__excerpt">{offer.excerpt.length > 20 ? offer.excerpt.slice(0, 20) + "..." : offer.excerpt}</p>
      {/* <p  className="job-card__excerpt">{offer.excerpt || "Description à venir."}</p> */}
    </article>
  );
}
