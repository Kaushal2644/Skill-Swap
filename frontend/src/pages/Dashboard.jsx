import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

// ── Helpers ──
function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}>★</span>
      ))}
      <span className="text-white font-semibold ml-1">{rating}</span>
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-orange-500/20 text-orange-400",
    accepted: "bg-green-500/20 text-green-300",
    rejected: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}

// ── Activity Chart (SVG) ──
function ActivityChart({ sent, received, history }) {
  // Build monthly data from actual swaps
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleString("default", { month: "short" }), year: d.getFullYear(), month: d.getMonth() });
  }

  const countByMonth = (items, monthIdx, yearIdx) =>
    items.filter((s) => {
      const d = new Date(s.createdAt);
      return d.getMonth() === monthIdx && d.getFullYear() === yearIdx;
    }).length;

  const sentData = months.map((m) => countByMonth(sent, m.month, m.year));
  const receivedData = months.map((m) => countByMonth(received, m.month, m.year));
  const completedData = months.map((m) => countByMonth(history, m.month, m.year));

  const allVals = [...sentData, ...receivedData, ...completedData];
  const max = Math.max(...allVals, 1);
  const w = 660, h = 180, padL = 32, padB = 24, padT = 8;
  const cw = w - padL, ch = h - padB - padT;

  const toPath = (data) =>
    data.map((v, i) => {
      const x = padL + (i / (data.length - 1)) * cw;
      const y = padT + ch - (v / max) * ch;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    }).join(" ");

  const toArea = (data) => {
    const pts = data.map((v, i) => {
      const x = padL + (i / (data.length - 1)) * cw;
      const y = padT + ch - (v / max) * ch;
      return `${x},${y}`;
    });
    return `M${pts.join(" L")} L${padL + cw},${padT + ch} L${padL},${padT + ch} Z`;
  };

  const yTicks = [0, Math.ceil(max / 2), max];

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full h-auto">
        {/* Y gridlines */}
        {yTicks.map((t) => {
          const y = padT + ch - (t / max) * ch;
          return (
            <g key={t}>
              <line x1={padL} x2={w} y1={y} y2={y} stroke="rgba(255,255,255,0.04)" />
              <text x={padL - 6} y={y + 4} textAnchor="end" fill="#4b5563" fontSize="10">{t}</text>
            </g>
          );
        })}
        {/* Areas */}
        <path d={toArea(sentData)} fill="url(#sentGrad)" opacity="0.2" />
        <path d={toArea(receivedData)} fill="url(#recvGrad)" opacity="0.2" />
        <path d={toArea(completedData)} fill="url(#compGrad)" opacity="0.2" />
        {/* Lines */}
        <path d={toPath(sentData)} fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={toPath(receivedData)} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={toPath(completedData)} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {sentData.map((v, i) => (
          <circle key={`s${i}`} cx={padL + (i / (sentData.length - 1)) * cw} cy={padT + ch - (v / max) * ch} r="3" fill="#818cf8" />
        ))}
        {receivedData.map((v, i) => (
          <circle key={`r${i}`} cx={padL + (i / (receivedData.length - 1)) * cw} cy={padT + ch - (v / max) * ch} r="3" fill="#34d399" />
        ))}
        {completedData.map((v, i) => (
          <circle key={`c${i}`} cx={padL + (i / (completedData.length - 1)) * cw} cy={padT + ch - (v / max) * ch} r="3" fill="#f59e0b" />
        ))}
        {/* X labels */}
        {months.map((m, i) => (
          <text key={m.label} x={padL + (i / (months.length - 1)) * cw} y={h + 6} textAnchor="middle" fill="#4b5563" fontSize="10">{m.label}</text>
        ))}
        <defs>
          <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#818cf8" stopOpacity="0" /></linearGradient>
          <linearGradient id="recvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#34d399" stopOpacity="0" /></linearGradient>
          <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0" /></linearGradient>
        </defs>
      </svg>
      <div className="flex items-center gap-5 mt-3 justify-center text-xs text-gray-400">
        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Sent</span>
        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Received</span>
        <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Completed</span>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subtitle, circleColor }) {
  return (
    <div className="relative bg-[#141942] rounded-2xl p-5 border border-white/5 overflow-hidden">
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20 ${circleColor}`} />
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{label}</span>
      </div>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [history, setHistory] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [recRes, sentRes, histRes, usersRes] = await Promise.all([
        API.get("/swaps"),
        API.get("/swaps/sent"),
        API.get("/swaps/history"),
        API.get("/users"),
      ]);
      setReceived(recRes.data);
      setSent(sentRes.data);
      setHistory(histRes.data);
      setUsers(usersRes.data.slice(0, 3));
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSwapAction = async (swapId, status) => {
    try {
      await API.put(`/swaps/${swapId}`, { status });
      toast.success(`Swap ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const pendingReceived = received.filter((s) => s.status === "pending");
  const totalSwaps = history.length;
  const pendingCount = pendingReceived.length;
  const activeCount = [...received, ...sent].filter((s) => s.status === "accepted").length;
  const initials = user?.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (loading) {
    return (
      <div className="min-h-screen flex bg-[#0b0f2a] text-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0b0f2a] text-white">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-[#0b0f2a]/85 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Good morning, {user?.name?.split(" ")[0] || "User"} ✌️
            </h2>
            <p className="text-sm text-gray-400">
              {pendingCount > 0
                ? `You have ${pendingCount} pending request${pendingCount !== 1 ? "s" : ""}`
                : "No pending requests right now"}
            </p>
          </div>
          <button className="relative w-10 h-10 rounded-xl bg-[#141942] border border-white/10 flex items-center justify-center hover:border-indigo-500 transition text-lg">
            🔔
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="⇄" label="Total Swaps" value={totalSwaps} subtitle={totalSwaps > 0 ? "completed" : "Make your first swap"} circleColor="bg-green-400" />
            <StatCard icon="⏳" label="Pending" value={pendingCount} subtitle={pendingCount > 0 ? "awaiting response" : "No requests yet"} circleColor="bg-indigo-500" />
            <StatCard icon="🔥" label="Active Swaps" value={activeCount} subtitle={activeCount > 0 ? "in progress" : "Start swapping"} circleColor="bg-green-400" />
            <StatCard icon="⭐" label="Avg. Rating" value={user?.rating || 0} subtitle={user?.rating ? "from reviews" : "Complete a swap first"} circleColor="bg-yellow-400" />
          </div>

          {/* Profile Card + Activity area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Activity / empty state */}
            <div className="lg:col-span-2 bg-[#141942] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Swap Activity</h3>
                <span className="text-xs text-indigo-400 font-medium">Last 6 months</span>
              </div>
              {history.length === 0 && sent.length === 0 && received.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-5xl mb-4">📈</span>
                  <p className="text-gray-400 text-sm max-w-md">
                    No activity yet. Your swap history chart appears here once you complete your first exchange.
                  </p>
                  <Link to="/browse" className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition">
                    Browse Users
                  </Link>
                </div>
              ) : (
                <ActivityChart sent={sent} received={received} history={history} />
              )}

              {/* Recent activity list */}
              {(sent.length > 0 || received.length > 0) && (
                <div className="mt-5 space-y-3 max-h-48 overflow-y-auto pr-2">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Recent Activity</p>
                  {[...sent, ...received]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((s) => {
                      const isSent = s.sender?._id === user?._id || s.sender === user?._id;
                      const other = isSent ? s.receiver : s.sender;
                      return (
                        <div key={s._id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px] font-bold">
                              {other?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{isSent ? `→ ${other?.name}` : `← ${other?.name}`}</p>
                              <p className="text-[11px] text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <StatusBadge status={s.status} />
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Profile Card */}
            <div className="bg-[#141942] rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
              <h3 className="text-lg font-bold">{user?.name}</h3>
              {user?.bio && <p className="text-sm text-gray-400">📍 {user.bio}</p>}
              <Stars rating={user?.rating || 0} />

              {user?.skillsOfferd?.length > 0 && (
                <div className="w-full text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Offering</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOfferd.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {user?.skillsWanted?.length > 0 && (
                <div className="w-full text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Wanting</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <Link
                to="/profile"
                className="mt-1 w-full py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:bg-white/5 transition flex items-center justify-center gap-2"
              >
                🔧 Edit Profile
              </Link>
            </div>
          </div>

          {/* Bottom 3-col: Incoming Requests · My Sent Swaps · Discover */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Incoming Requests */}
            <div className="bg-[#141942] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Incoming Requests</h3>
                {pendingCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-red-500 text-[11px] font-bold flex items-center justify-center">{pendingCount}</span>
                )}
              </div>
              {received.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">📬</span>
                  <p className="text-sm text-gray-400">No requests yet</p>
                  <Link to="/browse" className="mt-3 inline-block px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition">
                    Browse & Discover
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {received.slice(0, 5).map((r) => (
                    <div key={r._id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                            {r.sender?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{r.sender?.name}</p>
                            <p className="text-[11px] text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                      {r.message && <p className="text-xs text-gray-400 italic">"{r.message}"</p>}
                      {r.sender?.skillsOfferd?.length > 0 && (
                        <div className="flex flex-wrap gap-1 text-xs">
                          {r.sender.skillsOfferd.map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">{sk}</span>
                          ))}
                        </div>
                      )}
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleSwapAction(r._id, "accepted")} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-green-500/20 text-green-300 hover:bg-green-500/30 transition">
                            ✓ Accept
                          </button>
                          <button onClick={() => handleSwapAction(r._id, "rejected")} className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 transition">
                            ✕ Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Sent Swaps */}
            <div className="bg-[#141942] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">My Swaps</h3>
                <Link to="/sent" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View all →</Link>
              </div>
              {sent.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">🚀</span>
                  <p className="text-sm text-gray-400">Your swap journey starts here</p>
                  <Link to="/browse" className="mt-3 inline-block px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition">
                    Discover People
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                  {sent.slice(0, 5).map((s) => (
                    <div key={s._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white">
                            {s.receiver?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{s.receiver?.name}</p>
                            <p className="text-[11px] text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <StatusBadge status={s.status} />
                      </div>
                      {s.message && <p className="text-xs text-gray-400 italic">"{s.message}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discover */}
            <div className="bg-[#141942] rounded-2xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold">Discover</h3>
                <Link to="/browse" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View all →</Link>
              </div>
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl mb-2 block">🌐</span>
                  <p className="text-sm text-gray-400">No users found yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((u) => (
                    <div key={u._id} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {u.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {u.skillsOfferd?.slice(0, 2).map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-gray-400">{sk}</span>
                          ))}
                        </div>
                      </div>
                      <Link to="/browse" className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition shrink-0">
                        Swap
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}