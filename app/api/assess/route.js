import { NextResponse } from "next/server";
import { calculateHero } from "@/lib/heroAssignment";

export async function POST(request) {
  try {
    const { answers } = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    const result = calculateHero(answers);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/assess]", err);
    return NextResponse.json({ error: "Assessment failed" }, { status: 500 });
  }
}
