import Link from "next/link";
import { JobOffer } from "@/libs/jobs";

type JobCardType = {
  offer: JobOffer;
};

function displayDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR");
}

export default function JobCard({ offer }: JobCardType) {
  return (
    <article className="job-card">
      <div className="job-card__head">
        <h2>
          <Link href={`/single/${offer.uid}`}>{offer.title}</Link>
        </h2>
        <span className="job-card__save" aria-hidden>
          ⌁
        </span>
      </div>
      <p className="job-card__date">{displayDate(offer.publishedAt)}</p>
      <ul className="job-card__tags">
        {offer.tags.map((tag) => (
          <li key={`${offer.uid}-${tag}`}>
            <Link href={`/tag/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
      <p className="job-card__excerpt">{offer.excerpt}</p>
    </article>
  );
}
