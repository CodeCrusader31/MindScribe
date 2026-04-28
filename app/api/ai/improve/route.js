// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const res = await fetch("http://localhost:8000/improve", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ content: body.content }),
//     });

//     // We stream the response directly from the Python backend
//     // `res.body` is a ReadableStream which Next.js supports sending right back to the client
//     return new Response(res.body, {
//       headers: {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Cache-Control": "no-cache",
//       },
//     });

//   } catch (error) {
//     console.error("AI improve error:", error);
//     return NextResponse.json({ success: false, error: "Improvement failed" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const servers = [
      process.env.AI_SERVER_URL,        // Render / custom
      "http://localhost:10000",         // Docker local
      "http://localhost:8000",          // Local Python server
    ].filter(Boolean);

    let lastError = null;

    for (const server of servers) {
      try {
        const res = await fetch(`${server}/improve`, {
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

        return new Response(res.body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      } catch (err) {
        console.log(`Failed on ${server}`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error("All AI servers unavailable");

  } catch (error) {
    console.error("AI improve error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "All AI servers are unavailable",
      },
      { status: 500 }
    );
  }
}