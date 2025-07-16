// app/api/users/route.js

import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import User from "@/lib/models/User";

export async function GET(req) {
  try {
    await ConnectDB();

    const users = await User.find({}, "-password").sort({ createdAt: -1 }); // Exclude passwords and sort by newest

    return NextResponse.json({
      success: true,
      users,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch users",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
