"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, Zap, Target, Sparkles, BookOpen, AlertTriangle, Check, Archive, FolderOpen, IndianRupee, Map, Trophy, Search, Building2, Waves, Landmark, MountainSnow, Diamond, Leaf, Hammer, Droplet } from "lucide-react";
import { HERO_SCORING_MATRIX } from "@/lib/heroAssignment";

function getOrCreateSession() {
  if (typeof window === "undefined") return "anon";
  let sid = localStorage.getItem("shield_session");
  if (!sid) {
    sid = "agent_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("shield_session", sid);
  }
  return sid;
}

const DEMAND_COLOR = { Critical: "#10B981", High: "#F5A623", Moderate: "#2563EB", Low: "#9CA3AF" };

function SectionHeader({ icon, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid var(--shield-border)" }}>
      <span style={{ fontSize: "1.1rem" }}>{icon}</span>
      <span style={{
        fontFamily: "var(--font-hero)",
        fontSize: "0.85rem",
        letterSpacing: "0.12em",
        color: "var(--shield-gold)",
      }}>
        {label}
      </span>
    </div>
  );
}

function CareerCard({ career, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="glass-card"
      style={{ padding: "20px", cursor: "pointer", transition: "all 0.25s" }}
      onClick={() => setExpanded(!expanded)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em" }}>PATH {String(index + 1).padStart(2, "0")}</span>
            <span style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: "var(--shield-border)" }} />
            <span style={{
              fontSize: "0.7rem",
              fontFamily: "var(--font-mono)",
              color: DEMAND_COLOR[career.demandLevel] || "var(--shield-silver)",
              padding: "2px 8px",
              border: `1px solid ${DEMAND_COLOR[career.demandLevel] || "var(--shield-silver)"}30`,
              borderRadius: "999px",
              background: `${DEMAND_COLOR[career.demandLevel] || "var(--shield-silver)"}10`,
            }}>
              {career.demandLevel} Demand
            </span>
          </div>
          <h3 style={{ fontFamily: "var(--font-hero)", fontSize: "1.05rem", color: "var(--shield-white)", letterSpacing: "0.04em" }}>{career.title}</h3>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)" }}>Entry</div>
          <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.95rem", color: "var(--shield-gold)" }}>{career.entryLPA}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", marginTop: "4px" }}>Senior</div>
          <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.9rem", color: "#10B981" }}>{career.seniorLPA}</div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--shield-border)" }}>
          <p style={{ fontSize: "0.88rem", color: "var(--shield-silver)", lineHeight: 1.6, marginBottom: "12px" }}>{career.description}</p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {career.topCompanies?.map((c) => (
              <span key={c} style={{ fontSize: "0.75rem", padding: "4px 10px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: "4px", color: "var(--shield-white)" }}>{c}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: "12px", textAlign: "right" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", opacity: 0.6 }}>
          {expanded ? "▲ COLLAPSE" : "▼ EXPAND INTEL"}
        </span>
      </div>
    </div>
  );
}

function RoadmapStep({ step, index, heroColor }) {
  const IconProps = { size: 16 };
  const avengerMap = {
    captain_america: <Shield {...IconProps} />,
    iron_man: <Zap {...IconProps} fill="currentColor" />,
    thor: <Hammer {...IconProps} fill="currentColor" />,
    hulk: <Droplet {...IconProps} fill="currentColor" />,
    doctor_strange: <Sparkles {...IconProps} />,
    black_widow: <Target {...IconProps} />,
    black_panther: <Target {...IconProps} fill="currentColor" />
  };
  return (
    <div className="roadmap-node" style={{ marginBottom: "28px" }}>
      <div className="roadmap-dot" style={{ borderColor: heroColor, color: heroColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {avengerMap[step.avenger] || <Target {...IconProps} />}
      </div>
      <div style={{ flex: 1, paddingTop: "4px" }}>
        <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.7rem", letterSpacing: "0.15em", color: heroColor, marginBottom: "4px" }}>{step.phase}</div>
        <p style={{ fontSize: "0.9rem", color: "var(--shield-white)", lineHeight: 1.5 }}>{step.objective}</p>
      </div>
    </div>
  );
}

function SalaryTable({ salaryIntel }) {
  if (!salaryIntel) return null;
  const cities = [
    { key: "bangalore", label: "Bangalore", flag: <Building2 size={16} /> },
    { key: "mumbai", label: "Mumbai", flag: <Waves size={16} /> },
    { key: "delhi", label: "Delhi", flag: <Landmark size={16} /> },
    { key: "pune", label: "Pune", flag: <MountainSnow size={16} /> },
    { key: "hyderabad", label: "Hyderabad", flag: <Diamond size={16} /> },
    { key: "tier2", label: "Tier-2 India", flag: <Leaf size={16} /> },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
      {cities.map(({ key, label, flag }) => {
        const data = salaryIntel[key];
        if (!data) return null;
        return (
          <div key={key} className="glass-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <span style={{ display: "flex", alignItems: "center" }}>{flag}</span>
              <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.78rem", color: "var(--shield-white)", letterSpacing: "0.06em" }}>{label}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)", marginBottom: "2px" }}>Entry</div>
                <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", color: "var(--shield-gold)" }}>{data.entry}</div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)", marginBottom: "2px" }}>Senior</div>
                <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.85rem", color: "#10B981" }}>{data.senior}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Main Dossier Page ───────────────────────────── */
export default function DossierPage() {
  const router = useRouter();
  const [hero, setHero] = useState(null);
  const [course, setCourse] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef(null);

  // Load hero from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem("shield_hero");
    if (stored) {
      try { setHero(JSON.parse(stored)); } catch {}
    }
  }, []);

  // Debounced course search
  useEffect(() => {
    if (courseSearch.length < 2) { setSuggestions([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/courses?search=${encodeURIComponent(courseSearch)}`);
        const data = await res.json();
        setSuggestions(data.courses || []);
      } catch {}
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [courseSearch]);

  async function generateDossier() {
    const activeCourse = course || courseSearch.trim();
    if (!activeCourse || !hero) return;
    if (!course) setCourse(activeCourse);
    setLoading(true); setError(""); setDossier(null);
    try {
      const res = await fetch("/api/dossier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroId: hero.heroId, heroName: hero.name, course: activeCourse }),
      });
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDossier(data);
    } catch (err) {
      setError("The Infinity Stones are misaligned. Please retry, Agent.");
    } finally {
      setLoading(false);
    }
  }

  async function saveDossier() {
    if (!dossier) return;
    setSaving(true);
    try {
      await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: getOrCreateSession(), dossier, heroId: hero?.heroId, heroName: hero?.name, course }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  }

  const heroColor = hero?.color || "var(--shield-gold)";

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", padding: "0 0 80px" }}>

      {/* Banner */}
      <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "40px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div className="classified-stamp" style={{ marginBottom: "16px" }}>Classified — Mission Dossier</div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(1.8rem, 5vw, 3rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            {hero ? (
              <>Mission Briefing: <span style={{ color: heroColor }}>{hero.name}</span></>
            ) : (
              <>Generate Your <span className="text-gold-gradient">Mission Dossier</span></>
            )}
          </h1>
          {hero && (
            <p style={{ marginTop: "8px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.2em" }}>
              AGENT: {hero.name.toUpperCase()} · {hero.title?.toUpperCase()} · CLEARANCE LEVEL 7
            </p>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

        {/* No hero — prompt to take quiz */}
        {!hero && (
          <div className="glass-card" style={{ padding: "28px", textAlign: "center", marginBottom: "32px" }}>
            <p style={{ color: "var(--shield-silver)", marginBottom: "16px", fontSize: "0.9rem" }}>
              Even Thanos had a plan. Take the assessment first, Agent — your hero identity shapes your dossier.
            </p>
            <a href="/quiz" className="btn-gold" style={{ display: "inline-flex", alignItems: "center" }}>
              <Zap size={16} fill="var(--shield-black)" style={{ marginRight: "6px" }} /> Take Aptitude Assessment
            </a>
          </div>
        )}

        {/* Course Search */}
        <div className="dossier-panel" style={{ padding: "28px", marginBottom: "32px" }}>
          <SectionHeader icon={<Search size={18} />} label="Intel Query — Enter Course" />
          <div style={{ position: "relative" }}>
             <input
              className="shield-input"
              placeholder="Enter your course, Agent... (e.g. B.Tech Computer Science)"
              value={courseSearch}
              onChange={(e) => { setCourseSearch(e.target.value); setCourse(""); }}
              onKeyDown={(e) => { if (e.key === "Enter" && courseSearch.trim().length >= 2) generateDossier(); }}
            />
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && !course && (
              <div style={{
                position: "absolute",
                top: "100%", left: 0, right: 0,
                background: "var(--shield-navy)",
                border: "1px solid var(--shield-border)",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                zIndex: 50,
                overflow: "hidden",
              }}>
                {suggestions.map((s) => (
                  <div
                    key={s.shortCode}
                    onClick={() => { setCourse(s.name); setCourseSearch(s.name); setSuggestions([]); }}
                    style={{
                      padding: "12px 18px",
                      cursor: "pointer",
                      borderBottom: "1px solid rgba(31,41,55,0.5)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(245,166,35,0.07)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{ fontSize: "0.9rem", color: "var(--shield-white)" }}>{s.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--shield-silver)", fontFamily: "var(--font-mono)" }}>{s.stream} · {s.duration}yr</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="btn-gold"
            onClick={generateDossier}
            disabled={(!(course || courseSearch.trim())) || loading}
            style={{
              marginTop: "16px",
              width: "100%",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              opacity: (course || courseSearch.trim()) && !loading ? 1 : 0.5,
              cursor: (course || courseSearch.trim()) && !loading ? "pointer" : "not-allowed"
            }}
          >
            {loading ? "JARVIS is analyzing your future..." : <><Target size={16} style={{ marginRight: "6px" }} /> Generate Mission Dossier</>}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div className="arc-loader" style={{ margin: "0 auto 20px" }} />
            <p style={{ fontFamily: "var(--font-hero)", color: heroColor, letterSpacing: "0.15em", marginBottom: "8px" }}>JARVIS IS ANALYZING YOUR FUTURE...</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--shield-silver)", letterSpacing: "0.2em" }}>GROQ LLaMA-3.3-70B · EXPECTED IN &lt; 2 SECONDS</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: "16px 20px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", borderLeft: "3px solid var(--shield-red)", borderRadius: "8px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
            <AlertTriangle size={16} color="var(--shield-red)" />
            <p style={{ color: "var(--shield-red)", fontFamily: "var(--font-mono)", fontSize: "0.85rem" }}>{error}</p>
          </div>
        )}

        {/* ── DOSSIER OUTPUT ───────────────────────── */}
        {dossier && !loading && (
          <div className="dossier-panel animate-fadeUp" style={{ padding: "32px", animationFillMode: "forwards" }}>

            {/* Classification Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "var(--shield-silver)", marginBottom: "6px" }}>
                  {dossier.classification || "CLASSIFIED // S.H.I.E.L.D. EYES ONLY"}
                </div>
                <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.3rem", color: heroColor, letterSpacing: "0.05em" }}>
                  {course} — Career Intelligence Report
                </h2>
              </div>
              <span className="classified-stamp" style={{ alignSelf: "flex-start" }}>Top Secret</span>
            </div>

            {/* Mission Briefing */}
            {dossier.missionBriefing && (
              <div style={{ marginBottom: "32px", padding: "16px 20px", background: "rgba(245,166,35,0.05)", borderLeft: `3px solid ${heroColor}`, borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--shield-white)", lineHeight: 1.7, fontStyle: "italic" }}>
                  "{dossier.missionBriefing}"
                </p>
              </div>
            )}

            <div className="glow-line" style={{ marginBottom: "32px" }} />

            {/* Career Paths */}
            {dossier.careerPaths?.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <SectionHeader icon={<Target size={18} />} label="Career Intelligence Paths" />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {dossier.careerPaths.map((c, i) => <CareerCard key={i} career={c} index={i} />)}
                </div>
              </div>
            )}

            {/* Skills + Certifications */}
            <div className="dossier-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "36px" }}>
              {dossier.criticalSkills?.length > 0 && (
                <div>
                  <SectionHeader icon={<Zap size={18} />} label="Critical Skills" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {dossier.criticalSkills.map((s) => (
                      <span key={s} className="stat-pill">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {dossier.certifications?.length > 0 && (
                <div>
                  <SectionHeader icon={<Trophy size={18} />} label="Certifications" />
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {dossier.certifications.map((c) => (
                      <div key={c} style={{ fontSize: "0.85rem", color: "var(--shield-silver)", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ color: "var(--shield-gold)" }}>◆</span> {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Salary Intelligence */}
            {dossier.salaryIntel && (
              <div style={{ marginBottom: "36px" }}>
                <SectionHeader icon={<IndianRupee size={18} />} label="Infinity Earnings Scale — City-Wise Intel" />
                <SalaryTable salaryIntel={dossier.salaryIntel} />
              </div>
            )}

            {/* Roadmap */}
            {dossier.roadmap?.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <SectionHeader icon={<Map size={18} />} label="Hero's Journey Roadmap" />
                <div>
                  {dossier.roadmap.map((step, i) => <RoadmapStep key={i} step={step} index={i} heroColor={heroColor} />)}
                </div>
              </div>
            )}

            {/* Higher Studies */}
            {dossier.higherStudies?.length > 0 && (
              <div style={{ marginBottom: "36px" }}>
                <SectionHeader icon={<BookOpen size={18} />} label="Higher Studies Options" />
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {dossier.higherStudies.map((h) => (
                    <span key={h} style={{ padding: "6px 14px", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: "6px", fontSize: "0.82rem", color: "var(--shield-blue)" }}>{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Threat Assessment */}
            {dossier.threatAssessment && (
              <div style={{ marginBottom: "32px", padding: "16px 20px", background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)", borderLeft: "3px solid var(--shield-red)", borderRadius: "0 8px 8px 0" }}>
                <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.7rem", letterSpacing: "0.15em", color: "var(--shield-red)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}><AlertTriangle size={12} /> THREAT ASSESSMENT</div>
                <p style={{ fontSize: "0.88rem", color: "var(--shield-silver)", lineHeight: 1.6 }}>{dossier.threatAssessment}</p>
              </div>
            )}

            {/* Hero Quote */}
            {dossier.heroQuote && (
              <div style={{ textAlign: "center", padding: "28px", background: `linear-gradient(135deg, ${heroColor}08, transparent)`, borderRadius: "8px", border: `1px solid ${heroColor}20` }}>
                <div style={{ marginBottom: "12px", color: heroColor }}><Sparkles size={24} /></div>
                <p style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", color: heroColor, letterSpacing: "0.04em", lineHeight: 1.5, fontStyle: "italic" }}>
                  "{dossier.heroQuote}"
                </p>
                {hero && <p style={{ marginTop: "10px", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.2em" }}>— {hero.name}</p>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="glow-line" style={{ margin: "28px 0" }} />
            <div className="glow-line" style={{ margin: "28px 0" }} />
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
              <button className="btn-gold" onClick={saveDossier} disabled={saving || saved} style={{ opacity: saving ? 0.7 : 1, display: "flex", alignItems: "center", border: "none" }}>
                {saved ? <><Check size={16} strokeWidth={3} style={{ marginRight: "6px" }} /> Filed to Archive</> : saving ? "Filing..." : <><Archive size={16} style={{ marginRight: "6px" }} /> File to S.H.I.E.L.D. Archive</>}
              </button>
              <a href="/history" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-hero)", fontSize: "0.9rem", letterSpacing: "0.08em", color: "var(--shield-blue)", padding: "11px 24px", border: "1.5px solid var(--shield-blue)", borderRadius: "6px", textDecoration: "none" }}>
                <FolderOpen size={16} /> View Archive
              </a>
              <a href="/salary" className="btn-red" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-hero)", fontSize: "0.9rem", letterSpacing: "0.08em", color: "#fff", padding: "12px 24px", textDecoration: "none" }}>
                <IndianRupee size={16} /> Salary Heatmap
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
