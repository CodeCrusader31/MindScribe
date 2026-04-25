// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const { content } = await req.json();

//     const response = await fetch("http://127.0.0.1:8000/generate-title", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content }),
//     });

//     const data = await response.json();

//     return NextResponse.json(data);

//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to generate title" },
//       { status: 500 }
//     );
//   }
// }

// app/api/ai/title/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("http://localhost:8000/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: body.content }),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("AI title error:", error);
    return NextResponse.json({ success: false, titles: [] }, { status: 500 });
  }
}