import Link from "next/link";

export default function TopBar() {
  return (
    <header className="jobs-topbar">
      <div className="jobs-topbar__inner">
        <Link href="/homepage" className="jobs-brand" aria-label="Retour accueil">
          <span className="jobs-brand__icon" aria-hidden>
            ▢
          </span>
          <span>DEV</span>
        </Link>
        <Link href="/profil" className="jobs-profile" aria-label="Voir le profil">
          ⊙
        </Link>
      </div>
    </header>
  );
}
