// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const res = await fetch("http://localhost:8000/summarize", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: body.content }),
//     });

//     const data = await res.json();

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("AI summarize error:", error);
//     return NextResponse.json({ success: false, summary: null }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const servers = [
      process.env.AI_SERVER_URL,                     // preferred env (Render or custom)
      "http://localhost:10000",                     // Docker local
      "http://localhost:8000",                      // Local Python server
    ].filter(Boolean);

    let lastError = null;

    for (const server of servers) {
      try {
        const res = await fetch(`${server}/summarize`, {
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
    console.error("AI summarize error:", error);

    return NextResponse.json(
      {
        success: false,
        summary: null,
        message: "All AI servers are unavailable",
      },
      { status: 500 }
    );
  }
}