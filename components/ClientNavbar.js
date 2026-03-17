"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuth, clearAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function ClientNavbar() {
  const [auth, setAuth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Read auth state after mount so SSR doesn't mismatch
    setAuth(getAuth());
    
    // Also listen to storage events to update navbar actively across tabs
    const handleStorageChange = () => setAuth(getAuth());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function handleLogout() {
    clearAuth();
    setAuth(null);
    router.push("/");
  }

  if (auth?.token) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginLeft: "14px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.1em" }}>
          AGENT <span style={{ color: "var(--shield-gold)" }}>{auth.user?.name?.split(" ")[0].toUpperCase()}</span>
        </span>
        <button
          onClick={handleLogout}
          style={{
            fontFamily: "var(--font-hero)", fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--shield-red)",
            background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", padding: "5px 12px", borderRadius: "4px", cursor: "pointer",
            textTransform: "uppercase"
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "10px", marginLeft: "14px" }}>
      <Link href="/login" style={{
        fontFamily: "var(--font-hero)", fontSize: "0.72rem", letterSpacing: "0.08em", color: "var(--shield-silver)",
        textDecoration: "none", padding: "6px 14px", border: "1px solid var(--shield-border)", borderRadius: "5px", textTransform: "uppercase"
      }}>
        Login
      </Link>
      <Link href="/signup" style={{
        display: "inline-flex", alignItems: "center", padding: "7px 18px", background: "linear-gradient(135deg, #F5A623, #C8841A)",
        color: "#000", fontFamily: "var(--font-hero)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "5px", textDecoration: "none"
      }}>
        Enlist
      </Link>
    </div>
  );
}
