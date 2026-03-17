"use client";
import { useEffect, useState, useRef } from "react";
import { Zap, Shield, Play, Bot, IndianRupee, Map, BarChart2, Rocket } from "lucide-react";
import Link from "next/link";

/* ── Subtle particle field (toned down) ─────────── */
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${8 + Math.random() * 10}s`,
    delay: `${Math.random() * 10}s`,
    drift: `${(Math.random() - 0.5) * 60}px`,
  }));
  return (
    <div className="particle-field">
      {particles.map((p) => (
        <div key={p.id} className="particle" style={{ left: p.left, "--duration": p.duration, "--delay": p.delay, "--drift": p.drift }} />
      ))}
    </div>
  );
}

/* ── Shield SVG ─────────────────────────────────── */
function ShieldSVG({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="sg" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M50 5 L92 25 L92 55 C92 75 73 90 50 97 C27 90 8 75 8 55 L8 25 Z" fill="url(#sg)" stroke="#F5A623" strokeWidth="1.5" />
      <path d="M50 16 L82 30 L82 56 C82 71 68 81 50 88 C32 81 18 71 18 56 L18 30 Z" fill="none" stroke="#F5A623" strokeWidth="0.8" opacity="0.4" />
      <circle cx="50" cy="52" r="11" fill="rgba(245,166,35,0.12)" />
      <circle cx="50" cy="52" r="5.5" fill="#F5A623" opacity="0.85" />
      <circle cx="50" cy="52" r="2.5" fill="#fff" opacity="0.9" />
    </svg>
  );
}

/* ── Hero archetype chip ─────────────────────────── */
function HeroChip({ name, color }) {
  return (
    <span style={{
      padding: "5px 14px",
      border: `1px solid ${color}35`,
      borderRadius: "999px",
      background: `${color}0D`,
      fontSize: "0.76rem",
      fontFamily: "var(--font-hero)",
      letterSpacing: "0.06em",
      color,
      whiteSpace: "nowrap",
    }}>
      {name}
    </span>
  );
}

/* ── Feature row item ────────────────────────────── */
function Feature({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
      <div style={{
        width: "40px", height: "40px", flexShrink: 0,
        background: "rgba(245,166,35,0.08)",
        border: "1px solid rgba(245,166,35,0.2)",
        borderRadius: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.1rem",
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "0.9rem", color: "var(--shield-white)", letterSpacing: "0.04em", marginBottom: "4px" }}>{title}</h3>
        <p style={{ fontSize: "0.83rem", color: "var(--shield-silver)", lineHeight: 1.55 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Stat block ──────────────────────────────────── */
function Stat({ val, label }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="text-gold-gradient" style={{ fontFamily: "var(--font-hero)", fontSize: "1.9rem", fontWeight: 700, lineHeight: 1 }}>{val}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.15em", color: "var(--shield-silver)", marginTop: "6px", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ── Landing Page ────────────────────────────────── */
export default function Home() {
  const [typed, setTyped] = useState("");
  const [cursor, setCursor] = useState(true);
  const full = "Your career mission starts here.";
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    let i = 0;
    const iv = setInterval(() => {
      setTyped(full.slice(0, ++i));
      if (i >= full.length) { clearInterval(iv); done.current = true; }
    }, 55);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCursor((v) => !v), 520);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "var(--shield-black)" }}>

      {/* ── HERO ──────────────────────────────────── */}
      <section style={{
        minHeight: "calc(100vh - 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <ParticleField />

        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(245,166,35,0.06) 0%, transparent 70%)",
        }} />

        {/* Classification tag */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.1s", animationFillMode: "forwards", display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <span className="classified-stamp" style={{ fontSize: "0.6rem", padding: "2px 9px" }}>Classified</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", letterSpacing: "0.18em", opacity: 0.7 }}>
            S.H.I.E.L.D. LEVEL 7 ACCESS
          </span>
        </div>

        {/* Shield */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.25s", animationFillMode: "forwards", marginBottom: "24px" }}>
          <ShieldSVG size={100} />
        </div>

        {/* Title */}
        <h1 className="text-gold-gradient animate-fadeUp" style={{
          animationDelay: "0.35s", animationFillMode: "forwards",
          fontFamily: "var(--font-hero)",
          fontSize: "clamp(3rem, 8vw, 5.5rem)",
          fontWeight: 700,
          letterSpacing: "0.05em",
          lineHeight: 1,
          marginBottom: "10px",
        }}>
          S.H.I.E.L.D.
        </h1>

        <p className="animate-fadeUp" style={{
          animationDelay: "0.45s", animationFillMode: "forwards",
          fontFamily: "var(--font-hero)",
          fontSize: "clamp(0.75rem, 2vw, 1rem)",
          letterSpacing: "0.18em",
          color: "var(--shield-silver)",
          marginBottom: "32px",
        }}>
          SUPERHERO HORIZON INTELLIGENCE FOR EDUCATION &amp; LIFE DECISIONS
        </p>

        {/* Typewriter line */}
        <div className="animate-fadeUp" style={{
          animationDelay: "0.55s", animationFillMode: "forwards",
          fontFamily: "var(--font-body)",
          fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
          color: "var(--shield-white)",
          fontWeight: 400,
          marginBottom: "44px",
          minHeight: "2rem",
        }}>
          {typed}
          {cursor && <span style={{ display: "inline-block", width: "2px", height: "1em", background: "var(--shield-gold)", marginLeft: "1px", verticalAlign: "text-bottom" }} />}
        </div>

        {/* CTAs */}
        <div className="animate-fadeUp" style={{
          animationDelay: "0.7s", animationFillMode: "forwards",
          display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center",
          marginBottom: "56px",
        }}>
          <Link href="/quiz" className="btn-gold" style={{ fontSize: "0.95rem", padding: "13px 32px", display: "flex", alignItems: "center" }}>
            <Zap size={16} fill="var(--shield-black)" style={{ marginRight: "8px" }} /> Begin Your Mission
          </Link>
          <Link href="/signup" className="btn-outline" style={{ fontSize: "0.95rem", padding: "12px 28px", display: "flex", alignItems: "center" }}>
            <Shield size={16} style={{ marginRight: "8px" }} /> Create Account
          </Link>
        </div>

        {/* Hero archetype strip */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--shield-silver)", marginBottom: "12px", opacity: 0.55 }}>
            DISCOVER YOUR HERO ARCHETYPE
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { name: "Iron Man",        color: "#F5A623" },
              { name: "Black Panther",   color: "#7C3AED" },
              { name: "Captain America", color: "#2563EB" },
              { name: "Doctor Strange",  color: "#10B981" },
              { name: "Thor",            color: "#F59E0B" },
              { name: "Black Widow",     color: "#C0392B" },
              { name: "Bruce Banner",    color: "#10B981" },
            ].map((h) => <HeroChip key={h.name} {...h} />)}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", opacity: 0.3 }}>
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(180deg, var(--shield-gold), transparent)" }} />
        </div>
      </section>

      {/* ── THIN DIVIDER ──────────────────────────── */}
      <div className="glow-line" style={{ margin: "0 64px" }} />

      {/* ── STATS ─────────────────────────────────── */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <Stat val="< 2s" label="AI Generation" />
          <Stat val="7"    label="Hero Archetypes" />
          <Stat val="20+"  label="Career Paths" />
          <Stat val="6"    label="Cities Covered" />
        </div>
      </section>

      <div className="glow-line" style={{ margin: "0 64px" }} />

      {/* ── FEATURES ──────────────────────────────── */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "72px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div className="section-label" style={{ marginBottom: "10px" }}>What S.H.I.E.L.D. Gives You</div>
          <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            Your Mission <span className="text-gold-gradient">Arsenal</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "28px 48px" }}>
          <Feature icon={<Zap size={20} />} title="Avengers Aptitude Assessment" desc="5 targeted questions map your personality to a Marvel hero archetype." />
          <Feature icon={<Play size={20} />} title="Cinematic Hero Reveal" desc="A classified 4-second sequence reveals your identity. This is the WOW moment." />
          <Feature icon={<Bot size={20} />} title="AI Mission Dossier" desc="Groq LLaMA-3.3-70B generates a full career roadmap in under 2 seconds." />
          <Feature icon={<IndianRupee size={20} />} title="Infinity Earnings Scale" desc="City-wise salary intel across Mumbai, Bangalore, Delhi, Tier-2 India and more." />
          <Feature icon={<Map size={20} />} title="Hero's Journey Roadmap" desc="Year 1 to first job — a visual timeline with Avenger-themed milestones." />
          <Feature icon={<BarChart2 size={20} />} title="Course Comparator" desc="Side-by-side intelligence on any two courses before you commit." />
        </div>
      </section>

      <div className="glow-line" style={{ margin: "0 64px" }} />

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section style={{ maxWidth: "700px", margin: "0 auto", padding: "72px 32px", textAlign: "center" }}>
        <div className="section-label" style={{ marginBottom: "10px" }}>Mission Protocol</div>
        <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--shield-white)", letterSpacing: "0.04em", marginBottom: "48px" }}>
          Four Steps to <span className="text-gold-gradient">Clarity</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            { num: "01", icon: <Zap size={18} />, title: "Take the 60-Second Quiz",     desc: "Personality questions assign your Avenger archetype." },
            { num: "02", icon: <Play size={18} />, title: "Watch the Hero Reveal",        desc: "Cinematic reveal sequence. AGENT IDENTIFIED." },
            { num: "03", icon: <Bot size={18} />, title: "Receive Your AI Dossier",      desc: "Career roadmap, salary intel, skills — in 2 seconds." },
            { num: "04", icon: <Rocket size={18} />, title: "Save, Share & Follow Your Path", desc: "Download your mission card and archive your dossier." },
          ].map(({ num, icon, title, desc }, i, arr) => (
            <div key={num} style={{ display: "flex", gap: "20px", alignItems: "flex-start", textAlign: "left', paddingBottom: i < arr.length - 1 ? '28px' : '0', marginBottom: i < arr.length - 1 ? '0' : '0', position: 'relative" }}>
              {/* Line connector */}
              {i < arr.length - 1 && (
                <div style={{ position: "absolute", left: "19px", top: "44px", bottom: 0, width: "2px", background: "linear-gradient(180deg, rgba(245,166,35,0.25), transparent)" }} />
              )}
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(245,166,35,0.08)", border: "1.5px solid rgba(245,166,35,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem" }}>
                {icon}
              </div>
              <div style={{ paddingBottom: i < arr.length - 1 ? "28px" : "0", flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--shield-gold)", marginBottom: "4px" }}>STEP {num}</div>
                <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "0.95rem", color: "var(--shield-white)", letterSpacing: "0.04em", marginBottom: "4px" }}>{title}</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--shield-silver)", lineHeight: 1.55 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "48px" }}>
          <Link href="/quiz" className="btn-gold" style={{ fontSize: "1rem", padding: "14px 44px", display: "inline-flex", alignItems: "center" }}>
            <Zap size={18} fill="var(--shield-black)" style={{ marginRight: "8px" }} /> Start Your Mission
          </Link>
          <p style={{ marginTop: "14px", fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--shield-silver)", opacity: 0.45 }}>
            NO LOGIN REQUIRED · FREE · NO PII STORED
          </p>
        </div>
      </section>

    </div>
  );
}
