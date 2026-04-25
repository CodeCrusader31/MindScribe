import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: body.content }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI summarize error:", error);
    return NextResponse.json({ success: false, summary: null }, { status: 500 });
  }
}
