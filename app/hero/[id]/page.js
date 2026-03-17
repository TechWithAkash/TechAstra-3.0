"use client";
import { useEffect, useState } from "react";
import { Zap, Target, Shield, Sparkles, Hammer, Droplet, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { HERO_SCORING_MATRIX } from "@/lib/heroAssignment";

const AVENGER_ICONS = {
  iron_man:        <Zap size={48} fill="currentColor" />,
  black_panther:   <Target size={48} fill="currentColor" />,
  captain_america: <Shield size={48} />,
  doctor_strange:  <Sparkles size={48} />,
  thor:            <Hammer size={48} fill="currentColor" />,
  black_widow:     <Target size={48} />,
  bruce_banner:    <Droplet size={48} fill="currentColor" />,
};

// Cinematic sequence stages
const STAGES = [
  "black",       // 0: Full black
  "logo",        // 1: S.H.I.E.L.D. logo pulses
  "identified",  // 2: "AGENT IDENTIFIED" text
  "hero",        // 3: Hero name + title appears
  "classified",  // 4: CLASSIFIED stamp
  "quote",       // 5: Hero tagline (typewriter)
  "cta",         // 6: CTA button
];

const TIMING = [400, 1000, 1700, 2400, 3000, 3500, 4200];

export default function HeroRevealPage() {
  const { id } = useParams();
  const router = useRouter();

  const [stage, setStage] = useState(0);
  const [typedQuote, setTypedQuote] = useState("");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const hero = HERO_SCORING_MATRIX[id];

  useEffect(() => {
    if (!hero) return;

    const timers = TIMING.map((time, idx) =>
      setTimeout(() => setStage(idx + 1), time)
    );

    return () => timers.forEach(clearTimeout);
  }, [hero]);

  // Typewriter for tagline when stage 6 (quote)
  useEffect(() => {
    if (stage < 6 || !hero) return;
    const tagline = hero.tagline;
    let i = quoteIdx;
    if (i >= tagline.length) return;

    const interval = setInterval(() => {
      setTypedQuote(tagline.slice(0, i + 1));
      i++;
      if (i >= tagline.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [stage]);

  function handleSkip() {
    setSkipped(true);
    setStage(7);
    setTypedQuote(hero?.tagline || "");
  }

  if (!hero) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--shield-black)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "var(--shield-red)", fontFamily: "var(--font-hero)", letterSpacing: "0.1em" }}>AGENT NOT FOUND</p>
          <Link href="/quiz" className="btn-gold" style={{ marginTop: "16px", display: "inline-block" }}>Retake Assessment</Link>
        </div>
      </div>
    );
  }

  const isSkipped = skipped || stage >= 7;

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: stage === 0 ? "#000" : "var(--shield-black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.8s ease",
      }}
    >
      {/* Radial hero glow */}
      {stage >= 3 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${hero.color}15 0%, transparent 70%)`,
            transition: "opacity 1s ease",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Skip button */}
      {stage < 7 && (
        <button
          onClick={handleSkip}
          style={{
            position: "absolute",
            top: "80px", right: "24px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: "var(--shield-silver)",
            background: "transparent",
            border: "1px solid var(--shield-border)",
            borderRadius: "4px",
            padding: "6px 12px",
            cursor: "pointer",
            opacity: 0.5,
          }}
        >
          SKIP SEQUENCE
        </button>
      )}

      <div style={{ maxWidth: "680px", width: "100%", textAlign: "center" }}>

        {/* Stage 1: S.H.I.E.L.D. Logo */}
        {stage >= 1 && (
          <div
            style={{
              marginBottom: "24px",
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "scale(1)" : "scale(0.5)",
              transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" style={{ filter: `drop-shadow(0 0 20px ${hero.color}80)` }}>
              <path d="M50 5 L92 25 L92 55 C92 75 73 90 50 97 C27 90 8 75 8 55 L8 25 Z" fill={`${hero.color}15`} stroke={hero.color} strokeWidth="2" />
              <path d="M50 15 L82 30 L82 56 C82 72 68 83 50 89 C32 83 18 72 18 56 L18 30 Z" fill="none" stroke={hero.color} strokeWidth="1" opacity="0.5" />
              <circle cx="50" cy="52" r="14" fill={`${hero.color}20`} />
              <circle cx="50" cy="52" r="7" fill={hero.color} opacity="0.9" />
              <circle cx="50" cy="52" r="3" fill="#fff" />
            </svg>
          </div>
        )}

        {/* Stage 2: AGENT IDENTIFIED */}
        {stage >= 2 && (
          <div
            style={{
              marginBottom: "20px",
              opacity: stage >= 2 ? 1 : 0,
              transition: "opacity 0.5s ease 0.1s",
            }}
          >
            <div
              style={{
                display: "inline-block",
                fontFamily: "var(--font-hero)",
                fontSize: "clamp(1rem, 3vw, 1.4rem)",
                letterSpacing: "0.4em",
                color: "var(--shield-red)",
                textShadow: "0 0 16px rgba(192,57,43,0.8)",
                padding: "8px 20px",
                border: "1px solid rgba(192,57,43,0.3)",
                borderRadius: "4px",
                background: "rgba(192,57,43,0.08)",
              }}
            >
              ◈ AGENT IDENTIFIED ◈
            </div>
          </div>
        )}

        {/* Stage 3: Hero Name */}
        {stage >= 3 && (
          <div
            style={{
              opacity: stage >= 3 ? 1 : 0,
              transform: stage >= 3 ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)",
              marginBottom: "8px",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>
              {AVENGER_ICONS[id]}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-hero)",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: hero.color,
                textShadow: `0 0 32px ${hero.color}60`,
                marginBottom: "4px",
                lineHeight: 1.05,
              }}
            >
              {hero.name}
            </h1>
            <p
              style={{
                fontFamily: "var(--font-hero)",
                fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
                color: "var(--shield-silver)",
                letterSpacing: "0.2em",
              }}
            >
              {hero.title.toUpperCase()}
            </p>
          </div>
        )}

        {/* Stage 4: Classified + Traits */}
        {stage >= 4 && (
          <div
            style={{
              opacity: stage >= 4 ? 1 : 0,
              transform: stage >= 4 ? "rotate(-2deg) scale(1)" : "rotate(-8deg) scale(0.7)",
              transition: "all 0.5s ease",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <span className="classified-stamp" style={{ fontSize: "0.8rem", padding: "5px 14px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", background: "currentColor" }} /> Classified — Eyes Only
            </span>
          </div>
        )}

        {/* Traits pills */}
        {stage >= 4 && (
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginBottom: "24px", opacity: stage >= 4 ? 1 : 0, transition: "opacity 0.5s ease 0.3s" }}>
            {hero.traits.map((t) => (
              <span key={t} className="stat-pill" style={{ borderColor: `${hero.color}30`, color: hero.color }}>{t}</span>
            ))}
          </div>
        )}

        {/* Stage 5: Quote */}
        {stage >= 6 && (
          <div
            style={{
              opacity: stage >= 6 ? 1 : 0,
              transition: "opacity 0.5s ease",
              marginBottom: "32px",
              padding: "20px 28px",
              background: "rgba(17,24,39,0.6)",
              borderLeft: `3px solid ${hero.color}`,
              borderRadius: "0 8px 8px 0",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--shield-white)",
                lineHeight: 1.6,
                fontStyle: "italic",
                minHeight: "1.6em",
              }}
            >
              "{typedQuote}
              {typedQuote.length < hero.tagline.length && (
                <span style={{ display: "inline-block", width: "2px", height: "1em", background: hero.color, marginLeft: "1px", verticalAlign: "text-bottom", animation: "blink 0.8s step-end infinite" }} />
              )}
              "
            </p>
          </div>
        )}

        {/* Stage 6: CTA */}
        {(stage >= 7 || isSkipped) && (
          <div
            style={{
              opacity: 1,
              animation: "fadeUp 0.5s ease forwards",
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/dossier"
              className="btn-gold"
              style={{ fontSize: "1rem", padding: "14px 36px" }}
              onClick={() => {
                sessionStorage.setItem("shield_hero", JSON.stringify({ heroId: id, ...hero }));
              }}
            >
              <Target size={16} style={{ marginRight: "6px" }} /> Generate Mission Dossier
            </Link>
            <Link href="/quiz" className="btn-outline" style={{ display: "inline-flex", alignItems: "center" }}>
              <ArrowLeft size={16} style={{ marginRight: "6px" }} /> Retake Quiz
            </Link>
          </div>
        )}

        {/* Career Paths Preview */}
        {(stage >= 7 || isSkipped) && (
          <div style={{ marginTop: "40px", opacity: 1, animation: "fadeUp 0.6s ease 0.2s forwards" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--shield-silver)", marginBottom: "12px", opacity: 0.7 }}>
              YOUR DESIGNATED CAREER PATHS
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
              {hero.careers.map((c) => (
                <span key={c} style={{ padding: "6px 14px", background: "rgba(17,24,39,0.8)", border: `1px solid ${hero.color}25`, borderRadius: "6px", fontSize: "0.8rem", color: "var(--shield-white)", fontFamily: "var(--font-body)" }}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
