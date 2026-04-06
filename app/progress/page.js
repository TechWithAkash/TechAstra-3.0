"use client";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine,
} from "recharts";
import {
  TrendingUp, Target, Clock, Flame, AlertTriangle, CheckCircle2,
  BookOpen, BarChart2, Zap, Calendar,
} from "lucide-react";
import { HERO_SCORING_MATRIX } from "@/lib/heroAssignment";

/* ── Helpers ──────────────────────────────────────── */
function computeDNAScore({ completedModules = [], totalModules = 0, profile = {}, streak = 0 }) {
  const techPct = totalModules > 0 ? (completedModules.length / totalModules) : 0;
  const technical = Math.round(techPct * 80 + (profile.level === "intermediate" ? 15 : profile.level === "advanced" ? 35 : 0));
  const consistency = Math.min(streak * 8 + (completedModules.length > 0 ? 20 : 0), 100);
  const soft = profile.level === "beginner" ? 30 : profile.level === "intermediate" ? 45 : 60;
  const certs = completedModules.length > 4 ? 35 : completedModules.length > 2 ? 20 : 10;
  const market = profile.timelineMonths > 0 ? Math.min(30 + techPct * 40, 80) : 20;
  const total = Math.round(technical * 0.40 + consistency * 0.20 + soft * 0.15 + certs * 0.15 + market * 0.10);
  return { total: Math.min(total, 100), technical: Math.min(technical, 100), consistency: Math.min(consistency, 100), soft: Math.min(soft, 100), certifications: Math.min(certs, 100), marketAlignment: Math.min(market, 100) };
}

const LEVEL_COLORS = { beginner: "#10B981", intermediate: "#F5A623", advanced: "#7C3AED" };
const LEVEL_LABELS = { beginner: "Beginner Agent", intermediate: "Field Operative", advanced: "Senior Operative" };

/* ── Custom Tooltip ──────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "8px", padding: "10px 14px" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", marginBottom: "4px" }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily: "var(--font-hero)", fontSize: "0.9rem", color: p.color }}>
          {p.name}: {p.value}{p.unit || ""}
        </div>
      ))}
    </div>
  );
}

/* ── Metric Card ──────────────────────────────────── */
function MetricCard({ label, value, delta, color = "var(--shield-gold)", icon, desc }) {
  return (
    <div className="dossier-panel" style={{ padding: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", letterSpacing: "0.12em" }}>{label}</span>
      </div>
      <div style={{ fontFamily: "var(--font-hero)", fontSize: "2rem", color, lineHeight: 1, marginBottom: "4px" }}>{value}</div>
      {delta !== undefined && (
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: delta >= 0 ? "#10B981" : "var(--shield-red)", marginBottom: "6px" }}>
          {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)} from last week
        </div>
      )}
      {desc && <div style={{ fontSize: "0.78rem", color: "var(--shield-silver)", lineHeight: 1.5 }}>{desc}</div>}
    </div>
  );
}

/* ── Gap Analysis Row ────────────────────────────── */
function GapRow({ label, current, target = 80, color }) {
  const gap = Math.max(target - current, 0);
  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.1em" }}>{label}</span>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color }}>Current: {current}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", opacity: 0.6 }}>Target: {target}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: "8px", background: "rgba(31,41,55,0.8)", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${current}%`, background: color, borderRadius: "4px", transition: "width 1s ease" }} />
        <div style={{ position: "absolute", top: 0, left: `${target}%`, width: "2px", height: "100%", background: "rgba(255,255,255,0.3)" }} />
      </div>
      {gap > 10 && (
        <div style={{ marginTop: "4px", fontSize: "0.7rem", color: "var(--shield-silver)", display: "flex", alignItems: "center", gap: "4px" }}>
          <AlertTriangle size={10} color="var(--shield-gold)" /> {gap} points behind target
        </div>
      )}
    </div>
  );
}

/* ── MAIN PROGRESS PAGE ──────────────────────────── */
export default function ProgressPage() {
  const [hero, setHero] = useState(null);
  const [profile, setProfile] = useState({});
  const [dossier, setDossier] = useState(null);
  const [course, setCourse] = useState("");
  const [completedModules, setCompletedModules] = useState([]);
  const [streak, setStreak] = useState(0);
  const [dna, setDna] = useState({ total: 0, technical: 0, consistency: 0, soft: 0, certifications: 0, marketAlignment: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const heroRaw = sessionStorage.getItem("shield_hero") || localStorage.getItem("shield_hero");
    if (heroRaw) { try { setHero(JSON.parse(heroRaw)); } catch {} }
    const profileRaw = localStorage.getItem("shield_profile");
    if (profileRaw) { try { setProfile(JSON.parse(profileRaw)); } catch {} }

    const dossierRaw = localStorage.getItem("shield_dossier");
    if (dossierRaw) {
      try {
        const { dossier: d, course: c } = JSON.parse(dossierRaw);
        setDossier(d); setCourse(c);
        const key = `shield_progress_${c?.toLowerCase().replace(/\s+/g, "_").slice(0, 40)}`;
        const progRaw = localStorage.getItem(key);
        if (progRaw) {
          const prog = JSON.parse(progRaw);
          setCompletedModules(prog.completed || []);
          setStreak(prog.streak || 0);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    const totalModules = dossier?.learningModules?.length || 0;
    setDna(computeDNAScore({ completedModules, totalModules, profile, streak }));
  }, [completedModules, dossier, profile, streak]);

  const heroColor = hero?.color || "var(--shield-gold)";
  const totalModules = dossier?.learningModules?.length || 0;
  const completedCount = completedModules.length;
  const progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Projected months remaining
  const weeksRemaining = totalModules - completedCount;
  const monthsRemaining = (weeksRemaining / 4.33).toFixed(1);
  const projectedDate = new Date();
  projectedDate.setMonth(projectedDate.getMonth() + Math.ceil(parseFloat(monthsRemaining)));
  const projectedStr = projectedDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Simulated weekly progress (builds chart from completion data)
  const weeklyData = Array.from({ length: Math.max(totalModules, 4) }, (_, i) => ({
    week: `W${i + 1}`,
    completed: completedModules.includes(i) ? 1 : 0,
    cumulative: completedModules.filter((m) => m <= i).length,
    target: Math.round((i + 1) * (totalModules / Math.max(totalModules, 1))),
  }));

  // DNA score over time (simulated — grows as modules complete)
  const dnaProgression = Array.from({ length: Math.max(completedCount + 1, 4) }, (_, i) => {
    const modsDone = Math.min(i, completedCount);
    const pct = totalModules > 0 ? modsDone / totalModules : 0;
    const score = Math.round((pct * 80 + 15) * 0.4 + 20 * 0.6);
    return { week: `Week ${i + 1}`, score: Math.min(score, 100) };
  });
  dnaProgression.unshift({ week: "Start", score: profile.level === "intermediate" ? 20 : profile.level === "advanced" ? 35 : 10 });

  // Biggest gaps
  const gapItems = [
    { label: "Technical Depth", current: dna.technical, target: 80, color: heroColor },
    { label: "Consistency", current: dna.consistency, target: 75, color: "#10B981" },
    { label: "Soft Skills", current: dna.soft, target: 70, color: "#2563EB" },
    { label: "Certifications", current: dna.certifications, target: 60, color: "#7C3AED" },
    { label: "Market Alignment", current: dna.marketAlignment, target: 75, color: "#F59E0B" },
  ].sort((a, b) => (a.target - a.current) - (b.target - b.current));

  const biggestGap = gapItems[gapItems.length - 1];

  if (!mounted) return null;

  if (!dossier) {
    return (
      <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "24px", padding: "48px 24px" }}>
        <BarChart2 size={48} color="var(--shield-silver)" />
        <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.4rem", color: "var(--shield-white)", letterSpacing: "0.06em" }}>No Mission Data Yet</h2>
        <p style={{ color: "var(--shield-silver)", textAlign: "center", maxWidth: "400px" }}>Start your mission to generate progress metrics.</p>
        <a href="/quiz" className="btn-gold" style={{ display: "inline-flex", alignItems: "center" }}>
          <Zap size={16} fill="var(--shield-black)" style={{ marginRight: "8px" }} /> Begin Your Mission
        </a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="section-label" style={{ marginBottom: "10px" }}>Mission Performance Analytics</div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            Progress <span className="text-gold-gradient">Intelligence Report</span>
          </h1>
          {hero && (
            <p style={{ marginTop: "10px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.15em" }}>
              AGENT: {hero.name?.toUpperCase()} · FIELD: {course?.toUpperCase()} · {profile.level ? LEVEL_LABELS[profile.level]?.toUpperCase() : ""}
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Top Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "32px" }}>
          <MetricCard
            label="CAREER DNA SCORE"
            value={dna.total}
            color={heroColor}
            icon={<TrendingUp size={20} />}
            desc="Composite score across 5 career dimensions"
          />
          <MetricCard
            label="MISSION PROGRESS"
            value={`${progressPct}%`}
            color="#10B981"
            icon={<CheckCircle2 size={20} />}
            desc={`${completedCount} of ${totalModules} modules complete`}
          />
          <MetricCard
            label="JOB-READY ETA"
            value={weeksRemaining > 0 ? projectedStr : "NOW!"}
            color="#7C3AED"
            icon={<Calendar size={20} />}
            desc={weeksRemaining > 0 ? `${monthsRemaining} months at current pace` : "Mission accomplished, Agent!"}
          />
          <MetricCard
            label="SKILL VELOCITY"
            value={`${completedCount} mod`}
            color="#F59E0B"
            icon={<Flame size={20} />}
            desc="Modules completed total"
          />
        </div>

        {/* Charts Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>

          {/* Module Completion Chart */}
          <div className="dossier-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
              <BarChart2 size={18} color="var(--shield-gold)" />
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.82rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                MODULE COMPLETION TIMELINE
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyData.slice(0, 12)} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,41,55,0.5)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#9CA3AF", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cumulative" name="Completed" fill={heroColor} fillOpacity={0.85} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* DNA Score Progression */}
          <div className="dossier-panel" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
              <TrendingUp size={18} color="var(--shield-gold)" />
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.82rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                CAREER DNA SCORE GROWTH
              </span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dnaProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(31,41,55,0.5)" vertical={false} />
                <XAxis dataKey="week" tick={{ fill: "#9CA3AF", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#9CA3AF", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={70} stroke="rgba(16,185,129,0.3)" strokeDasharray="4 2" label={{ value: "Job-Ready Threshold", fill: "#10B981", fontSize: 9 }} />
                <Line type="monotone" dataKey="score" name="DNA Score" stroke={heroColor} strokeWidth={2.5} dot={{ fill: heroColor, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)", marginTop: "8px", letterSpacing: "0.1em" }}>
              * GREEN LINE = 70 point job-readiness threshold
            </p>
          </div>
        </div>

        {/* Gap Analysis */}
        <div className="dossier-panel" style={{ padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Target size={18} color="var(--shield-gold)" />
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
                SKILL GAP ANALYSIS
              </span>
            </div>
            {biggestGap && biggestGap.target - biggestGap.current > 10 && (
              <div style={{
                padding: "6px 14px", background: "rgba(192,57,43,0.08)",
                border: "1px solid rgba(192,57,43,0.2)", borderRadius: "6px",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <AlertTriangle size={12} color="var(--shield-red)" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-red)", letterSpacing: "0.1em" }}>
                  PRIORITY GAP: {biggestGap.label.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {gapItems.map((g) => (
            <GapRow key={g.label} {...g} />
          ))}
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--shield-silver)", marginTop: "16px", letterSpacing: "0.1em", opacity: 0.6 }}>
            TARGETS BASED ON INDUSTRY BENCHMARKS FOR {course?.toUpperCase() || "YOUR SELECTED FIELD"}
          </p>
        </div>

        {/* Completed Modules List */}
        <div className="dossier-panel" style={{ padding: "24px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
            <BookOpen size={18} color="var(--shield-gold)" />
            <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", letterSpacing: "0.12em", color: "var(--shield-gold)" }}>
              COMPLETED MODULES
            </span>
          </div>
          {completedCount === 0 ? (
            <div style={{ textAlign: "center", padding: "24px" }}>
              <Clock size={32} color="var(--shield-silver)" style={{ marginBottom: "12px" }} />
              <p style={{ color: "var(--shield-silver)", fontSize: "0.85rem" }}>
                No modules completed yet. Head to your{" "}
                <a href="/dossier" style={{ color: heroColor, textDecoration: "none" }}>Mission Dossier</a>{" "}
                to start checking off modules.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {completedModules.map((idx) => {
                const mod = dossier?.learningModules?.[idx];
                if (!mod) return null;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: "12px 16px",
                      border: `1px solid ${heroColor}30`,
                      borderRadius: "8px",
                      background: `${heroColor}06`,
                      display: "flex", alignItems: "center", gap: "12px",
                    }}
                  >
                    <CheckCircle2 size={18} color={heroColor} style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: heroColor, letterSpacing: "0.12em", marginBottom: "2px" }}>
                        WEEK {mod.week} · {mod.phase?.toUpperCase()}
                      </div>
                      <div style={{ fontSize: "0.88rem", color: "var(--shield-white)" }}>{mod.topic}</div>
                    </div>
                    <span className="stat-pill" style={{ fontSize: "0.62rem" }}>~{mod.estimatedHours}h</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Improvement Summary */}
        <div style={{
          padding: "24px 28px",
          background: `linear-gradient(135deg, ${heroColor}10, rgba(17,24,39,0.6))`,
          border: `1px solid ${heroColor}25`,
          borderRadius: "12px",
          marginBottom: "24px",
        }}>
          <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.8rem", letterSpacing: "0.15em", color: heroColor, marginBottom: "12px" }}>
            MISSION INTELLIGENCE SUMMARY
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            {[
              { label: "Current DNA Score", value: `${dna.total}/100` },
              { label: "Modules Remaining", value: `${totalModules - completedCount}` },
              { label: "Est. Job-Ready", value: weeksRemaining > 0 ? projectedStr : "Now!" },
              { label: "Biggest Gap", value: biggestGap?.label || "—" },
              { label: "Weekly Pace", value: `${profile.weeklyHours || 10}h / week` },
              { label: "Level", value: LEVEL_LABELS[profile.level] || "Beginner" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--shield-silver)", letterSpacing: "0.12em", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.95rem", color: "var(--shield-white)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <a href="/dashboard" className="btn-gold" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <TrendingUp size={16} style={{ marginRight: "8px" }} /> Back to Dashboard
          </a>
          <a href="/dossier" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
            <Target size={16} style={{ marginRight: "8px" }} /> Mission Dossier
          </a>
        </div>
      </div>
    </div>
  );
}
