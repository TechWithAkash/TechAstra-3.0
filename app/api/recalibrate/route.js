import { NextResponse } from "next/server";
import { groq, SHIELD_SYSTEM_PROMPT, buildRecalibratePrompt, sanitizeInput } from "@/lib/groq";

export async function POST(request) {
  try {
    const body = await request.json();
    const { heroName, course, pace, completedTopics, profile } = body;

    if (!heroName || !course || !pace) {
      return NextResponse.json({ error: "heroName, course, and pace are required" }, { status: 400 });
    }

    const cleanCourse = sanitizeInput(course);
    const cleanHeroName = sanitizeInput(heroName);
    const userPrompt = buildRecalibratePrompt(
      cleanHeroName,
      cleanCourse,
      pace,
      completedTopics || [],
      profile || {}
    );

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SHIELD_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0]?.message?.content || "{}";

    try {
      const recalibratedDossier = JSON.parse(rawText);
      return NextResponse.json({ success: true, dossier: recalibratedDossier });
    } catch {
      return NextResponse.json({ raw: rawText, parseError: true });
    }
  } catch (err) {
    console.error("[/api/recalibrate]", err);
    return NextResponse.json(
      { error: "Recalibration failed. S.H.I.E.L.D. systems offline.", detail: err.message },
      { status: 500 }
    );
  }
}
