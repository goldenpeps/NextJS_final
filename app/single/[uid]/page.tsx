import Link from "next/link";
import { notFound } from "next/navigation";
import TopBar from "@/components/jobs/TopBar";
import { getAllOffers, getOfferByUid } from "@/libs/jobs";

export async function generateStaticParams() {
  const offers = await getAllOffers();
  return offers.map((offer) => ({ uid: offer.uid }));
}

export default async function SingleOfferPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const offer = await getOfferByUid(uid);

  if (!offer) {
    notFound();
  }

  return (
    <main className="jobs-page">
      <div className="jobs-shell jobs-shell--narrow">
        <TopBar />

        <section className="jobs-section jobs-section--single">
          <Link href="/liste" className="jobs-button jobs-button--small">
            &lt; Voir toutes les offres
          </Link>

          <h1 className="jobs-main-title">{offer.title}</h1>

          <p className="job-card__date">
            {new Date(offer.publishedAt).toLocaleDateString("fr-FR")}
          </p>

          {offer.tags.length > 0 ? (
            <ul className="job-card__tags">
              {offer.tags.map((tag) => (
                <li key={`${offer.uid}-${tag}`}>
                  <Link href={`/tag/${tag}`}>{tag}</Link>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="job-single-content">
            {offer.content.map((paragraph, index) => (
              <p key={`${offer.uid}-p-${index}`}>{paragraph}</p>
            ))}
          </div>

          <form className="job-apply-form">
            <label htmlFor="application-message" className="sr-only">
              Message de candidature
            </label>
            <textarea
              id="application-message"
              name="message"
              placeholder="Postuler a cette offre ..."
            />
            <button type="submit" className="jobs-button">
              Envoyer
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
