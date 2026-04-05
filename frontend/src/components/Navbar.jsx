import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { path: "/dashboard", label: "Dashboard", icon: "⊙" },
  { path: "/browse", label: "Discover", icon: "◎" },
  { path: "/sent", label: "Sent", icon: "↗" },
  { path: "/received", label: "Received", icon: "↙" },
  { path: "/history", label: "History", icon: "☰" },
  { path: "/chat", label: "Chat", icon: "✉" },
  { path: "/profile", label: "Profile", icon: "●" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="w-[72px] shrink-0 border-r border-white/5 flex flex-col items-center py-5 gap-2 sticky top-0 h-screen bg-[#0b0f2a]">
      {/* Logo */}
      <Link to="/dashboard">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
      </Link>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 w-full px-2">
        {navLinks.map((link) => {
          const active = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path}>
              <div className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl cursor-pointer transition text-[11px] font-medium ${
                active ? "bg-indigo-500/15 text-indigo-400" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}>
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="mt-auto flex flex-col items-center gap-3 px-2">
        {user && (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <button
          onClick={logout}
          className="text-gray-500 hover:text-red-400 transition text-[11px] font-medium flex flex-col items-center gap-1"
        >
          <span className="text-lg">⏻</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}