import { useAuth } from '@/context/AuthContext';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <h2 className="text-xl font-semibold text-gray-800">Workspace</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-200 font-medium">
          <UserIcon className="w-4 h-4" /> 
          {/* Fallback to email just in case, but prefer username */}
          {user?.username || user?.email}
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
}