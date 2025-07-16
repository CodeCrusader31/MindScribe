//api/comments/route.js
import { NextResponse } from "next/server";
import {ConnectDB} from "@/lib/config/db"; // Make sure you have a MongoDB connection function here
import Comment from "@/lib/models/comment";

export async function POST(req) {
  const { blogSlug, commenter,  text } = await req.json();

  if (!blogSlug || !commenter  || !text) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  await ConnectDB();

  const comment = new Comment({
    blogSlug,
    commenter,
   // commenterId,
    text,
  });

  await comment.save();

  return NextResponse.json({ success: true, comment }, { status: 201 });
}