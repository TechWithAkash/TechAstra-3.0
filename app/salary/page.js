"use client";
import { useState } from "react";
import { Building2, Waves, Landmark, MountainSnow, Diamond, Leaf } from "lucide-react";

const SALARY_DATA = [
  {
    career: "Software Engineer",
    stream: "B.Tech CS / BCA",
    avenger: "iron_man",
    color: "#F5A623",
    cities: {
      bangalore: { entry: 8, senior: 45 },
      mumbai: { entry: 7, senior: 35 },
      delhi: { entry: 6, senior: 30 },
      pune: { entry: 6, senior: 28 },
      hyderabad: { entry: 7, senior: 32 },
      tier2: { entry: 4, senior: 15 },
    },
  },
  {
    career: "Doctor (MBBS+PG)",
    stream: "MBBS",
    avenger: "doctor_strange",
    color: "#10B981",
    cities: {
      bangalore: { entry: 10, senior: 40 },
      mumbai: { entry: 12, senior: 50 },
      delhi: { entry: 10, senior: 45 },
      pune: { entry: 8, senior: 35 },
      hyderabad: { entry: 9, senior: 38 },
      tier2: { entry: 5, senior: 20 },
    },
  },
  {
    career: "Chartered Accountant",
    stream: "CA / B.Com",
    avenger: "black_panther",
    color: "#7C3AED",
    cities: {
      bangalore: { entry: 7, senior: 30 },
      mumbai: { entry: 8, senior: 40 },
      delhi: { entry: 7, senior: 35 },
      pune: { entry: 6, senior: 25 },
      hyderabad: { entry: 6, senior: 28 },
      tier2: { entry: 4, senior: 15 },
    },
  },
  {
    career: "Product Manager",
    stream: "BBA / MBA",
    avenger: "black_panther",
    color: "#2563EB",
    cities: {
      bangalore: { entry: 18, senior: 60 },
      mumbai: { entry: 16, senior: 55 },
      delhi: { entry: 14, senior: 50 },
      pune: { entry: 14, senior: 45 },
      hyderabad: { entry: 15, senior: 50 },
      tier2: { entry: 8, senior: 25 },
    },
  },
  {
    career: "Lawyer (Litigation)",
    stream: "LLB / BA LLB",
    avenger: "captain_america",
    color: "#2563EB",
    cities: {
      bangalore: { entry: 5, senior: 25 },
      mumbai: { entry: 6, senior: 35 },
      delhi: { entry: 6, senior: 40 },
      pune: { entry: 4, senior: 20 },
      hyderabad: { entry: 4, senior: 18 },
      tier2: { entry: 3, senior: 10 },
    },
  },
  {
    career: "Data Scientist",
    stream: "B.Sc Data Science / B.Tech",
    avenger: "iron_man",
    color: "#F59E0B",
    cities: {
      bangalore: { entry: 10, senior: 50 },
      mumbai: { entry: 9, senior: 42 },
      delhi: { entry: 8, senior: 38 },
      pune: { entry: 8, senior: 35 },
      hyderabad: { entry: 9, senior: 40 },
      tier2: { entry: 5, senior: 18 },
    },
  },
];

const CITIES = [
  { key: "bangalore", label: "Bangalore", icon: <Building2 size={16} /> },
  { key: "mumbai", label: "Mumbai", icon: <Waves size={16} /> },
  { key: "delhi", label: "Delhi", icon: <Landmark size={16} /> },
  { key: "pune", label: "Pune", icon: <MountainSnow size={16} /> },
  { key: "hyderabad", label: "Hyderabad", icon: <Diamond size={16} /> },
  { key: "tier2", label: "Tier-2 India", icon: <Leaf size={16} /> },
];

const maxSenior = 65;

function SalaryBar({ value, max, color, label }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", width: "30px", textAlign: "right", letterSpacing: "0.05em" }}>
        ₹{value}L
      </span>
      <div style={{ flex: 1, height: "20px", background: "rgba(31,41,55,0.8)", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            borderRadius: "10px",
            transition: "width 0.6s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "8px",
          }}
        >
          {pct > 20 && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#000", fontWeight: 700 }}>
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SalaryPage() {
  const [selectedCity, setSelectedCity] = useState("bangalore");

  const sortedData = [...SALARY_DATA].sort(
    (a, b) => b.cities[selectedCity].senior - a.cities[selectedCity].senior
  );

  return (
    <div style={{ minHeight: "calc(100vh - 60px)", background: "var(--shield-black)", paddingBottom: "80px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #0A0A0A, #111827, #0A0A0A)", borderBottom: "1px solid var(--shield-border)", padding: "48px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label" style={{ marginBottom: "12px" }}>Black Widow · "Follow the money"</div>
          <h1 style={{ fontFamily: "var(--font-hero)", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
            The <span className="text-gold-gradient">Infinity Earnings</span> Scale
          </h1>
          <p style={{ marginTop: "12px", color: "var(--shield-silver)", fontSize: "0.9rem", maxWidth: "600px", margin: "12px auto 0" }}>
            City-wise salary intelligence across India. Know what you'll earn — before you choose.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>

        {/* City selector */}
        <div style={{ marginBottom: "40px" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", letterSpacing: "0.2em", marginBottom: "14px", textAlign: "center" }}>SELECT TARGET CITY</p>
          <div className="city-btn-group" style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            {CITIES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSelectedCity(key)}
                style={{
                  padding: "8px 18px",
                  fontFamily: "var(--font-hero)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  border: `1.5px solid ${selectedCity === key ? "var(--shield-gold)" : "var(--shield-border)"}`,
                  background: selectedCity === key ? "rgba(245,166,35,0.12)" : "transparent",
                  color: selectedCity === key ? "var(--shield-gold)" : "var(--shield-silver)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>{icon}</div> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sortedData.map((d, rank) => {
            const c = d.cities[selectedCity];
            return (
              <div key={d.career} className="dossier-panel" style={{ padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)", letterSpacing: "0.15em" }}>RANK #{rank + 1}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--font-hero)", fontSize: "1.1rem", color: "var(--shield-white)", letterSpacing: "0.04em" }}>
                      {d.career}
                    </h2>
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--shield-silver)", marginTop: "2px" }}>{d.stream}</p>
                  </div>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)" }}>Entry</div>
                      <div style={{ fontFamily: "var(--font-hero)", fontSize: "1.2rem", color: "var(--shield-gold)" }}>₹{c.entry}L</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--shield-silver)" }}>Senior</div>
                      <div style={{ fontFamily: "var(--font-hero)", fontSize: "1.2rem", color: "#10B981" }}>₹{c.senior}L</div>
                    </div>
                  </div>
                </div>
                <SalaryBar value={c.entry} max={maxSenior} color={d.color} label="ENTRY" />
                <SalaryBar value={c.senior} max={maxSenior} color={d.color} label="SENIOR" />
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: "32px", fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--shield-silver)", letterSpacing: "0.15em", opacity: 0.5 }}>
          DATA FROM INDIAN MARKET INTELLIGENCE · 2024–25 · S.H.I.E.L.D. CLASSIFICATION
        </p>
      </div>
    </div>
  );
}
