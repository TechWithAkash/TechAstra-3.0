import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  stream: String,
  duration: Number,
  level: { type: String, default: "undergraduate" },
  avgSalaryStart: Number,
  jobDemand: String,
  topColleges: [String],
  entryExams: [String],
  tags: [String],
  avenger: String,
});

CourseSchema.index({ name: "text", tags: "text" });
CourseSchema.index({ stream: 1 });

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
