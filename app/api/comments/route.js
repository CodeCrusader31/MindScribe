//api/comments/route.js
import { NextResponse } from "next/server";
import {ConnectDB} from "@/lib/config/db"; // Make sure you have a MongoDB connection function here
import Comment from "@/lib/models/comment";

export async function POST(req) {
  try {
    await ConnectDB();
    const { blogSlug, commenter, commenterId, text } = await req.json();

    if (!blogSlug || !commenter || !commenterId || !text) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const newComment = new Comment({
      blogSlug,
      commenter,
      commenterId,
      text,
    });

    await newComment.save();

    return NextResponse.json({ success: true, message: "Comment added" });
  } catch (error) {
    console.error("Error while saving comment:", error); // Add this
    return NextResponse.json({ success: false, message: "Error adding comment", error });
  }
}
