import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq matching your existing API pattern
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

export async function POST(req) {
  try {
    if (!groq) {
      return NextResponse.json(
        { error: "Groq API key not configured. Check your .env.local file." },
        { status: 500 }
      );
    }

    const { messages, documentContext, heroId = "iron_man" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
    }

    // Persona logic for immersive hackathon demo
    let persona = "an expert S.H.I.E.L.D. academic mentor";
    const heroIdLower = heroId.toLowerCase();
    
    if (heroIdLower === "iron_man") persona = "J.A.R.V.I.S., the highly intelligent, slightly witty, and deeply analytical AI assisting Tony Stark";
    if (heroIdLower === "black_panther") persona = "Wakandan Royal Intel, highly advanced, deeply respectful, and focused on legacy and strategy";
    if (heroIdLower === "captain_america") persona = "a seasoned tactician from the 1940s brought into the modern age, focusing on honor, discipline, and steady progress";
    if (heroIdLower === "doctor_strange") persona = "the Sorcerer Supreme, speaking with mystical vocabulary about infinite possibilities and the multiverse of knowledge";

    const systemPrompt = `You are ${persona}. You are a digital tutor inside the S.H.I.E.L.D. Career Intelligence system. 
Your objective is to tutor the user exclusively on the material provided below. Do not just give answers; guide them, encourage them, and keep them engaged. 
Maintain your persona (e.g., if you are J.A.R.V.I.S., use phrases like 'Sir' or 'Miss' and sound highly analytical).

Here is the student's study material (Document Context):
"""
${documentContext ? documentContext : "No document provided. Just assist the user with general career queries."}
"""

Instructions:
1. Stay in character 100% of the time.
2. Only answer questions using the provided Document Context.
3. If they ask something outside the context, politely remind them (in character) that this mission protocol only covers the provided materials.
4. Keep your responses concise, readable, and engaging (limit to 3-4 short paragraphs). Use markdown for readability (bullet points, bold text).`;

    const groqMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const completion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I'm unable to process that communication right now.";
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Mentor API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate mentor response." },
      { status: 500 }
    );
  }
}
