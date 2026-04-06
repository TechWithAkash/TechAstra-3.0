"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import {
  Zap, Target, RotateCcw, LayoutDashboard, TrendingUp, Clock, CheckCircle2,
  Flame, AlertTriangle, BookOpen, Shield, ChevronRight, RefreshCw,
} from "lucide-react";
import { HERO_SCORING_MATRIX } from "@/lib/heroAssignment";

/* ── Helpers ──────────────────────────────────────── */
function getFromStorage(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function getProgressKey(course) {
  return `shield_progress_${course?.toLowerCase().replace(/\s+/g, "_").slice(0, 40)}`;
}

function computeDNAScore({ completedModules = [], totalModules = 0, profile = {}, streak = 0 }) {
  const techPct = totalModules > 0 ? (completedModules.length / totalModules) : 0;
  const technical = Math.round(techPct * 80 + (profile.level === "intermediate" ? 15 : profile.level === "advanced" ? 35 : 0));
  const consistency = Math.min(streak * 8 + (completedModules.length > 0 ? 20 : 0), 100);
  const soft = profile.level === "beginner" ? 30 : profile.level === "intermediate" ? 45 : 60;
  const certs = completedModules.length > 4 ? 35 : completedModules.length > 2 ? 20 : 10;
  const market = profile.timelineMonths > 0 ? Math.min(30 + techPct * 40, 80) : 20;

  const total = Math.round(
    technical * 0.40 +
    consistency * 0.20 +
    soft * 0.15 +
    certs * 0.15 +
    market * 0.10
  );
  return {
    total: Math.min(total, 100),
    technical: Math.min(technical, 100),
    consistency: Math.min(consistency, 100),
    soft: Math.min(soft, 100),
    certifications: Math.min(certs, 100),
    marketAlignment: Math.min(market, 100),
  };
}

/* ── Components ───────────────────────────────────── */
function DNAScoreRing({ score, color }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ position: "relative", width: "140px", height: "140px", flexShrink: 0 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(31,41,55,0.8)" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-hero)", fontSize: "2rem", fontWeight: 700, color, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.15em", color: "var(--shield-silver)", marginTop: "2px" }}>
          DNA SCORE
        </span>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "var(--shield-gold)", icon }) {
  return (
    <div className="glass-card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "8px",
        background: `${color}12`, border: `1px solid ${color}25`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)", letterSpacing: "0.12em", marginBottom: "2px" }}>
          {label}
        </div>
        <div style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", color: "var(--shield-white)", letterSpacing: "0.03em" }}>
          {value}
        </div>
        {sub && <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", marginTop: "2px" }}>{sub}</div>}
      </div>
    </div>
  );
}

function WeeklyMissionCard({ mission, index, heroColor }) {
  return (
    <div style={{
      padding: "14px 18px",
      background: "rgba(17,24,39,0.6)",
      border: `1px solid ${heroColor}20`,
      borderLeft: `3px solid ${heroColor}`,
      borderRadius: "0 8px 8px 0",
    }}>
      <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.65rem", letterSpacing: "0.15em", color: heroColor, marginRight: "10px" }}>
        MISSION {index + 1}
      </span>
      <span style={{ fontSize: "0.85rem", color: "var(--shield-silver)", lineHeight: 1.5 }}>{mission}</span>
    </div>
  );
}

/* ── MAIN DASHBOARD ──────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter();
  const [hero, setHero] = useState(null);
  const [profile, setProfile] = useState({});
  const [dossier, setDossier] = useState(null);
  const [course, setCourse] = useState("");
  const [completedModules, setCompletedModules] = useState([]);
  const [streak, setStreak] = useState(0);
  const [dna, setDna] = useState({ total: 0, technical: 0, consistency: 0, soft: 0, certifications: 0, marketAlignment: 0 });
  const [recalibrating, setRecalibrating] = useState(false);
  const [recalibrateMode, setRecalibrateMode] = useState(null); // "faster" | "slower" | null
  const [recalibrated, setRecalibrated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [courseSearch, setCourseSearch] = useState("");
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationError, setGenerationError] = useState("");

  useEffect(() => {
    setMounted(true);
    // Load hero
    const heroRaw = sessionStorage.getItem("shield_hero") || localStorage.getItem("shield_hero");
    if (heroRaw) { try { setHero(JSON.parse(heroRaw)); } catch {} }

    // Load profile
    const profileRaw = localStorage.getItem("shield_profile");
    if (profileRaw) { try { setProfile(JSON.parse(profileRaw)); } catch {} }

    // Load dossier
    const dossierRaw = localStorage.getItem("shield_dossier");
    if (dossierRaw) {
      try {
        const { dossier: d, course: c } = JSON.parse(dossierRaw);
        setDossier(d);
        setCourse(c);

        // Load progress
        const key = `shield_progress_${c?.toLowerCase().replace(/\s+/g, "_").slice(0, 40)}`;
        const progRaw = localStorage.getItem(key);
        if (progRaw) {
          const prog = JSON.parse(progRaw);
          setCompletedModules(prog.completed || []);
          setStreak(prog.streak || 0);
        }
      } catch {}
    }

    // Update streak
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem("shield_last_active");
    if (lastActive !== today) {
      localStorage.setItem("shield_last_active", today);
    }
  }, []);

  // Compute DNA score whenever deps change
  useEffect(() => {
    const totalModules = dossier?.learningModules?.length || 0;
    const scores = computeDNAScore({ completedModules, totalModules, profile, streak });
    setDna(scores);
  }, [completedModules, dossier, profile, streak]);

  const heroColor = hero?.color || "var(--shield-gold)";
  const totalModules = dossier?.learningModules?.length || 0;
  const completedCount = completedModules.length;
  const progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const clearanceLevel = Math.min(Math.ceil(dna.total / 15), 7);
  const levelLabel = ["", "1 — Trainee", "2 — Recruit", "3 — Field Agent", "4 — Senior Agent", "5 — Specialist", "6 — Commander", "7 — Director"][clearanceLevel] || "1 — Trainee";

  // Projected completion
  const weeksCompleted = completedCount;
  const weeksRemaining = totalModules - completedCount;
  const avgWeeksPerModule = 1; // each module = ~1 week
  const monthsRemaining = ((weeksRemaining * avgWeeksPerModule) / 4.33).toFixed(1);

  // Radar chart data
  const radarData = [
    { skill: "Technical", value: dna.technical, fullMark: 100 },
    { skill: "Consistency", value: dna.consistency, fullMark: 100 },
    { skill: "Soft Skills", value: dna.soft, fullMark: 100 },
    { skill: "Certs", value: dna.certifications, fullMark: 100 },
    { skill: "Market Fit", value: dna.marketAlignment, fullMark: 100 },
  ];

  // Recalibrate
  async function handleRecalibrate(pace) {
    if (!hero || !course) return;
    setRecalibrateMode(pace);
    setRecalibrating(true);
    try {
      const completedTopics = completedModules.map((i) => dossier?.learningModules?.[i]?.topic).filter(Boolean);
      const res = await fetch("/api/recalibrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroName: hero.name,
          course,
          pace,
          completedTopics,
          profile,
        }),
      });
      const data = await res.json();
      if (data.success && data.dossier) {
        const mergedDossier = { ...dossier, ...data.dossier };
        setDossier(mergedDossier);
        localStorage.setItem("shield_dossier", JSON.stringify({ dossier: mergedDossier, course, hero }));
        setRecalibrated(true);
        setTimeout(() => setRecalibrated(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRecalibrating(false);
      setRecalibrateMode(null);
    }
  }

  async function generateDossier() {
    const activeCourse = courseSearch.trim();
    if (!activeCourse || !hero) return;
    
    setGenerationLoading(true); 
    setGenerationError(""); 
    
    try {
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroId: hero.heroId,
          heroName: hero.name,
          course: activeCourse,
          profile,
        }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setDossier(data);
      setCourse(activeCourse);
      setCompletedModules([]);
      
      // Save full dossier to localStorage so it persists
      localStorage.setItem("shield_dossier", JSON.stringify({ dossier: data, course: activeCourse, hero }));
      // Save progress initialize
      const progKey = `shield_progress_${activeCourse.toLowerCase().replace(/\\s+/g, "_").slice(0, 40)}`;
      localStorage.setItem(progKey, JSON.stringify({ completed: [], streak: 0, startedAt: Date.now() }));
    } catch (err) {
      setGenerationError("Mission generation failed. Systems resetting. Please try again.");
    } finally {
      setGenerationLoading(false);
    }
  }

  if (!mounted) return null;

  if (!dossier) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", paddingBottom: "80px" }}>
        {/* Banner */}
        <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "40px 24px" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
            <div className="classified-stamp" style={{ marginBottom: "16px" }}>Classified — Target Field Calibration</div>
            <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
              Initialize Your <span className="text-gold-gradient">Dashboard</span>
            </h1>
            <p style={{ color: "var(--shield-silver)", marginTop: "12px", fontSize: "0.95rem" }}>
              Agent {hero?.name || "Unknown"}, provide your target field to lock in your custom learning path.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 24px" }}>
          {/* Course Search */}
          <div className="dossier-panel" style={{ padding: "32px", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
              <span style={{ fontSize: "1.1rem" }}><Target size={18} /></span>
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                Intel Query — Mission Objective
              </span>
            </div>
            
            <input
              className="shield-input"
              placeholder="Enter your target field or course (e.g. Frontend React Developer)"
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && courseSearch.trim().length >= 2) generateDossier(); }}
            />

            <button
              className="btn-gold"
              onClick={generateDossier}
              disabled={courseSearch.trim().length < 2 || generationLoading}
              style={{
                marginTop: "20px", width: "100%", justifyContent: "center", display: "flex", alignItems: "center",
                opacity: (courseSearch.trim().length >= 2 && !generationLoading) ? 1 : 0.5,
                cursor: (courseSearch.trim().length >= 2 && !generationLoading) ? "pointer" : "not-allowed",
              }}
            >
              {generationLoading ? "JARVIS is building your adaptive dashboard..." : <><Zap size={16} fill="var(--shield-black)" style={{ marginRight: "6px" }} /> Activate Dashboard</>}
            </button>
          </div>

          {/* Loading */}
          {generationLoading && (
            <div style={{ textAlign: "center", padding: "40px 24px" }}>
              <div className="arc-loader" style={{ margin: "0 auto 20px" }} />
              <p style={{ fontFamily: "var(--font-hero)", color: hero?.color || "var(--shield-gold)", letterSpacing: "0.15em", marginBottom: "8px", animation: "glow-pulse 2s ease-in-out infinite" }}>
                JARVIS IS COMPILING YOUR MODULES...
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--shield-silver)", letterSpacing: "0.2em" }}>
                GROQ LLaMA-3.3-70B · PERSONALIZING PROGRESS METRICS
              </p>
            </div>
          )}

          {/* Error */}
          {generationError && (
            <div style={{ padding: "16px 20px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderLeft: "3px solid var(--shield-red)", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={16} color="var(--shield-red)" />
              <p style={{ color: "var(--shield-red)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{generationError}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "36px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em", color: "var(--shield-silver)", marginBottom: "6px" }}>
                S.H.I.E.L.D. MISSION CONTROL
              </div>
              <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "var(--shield-white)", letterSpacing: "0.05em" }}>
                Agent <span style={{ color: heroColor }}>{hero?.name || "Unknown"}</span>
              </h1>
              <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                <span className="stat-pill">CLEARANCE LEVEL {levelLabel}</span>
                {course && <span className="stat-pill" style={{ color: heroColor, borderColor: `${heroColor}30` }}>{course}</span>}
                {profile.timelineMonths > 0 && (
                  <span className="stat-pill">{profile.timelineMonths}mo Timeline</span>
                )}
              </div>
            </div>

            {/* DNA Score Ring */}
            <DNAScoreRing score={dna.total} color={heroColor} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Recalibrated success */}
        {recalibrated && (
          <div style={{
            padding: "14px 20px", background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.3)", borderRadius: "8px",
            marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px",
          }}>
            <CheckCircle2 size={16} color="#10B981" />
            <p style={{ color: "#10B981", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
              Mission recalibrated. Your learning path has been updated, Agent.
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "32px" }}>
          <StatCard
            label="MODULES COMPLETE"
            value={`${completedCount} / ${totalModules}`}
            sub={`${progressPct}% of mission`}
            color={heroColor}
            icon={<CheckCircle2 size={20} />}
          />
          <StatCard
            label="GOAL PROXIMITY"
            value={weeksRemaining > 0 ? `${monthsRemaining} mo` : "Job-Ready!"}
            sub={weeksRemaining > 0 ? "estimated remaining" : "Mission Complete!"}
            color="#10B981"
            icon={<Target size={20} />}
          />
          <StatCard
            label="WEEKLY HOURS"
            value={`${profile.weeklyHours || 10}h`}
            sub="allocated per week"
            color="#2563EB"
            icon={<Clock size={20} />}
          />
          <StatCard
            label="STREAK"
            value={`${streak} days`}
            sub="consecutive active days"
            color="#F59E0B"
            icon={<Flame size={20} />}
          />
        </div>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>

          {/* Radar Chart */}
          <div className="dossier-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
              <TrendingUp size={18} color="var(--shield-gold)" />
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                CAREER DNA BREAKDOWN
              </span>
            </div>

            <ResponsiveContainer width="100%" height={270}>
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(245,166,35,0.15)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "#9CA3AF", fontSize: 11, fontFamily: "JetBrains Mono" }}
                />
                <PolarRadiusAxis
                  angle={72}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  name="DNA"
                  dataKey="value"
                  stroke={heroColor}
                  fill={heroColor}
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Score breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
              {[
                { label: "Technical", value: dna.technical, color: heroColor },
                { label: "Consistency", value: dna.consistency, color: "#10B981" },
                { label: "Soft Skills", value: dna.soft, color: "#2563EB" },
                { label: "Certifications", value: dna.certifications, color: "#7C3AED" },
                { label: "Market Fit", value: dna.marketAlignment, color: "#F59E0B" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", width: "90px", flexShrink: 0 }}>{label}</span>
                  <div style={{ flex: 1, height: "6px", background: "rgba(31,41,55,0.8)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: "3px", transition: "width 1s ease" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color, width: "28px", textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Missions + Recalibrate */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Recalibrate Panel */}
            <div className="dossier-panel" style={{ padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
                <RefreshCw size={18} color="var(--shield-gold)" />
                <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                  RECALIBRATE MISSION
                </span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--shield-silver)", lineHeight: 1.6, marginBottom: "16px" }}>
                Adjust your learning pace. S.H.I.E.L.D. AI will regenerate your modules to match.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn-gold"
                  onClick={() => handleRecalibrate("faster")}
                  disabled={recalibrating}
                  style={{
                    flex: 1, justifyContent: "center", fontSize: "0.78rem", padding: "10px 12px",
                    opacity: recalibrating && recalibrateMode === "faster" ? 0.6 : 1,
                  }}
                >
                  {recalibrating && recalibrateMode === "faster" ? (
                    <><RotateCcw size={14} style={{ marginRight: "6px", animation: "arc-spin 1s linear infinite" }} /> Recalibrating...</>
                  ) : (
                    <><Zap size={14} fill="var(--shield-black)" style={{ marginRight: "6px" }} /> Go Faster</>
                  )}
                </button>
                <button
                  className="btn-outline"
                  onClick={() => handleRecalibrate("slower")}
                  disabled={recalibrating}
                  style={{
                    flex: 1, justifyContent: "center", fontSize: "0.78rem", padding: "10px 12px",
                    opacity: recalibrating && recalibrateMode === "slower" ? 0.6 : 1,
                  }}
                >
                  {recalibrating && recalibrateMode === "slower" ? (
                    <><RotateCcw size={14} style={{ marginRight: "6px", animation: "arc-spin 1s linear infinite" }} /> Recalibrating...</>
                  ) : (
                    <><BookOpen size={14} style={{ marginRight: "6px" }} /> Go Slower</>
                  )}
                </button>
              </div>
              {recalibrating && (
                <p style={{ marginTop: "10px", fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", letterSpacing: "0.15em", textAlign: "center" }}>
                  JARVIS IS REBUILDING YOUR MISSION PATH...
                </p>
              )}
            </div>

            {/* Weekly Missions */}
            {dossier?.weeklyMissions?.length > 0 && (
              <div className="dossier-panel" style={{ padding: "22px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
                  <Shield size={18} color="var(--shield-gold)" />
                  <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                    WEEKLY MISSION BRIEFINGS
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {dossier.weeklyMissions.slice(0, 4).map((m, i) => (
                    <WeeklyMissionCard key={i} mission={m} index={i} heroColor={heroColor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module Progress Section */}
        {dossier?.learningModules?.length > 0 && (
          <div className="dossier-panel" style={{ padding: "24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BookOpen size={18} color="var(--shield-gold)" />
                <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                  LEARNING MISSION STATUS
                </span>
              </div>
              <a href="/dossier" style={{
                fontFamily: "var(--font-hero)", fontSize: "0.72rem", letterSpacing: "0.08em",
                color: heroColor, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
              }}>
                Full Roadmap <ChevronRight size={14} />
              </a>
            </div>

            {/* Module grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {dossier.learningModules.map((mod, i) => {
                const done = completedModules.includes(i);
                return (
                  <div
                    key={i}
                    style={{
                      padding: "12px 14px",
                      border: `1px solid ${done ? `${heroColor}50` : "var(--shield-border)"}`,
                      borderRadius: "8px",
                      background: done ? `${heroColor}08` : "rgba(17,24,39,0.4)",
                      display: "flex", alignItems: "center", gap: "10px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ color: done ? heroColor : "var(--shield-border)", flexShrink: 0, display: "flex" }}>
                      {done ? <CheckCircle2 size={18} /> : <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid currentColor" }} />}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: heroColor, letterSpacing: "0.12em", marginBottom: "2px" }}>
                        WK {mod.week}
                      </div>
                      <div style={{
                        fontSize: "0.78rem",
                        color: done ? heroColor : "var(--shield-white)",
                        fontWeight: done ? 500 : 400,
                        textDecoration: done ? "line-through" : "none",
                        opacity: done ? 0.7 : 1,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {mod.topic}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall progress */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.1em" }}>MISSION PROGRESS</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: heroColor }}>{progressPct}% COMPLETE</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href="/dossier" className="btn-gold" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <Target size={16} style={{ marginRight: "8px" }} /> Full Dossier
          </a>
          <a href="/progress" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <TrendingUp size={16} style={{ marginRight: "8px" }} /> Progress Metrics
          </a>
          <a href="/salary" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontFamily: "var(--font-hero)", fontSize: "0.9rem", letterSpacing: "0.08em",
            color: "var(--shield-silver)", textDecoration: "none", padding: "11px 24px",
            border: "1.5px solid var(--shield-border)", borderRadius: "6px",
          }}>
            Earnings Scale
          </a>
          <a href="/compare" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            fontFamily: "var(--font-hero)", fontSize: "0.9rem", letterSpacing: "0.08em",
            color: "var(--shield-silver)", textDecoration: "none", padding: "11px 24px",
            border: "1.5px solid var(--shield-border)", borderRadius: "6px",
          }}>
            Course Compare
          </a>
        </div>
      </div>
    </div>
  );
}
