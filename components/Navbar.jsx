"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  // Prevent flickering or false state
  if (loading) return null;

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Top section with logo and mobile menu */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            MindScribe
          </Link>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Search bar - always visible on desktop, conditionally on mobile */}
        <div className="my-4 md:my-0 md:mx-4 flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs by title or author..."
                className="block w-full pl-4 pr-10 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Navigation links and user info - conditionally shown on mobile */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4`}>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 py-2 md:py-0">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user?.role === "author" && (
              <>
                <Link
                  href="/author/addProduct"
                  className="text-green-700 hover:text-white hover:bg-green-600 transition-colors px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Post
                </Link>
                <Link
                  href="/author"
                  className="text-green-700 hover:text-white hover:bg-green-600 transition-colors px-3 py-2 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-red-700 hover:text-white hover:bg-red-600 transition-colors px-3 py-2 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2 md:border-t-0 md:pt-0">
            {user ? (
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-gray-700 px-3 py-2">Welcome, {user.username}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:bg-red-100 transition-colors px-3 py-2 rounded-md text-left md:text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <Link 
                  href="/auth/login" 
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors px-4 py-2 rounded-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-green-600 text-white hover:bg-green-700 transition-colors px-4 py-2 rounded-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;