import { JobOffer } from "@/libs/jobs";
import JobCard from "@/components/jobs/JobCard";

type JobGridType = {
  offers: JobOffer[];
};

export default function JobGrid({ offers }: JobGridType) {
  if (offers.length === 0) {
    return <p>Aucune offre disponible pour le moment.</p>;
  }

  return (
    <div className="jobs-grid">
      {offers.map((offer) => (
        <JobCard key={offer.uid} offer={offer} />
      ))}
    </div>
  );
}
