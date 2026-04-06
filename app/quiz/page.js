"use client";
import { useState } from "react";
import { AlertTriangle, Zap, ChevronRight, Clock, Target, BookOpen, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS } from "@/lib/heroAssignment";

function ShieldLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
      <path d="M50 5 L92 25 L92 55 C92 75 73 90 50 97 C27 90 8 75 8 55 L8 25 Z" fill="rgba(245,166,35,0.1)" stroke="#F5A623" strokeWidth="2" />
      <circle cx="50" cy="52" r="14" fill="rgba(245,166,35,0.15)" />
      <circle cx="50" cy="52" r="6" fill="#F5A623" opacity="0.9" />
    </svg>
  );
}

const LEVEL_OPTIONS = [
  {
    id: "beginner",
    icon: <BookOpen size={22} />,
    label: "Beginner",
    desc: "Just starting out — need full foundations",
    color: "#10B981",
  },
  {
    id: "intermediate",
    icon: <Target size={22} />,
    label: "Intermediate",
    desc: "Know the basics — ready to level up",
    color: "#F5A623",
  },
  {
    id: "advanced",
    icon: <Rocket size={22} />,
    label: "Advanced",
    desc: "Solid skills — aiming for mastery",
    color: "#7C3AED",
  },
];

const TIMELINE_OPTIONS = [
  { id: "3", label: "3 Months", desc: "Intensive fast-track", icon: <Zap size={20} />, color: "#C0392B" },
  { id: "6", label: "6 Months", desc: "Balanced pace", icon: <Clock size={20} />, color: "#F5A623" },
  { id: "12", label: "1 Year", desc: "Steady & thorough", icon: <Target size={20} />, color: "#2563EB" },
  { id: "0", label: "Just Exploring", desc: "No rush", icon: <BookOpen size={20} />, color: "#9CA3AF" },
];

const HOURS_OPTIONS = [5, 10, 15, 20];

export default function QuizPage() {
  const router = useRouter();

  // Phase: "personality" | "level" | "timeline" | "submitting"
  const [phase, setPhase] = useState("personality");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Profile state
  const [level, setLevel] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [weeklyHours, setWeeklyHours] = useState(10);

  const question = QUIZ_QUESTIONS[currentQ];
  const totalSteps = QUIZ_QUESTIONS.length + 2; // 5 personality + level + timeline
  const currentStep =
    phase === "personality" ? currentQ + 1 :
    phase === "level" ? QUIZ_QUESTIONS.length + 1 :
    phase === "timeline" ? QUIZ_QUESTIONS.length + 2 :
    totalSteps;

  // ─── Personality quiz logic ──────────────────────────────────────────
  function handleSelect(option) {
    setSelected(option);
  }

  async function handleNext() {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      // Done with personality quiz — move to profile phase
      setPhase("level");
    }
  }

  // ─── Level selection ─────────────────────────────────────────────────
  function handleLevelSelect(lvl) {
    setLevel(lvl);
  }

  function handleLevelNext() {
    if (!level) return;
    setPhase("timeline");
  }

  // ─── Timeline selection & submit ─────────────────────────────────────
  function handleTimelineSelect(t) {
    setTimeline(t);
  }

  async function handleFinalSubmit() {
    if (!timeline) return;
    setPhase("submitting");
    setLoading(true);
    setError("");

    const profile = {
      level,
      timelineMonths: parseInt(timeline) || 6,
      weeklyHours,
    };

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) throw new Error("Assessment failed");
      const hero = await res.json();

      // Store hero + profile
      sessionStorage.setItem("shield_hero", JSON.stringify(hero));
      localStorage.setItem("shield_profile", JSON.stringify(profile));

      router.push(`/hero/${hero.heroId}`);
    } catch (err) {
      setError("Mission assessment failed. Please retry, Agent.");
      setLoading(false);
      setPhase("timeline");
    }
  }

  // ─── Loading screen ──────────────────────────────────────────────────
  if (loading || phase === "submitting") {
    return (
      <div style={{
        minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: "24px", background: "var(--shield-black)",
      }}>
        <div className="arc-loader" />
        <p style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", color: "var(--shield-gold)", letterSpacing: "0.15em", animation: "glow-pulse 2s ease-in-out infinite" }}>
          ANALYZING AGENT PROFILE...
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.2em" }}>
          JARVIS IS CALCULATING YOUR ADAPTIVE MISSION
        </p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)", background: "var(--shield-black)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "48px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: "680px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <ShieldLogo />
          </div>
          <div className="section-label" style={{ marginBottom: "8px" }}>
            {phase === "personality" ? "Avengers Aptitude Assessment" :
             phase === "level" ? "Current Level Calibration" :
             "Mission Timeline Setup"}
          </div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "1.6rem", color: "var(--shield-white)", letterSpacing: "0.06em" }}>
            {phase === "personality" ? <>Discover Your <span className="text-gold-gradient">Hero Archetype</span></> :
             phase === "level" ? <>Calibrate Your <span className="text-gold-gradient">Starting Point</span></> :
             <>Set Your <span className="text-gold-gradient">Mission Timeline</span></>}
          </h1>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.15em" }}>
              MISSION PROGRESS
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-gold)" }}>
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
        </div>

        {/* ─── PHASE: PERSONALITY QUIZ ─────────────────────────── */}
        {phase === "personality" && (
          <>
            <div className="dossier-panel" style={{ padding: "36px", marginBottom: "24px" }} key={currentQ}>
              <div style={{ marginBottom: "8px" }}>
                <span className="classified-stamp" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
                  Question {currentQ + 1}
                </span>
              </div>
              <h2 style={{
                fontFamily: "var(--font-body)", fontSize: "1.15rem", fontWeight: 600,
                color: "var(--shield-white)", marginTop: "16px", marginBottom: "28px",
                lineHeight: 1.5, letterSpacing: "0", textTransform: "none",
              }}>
                {question.question}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {question.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`quiz-option ${selected === opt ? "selected" : ""}`}
                    onClick={() => handleSelect(opt)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleSelect(opt)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        border: `1.5px solid ${selected === opt ? "var(--shield-gold)" : "var(--shield-border)"}`,
                        background: selected === opt ? "rgba(245,166,35,0.15)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, fontSize: "0.65rem", fontFamily: "var(--font-hero)",
                        color: selected === opt ? "var(--shield-gold)" : "var(--shield-silver)",
                        transition: "all 0.2s",
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                padding: "12px 16px", background: "rgba(192,57,43,0.1)",
                border: "1px solid rgba(192,57,43,0.3)", borderRadius: "8px",
                color: "var(--shield-red)", fontSize: "0.85rem", marginBottom: "16px",
                fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "6px"
              }}>
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button
              className="btn-gold"
              onClick={handleNext}
              disabled={!selected}
              style={{
                width: "100%", justifyContent: "center", opacity: selected ? 1 : 0.4,
                cursor: selected ? "pointer" : "not-allowed", fontSize: "0.95rem", padding: "15px",
              }}
            >
              {currentQ === QUIZ_QUESTIONS.length - 1
                ? <><ChevronRight size={16} style={{ marginRight: "6px" }} /> Continue to Level Calibration</>
                : "Continue Mission →"
              }
            </button>
          </>
        )}

        {/* ─── PHASE: LEVEL SELECTION ──────────────────────────── */}
        {phase === "level" && (
          <>
            <div className="dossier-panel" style={{ padding: "36px", marginBottom: "24px" }}>
              <div style={{ marginBottom: "8px" }}>
                <span className="classified-stamp" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
                  Intel Required
                </span>
              </div>
              <h2 style={{
                fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 600,
                color: "var(--shield-white)", marginTop: "16px", marginBottom: "28px",
                lineHeight: 1.5, letterSpacing: "0", textTransform: "none",
              }}>
                What is your current knowledge level in your target field?
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {LEVEL_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleLevelSelect(opt.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleLevelSelect(opt.id)}
                    style={{
                      cursor: "pointer",
                      padding: "18px 20px",
                      border: `1.5px solid ${level === opt.id ? opt.color : "var(--shield-border)"}`,
                      borderRadius: "8px",
                      background: level === opt.id ? `${opt.color}12` : "rgba(17,24,39,0.6)",
                      transition: "all 0.25s",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <span style={{ color: level === opt.id ? opt.color : "var(--shield-silver)", transition: "color 0.2s", display: "flex" }}>
                      {opt.icon}
                    </span>
                    <div>
                      <div style={{
                        fontFamily: "var(--font-hero)", fontSize: "0.95rem", letterSpacing: "0.04em",
                        color: level === opt.id ? opt.color : "var(--shield-white)",
                        marginBottom: "2px",
                      }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--shield-silver)" }}>
                        {opt.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-gold"
              onClick={handleLevelNext}
              disabled={!level}
              style={{
                width: "100%", justifyContent: "center", opacity: level ? 1 : 0.4,
                cursor: level ? "pointer" : "not-allowed", fontSize: "0.95rem", padding: "15px",
              }}
            >
              <ChevronRight size={16} style={{ marginRight: "6px" }} /> Set Mission Timeline
            </button>
          </>
        )}

        {/* ─── PHASE: TIMELINE SELECTION ───────────────────────── */}
        {phase === "timeline" && (
          <>
            <div className="dossier-panel" style={{ padding: "36px", marginBottom: "24px" }}>
              <div style={{ marginBottom: "8px" }}>
                <span className="classified-stamp" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
                  Final Briefing
                </span>
              </div>
              <h2 style={{
                fontFamily: "var(--font-body)", fontSize: "1.1rem", fontWeight: 600,
                color: "var(--shield-white)", marginTop: "16px", marginBottom: "24px",
                lineHeight: 1.5, letterSpacing: "0", textTransform: "none",
              }}>
                What is your goal timeline?
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
                {TIMELINE_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleTimelineSelect(opt.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleTimelineSelect(opt.id)}
                    style={{
                      cursor: "pointer",
                      padding: "16px",
                      border: `1.5px solid ${timeline === opt.id ? opt.color : "var(--shield-border)"}`,
                      borderRadius: "8px",
                      background: timeline === opt.id ? `${opt.color}12` : "rgba(17,24,39,0.6)",
                      transition: "all 0.25s",
                      textAlign: "center",
                    }}
                  >
                    <span style={{ color: timeline === opt.id ? opt.color : "var(--shield-silver)", display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                      {opt.icon}
                    </span>
                    <div style={{
                      fontFamily: "var(--font-hero)", fontSize: "0.9rem",
                      color: timeline === opt.id ? opt.color : "var(--shield-white)",
                      marginBottom: "4px",
                    }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--shield-silver)" }}>{opt.desc}</div>
                  </div>
                ))}
              </div>

              {/* Weekly hours */}
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", color: "var(--shield-silver)", marginBottom: "12px" }}>
                  WEEKLY STUDY HOURS
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  {HOURS_OPTIONS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setWeeklyHours(h)}
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        border: `1.5px solid ${weeklyHours === h ? "var(--shield-gold)" : "var(--shield-border)"}`,
                        borderRadius: "6px",
                        background: weeklyHours === h ? "rgba(245,166,35,0.12)" : "transparent",
                        color: weeklyHours === h ? "var(--shield-gold)" : "var(--shield-silver)",
                        fontFamily: "var(--font-hero)",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{
                padding: "12px 16px", background: "rgba(192,57,43,0.1)",
                border: "1px solid rgba(192,57,43,0.3)", borderRadius: "8px",
                color: "var(--shield-red)", fontSize: "0.85rem", marginBottom: "16px",
                fontFamily: "var(--font-mono)", display: "flex", alignItems: "center", gap: "6px",
              }}>
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button
              className="btn-gold"
              onClick={handleFinalSubmit}
              disabled={!timeline}
              style={{
                width: "100%", justifyContent: "center", opacity: timeline ? 1 : 0.4,
                cursor: timeline ? "pointer" : "not-allowed", fontSize: "0.95rem", padding: "15px",
              }}
            >
              <Zap size={16} fill="var(--shield-black)" style={{ marginRight: "6px" }} /> Submit — Reveal My Identity
            </button>
          </>
        )}

        <p style={{
          textAlign: "center", marginTop: "16px", fontFamily: "var(--font-mono)",
          fontSize: "0.66rem", color: "var(--shield-silver)", letterSpacing: "0.15em", opacity: 0.5,
        }}>
          CLASSIFIED DATA · NO PII STORED · S.H.I.E.L.D. ENCRYPTED
        </p>
      </div>
    </div>
  );
}
