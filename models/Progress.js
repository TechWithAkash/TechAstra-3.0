import mongoose from "mongoose";

const ModuleProgressSchema = new mongoose.Schema({
  moduleIndex: Number,
  topic: String,
  completedAt: { type: Date, default: Date.now },
});

const ProgressSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    course: { type: String, required: true },
    heroId: { type: String },
    level: { type: String, default: "beginner" },
    timelineMonths: { type: Number, default: 6 },
    weeklyHours: { type: Number, default: 10 },
    completedModules: [ModuleProgressSchema],
    streakDays: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: Date.now },
    dnaScore: { type: Number, default: 0 },
    dnaComponents: {
      technical: { type: Number, default: 0 },
      soft: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      marketAlignment: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

ProgressSchema.index({ sessionId: 1, course: 1 }, { unique: true });

export default mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
