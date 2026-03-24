import Link from "next/link";

export default function JobsHeader() {
  return (
    <header className="jobs-topbar">
      <div className="jobs-topbar__inner">
        <Link href="/homepage" className="jobs-brand" aria-label="Retour accueil">
          <span className="jobs-brand__icon">◌</span>
          <span>DEV</span>
        </Link>

        <Link href="/profil" className="jobs-profile" aria-label="Aller au profil">
          ⊙
        </Link>
      </div>
    </header>
  );
}
