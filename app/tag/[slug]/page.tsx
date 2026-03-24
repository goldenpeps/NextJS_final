import Link from "next/link";
import { notFound } from "next/navigation";
import JobGrid from "@/components/jobs/JobGrid";
import SectionHeading from "@/components/jobs/SectionHeading";
import TopBar from "@/components/jobs/TopBar";
import { getAllTags, getOffersByTag } from "@/libs/jobs";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ slug: tag }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offers = await getOffersByTag(slug);

  if (!offers.length) {
    notFound();
  }

  return (
    <main className="jobs-page">
      <div className="jobs-shell jobs-shell--narrow">
        <TopBar />

        <section className="jobs-section">
          <Link href="/liste" className="jobs-button jobs-button--small">
            &lt; Voir toutes les offres
          </Link>

          <SectionHeading
            title={slug.charAt(0).toUpperCase() + slug.slice(1)}
            rightContent={<span>{offers.length} offres</span>}
          />

          <JobGrid offers={offers} />
        </section>
      </div>
    </main>
  );
}
