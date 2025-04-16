import { NextResponse } from "next/server";
import connectDB from "@/lib/config/db";
import Comment from "@/lib/models/comment";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { slug } = params;

    const comments = await Comment.find({ blogSlug: slug }).sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching comments", error }, { status: 500 });
  }
}
