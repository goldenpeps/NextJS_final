import JobsHeader from "@/components/ui/JobsHeader";
import ProfilePinnedOffers from "@/components/ui/ProfilePinnedOffers";

export default async function ProfilPage() {
  return (
    <main className="jobs-page">
      <div className="jobs-shell">
        <JobsHeader />

        <section className="jobs-section">
          <h1 className="jobs-main-title">Profil</h1>
          <ProfilePinnedOffers />
        </section>
      </div>
    </main>
  );
}
