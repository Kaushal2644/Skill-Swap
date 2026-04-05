import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import UserCard from "../components/UserCard";

export default function BrowseUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.skillsOfferd?.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      u.skillsWanted?.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex bg-[#0b0f2a] text-white">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0b0f2a]/85 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Discover People</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 pl-9 pr-4 py-2 rounded-xl bg-[#141942] border border-white/10 outline-none text-sm placeholder-gray-500 focus:border-indigo-500 transition"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">🔍</span>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {loading ? (
            <p className="text-gray-400 text-center py-20">Loading users...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="text-gray-400">No users found{search && ` matching "${search}"`}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((u) => (
                <UserCard key={u._id} user={u} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}