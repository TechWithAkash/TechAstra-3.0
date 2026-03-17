import { NextResponse } from "next/server";
import { groq, SHIELD_SYSTEM_PROMPT, buildDossierPrompt, sanitizeInput } from "@/lib/groq";

export async function POST(request) {
  try {
    const body = await request.json();
    const { heroId, heroName, course, interests } = body;

    if (!heroId || !heroName || !course) {
      return NextResponse.json({ error: "heroId, heroName, and course are required" }, { status: 400 });
    }

    const cleanCourse = sanitizeInput(course);
    const cleanHeroName = sanitizeInput(heroName);
    const userPrompt = buildDossierPrompt(cleanHeroName, cleanCourse, interests);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SHIELD_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const rawText = completion.choices[0]?.message?.content || "{}";

    try {
      const dossier = JSON.parse(rawText);
      return NextResponse.json(dossier);
    } catch {
      return NextResponse.json({ raw: rawText, parseError: true });
    }
  } catch (err) {
    console.error("[/api/dossier]", err);
    return NextResponse.json(
      { error: "The Infinity Stones are misaligned. Please retry.", detail: err.message },
      { status: 500 }
    );
  }
}
