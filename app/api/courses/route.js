import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

const COURSES_SEED = [
  { name: "B.Tech Computer Science", shortCode: "btechcs", stream: "Engineering", duration: 4, avenger: "iron_man", entryExams: ["JEE Main", "JEE Advanced"], topColleges: ["IIT Bombay", "IIT Delhi", "NIT Trichy", "BITS Pilani"], tags: ["tech", "software", "data", "engineering"], avgSalaryStart: 800000, jobDemand: "very_high" },
  { name: "MBBS", shortCode: "mbbs", stream: "Medical", duration: 5.5, avenger: "doctor_strange", entryExams: ["NEET"], topColleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER"], tags: ["medical", "doctor", "healthcare", "clinical"], avgSalaryStart: 600000, jobDemand: "high" },
  { name: "B.Com (Bachelor of Commerce)", shortCode: "bcom", stream: "Commerce", duration: 3, avenger: "black_widow", entryExams: ["Class 12 Merit"], topColleges: ["SRCC Delhi", "Loyola Chennai", "Christ University"], tags: ["commerce", "accounts", "finance", "banking"], avgSalaryStart: 350000, jobDemand: "high" },
  { name: "BBA (Bachelor of Business Administration)", shortCode: "bba", stream: "Management", duration: 3, avenger: "black_panther", entryExams: ["IPMAT", "SET", "DU JAT"], topColleges: ["IIM Indore (IPM)", "Christ University", "Symbiosis"], tags: ["business", "management", "mba", "entrepreneurship"], avgSalaryStart: 450000, jobDemand: "high" },
  { name: "B.Sc Data Science", shortCode: "bscds", stream: "Science", duration: 3, avenger: "iron_man", entryExams: ["Class 12 Merit", "JEE Main"], topColleges: ["IIT Madras", "CMI Chennai", "BITS Pilani"], tags: ["data", "analytics", "ml", "ai", "science"], avgSalaryStart: 700000, jobDemand: "very_high" },
  { name: "LLB (Bachelor of Legislative Law)", shortCode: "llb", stream: "Law", duration: 3, avenger: "captain_america", entryExams: ["CLAT", "AILET", "LSAT India"], topColleges: ["NLU Delhi", "NALSAR Hyderabad", "NLU Bangalore"], tags: ["law", "lawyer", "legal", "judiciary", "advocate"], avgSalaryStart: 400000, jobDemand: "moderate" },
  { name: "B.Arch (Bachelor of Architecture)", shortCode: "barch", stream: "Design", duration: 5, avenger: "bruce_banner", entryExams: ["NATA", "JEE Paper 2"], topColleges: ["SPA Delhi", "CEPT Ahmedabad", "IIT Roorkee"], tags: ["architecture", "design", "civil", "urban", "planning"], avgSalaryStart: 400000, jobDemand: "moderate" },
  { name: "B.Tech Mechanical Engineering", shortCode: "btechmech", stream: "Engineering", duration: 4, avenger: "thor", entryExams: ["JEE Main", "JEE Advanced"], topColleges: ["IIT Bombay", "NIT Trichy", "BITS Pilani"], tags: ["mechanical", "engineering", "manufacturing", "automobile"], avgSalaryStart: 550000, jobDemand: "high" },
  { name: "BA Psychology", shortCode: "bapsych", stream: "Arts", duration: 3, avenger: "black_widow", entryExams: ["Class 12 Merit", "CUCET"], topColleges: ["Lady Shri Ram College", "Christ University", "FLAME University"], tags: ["psychology", "mental health", "counselling", "HR", "arts"], avgSalaryStart: 350000, jobDemand: "moderate" },
  { name: "B.Pharm (Bachelor of Pharmacy)", shortCode: "bpharm", stream: "Pharmacy", duration: 4, avenger: "doctor_strange", entryExams: ["NEET", "GPAT", "State CETs"], topColleges: ["Manipal College of Pharmacy", "JSS Mysore", "KLE Belagavi"], tags: ["pharmacy", "drugs", "healthcare", "medical", "research"], avgSalaryStart: 350000, jobDemand: "moderate" },
  { name: "CA (Chartered Accountancy)", shortCode: "ca", stream: "Commerce", duration: 5, avenger: "black_panther", entryExams: ["CA Foundation"], topColleges: ["ICAI affiliated"], tags: ["ca", "accounting", "finance", "audit", "commerce"], avgSalaryStart: 700000, jobDemand: "very_high" },
  { name: "B.Tech Electronics & Communication", shortCode: "btechece", stream: "Engineering", duration: 4, avenger: "iron_man", entryExams: ["JEE Main", "JEE Advanced", "BITSAT"], topColleges: ["IIT Kharagpur", "NIT Warangal", "BITS Pilani"], tags: ["electronics", "embedded", "VLSI", "hardware", "engineering"], avgSalaryStart: 600000, jobDemand: "high" },
  { name: "BSW (Bachelor of Social Work)", shortCode: "bsw", stream: "Arts", duration: 3, avenger: "captain_america", entryExams: ["Class 12 Merit"], topColleges: ["TISS Mumbai", "Delhi University", "Madras University"], tags: ["social work", "NGO", "community", "welfare", "arts"], avgSalaryStart: 280000, jobDemand: "low" },
  { name: "BCA (Bachelor of Computer Applications)", shortCode: "bca", stream: "Technology", duration: 3, avenger: "iron_man", entryExams: ["Class 12 Merit", "University CET"], topColleges: ["Christ University", "Symbiosis", "Amity University"], tags: ["computer", "programming", "software", "applications", "IT"], avgSalaryStart: 450000, jobDemand: "high" },
  { name: "B.Sc Nursing", shortCode: "bscnursing", stream: "Medical", duration: 4, avenger: "captain_america", entryExams: ["NEET", "State Nursing CETs"], topColleges: ["AIIMS", "CMC Vellore", "JIPMER"], tags: ["nursing", "healthcare", "hospital", "patient care", "medical"], avgSalaryStart: 350000, jobDemand: "high" },
  { name: "B.Des (Bachelor of Design)", shortCode: "bdes", stream: "Design", duration: 4, avenger: "black_widow", entryExams: ["NID DAT", "UCEED", "CEED"], topColleges: ["NID Ahmedabad", "IIT Bombay IDC", "MIT Institute of Design"], tags: ["design", "UX", "UI", "graphic", "product", "creative"], avgSalaryStart: 500000, jobDemand: "high" },
  { name: "B.Sc Physics", shortCode: "bscphy", stream: "Science", duration: 3, avenger: "bruce_banner", entryExams: ["IIT JAM", "Class 12 Merit"], topColleges: ["IIT Bombay", "TIFR", "St. Stephen's Delhi"], tags: ["physics", "research", "science", "theoretical", "engineering"], avgSalaryStart: 350000, jobDemand: "moderate" },
  { name: "Mass Communication & Journalism", shortCode: "bjmc", stream: "Media", duration: 3, avenger: "black_widow", entryExams: ["IIMC Entrance", "DUET", "Class 12 Merit"], topColleges: ["IIMC Delhi", "AJK MCRC Jamia", "Symbiosis Pune"], tags: ["journalism", "media", "PR", "advertising", "content"], avgSalaryStart: 350000, jobDemand: "moderate" },
  { name: "B.Tech Civil Engineering", shortCode: "btechcivil", stream: "Engineering", duration: 4, avenger: "captain_america", entryExams: ["JEE Main"], topColleges: ["IIT Bombay", "NIT Trichy", "BITS Pilani"], tags: ["civil", "infrastructure", "construction", "engineering", "government"], avgSalaryStart: 450000, jobDemand: "moderate" },
  { name: "MBA (Master of Business Administration)", shortCode: "mba", stream: "Management", duration: 2, avenger: "black_panther", entryExams: ["CAT", "GMAT", "XAT", "SNAP"], topColleges: ["IIM Ahmedabad", "IIM Bangalore", "ISB Hyderabad"], tags: ["mba", "management", "business", "strategy", "leadership"], avgSalaryStart: 1200000, jobDemand: "very_high" },
];

async function ensureSeeded() {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(COURSES_SEED);
      console.log("[Seed] Courses seeded successfully");
    }
  } catch (err) {
    console.error("[Seed] Error:", err.message);
  }
}

export async function GET(request) {
  try {
    await connectDB();
    await ensureSeeded();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const stream = searchParams.get("stream") || "";

    let query = {};

    if (search && search.length >= 2) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
        { stream: { $regex: search, $options: "i" } },
      ];
    }

    if (stream) query.stream = stream;

    const courses = await Course.find(query)
      .limit(10)
      .select("name shortCode stream duration avenger entryExams topColleges avgSalaryStart jobDemand")
      .lean();

    return NextResponse.json({ courses });
  } catch (err) {
    console.error("[/api/courses]", err);
    return NextResponse.json({ error: "Could not fetch courses", courses: [] }, { status: 500 });
  }
}
