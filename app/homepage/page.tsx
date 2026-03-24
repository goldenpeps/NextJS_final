
import Image from "next/image";
import Link from "next/link";
import JobCard, { type JobOffer } from "@/components/ui/JobCard";
import * as prismic from "@prismicio/client";
import JobsHeader from "@/components/ui/JobsHeader";
import { createClient } from "@/prismicio";
 
export default async function HomepagePage() {
  const websites = await createClient().getAllByType("offre", {
      filters: [prismic.filter.at("document.tags", ["FirstPage"])],
 
});
  const offers: JobOffer[] = websites.map((website) => {
    const description = website.data.description
      .map((block) => ("text" in block && typeof block.text === "string" ? block.text : ""))
      .join(" ")
      .trim();

    return {
      uid: website.uid ?? website.id,
      slug: website.uid ?? website.id,
      title: website.data.title?.trim() || "Offre",
      excerpt: description || "Description à venir.",
      content: description ? [description] : ["Description à venir."],
      tags: website.tags ?? [],
      publishedAt: website.data.date || website.first_publication_date,
      applicationsCount: 0,
    };
  });

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
