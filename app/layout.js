import "./globals.css";
import Link from "next/link";
import ClientNavbar from "@/components/ClientNavbar";

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
        <NavbarWrapper />
        <main style={{ paddingTop: "60px" }}>{children}</main>
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
          }}
        >
          CLASSIFIED // S.H.I.E.L.D. INTERNAL DOCUMENT // EYES ONLY · TECH ASTRA WEBATHON 2026
        </footer>
      </body>
    </html>
  );
}

// Static server-rendered navbar wrapper — dynamic auth state is handled client-side inside ClientNavbar
function NavbarWrapper() {
  return (
    <nav className="shield-navbar">
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              background: "linear-gradient(135deg, #F5A623, #C8841A)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(245,166,35,0.4)",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(0,0,0,0.25)" />
              <circle cx="12" cy="12" r="2.5" fill="#000" opacity="0.8" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--shield-gold)" }}>
            S.H.I.E.L.D.
          </span>
        </Link>

        {/* Nav — Primary links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {[
            { href: "/quiz",    label: "Mission" },
            { href: "/salary",  label: "Earnings" },
            { href: "/compare", label: "Compare" },
            { href: "/history", label: "Archive" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: "var(--font-hero)",
                fontSize: "0.72rem",
                letterSpacing: "0.08em",
                color: "var(--shield-silver)",
                textDecoration: "none",
                padding: "6px 11px",
                borderRadius: "4px",
                textTransform: "uppercase",
              }}
            >
              {label}
            </Link>
          ))}

          {/* Auth side — client-rendered to read localStorage */}
          <ClientNavbar />
        </div>
      </div>
    </nav>
  );
}
