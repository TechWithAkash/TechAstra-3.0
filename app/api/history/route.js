import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Dossier from "@/models/Dossier";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ dossiers: [] });
    }

    const dossiers = await Dossier.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ dossiers });
  } catch (err) {
    console.error("[/api/history]", err);
    return NextResponse.json({ error: "Failed to fetch history", dossiers: [] }, { status: 500 });
  }
}
