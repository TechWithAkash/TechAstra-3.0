import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Dossier from "@/models/Dossier";

export async function POST(request) {
  try {
    await connectDB();
    const { sessionId, dossier, heroId, heroName, course } = await request.json();

    if (!sessionId || !dossier) {
      return NextResponse.json({ error: "sessionId and dossier are required" }, { status: 400 });
    }

    const saved = await Dossier.findOneAndUpdate(
      { sessionId, course, heroId },
      { ...dossier, sessionId, heroId, heroName, course },
      { upsert: true, new: true, runValidators: false }
    );

    return NextResponse.json({ saved: true, id: saved._id.toString() });
  } catch (err) {
    console.error("[/api/save]", err);
    return NextResponse.json({ error: "Failed to save dossier" }, { status: 500 });
  }
}
