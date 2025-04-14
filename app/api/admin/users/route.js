import { withRoleAuth } from "@/middleware/roleAuth";
import { NextResponse } from "next/server";

// Handler for admin-only routes
async function handleAdminRequest(req) {
  // Your admin-specific logic here
  return NextResponse.json({ message: "Admin access granted" });
}

// Export with role protection
export const GET = withRoleAuth(handleAdminRequest, "admin");
export const POST = withRoleAuth(handleAdminRequest, "admin");