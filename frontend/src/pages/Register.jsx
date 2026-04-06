import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [availability, setAvailability] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [skillsOffered, setSkillsOffered] = useState("");
  const [skillsWanted, setSkillsWanted] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleAvailability = (value) => {
    if (availability.includes(value)) {
      setAvailability(availability.filter((item) => item !== value));
    } else {
      setAvailability([...availability, value]);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0b0f2a] via-[#141942] to-[#0b0f2a] text-white">
      {/* LEFT HERO SECTION */}
      <div className="w-1/2 flex flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center">
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

      {/* REGISTER FORM */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[420px] p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
          {/* Toggle */}
          <div className="flex mb-8 bg-[#1a1e46] rounded-xl p-1">
            <Link to="/" className="flex-1 py-2 text-center text-gray-400">
              SIGN IN
            </Link>

            <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold">
              CREATE ACCOUNT
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-2">Start swapping today ↔</h2>

          <p className="text-gray-400 mb-6">
            Create your profile – it only takes a minute
          </p>

          {/* FORM */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              try {
                await register({
                  name,
                  email,
                  password,
                  bio: location,
                  skillsOffered: skillsOffered.split(",").map((s) => s.trim()).filter(Boolean),
                  skillsWanted: skillsWanted.split(",").map((s) => s.trim()).filter(Boolean),
                });
                toast.success("Account created! Welcome to SkillSwap 🎉");
                navigate("/dashboard");
              } catch (err) {
                toast.error(err.response?.data?.message || "Registration failed");
              } finally {
                setLoading(false);
              }
            }}
            className="space-y-4"
          >
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              {/* <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xl">
                ?
              </div> */}

              <div>
                {/* <p className="text-sm font-semibold">Profile Photo</p>
                <p className="text-xs text-gray-400">
                  Click to upload • PNG, JPG up to 5MB
                </p>

                <input type="file" accept="image/*" className="mt-1 text-sm" /> */}
              </div>
            </div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
            />

            <input
              type="text"
              placeholder="Location (Optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
            />

            <input
              type="text"
              placeholder="Skills You Offer (comma separated)"
              value={skillsOffered}
              onChange={(e) => setSkillsOffered(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
            />

            <input
              type="text"
              placeholder="Skills You Want (comma separated)"
              value={skillsWanted}
              onChange={(e) => setSkillsWanted(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1a1e46] outline-none focus:border focus:border-purple-500"
            />

            {/* Availability */}
            <div>
              <p className="text-sm text-gray-400 mb-2">Availability</p>

              <div className="flex gap-2 flex-wrap">
                {["Weekdays", "Weekends", "Evenings", "Mornings"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAvailability(item)}
                      className={`px-4 py-2 rounded-lg text-sm transition
        ${
          availability.includes(item)
            ? "bg-purple-500 text-white"
            : "bg-[#1a1e46] text-gray-400"
        }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Profile Visibility */}
            <div className="flex items-center justify-between bg-[#1a1e46] p-4 rounded-xl mt-4">
              <div>
                <p className="font-semibold">
                  {isPublic ? "Public Profile" : "Private Profile"}
                </p>

                <p className="text-sm text-gray-400">
                  {isPublic
                    ? "Anyone can find and send you swap requests"
                    : "Only people you invite can see your profile"}
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  className="sr-only peer"
                />

                <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-purple-500 transition"></div>

                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "CREATING..." : "CREATE MY PROFILE →"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/" className="text-purple-400">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}