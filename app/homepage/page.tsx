
import * as prismic from "@prismicio/client";
import Image from "next/image";
import Link from "next/link";
import JobCard from "@/components/ui/JobCard";
import JobsHeader from "@/components/ui/JobsHeader";
import { createClient } from "@/prismicio";
import type { OffreDocument } from "@/prismicio-types";

function mapWebsiteToOffer(website: OffreDocument) {
  const description = prismic.asText(website.data.description) ?? "";
  const firstLine = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0];

  const tags = (website.data.tag ?? "")
    .split(/[;,|\n]/)
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return {
    uid: website.uid || website.id,
    slug: website.uid || website.id,
    title: website.data.title?.trim() || "Offre",
    excerpt: firstLine || "Description à venir.",
    content: description ? [description] : ["Description à venir."],
    tags,
    publishedAt: website.data.date || website.first_publication_date,
    applicationsCount: 0,
  };
}

export default async function HomepagePage() {
  const client = createClient();
  const websites = await client.getAllByType("offre");
  const offers = (websites as OffreDocument[]).slice(0, 6).map(mapWebsiteToOffer);

  return (
    <main className="jobs-page">
      <div className="jobs-shell">
        <JobsHeader />

        <section className="jobs-hero" aria-label="Image de couverture">
          <Image
            src="/images/imageAccueil.jpg"
            alt="Bureau moderne"
            className="jobs-hero__image"
            fill
            priority
            sizes="(max-width: 1060px) 100vw, 1060px"
          />
        </section>

        <section className="jobs-section">
          <h1 className="jobs-main-title">Nos dernières opportunités</h1>

          {offers.length > 0 ? (
            <div className="jobs-grid">
              {offers.map((offer) => (
                <JobCard key={offer.uid} offer={offer} />
              ))}
            </div>
          ) : (
            <p className="jobs-empty">Aucune offre disponible pour le moment.</p>
          )}

          <div className="jobs-cta-wrap">
            <Link href="/liste" className="jobs-button">
              Voir toutes les offres
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
