import Link from "next/link";
import type { JobOffer } from "@/libs/jobs";
import { toTagSlug } from "@/libs/jobs";

type JobCardProps = {
  offer: JobOffer;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR").format(date);
}

export default function JobCard({ offer }: JobCardProps) {
  return (
    <article className="job-card">
      <header className="job-card__head">
        <h2>
          <Link href={`/single/${offer.uid}`}>{offer.title}</Link>
        </h2>
        <span className="job-card__save" aria-hidden>
          ◫
        </span>
      </header>

      <p className="job-card__date">◷ {formatDate(offer.publishedAt)}</p>

      {offer.tags.length > 0 && (
        <div className="job-card__tags" aria-label="Tags">
          {offer.tags.map((tag) => (
            <Link key={tag} href={`/tag/${toTagSlug(tag)}`}>
              {tag}
            </Link>
          ))}
        </div>
      )}

      <p className="job-card__excerpt">{offer.excerpt || "Description à venir."}</p>
    </article>
  );
}
