import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "shield-hackathon-secret-key-2026";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    // Check existing user
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

    // Create user (password hashed by pre-save hook)
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password });

    // Issue JWT
    const token = jwt.sign(
      { userId: user._id.toString(), name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    }, { status: 201 });

  } catch (err) {
    console.error("[/api/auth/signup] FULL ERROR:", err.message, err.stack);
    return NextResponse.json(
      { error: "Registration failed. Please try again.", detail: err.message },
      { status: 500 }
    );
  }
}
