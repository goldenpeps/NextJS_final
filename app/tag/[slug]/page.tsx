import Link from "next/link";
import { notFound } from "next/navigation";
import JobCard, { type JobOffer } from "@/components/ui/JobCard";
import JobsHeader from "@/components/ui/JobsHeader";
import { createClient } from "@/prismicio";

type TagPageDetailsProps = {
  params: Promise<{ slug: string }>;
};

function toTagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}


export default async function TagPageDetails({ params }: TagPageDetailsProps) {
  const { slug } = await params;
  const client = createClient();
  const websites = await client.getAllByType("offre", {
    orderings: [{ field: "document.first_publication_date", direction: "desc" }],
  });
  const allOffers: JobOffer[] = websites.map((website) => {
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
  const offers = allOffers.filter((offer) =>
    offer.tags.some((tag) => toTagSlug(tag) === slug || tag.toLowerCase() === slug.toLowerCase()),
  );
  const matchedTag = allOffers
    .flatMap((offer) => offer.tags)
    .find((tag) => toTagSlug(tag) === slug);
  const tagLabel = matchedTag ?? slug.replace(/-/g, " ");

  if (!matchedTag && offers.length === 0) {
    notFound();
  }

  return (
    <main className="jobs-page">
      <div className="jobs-shell">
        <JobsHeader />

        <section className="jobs-section">
          <Link href="/tag" className="jobs-button jobs-button--small">
            &lt; Tous les tags
          </Link>

          <div className="jobs-section-heading">
            <h1>{tagLabel}</h1>
            <p className="jobs-section-heading__meta">{offers.length} offres</p>
          </div>

          {offers.length > 0 ? (
            <div className="jobs-grid">
              {offers.map((offer) => (
                <JobCard key={offer.uid} offer={offer} />
              ))}
            </div>
          ) : (
            <p className="jobs-empty">Aucune offre disponible pour ce tag.</p>
          )}
        </section>
      </div>
    </main>
  );
}
