"use client";

import { useAuth } from "@/context/AuthContext";

export function useRole() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isAuthor = user?.role === "author" || isAdmin;
  const isReader = Boolean(user?.role);

  return {
    isAdmin,
    isAuthor,
    isReader,
    role: user?.role,
    
    // Check if user has required role
    hasRole: (requiredRole) => {
      const roles = {
        admin: ["admin"],
        author: ["admin", "author"],
        reader: ["admin", "author", "reader"]
      };
      
      return roles[requiredRole]?.includes(user?.role) || false;
    }
  };
}