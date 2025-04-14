import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Role hierarchy
const roleHierarchy = {
  admin: 3,
  author: 2,
  reader: 1
};

export function getRoleLevel(role) {
  return roleHierarchy[role] || 0;
}

export async function roleCheck(request, requiredRole) {
  try {
    const token = request.cookies.get("token")?.value;
    
    if (!token) {
      return {
        success: false,
        error: "Authentication required",
        status: 401
      };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRole = decoded.role;

    // Check if user's role level is sufficient
    if (getRoleLevel(userRole) < getRoleLevel(requiredRole)) {
      return {
        success: false,
        error: "Insufficient privileges",
        status: 403
      };
    }

    return {
      success: true,
      user: decoded
    };

  } catch (error) {
    return {
      success: false,
      error: "Invalid token",
      status: 401
    };
  }
}

// Middleware creator for role-based routes
export function withRoleAuth(handler, requiredRole) {
  return async function(request) {
    const result = await roleCheck(request, requiredRole);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }
    
    // Add user info to request
    request.user = result.user;
    return handler(request);
  };
}