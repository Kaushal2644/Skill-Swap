import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skillsOffered, setSkillsOffered] = useState(
    user?.skillsOffered?.join(", ") || ""
  );
  const [skillsWanted, setSkillsWanted] = useState(
    user?.skillsWanted?.join(", ") || ""
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put("/users/profile", {
        name,
        bio,
        skillsOffered: skillsOffered
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skillsWanted: skillsWanted
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      updateUser(res.data.user);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0b0f2a] text-white">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0b0f2a]/85 backdrop-blur-md border-b border-white/5 px-8 py-4">
          <h2 className="text-2xl font-extrabold tracking-tight">
            My Profile
          </h2>
          <p className="text-sm text-gray-400">
            Update your information and skills
          </p>
        </header>

        <div className="p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: Profile Preview Card ── */}
            <div className="bg-[#141942] rounded-2xl border border-white/5 p-8 flex flex-col items-center text-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-3xl font-bold">
                {initials}
              </div>

              <div>
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-sm text-gray-400">{user?.email}</p>
                {user?.bio && (
                  <p className="text-sm text-gray-400 mt-1">📍 {user.bio}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={
                      i <= Math.round(user?.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }
                  >
                    ★
                  </span>
                ))}
                <span className="text-sm font-semibold ml-1">
                  {user?.rating || 0}
                </span>
              </div>

              {/* Skills Offered */}
              {user?.skillsOffered?.length > 0 && (
                <div className="w-full text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Offering
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Wanted */}
              {user?.skillsWanted?.length > 0 && (
                <div className="w-full text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                    Wanting
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Account info */}
              <div className="w-full text-left mt-2 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Role</span>
                  <span className="capitalize text-gray-300">
                    {user?.role || "user"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Joined</span>
                  <span className="text-gray-300">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Right: Edit Form ── */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="bg-[#141942] rounded-2xl border border-white/5 p-6 space-y-5">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full p-3 rounded-xl bg-[#0b0f2a] border border-white/10 outline-none text-sm focus:border-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                      Location / Bio
                    </label>
                    <input
                      type="text"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="e.g. New York, USA"
                      className="w-full p-3 rounded-xl bg-[#0b0f2a] border border-white/10 outline-none text-sm placeholder-gray-600 focus:border-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-[#141942] rounded-2xl border border-white/5 p-6 space-y-5">
                  <h3 className="text-lg font-semibold">Skills</h3>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                      Skills You Offer
                      <span className="text-gray-600 normal-case ml-1">
                        (comma separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={skillsOffered}
                      onChange={(e) => setSkillsOffered(e.target.value)}
                      placeholder="e.g. React, Node.js, UI Design"
                      className="w-full p-3 rounded-xl bg-[#0b0f2a] border border-white/10 outline-none text-sm placeholder-gray-600 focus:border-indigo-500 transition"
                    />
                    {skillsOffered && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skillsOffered
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            >
                              {s}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">
                      Skills You Want
                      <span className="text-gray-600 normal-case ml-1">
                        (comma separated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={skillsWanted}
                      onChange={(e) => setSkillsWanted(e.target.value)}
                      placeholder="e.g. Python, Machine Learning"
                      className="w-full p-3 rounded-xl bg-[#0b0f2a] border border-white/10 outline-none text-sm placeholder-gray-600 focus:border-indigo-500 transition"
                    />
                    {skillsWanted && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {skillsWanted
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((s) => (
                            <span
                              key={s}
                              className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30"
                            >
                              {s}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Save */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}