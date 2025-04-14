import { withRoleAuth } from "@/middleware/roleAuth";
import { NextResponse } from "next/server";

// Handler for author-only routes
async function handleAuthorRequest(req) {
  // Your author-specific logic here
  return NextResponse.json({ message: "Author access granted" });
}

// Export with role protection
export const GET = withRoleAuth(handleAuthorRequest, "author");
export const POST = withRoleAuth(handleAuthorRequest, "author");