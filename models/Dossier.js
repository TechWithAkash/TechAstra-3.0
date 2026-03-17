import mongoose from "mongoose";

const CareerPathSchema = new mongoose.Schema({
  title: String,
  description: String,
  entryLPA: String,
  seniorLPA: String,
  demandLevel: String,
  topCompanies: [String],
});

const RoadmapStepSchema = new mongoose.Schema({
  phase: String,
  objective: String,
  avenger: String,
});

const SalaryIntelSchema = new mongoose.Schema({
  entry: String,
  senior: String,
});

const DossierSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    heroId: { type: String, required: true },
    heroName: { type: String, required: true },
    course: { type: String, required: true },
    classification: String,
    agentDesignation: String,
    missionBriefing: String,
    careerPaths: [CareerPathSchema],
    criticalSkills: [String],
    certifications: [String],
    roadmap: [RoadmapStepSchema],
    higherStudies: [String],
    salaryIntel: { type: mongoose.Schema.Types.Mixed },
    heroQuote: String,
    threatAssessment: String,
    shared: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Dossier || mongoose.model("Dossier", DossierSchema);
