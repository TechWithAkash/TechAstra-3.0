"use client";
import { useState } from "react";
import { AlertTriangle, Zap, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setAuth } from "@/lib/auth";

function ShieldIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <path
        d="M50 5 L92 25 L92 55 C92 75 73 90 50 97 C27 90 8 75 8 55 L8 25 Z"
        fill="rgba(245,166,35,0.1)"
        stroke="#F5A623"
        strokeWidth="2"
      />
      <circle cx="50" cy="52" r="10" fill="rgba(245,166,35,0.2)" />
      <circle cx="50" cy="52" r="5" fill="#F5A623" opacity="0.9" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setAuth({ token: data.token, user: data.user });
      router.push("/quiz");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoLogin() {
    setAuth({
      token: "demo-token-xyz789",
      user: { userId: "demo-admin", name: "Demo User", email: "demo@shield.gov" }
    });
    router.push("/quiz");
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)",
      background: "var(--shield-black)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <ShieldIcon />
          </div>
          <div className="section-label" style={{ marginBottom: "8px" }}>S.H.I.E.L.D. Secure Access</div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "1.9rem", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            Agent <span className="text-gold-gradient">Login</span>
          </h1>
          <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "var(--shield-silver)" }}>
            Access your classified mission dossiers.
          </p>
        </div>

        {/* Form */}
        <div className="dossier-panel" style={{ padding: "32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "16px" }}>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--shield-silver)", marginBottom: "8px" }}>
                AGENT EMAIL
              </label>
              <input
                className="shield-input"
                type="email"
                name="email"
                placeholder="agent@shield.gov"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--shield-silver)", marginBottom: "8px" }}>
                SECURITY PASSPHRASE
              </label>
              <input
                className="shield-input"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderLeft: "3px solid var(--shield-red)", borderRadius: "6px" }}>
                <p style={{ fontSize: "0.82rem", color: "var(--shield-red)", fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "6px" }}><AlertTriangle size={14} /> {error}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{ justifyContent: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "wait" : "pointer", marginTop: "4px" }}
            >
              {loading ? (
                <>
                  <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #000", borderTopColor: "transparent", borderRadius: "50%", animation: "arc-spin 0.7s linear infinite", marginRight: "6px" }} />
                  Verifying...
                </>
              ) : <><Zap size={16} style={{ marginRight: "6px" }} /> Access S.H.I.E.L.D.</>}
            </button>
          </form>

          {/* Quick Access / Demo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--shield-border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)", letterSpacing: "0.15em" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--shield-border)" }} />
          </div>

          <button
            type="button"
            className="btn-outline"
            onClick={handleDemoLogin}
            style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", borderColor: "var(--shield-silver)", color: "var(--shield-white)" }}
          >
            <ShieldCheck size={16} style={{ marginRight: "8px", color: "var(--shield-gold)" }} />
            Demo Access Login
          </button>

          <div className="glow-line" style={{ margin: "24px 0" }} />

          <p style={{ textAlign: "center", fontSize: "0.83rem", color: "var(--shield-silver)" }}>
            No account?{" "}
            <Link href="/signup" style={{ color: "var(--shield-gold)", textDecoration: "none", fontWeight: 600 }}>
              Enlist as Agent →
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", letterSpacing: "0.15em", opacity: 0.4 }}>
          CLASSIFIED SYSTEM · S.H.I.E.L.D. ENCRYPTION ACTIVE
        </p>
      </div>
    </div>
  );
}
