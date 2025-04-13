import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";

export async function POST(req) {
  await ConnectDB();
  const { username, email, password, profession, experiences } = await req.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      profession,
      experiences
    });

    await newUser.save();

    return NextResponse.json({ message: "Registered successfully!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error in registration", error }, { status: 500 });
  }
}
