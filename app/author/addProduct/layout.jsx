'use client';

import { AuthProvider } from "@/context/AuthContext";// Import the Auth context provider

export default function AuthorLayout({ children }) {
  return (
    <AuthProvider>
      <div className="author-layout">
        {/* Your layout design like sidebar or header for authors */}
        <div className="container">{children}</div>
      </div>
    </AuthProvider>
  );
}
