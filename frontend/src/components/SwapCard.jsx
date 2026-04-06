import API from "../api/axios";
import toast from "react-hot-toast";

const statusStyles = {
  pending: "bg-orange-500/20 text-orange-400",
  accepted: "bg-green-500/20 text-green-300",
  rejected: "bg-red-500/20 text-red-400",
};

export default function SwapCard({ swap, type = "sent", onUpdate }) {
  const other = type === "sent" ? swap.receiver : swap.sender;
  const initials = other?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleAction = async (status) => {
    try {
      await API.put(`/swaps/${swap._id}`, { status });
      toast.success(`Swap ${status}`);
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="bg-[#141942] rounded-2xl border border-white/5 p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium">{other?.name || "Unknown"}</p>
            <p className="text-[11px] text-gray-500">{other?.email}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[swap.status]}`}>
          {swap.status}
        </span>
      </div>

      {/* Message */}
      {swap.message && (
        <p className="text-xs text-gray-400 italic">"{swap.message}"</p>
      )}

      {/* Skills preview */}
      <div className="flex flex-wrap gap-2 text-xs">
        {other?.skillsOffered?.map((s) => (
          <span key={s} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">{s}</span>
        ))}
        {other?.skillsWanted?.map((s) => (
          <span key={s} className="px-2 py-0.5 rounded bg-green-500/20 text-green-300">{s}</span>
        ))}
      </div>

      {/* Date */}
      <p className="text-[11px] text-gray-600">{new Date(swap.createdAt).toLocaleDateString()}</p>

      {/* Actions for received pending swaps */}
      {type === "received" && swap.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => handleAction("accepted")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-green-500/20 text-green-300 hover:bg-green-500/30 transition"
          >
            ✓ Accept
          </button>
          <button
            onClick={() => handleAction("rejected")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
          >
            ✕ Reject
          </button>
        </div>
      )}
    </div>
  );
}