"use client";

import { useRole } from "@/hooks/useRole";

export function RoleGuard({ children, requiredRole }) {
  const { hasRole } = useRole();
  
  if (!hasRole(requiredRole)) {
    return null; // Or return an "Access Denied" component
  }
  
  return children;
}