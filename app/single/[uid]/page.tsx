import Link from "next/link";
import { notFound } from "next/navigation";
import JobsHeader from "@/components/ui/JobsHeader";
import { createClient } from "@/prismicio";

type JobOffer = {
	uid: string;
	title: string;
	content: string[];
	tags: string[];
	publishedAt: string;
};

type SingleOfferPageProps = {
	params: Promise<{ uid: string }>;
};

function toTagSlug(tag: string): string {
	return tag
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR").format(date);
}

export default async function SingleOfferPage({ params }: SingleOfferPageProps) {
  const { uid } = await params;
	const websites = await createClient().getAllByType("offre");
	const offers: JobOffer[] = websites.map((website) => {
		const content = website.data.description
			.map((block) => ("text" in block && typeof block.text === "string" ? block.text.trim() : ""))
			.filter(Boolean);

		return {
			uid: website.uid ?? website.id,
			title: website.data.title?.trim() || "Offre",
			content: content.length > 0 ? content : ["Description à venir."],
			tags: website.tags ?? [],
			publishedAt: website.data.date || website.first_publication_date,
		};
	});
  const offer = offers.find((item) => item.uid === uid);

  if (!offer) {
    notFound();
  }

  return (
    <main className="jobs-page">
      <div className="jobs-shell jobs-shell--narrow">
        <JobsHeader />

	        <section className="jobs-section jobs-section--single">
	          <Link href="/liste" className="jobs-button jobs-button--small">
	            &lt; Voir toutes les offres
	          </Link>

	          <h1 className="jobs-main-title">{offer.title}</h1>

	          <p className="job-card__date">◷ {formatDate(offer.publishedAt)}</p>

	          {offer.tags.length > 0 && (
	            <div className="jobs-filter-tags" aria-label="Tags de l'offre">
	              {offer.tags.map((tag) => (
	                <Link key={tag} href={`/tag/${toTagSlug(tag)}`}>
	                  {tag}
	                </Link>
	              ))}
	            </div>
	          )}

	          <div className="job-single-content" aria-label="Description de l'offre">
	            {offer.content.map((line, index) => (
	              <p key={`${offer.uid}-${index}`}>{line}</p>
	            ))}
	          </div>

	          <section className="job-apply-form" aria-label="Reference de l'offre">
	            <textarea readOnly value={`UID / UUID de l'offre : ${offer.uid}`} />
	            <button type="button" className="jobs-button">
	              Envoyer
	            </button>
	          </section>
	        </section>
      </div>
    </main>
  );
}
