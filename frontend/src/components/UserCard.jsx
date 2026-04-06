import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function UserCard({ user }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSwapRequest = async () => {
    setSending(true);
    try {
      await API.post("/swaps", { receiverId: user._id, message: "I'd like to swap skills with you!" });
      toast.success("Swap request sent!");
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const initials = user.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  return (
    <div className="bg-[#141942] rounded-2xl border border-white/5 p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{user.name}</h3>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Skills Offered */}
      {user.skillsOffered?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Offering</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsOffered.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-full text-[11px] bg-purple-500/20 text-purple-300 border border-purple-500/30">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Skills Wanted */}
      {user.skillsWanted?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Wanting</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skillsWanted.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-full text-[11px] bg-green-500/20 text-green-300 border border-green-500/30">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto flex gap-2">
        <button
          onClick={handleSwapRequest}
          disabled={sending || sent}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
            sent
              ? "bg-green-500/20 text-green-300 cursor-default"
              : "bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
          } disabled:opacity-60`}
        >
          {sent ? "✓ Sent" : sending ? "Sending..." : "Swap Request"}
        </button>
        <Link
          to={`/chat?with=${user._id}`}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition flex items-center gap-1.5"
        >
          💬
        </Link>
      </div>
    </div>
  );
}