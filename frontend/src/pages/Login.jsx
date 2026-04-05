import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0b0f2a] via-[#141942] to-[#0b0f2a] text-white">
      {/* LEFT SECTION */}
      <div className="w-1/2 flex flex-col justify-center px-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center font-bold">
            ↔
          </div>
          <h1 className="text-2xl font-semibold">SkillSwap</h1>
        </div>

        <p className="text-sm tracking-widest text-orange-400 mb-6">
          — SKILL EXCHANGE NETWORK
        </p>

        <h2 className="text-5xl font-bold leading-tight mb-6">
          Trade what <br />
          you <span className="text-green-400">know</span> for <br />
          what you <span className="text-purple-400">want</span>
        </h2>

        <p className="text-gray-400 max-w-md">
          Connect with skilled people worldwide. Offer what you're great at,
          learn what you've always wanted — no money needed, just genuine
          exchange.
        </p>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[420px] p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
          {/* Toggle */}
          <div className="flex mb-8 bg-[#1a1e46] rounded-xl p-1">
            <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold">
              SIGN IN
            </button>

            <Link
              to="/register"
              className="flex-1 py-2 text-center text-gray-400"
            >
              CREATE ACCOUNT
            </Link>
          </div>

          <h2 className="text-3xl font-bold mb-2">Welcome back 👋</h2>
          <p className="text-gray-400 mb-6">
            Sign in to continue swapping skills
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full mt-1 p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">PASSWORD</label>
              <input
                type="password"
                placeholder="********"
                className="w-full mt-1 p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* <div className="text-right text-sm text-purple-400">
              Forgot password?
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "SIGNING IN..." : "SIGN IN →"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-700"></div>
            {/* <span className="px-3">OR CONTINUE WITH</span> */}
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* <button className="w-full py-3 rounded-lg bg-[#1a1e46] hover:bg-[#232864] transition">
            Continue with Google
          </button> */}

          <p className="text-center text-gray-400 mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-400 cursor-pointer">
              Join free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}