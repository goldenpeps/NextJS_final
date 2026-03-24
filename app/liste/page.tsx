import Link from "next/link";
import JobGrid from "@/components/jobs/JobGrid";
import SectionHeading from "@/components/jobs/SectionHeading";
import TopBar from "@/components/jobs/TopBar";
import { getAllOffers, getAllTags } from "@/libs/jobs";

export default async function ListePage() {
  const [offers, tags] = await Promise.all([getAllOffers(), getAllTags()]);

  return (
    <main className="jobs-page">
      <div className="jobs-shell jobs-shell--narrow">
        <TopBar />

        <section className="jobs-section">
          <SectionHeading
            title="Offres d'emploi"
            rightContent={<span>{offers.length} offres</span>}
          />

          <ul className="jobs-filter-tags">
            {tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tag/${tag}`}>{tag}</Link>
              </li>
            ))}
          </ul>

          <JobGrid offers={offers} />
        </section>
      </div>
    </main>
  );
}
