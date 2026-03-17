"use client";
import { useState, useEffect, useRef } from "react";
import { Check, X, Target } from "lucide-react";
import Link from "next/link";

const COMPARE_DATA = {
  btechcs: {
    name: "B.Tech Computer Science",
    stream: "Engineering", duration: "4 years",
    avenger: "Iron Man", color: "#F5A623",
    entrySalary: "₹6–12 LPA", seniorSalary: "₹30–80 LPA",
    jobDemand: "Very High",
    topCompanies: ["Google", "Microsoft", "Amazon", "Flipkart", "TCS"],
    topColleges: ["IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani"],
    entryExams: ["JEE Main", "JEE Advanced", "BITSAT"],
    skills: ["DSA", "System Design", "React", "Python", "Cloud"],
    higherStudies: ["M.Tech (IIT/NIT)", "MS abroad", "MBA (IIM)"],
    pros: ["Highest demand globally", "Massive salary growth", "Remote work possibilities", "Multiple specializations"],
    cons: ["Extremely competitive", "Constant upskilling needed", "High stress in product companies"],
  },
  mbbs: {
    name: "MBBS",
    stream: "Medical", duration: "5.5 years + internship",
    avenger: "Doctor Strange", color: "#10B981",
    entrySalary: "₹5–10 LPA", seniorSalary: "₹25–60 LPA",
    jobDemand: "High",
    topCompanies: ["AIIMS", "Apollo Hospitals", "Fortis", "Max Healthcare"],
    topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER"],
    entryExams: ["NEET"],
    skills: ["Clinical Diagnosis", "Patient Care", "Medical Research", "Surgery"],
    higherStudies: ["MD/MS", "USMLE (USA)", "PLAB (UK)", "Super-specialization"],
    pros: ["Noble profession", "Job security guaranteed", "High social respect", "PG leads to top salary"],
    cons: ["Very long study period", "High stress, long hours", "NEET extremely competitive"],
  },
  bba: {
    name: "BBA (Bachelor of Business Administration)",
    stream: "Management", duration: "3 years",
    avenger: "Black Panther", color: "#7C3AED",
    entrySalary: "₹3–6 LPA", seniorSalary: "₹15–40 LPA",
    jobDemand: "High",
    topCompanies: ["Deloitte", "KPMG", "McKinsey", "Reliance", "Tata"],
    topColleges: ["IIM Indore (IPM)", "Christ University", "Symbiosis Pune"],
    entryExams: ["IPMAT", "SET", "DU JAT"],
    skills: ["Leadership", "Finance Basics", "Marketing", "Analytics", "Communication"],
    higherStudies: ["MBA (IIM/ISB)", "PGDM", "CFA", "CA after BBA"],
    pros: ["Broad skill foundation", "Fast MBA track", "Entrepreneurship ready", "Networking opportunities"],
    cons: ["Lower starting salary vs engineering", "MBA crucial for top salaries", "Generic degree without specialization"],
  },
  bscds: {
    name: "B.Sc Data Science",
    stream: "Science/Technology", duration: "3 years",
    avenger: "Iron Man", color: "#F59E0B",
    entrySalary: "₹5–10 LPA", seniorSalary: "₹25–60 LPA",
    jobDemand: "Very High",
    topCompanies: ["Google", "Netflix", "Amazon", "Zomato", "Ola"],
    topColleges: ["IIT Madras (BSc)", "CMI Chennai", "BITS Pilani"],
    entryExams: ["IIT JAM", "Class 12 Merit"],
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "Deep Learning"],
    higherStudies: ["M.Tech AI/ML", "MS in Data Science (abroad)", "MBA Analytics"],
    pros: ["AI/ML boom — huge demand", "High salaries early on", "Remote work friendly", "International opportunities"],
    cons: ["Requires strong math", "Evolving field needs constant learning", "Fewer top colleges yet"],
  },
};

const COURSE_OPTIONS = Object.entries(COMPARE_DATA).map(([k, v]) => ({ key: k, name: v.name }));

export default function ComparePage() {
  const [left, setLeft] = useState("btechcs");
  const [right, setRight] = useState("mbbs");

  const L = COMPARE_DATA[left];
  const R = COMPARE_DATA[right];

  const rows = [
    { label: "Duration", lVal: L.duration, rVal: R.duration },
    { label: "Entry Salary", lVal: L.entrySalary, rVal: R.entrySalary },
    { label: "Senior Salary", lVal: L.seniorSalary, rVal: R.seniorSalary },
    { label: "Job Demand", lVal: L.jobDemand, rVal: R.jobDemand },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", paddingBottom: "80px" }}>
      <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "48px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label" style={{ marginBottom: "12px" }}>Bruce Banner · "Choose wisely before you smash"</div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            Career <span className="text-gold-gradient">Comparator</span>
          </h1>
          <p style={{ marginTop: "10px", color: "var(--shield-silver)", fontSize: "0.9rem" }}>
            Side-by-side intelligence report. Make an informed decision, Agent.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Selectors */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", alignItems: "center", marginBottom: "40px" }}>
          <div style={{ flex: "1 1 min-content" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", marginBottom: "8px" }}>COURSE A</p>
            <select
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="shield-input"
              style={{ cursor: "pointer" }}
            >
              {COURSE_OPTIONS.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
            </select>
          </div>
          <div style={{ fontFamily: "var(--font-hero)", fontSize: "1.5rem", color: "var(--shield-gold)", textAlign: "center", padding: "12px" }}>VS</div>
          <div style={{ flex: "1 1 min-content" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", marginBottom: "8px" }}>COURSE B</p>
            <select
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="shield-input"
              style={{ cursor: "pointer" }}
            >
              {COURSE_OPTIONS.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
          {[L, R].map((d, idx) => (
            <div key={idx} className="dossier-panel" style={{ padding: "28px" }}>
              <div style={{ borderBottom: `2px solid ${d.color}`, paddingBottom: "16px", marginBottom: "20px" }}>
                <div style={{ fontFamily: "var(--font-hero)", fontSize: "0.7rem", letterSpacing: "0.15em", color: d.color, marginBottom: "6px" }}>AGENT: {d.avenger.toUpperCase()}</div>
                <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1rem", color: "var(--shield-white)", letterSpacing: "0.04em" }}>{d.name}</h2>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", marginTop: "4px" }}>{d.stream}</p>
              </div>

              {rows.map(({ label, lVal, rVal }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid rgba(31,41,55,0.5)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--shield-silver)", letterSpacing: "0.1em" }}>{label}</span>
                  <span style={{ fontFamily: "var(--font-hero)", fontSize: "0.82rem", color: d.color }}>{idx === 0 ? lVal : rVal}</span>
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", marginBottom: "10px" }}>ADVANTAGES</p>
                {d.pros.map((p) => (
                  <div key={p} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "0.82rem", color: "var(--shield-white)", alignItems: "flex-start" }}>
                    <span style={{ color: "#10B981", flexShrink: 0, marginTop: "2px" }}><Check size={14} strokeWidth={3} /></span> {p}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", marginBottom: "10px" }}>CHALLENGES</p>
                {d.cons.map((c) => (
                  <div key={c} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "0.82rem", color: "var(--shield-silver)", alignItems: "flex-start" }}>
                    <span style={{ color: "var(--shield-red)", flexShrink: 0, marginTop: "2px" }}><X size={14} strokeWidth={3} /></span> {c}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "20px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", marginBottom: "10px" }}>KEY SKILLS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {d.skills.map((s) => <span key={s} className="stat-pill" style={{ fontSize: "0.7rem", color: d.color, borderColor: `${d.color}30` }}>{s}</span>)}
                </div>
              </div>

              <Link
                href="/dossier"
                className="btn-gold"
                style={{ marginTop: "20px", display: "flex", justifyContent: "center", fontSize: "0.8rem", padding: "10px 16px" }}
                onClick={() => sessionStorage.setItem("shield_hero", JSON.stringify({ heroId: "iron_man", name: "Tony Stark", color: d.color }))}
              >
                <Target size={16} style={{ marginRight: "6px" }} /> Generate Full Dossier
              </Link>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.15em", opacity: 0.5 }}>
          INTELLIGENCE DATA · INDIAN MARKET 2024–25 · S.H.I.E.L.D. CLASSIFICATION
        </p>
      </div>
    </div>
  );
}
