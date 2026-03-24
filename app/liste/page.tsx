
import Link from "next/link";
import JobCard, { type JobOffer } from "@/components/ui/JobCard";
import JobsHeader from "@/components/ui/JobsHeader";
import { createClient } from "@/prismicio";

type ListePageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ListePage({ searchParams }: ListePageProps) {
  const { page } = await searchParams;
  const requestedPage = Number.parseInt(page ?? "1", 10);
  const safeRequestedPage = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;
  const pageSize = 6;

  const websites = await createClient().getAllByType("offre");
  const sortedOffers: JobOffer[] = websites
    .map((website) => {
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
    })
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
