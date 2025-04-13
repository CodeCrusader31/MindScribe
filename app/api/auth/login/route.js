import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";
import { generateToken } from "@/lib/generateToken";

export async function POST(req) {
  await ConnectDB();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken(user);

    return NextResponse.json({ token, user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Login failed", error: err }, { status: 500 });
  }
}
