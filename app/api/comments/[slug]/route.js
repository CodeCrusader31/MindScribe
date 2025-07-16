// app/api/comments/[slug]/route.js
import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import Comment from "@/lib/models/comment";

// GET /api/comments/[slug]
export async function GET(request, { params }) {
    try {
      await ConnectDB();
  
      const slug = params?.slug;
  
      if (!slug) {
        return NextResponse.json({ error: "Missing blog slug" }, { status: 400 });
      }
  
      const comments = await Comment.find({ blogSlug: slug }).sort({ createdAt: -1 });
  
      return NextResponse.json(comments, { status: 200 });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
  }