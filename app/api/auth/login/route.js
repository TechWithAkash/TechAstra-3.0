import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "shield-hackathon-secret-key-2026";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

    // Find user — explicitly select password (it has select:false)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const valid = await user.comparePassword(password);
    if (!valid)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = jwt.sign(
      { userId: user._id.toString(), name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });

  } catch (err) {
    console.error("[/api/auth/login]", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
