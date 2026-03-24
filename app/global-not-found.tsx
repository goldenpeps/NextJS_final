// Import global styles and fonts
import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import JobsHeader from "@/components/ui/JobsHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 -page non trouvée",
  description: "La page que vous recherchez n'existe pas.",
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={inter.className}>
        <body>
      <JobsHeader />
        <div  style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
            padding: "4rem",

        }}>
      <h1>404 - Page Non Trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <a href="/" style={{ marginTop: "2rem", fontWeight: "bold", color: "#0070f3" }}>
        Retour à l'accueil
        </a>
         </div>
      </body>
    
    </html>
  );
}
