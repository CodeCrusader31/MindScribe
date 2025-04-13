"use client";

import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-100 shadow-sm">
      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/blog">Blog</Link>

        {user?.role === "author" && (
          <Link 
            href="/author/addProduct" 
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Create Post
          </Link>
        )}

        {user?.role === "admin" && (
          <Link href="/admin">Admin Dashboard</Link>
        )}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;