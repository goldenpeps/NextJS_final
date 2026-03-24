import * as prismic from "@prismicio/client";
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
	const content = description
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const documentTags = parseTagField(website.tags);
	const legacyTags = parseTagField(website.data.tag);

	return {
		uid: website.uid || website.id,
		title: website.data.title?.trim() || "Offre",
		content: content.length > 0 ? content : ["Description à venir."],
		tags: documentTags.length > 0 ? documentTags : legacyTags,
		publishedAt: website.data.date || website.first_publication_date,
	};
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
  const client = createClient();
  const websites = await client.getAllByType("offre");
  const offers = (websites as unknown as OffreDocumentLike[]).map(mapWebsiteToOffer);
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
