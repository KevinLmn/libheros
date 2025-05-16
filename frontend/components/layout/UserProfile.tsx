import { useAuth } from "@/contexts/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{user?.name}</span>
        <span className="text-xs text-gray-500">{user?.email}</span>
      </div>
      <button
        onClick={logout}
        className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
      >
        Logout
      </button>
    </div>
  );
}
