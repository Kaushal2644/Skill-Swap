import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

export default function Chat() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeUserId = searchParams.get("with");

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch conversation list
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await API.get("/chat");
      setConversations(res.data);
    } catch {
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConvos(false);
    }
  };

  // When activeUserId changes, load that conversation
  useEffect(() => {
    if (!activeUserId) {
      setMessages([]);
      setActiveUser(null);
      return;
    }
    loadConversation(activeUserId);

    // Poll for new messages every 4s
    pollRef.current = setInterval(() => {
      loadConversation(activeUserId, true);
    }, 4000);

    return () => clearInterval(pollRef.current);
  }, [activeUserId]);

  const loadConversation = async (userId, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await API.get(`/chat/${userId}`);
      setMessages(res.data);

      // Derive active user from messages or conversations
      if (res.data.length > 0) {
        const msg = res.data[0];
        const other = msg.sender._id === user._id ? msg.receiver : msg.sender;
        setActiveUser(other);
      } else {
        // Fetch user info if no messages yet
        const convo = conversations.find((c) => c.user?._id === userId);
        if (convo) {
          setActiveUser(convo.user);
        } else {
          try {
            const uRes = await API.get(`/users/${userId}`);
            setActiveUser(uRes.data);
          } catch {
            setActiveUser({ _id: userId, name: "User" });
          }
        }
      }

      // Refresh unread counts
      if (!silent) fetchConversations();
    } catch {
      if (!silent) toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUserId || sending) return;

    setSending(true);
    try {
      const res = await API.post(`/chat/${activeUserId}`, { text: text.trim() });
      setMessages((prev) => [...prev, res.data]);
      setText("");
      fetchConversations();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const openChat = (userId) => {
    setSearchParams({ with: userId });
  };

  const filteredConversations = conversations.filter((c) =>
    c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  return (
    <div className="flex min-h-screen bg-[#0b0f2a] text-white">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row h-screen overflow-hidden">
        {/* ─── Sidebar: Conversation List ─── */}
        <div className={`w-full lg:w-80 xl:w-96 border-r border-white/5 flex flex-col bg-[#0b0f2a] shrink-0 ${activeUserId ? "hidden lg:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-5 border-b border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Messages</h2>
              {totalUnread > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {totalUnread}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50"
              />
              <svg className="absolute right-3 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {loadingConvos ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <span className="text-5xl mb-4">💬</span>
                <p className="text-gray-400 text-sm mb-1">No conversations yet</p>
                <p className="text-gray-500 text-xs mb-4">Start chatting by visiting a user's profile or browsing users.</p>
                <Link to="/browse" className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 transition">
                  Browse Users
                </Link>
              </div>
            ) : (
              filteredConversations.map((convo) => {
                const isActive = convo.user?._id === activeUserId;
                const isOwnMessage = convo.lastSender?.toString() === user?._id;
                return (
                  <button
                    key={convo.user?._id}
                    onClick={() => openChat(convo.user?._id)}
                    className={`w-full flex items-center gap-3 px-5 py-4 text-left transition border-b border-white/[0.03] ${
                      isActive ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
                      {convo.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{convo.user?.name}</p>
                        <span className="text-[10px] text-gray-500 shrink-0 ml-2">{formatTime(convo.lastMessageAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {isOwnMessage ? "You: " : ""}{convo.lastMessage}
                      </p>
                    </div>
                    {convo.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-[10px] flex items-center justify-center font-bold shrink-0">
                        {convo.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ─── Chat Area ─── */}
        <div className={`flex-1 flex flex-col ${!activeUserId ? "hidden lg:flex" : "flex"}`}>
          {!activeUserId ? (
            /* No conversation selected */
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Your Messages</h3>
              <p className="text-gray-400 text-sm max-w-sm">Select a conversation or start a new chat from the Browse Users page.</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 bg-[#0b0f2a]/80 backdrop-blur-md">
                <button
                  onClick={() => setSearchParams({})}
                  className="lg:hidden text-gray-400 hover:text-white mr-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-bold shrink-0">
                  {activeUser?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{activeUser?.name || "Loading..."}</p>
                  <p className="text-[11px] text-gray-500">{activeUser?.email || ""}</p>
                </div>
                <Link
                  to={`/browse`}
                  className="text-xs text-gray-500 hover:text-indigo-400 transition"
                >
                  View Profile
                </Link>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="text-4xl mb-3">👋</span>
                    <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => {
                      const isMine = msg.sender?._id === user?._id;
                      const showDate = idx === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[idx - 1].createdAt).toDateString();

                      return (
                        <div key={msg._id}>
                          {showDate && (
                            <div className="flex items-center justify-center my-4">
                              <span className="text-[10px] text-gray-600 bg-white/5 px-3 py-1 rounded-full">
                                {new Date(msg.createdAt).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                              </span>
                            </div>
                          )}
                          <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1.5`}>
                            <div
                              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isMine
                                  ? "bg-indigo-500 text-white rounded-br-md"
                                  : "bg-white/[0.07] text-gray-200 rounded-bl-md"
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                              <p className={`text-[10px] mt-1 ${isMine ? "text-indigo-200" : "text-gray-500"}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-[#0b0f2a]/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    maxLength={2000}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 transition"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim() || sending}
                    className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center hover:opacity-90 transition disabled:opacity-40"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
