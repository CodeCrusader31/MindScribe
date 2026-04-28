

// // app/api/ai/title/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const res = await fetch("http://localhost:8000/title" || "http://localhost:10000", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: body.content }),
//     });

//     const data = await res.json();

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("AI title error:", error);
//     return NextResponse.json({ success: false, titles: [] }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const servers = [
      process.env.AI_SERVER_URL,        // Render / custom env
      "http://localhost:10000",         // Docker local
      "http://localhost:8000",          // Local Python server
    ].filter(Boolean);

    let lastError = null;

    for (const server of servers) {
      try {
        const res = await fetch(`${server}/title`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: body.content,
          }),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        return NextResponse.json(data);

      } catch (err) {
        console.log(`Failed on ${server}`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error("All AI servers unavailable");

  } catch (error) {
    console.error("AI title error:", error);

    return NextResponse.json(
      {
        success: false,
        titles: [],
        message: "All AI servers are unavailable",
      },
      { status: 500 }
    );
  }
}