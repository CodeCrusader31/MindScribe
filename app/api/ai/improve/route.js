import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8000/improve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: body.content }),
    });

    // We stream the response directly from the Python backend
    // `res.body` is a ReadableStream which Next.js supports sending right back to the client
    return new Response(res.body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error) {
    console.error("AI improve error:", error);
    return NextResponse.json({ success: false, error: "Improvement failed" }, { status: 500 });
  }
}
