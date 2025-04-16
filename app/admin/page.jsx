// app/admin/page.jsx (example)
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/auth/login"); // 👈 redirect if not admin
    }
  }, [user]);

  return user?.role === "admin" && (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}
