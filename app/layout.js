import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: "S.H.I.E.L.D. — Superhero Career Intelligence",
  description:
    "Marvel-themed AI career guidance. Take the Avengers quiz, get your hero identity, and receive a classified Mission Dossier — powered by Groq AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Analytics />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            {children}
            <footer
              style={{
                borderTop: "1px solid var(--shield-border)",
                padding: "20px 24px",
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--shield-silver)",
                opacity: 0.45,
                letterSpacing: "0.12em",
                marginTop: "auto"
              }}
            >
              CLASSIFIED // S.H.I.E.L.D. INTERNAL DOCUMENT // EYES ONLY · TECH ASTRA WEBATHON 2026
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
