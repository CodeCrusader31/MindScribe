import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";

export async function POST(req) {
  try {
    await ConnectDB();

    const { 
      username, 
      email, 
      password,
      role,
      profession, 
      experiences 
    } = await req.json();

    // Properly process experiences array
    let processedExperiences;
    if (typeof experiences === 'string') {
      // If it's a string, split by commas
      processedExperiences = experiences.split(',').map(exp => exp.trim()).filter(Boolean);
    } else if (Array.isArray(experiences)) {
      // If it's already an array, just clean it
      processedExperiences = experiences.map(exp => exp.trim()).filter(Boolean);
    } else {
      // Default to empty array if invalid
      processedExperiences = [];
    }

    // Create new user with properly processed experiences
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: role || "reader",
      profession: profession || "",
      experiences: processedExperiences // Using the processed array
    });

    await newUser.save();

    // Return success without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({
      success: false,
      message: "Error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}