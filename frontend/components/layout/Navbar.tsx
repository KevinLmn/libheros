"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full h-16 flex items-center justify-end px-8 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-semibold text-gray-900 text-sm">
            {user?.name}
          </div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg bg-red-50 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
