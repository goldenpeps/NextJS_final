import TopBar from "@/components/jobs/TopBar";

const sections = [
  {
    title: "Lorem ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    title: "Lorem ipsum",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

export default function MentionPage() {
  return (
    <main className="jobs-page">
      <div className="jobs-shell jobs-shell--narrow">
        <TopBar />

        <section className="jobs-section jobs-legal">
          <h1 className="jobs-main-title">Mentions Legales</h1>
          {sections.map((section, index) => (
            <article key={`legal-${index}`}>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
