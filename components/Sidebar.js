"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAuth, clearAuth } from "@/lib/auth";
import {
  Zap, Home, BookOpen, FolderOpen, IndianRupee, BarChart2,
  LayoutDashboard, TrendingUp, LogIn, LogOut, UserPlus, MessageSquare
} from "lucide-react";

const NAV_LINKS = [
  // { href: "/", label: "Home", icon: <Home size={20} /> },
  // { href: "/quiz", label: "Assessment", icon: <Zap size={20} /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/dossier", label: "Dossier", icon: <BookOpen size={20} /> },
  { href: "/mentor", label: "AI Mentor", icon: <MessageSquare size={20} /> },
  { href: "/progress", label: "Progress", icon: <TrendingUp size={20} /> },
  { href: "/history", label: "Archive", icon: <FolderOpen size={20} /> },
  { href: "/salary", label: "Earnings", icon: <IndianRupee size={20} /> },
  { href: "/compare", label: "Compare", icon: <BarChart2 size={20} /> },
];

const MOBILE_LINKS = [
  { href: "/", label: "Home", icon: <Home size={22} /> },
  { href: "/dossier", label: "Dossier", icon: <BookOpen size={22} /> },
  { href: "/mentor", label: "AI Mentor", icon: <MessageSquare size={22} /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={22} /> },
  { href: "/progress", label: "Progress", icon: <TrendingUp size={22} /> },
  { href: "/history", label: "Archive", icon: <FolderOpen size={22} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = getAuth();
    if (auth?.user) setUser(auth.user);

    function handleStorage() {
      const auth = getAuth();
      setUser(auth?.user || null);
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  function handleLogout() {
    clearAuth();
    setUser(null);
    window.dispatchEvent(new Event("storage"));
  }

  if (!mounted) return null;

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar (Rendered inside .shield-sidebar via layout) */}
      <nav className="shield-sidebar">
        
        {/* Brand Header */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--shield-border)" }}>
          <Link
            href="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}
          >
            <div
              style={{
                width: "36px", height: "36px",
                background: "linear-gradient(135deg, #F5A623, #C8841A)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 12px rgba(245,166,35,0.4)",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" fill="rgba(0,0,0,0.25)" />
                <circle cx="12" cy="12" r="2.5" fill="#000" opacity="0.8" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.1em", color: "var(--shield-gold)", lineHeight: 1.2 }}>
                S.H.I.E.L.D.
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--shield-silver)", opacity: 0.8 }}>
                CAREER INTELLIGENCE
              </div>
            </div>
          </Link>
        </div>

        {/* Main Links */}
        <div style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--shield-silver)", padding: "0 10px", marginBottom: "8px", opacity: 0.6 }}>
            MISSION DIRECTIVES
          </div>
          {NAV_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.06em",
                color: isActive(href) ? "var(--shield-gold)" : "var(--shield-silver)",
                textDecoration: "none", padding: "12px 14px", borderRadius: "8px",
                background: isActive(href) ? "rgba(245,166,35,0.08)" : "transparent",
                border: isActive(href) ? "1px solid rgba(245,166,35,0.2)" : "1px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive(href)) {
                  e.currentTarget.style.color = "var(--shield-white)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(href)) {
                  e.currentTarget.style.color = "var(--shield-silver)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span style={{ color: isActive(href) ? "var(--shield-gold)" : "var(--shield-silver)", opacity: isActive(href) ? 1 : 0.7 }}>
                {icon}
              </span>
              {label}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div style={{ padding: "20px", borderTop: "1px solid var(--shield-border)", background: "rgba(0,0,0,0.2)" }}>
          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--shield-gold)" }}>
                  <Zap size={16} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--shield-silver)" }}>LOGGED IN AS</div>
                  <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.8rem", letterSpacing: "0.05em", color: "var(--shield-white)" }}>AGENT {user.name?.toUpperCase()}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%", background: "none", border: "1px solid var(--shield-border)", borderRadius: "6px",
                  padding: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "6px", color: "var(--shield-red)", fontFamily: "var(--font-hero)", fontSize: "0.75rem", letterSpacing: "0.06em",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--shield-red)"; e.currentTarget.style.background = "rgba(192,57,43,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--shield-border)"; e.currentTarget.style.background = "none"; }}
              >
                <LogOut size={14} /> Disconnect
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/login" style={{
                width: "100%", fontFamily: "var(--font-hero)", fontSize: "0.8rem", letterSpacing: "0.06em",
                color: "var(--shield-silver)", textDecoration: "none", padding: "10px", border: "1px solid var(--shield-border)", borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--shield-white)"; e.currentTarget.style.borderColor = "var(--shield-silver)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--shield-silver)"; e.currentTarget.style.borderColor = "var(--shield-border)"; }}
              >
                <LogIn size={16} /> Agent Login
              </Link>
              <Link href="/signup" style={{
                width: "100%", fontFamily: "var(--font-hero)", fontSize: "0.8rem", letterSpacing: "0.06em",
                color: "var(--shield-black)", textDecoration: "none", padding: "10px", background: "var(--shield-gold)", borderRadius: "6px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "opacity 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                <UserPlus size={16} /> New Recruit Enlist
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      {mounted && createPortal(
        <div className="mobile-bottom-bar">
          {MOBILE_LINKS.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: "4px", textDecoration: "none", flex: 1, padding: "8px 4px",
                color: isActive(href) ? "var(--shield-gold)" : "var(--shield-silver)",
                transition: "color 0.2s",
              }}
            >
              {icon}
              <span style={{
                fontFamily: "var(--font-hero)", fontSize: "0.55rem",
                letterSpacing: "0.05em", color: "inherit",
              }}>
                {label}
              </span>
            </Link>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
