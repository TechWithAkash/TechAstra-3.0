"use client";
import { useEffect, useState } from "react";
import { FolderOpen, Zap, Target } from "lucide-react";
import Link from "next/link";
import { HERO_SCORING_MATRIX } from "@/lib/heroAssignment";

function getSession() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("shield_session");
}

export default function HistoryPage() {
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sid = getSession();
    if (!sid) { setLoading(false); return; }
    fetch(`/api/history?sessionId=${sid}`)
      .then((r) => r.json())
      .then((data) => { setDossiers(data.dossiers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", paddingBottom: "80px" }}>
      <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "48px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label" style={{ marginBottom: "12px" }}>Secured Intelligence Database</div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            S.H.I.E.L.D. <span className="text-gold-gradient">Archives</span>
          </h1>
          <p style={{ marginTop: "10px", color: "var(--shield-silver)", fontSize: "0.9rem" }}>Your classified mission dossiers, secured and ready for retrieval.</p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <div className="arc-loader" style={{ margin: "0 auto 20px" }} />
            <p style={{ fontFamily: "var(--font-hero)", color: "var(--shield-gold)", letterSpacing: "0.15em" }}>ACCESSING SECURE DATABASE...</p>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="dossier-panel" style={{ padding: "60px 24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <FolderOpen size={48} style={{ marginBottom: "16px", color: "var(--shield-silver)" }} />
            <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", color: "var(--shield-white)", marginBottom: "12px" }}>No Dossiers Filed</h2>
            <p style={{ color: "var(--shield-silver)", marginBottom: "24px", fontSize: "0.9rem" }}>
              Even Thanos had a plan. Generate your first Mission Dossier to build your classified archive.
            </p>
            <Link href="/quiz" className="btn-gold" style={{ display: "inline-flex", alignItems: "center" }}>
              <Zap size={16} fill="var(--shield-black)" style={{ marginRight: "6px" }} /> Start Your Mission
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {dossiers.map((d) => {
              const hero = HERO_SCORING_MATRIX[d.heroId];
              const heroColor = hero?.color || "var(--shield-gold)";
              return (
                <div key={d._id} className="dossier-panel" style={{ padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <span className="classified-stamp" style={{ fontSize: "0.6rem", marginBottom: "8px", display: "inline-block" }}>Classified</span>
                      <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", color: "var(--shield-white)", letterSpacing: "0.04em" }}>{d.course}</h2>
                      {hero && (
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: heroColor, letterSpacing: "0.15em", marginTop: "4px" }}>
                          AGENT: {hero.name.toUpperCase()} · {hero.title.toUpperCase()}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)" }}>
                        {new Date(d.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {d.missionBriefing && (
                    <p style={{ fontSize: "0.85rem", color: "var(--shield-silver)", lineHeight: 1.6, marginBottom: "16px", fontStyle: "italic" }}>
                      "{d.missionBriefing.slice(0, 200)}{d.missionBriefing.length > 200 ? "..." : ""}"
                    </p>
                  )}

                  {d.criticalSkills?.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {d.criticalSkills.slice(0, 5).map((s) => (
                        <span key={s} className="stat-pill" style={{ fontSize: "0.7rem", borderColor: `${heroColor}30`, color: heroColor }}>{s}</span>
                      ))}
                    </div>
                  )}

                  {d.heroQuote && (
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--shield-border)" }}>
                      <p style={{ fontFamily: "var(--font-hero)", fontSize: "0.88rem", color: heroColor, fontStyle: "italic", letterSpacing: "0.03em" }}>
                        "{d.heroQuote}"
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ textAlign: "center", marginTop: "16px" }}>
              <Link href="/dossier" className="btn-gold" style={{ display: "inline-flex", alignItems: "center" }}>
                <Target size={16} style={{ marginRight: "6px" }} /> Generate New Dossier
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
