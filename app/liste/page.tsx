
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

type ListePageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function HomepagePage({ searchParams }: ListePageProps) {
  const { page } = await searchParams;
  const requestedPage = Number.parseInt(page ?? "1", 10);
  const safeRequestedPage = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;
  const pageSize = 6;

  const client = createClient();
  const websites = await client.getAllByType("offre");
  const sortedOffers = (websites as unknown as OffreDocumentLike[])
    .map(mapWebsiteToOffer)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const totalPages = Math.max(1, Math.ceil(sortedOffers.length / pageSize));
  const currentPage = Math.min(safeRequestedPage, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const offers = sortedOffers.slice(startIndex, startIndex + pageSize);

  return (
    <main className="jobs-page">
      <div className="jobs-shell">
        <JobsHeader />

        <section className="jobs-section">
          <h1 className="jobs-main-title">Voir toutes les offres</h1>

          {offers.length > 0 ? (
            <>
              <div className="jobs-grid">
                {offers.map((offer) => (
                  <JobCard key={offer.uid} offer={offer} />
                ))}
              </div>

              <div className="jobs-pagination" aria-label="Pagination des offres">
                {currentPage > 1 ? (
                  <Link href={`/liste?page=${currentPage - 1}`} className="jobs-button jobs-button--small">
                    Precedent
                  </Link>
                ) : (
                  <span className="jobs-button jobs-button--small jobs-button--disabled">Precedent</span>
                )}

                <span className="jobs-pagination__status">
                  Page {currentPage} / {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link href={`/liste?page=${currentPage + 1}`} className="jobs-button jobs-button--small">
                    Suivant
                  </Link>
                ) : (
                  <span className="jobs-button jobs-button--small jobs-button--disabled">Suivant</span>
                )}
              </div>
            </>
          ) : (
            <p className="jobs-empty">Aucune offre disponible pour le moment.</p>
          )}

        </section>
      </div>
    </main>
  );
}
