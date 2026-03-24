import Link from "next/link";
import TopBar from "@/components/jobs/TopBar";
import JobGrid from "@/components/jobs/JobGrid";
import { getApplicationHistory, getSavedOffers } from "@/libs/jobs";

export default async function ProfilPage() {
  const [savedOffers, history] = await Promise.all([
    getSavedOffers(),
    getApplicationHistory(),
  ]);

  return (
    <main className="jobs-page">
      <div className="jobs-shell jobs-shell--narrow">
        <TopBar />

        <section className="jobs-section">
          <h1 className="jobs-main-title">Bienvenue</h1>

          <h2 className="jobs-subtitle">Offres enregistrees</h2>
          <JobGrid offers={savedOffers} />

          <h2 className="jobs-subtitle">Historique des candidatures</h2>
          <div className="jobs-history">
            {history.map((offer) => (
              <article key={offer.uid} className="jobs-history__item">
                <p className="job-card__date">
                  {new Date(offer.publishedAt).toLocaleDateString("fr-FR")}
                </p>
                <h3>
                  <Link href={`/single/${offer.uid}`}>{offer.title}</Link>
                </h3>
                <ul className="job-card__tags">
                  {offer.tags.map((tag) => (
                    <li key={`${offer.uid}-history-${tag}`}>
                      <Link href={`/tag/${tag}`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
                <p>{offer.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
