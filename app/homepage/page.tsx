import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/jobs/TopBar";
import JobGrid from "@/components/jobs/JobGrid";
import { getLatestOffers } from "@/libs/jobs";

export default async function HomePage() {
  const offers = await getLatestOffers(6);

  return (
    <main className="jobs-page">
      <div className="jobs-shell">
        <TopBar />

        <section className="jobs-hero" aria-label="Banniere">
          <Image
            src="/images/imageAccueil.jpg"
            alt="Banniere de la page d'accueil"
            fill
            priority
            className="jobs-hero__image"
            sizes="(max-width: 960px) 100vw, 960px"
          />
        </section>

        <section className="jobs-section">
          <h1 className="jobs-main-title">Nos dernieres opportunites</h1>
          <JobGrid offers={offers} />
          <div className="jobs-cta-wrap">
            <Link href="/liste" className="jobs-button">
              Voir toutes les offres
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
