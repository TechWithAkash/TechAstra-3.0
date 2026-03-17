"use client";
import { useState } from "react";
import { AlertTriangle, Zap } from "lucide-react";
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

export default function QuizPage() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const question = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

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
      // Submit answers
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers }),
        });

        if (!res.ok) throw new Error("Assessment failed");
        const hero = await res.json();

        // Store hero in sessionStorage
        sessionStorage.setItem("shield_hero", JSON.stringify(hero));
        router.push(`/hero/${hero.heroId}`);
      } catch (err) {
        setError("Mission assessment failed. Please retry, Agent.");
        setLoading(false);
      }
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          background: "var(--shield-black)",
        }}
      >
        <div className="arc-loader" />
        <p
          style={{
            fontFamily: "var(--font-hero)",
            fontSize: "1rem",
            color: "var(--shield-gold)",
            letterSpacing: "0.15em",
            animation: "glow-pulse 2s ease-in-out infinite",
          }}
        >
          ANALYZING AGENT PROFILE...
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.2em" }}>
          JARVIS IS CALCULATING YOUR ARCHETYPE
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh - 60px)",
        background: "var(--shield-black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "680px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <ShieldLogo />
          </div>
          <div className="section-label" style={{ marginBottom: "8px" }}>
            Avengers Aptitude Assessment
          </div>
          <h1
            style={{
              fontFamily: "var(--font-hero)",
              fontSize: "1.6rem",
              color: "var(--shield-white)",
              letterSpacing: "0.06em",
            }}
          >
            Discover Your <span className="text-gold-gradient">Hero Archetype</span>
          </h1>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.15em" }}>
              MISSION PROGRESS
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-gold)" }}>
              {currentQ + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
          </div>
        </div>

        {/* Question Card */}
        <div
          className="dossier-panel"
          style={{ padding: "36px", marginBottom: "24px" }}
          key={currentQ}
        >
          <div style={{ marginBottom: "8px" }}>
            <span className="classified-stamp" style={{ fontSize: "0.65rem", padding: "2px 8px" }}>
              Question {currentQ + 1}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.15rem",
              fontWeight: 600,
              color: "var(--shield-white)",
              marginTop: "16px",
              marginBottom: "28px",
              lineHeight: 1.5,
              letterSpacing: "0",
              textTransform: "none",
            }}
          >
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
                  <span
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      border: `1.5px solid ${selected === opt ? "var(--shield-gold)" : "var(--shield-border)"}`,
                      background: selected === opt ? "rgba(245,166,35,0.15)" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "0.65rem",
                      fontFamily: "var(--font-hero)",
                      color: selected === opt ? "var(--shield-gold)" : "var(--shield-silver)",
                      transition: "all 0.2s",
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(192,57,43,0.1)",
              border: "1px solid rgba(192,57,43,0.3)",
              borderRadius: "8px",
              color: "var(--shield-red)",
              fontSize: "0.85rem",
              marginBottom: "16px",
              fontFamily: "var(--font-mono)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* Next Button */}
        <button
          className="btn-gold"
          onClick={handleNext}
          disabled={!selected}
          style={{
            width: "100%",
            justifyContent: "center",
            opacity: selected ? 1 : 0.4,
            cursor: selected ? "pointer" : "not-allowed",
            fontSize: "0.95rem",
            padding: "15px",
          }}
        >
          {currentQ === QUIZ_QUESTIONS.length - 1 ? <><Zap size={16} fill="var(--shield-black)" style={{ marginRight: "6px" }} /> Submit — Reveal My Identity</> : "Continue Mission →"}
        </button>

        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.66rem",
            color: "var(--shield-silver)",
            letterSpacing: "0.15em",
            opacity: 0.5,
          }}
        >
          CLASSIFIED DATA · NO PII STORED · S.H.I.E.L.D. ENCRYPTED
        </p>
      </div>
    </div>
  );
}
