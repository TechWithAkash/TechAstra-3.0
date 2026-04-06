"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function AppShell({ children }) {
  const pathname = usePathname();

  // Define routes that shouldn't have the sidebar
  const isNoSidebarRoute = 
    pathname === "/" || 
    pathname === "/login" || 
    pathname === "/signup" || 
    pathname === "/quiz" || 
    pathname.startsWith("/hero/");

  if (isNoSidebarRoute) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Simple Top Nav for Public Pages */}
        <nav style={{
          height: "60px", background: "rgba(10, 10, 10, 0.92)", borderBottom: "1px solid var(--shield-border)",
          display: "flex", alignItems: "center", padding: "0 24px", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          backdropFilter: "blur(16px)"
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "30px", height: "30px", background: "linear-gradient(135deg, #F5A623, #C8841A)",
              borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 10px rgba(245,166,35,0.4)"
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(0,0,0,0.25)" />
                <circle cx="12" cy="12" r="2.5" fill="#000" opacity="0.8" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--shield-gold)" }}>
              S.H.I.E.L.D.
            </span>
          </Link>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <Link href="/login" style={{ fontFamily: "var(--font-hero)", fontSize: "0.75rem", color: "var(--shield-silver)", padding: "6px 12px", border: "1px solid var(--shield-border)", borderRadius: "4px", textDecoration: "none" }}>Login</Link>
          </div>
        </nav>
        <main style={{ flex: 1, paddingTop: "60px", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </div>
    );
  }

  // Dashboard / Authenticated Routes
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
