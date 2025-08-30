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



// import { ConnectDB } from "@/lib/config/db";
// import UserModel from "@/lib/models/UserModel";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await ConnectDB();
    
//     // Get all users (excluding passwords)
//     const users = await UserModel.find({}).select('-password');
    
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error("❌ Error fetching users:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch users" },
//       { status: 500 }
//     );
//   }
// }