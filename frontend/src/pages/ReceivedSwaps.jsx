import { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import SwapCard from "../components/SwapCard";

export default function ReceivedSwaps() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceived = () => {
    setLoading(true);
    API.get("/swaps")
      .then((res) => setSwaps(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReceived();
  }, []);

  const pendingCount = swaps.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen flex bg-[#0b0f2a] text-white">
      <Navbar />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-[#0b0f2a]/85 backdrop-blur-md border-b border-white/5 px-8 py-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Received Requests</h2>
          <p className="text-sm text-gray-400">
            {swaps.length} total · {pendingCount} pending
          </p>
        </header>

        <div className="p-6 lg:p-8">
          {loading ? (
            <p className="text-gray-400 text-center py-20">Loading...</p>
          ) : swaps.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl block mb-4">📬</span>
              <p className="text-gray-400">No swap requests received yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {swaps.map((s) => (
                <SwapCard key={s._id} swap={s} type="received" onUpdate={fetchReceived} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}