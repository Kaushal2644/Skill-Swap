import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider, { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrowseUsers from "./pages/BrowseUsers";
import SentSwaps from "./pages/SentSwaps";
import ReceivedSwaps from "./pages/ReceivedSwaps";
import SwapHistory from "./pages/SwapHistory";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";

function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b0f2a] text-white">Loading...</div>;
  return token ? children : <Navigate to="/" replace />;
}

function GuestRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b0f2a] text-white">Loading...</div>;
  return token ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: "#141942", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }} />
        <Routes>
          <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseUsers /></ProtectedRoute>} />
          <Route path="/sent" element={<ProtectedRoute><SentSwaps /></ProtectedRoute>} />
          <Route path="/received" element={<ProtectedRoute><ReceivedSwaps /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><SwapHistory /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;