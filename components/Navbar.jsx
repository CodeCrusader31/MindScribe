"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { role, setRole } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setRole(null);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 shadow-sm">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>

        {role === "reader" && (
          <span className="text-blue-600">Read Blogs</span>
        )}

        {role === "author" && (
          <Link href="/create-blog">Create Blog</Link>
        )}

        {role === "admin" && (
          <Link href="/admin-dashboard">Admin Dashboard</Link>
        )}
      </div>

      <div className="flex gap-4">
        {!role && (
          <>
            <Link href="/auth/login" className="text-green-600 hover:underline">
              Login
            </Link>
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}

        {role && (
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
