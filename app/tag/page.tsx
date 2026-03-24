
import * as prismic from "@prismicio/client";
import Link from "next/link";
import JobCard, { type JobOffer } from "@/components/ui/JobCard";
import JobsHeader from "@/components/ui/JobsHeader";
import { createClient } from "@/prismicio";

type OffreDocumentLike = {
  uid: string | null;
  id: string;
  tags?: string[];
  first_publication_date: string;
  data: {
    title?: string | null;
    date?: string | null;
    description?: unknown;
    tag?: unknown;
  };
};

function toTagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function parseTagField(tagField: unknown): string[] {
  if (Array.isArray(tagField)) {
    return [...new Set(tagField.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
  }

  if (typeof tagField === "string") {
    return [...new Set(tagField
      .split(/[;,|\n]/)
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean))];
  }

  const asText = prismic.asText(tagField as prismic.RichTextField) ?? "";
  return [...new Set(asText
    .split(/[;,|\n]/)
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean))];
}

function mapWebsiteToOffer(website: OffreDocumentLike): JobOffer {
  const description = prismic.asText(website.data.description as prismic.RichTextField) ?? "";
  const firstLine = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0];
  const documentTags = parseTagField(website.tags);
  const legacyTags = parseTagField(website.data.tag);

  return {
    uid: website.uid || website.id,
    slug: website.uid || website.id,
    title: website.data.title?.trim() || "Offre",
    excerpt: firstLine || "Description à venir.",
    content: description ? [description] : ["Description à venir."],
    tags: documentTags.length > 0 ? documentTags : legacyTags,
    publishedAt: website.data.date || website.first_publication_date,
    applicationsCount: 0,
  };
}

export default async function TagPage() {
  const client = createClient();
  const websites = await client.getAllByType("offre", {
    orderings: [{ field: "document.first_publication_date", direction: "desc" }],
  });
  const offers = (websites as unknown as OffreDocumentLike[]).map(mapWebsiteToOffer);
  const tags = [...new Set(offers.flatMap((offer) => offer.tags))].sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base" }),
  );

  return (
    <main className="jobs-page">
      <div className="jobs-shell">
        <JobsHeader />

        <section className="jobs-section">
          <h1 className="jobs-main-title">Toutes les offres par tag</h1>

          {tags.length > 0 && (
            <div className="jobs-filter-tags" aria-label="Liste des tags">
              {tags.map((tag) => (
                <Link key={tag} href={`/tag/${toTagSlug(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>
          )}

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
              Retour a la liste complete
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
