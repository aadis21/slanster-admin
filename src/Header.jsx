import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    alert("Logged out successfully!");
  };

  const initial = (user?.name || "U").charAt(0).toUpperCase();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 text-white backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.4)]">
        {/* Top accent */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <a href="/" className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <span className="text-lg font-bold">S</span>
              </span>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                Slanster Dashboard
              </h1>
            </a>

            {/* Right Nav */}
            <nav className="flex items-center gap-4 sm:gap-6">
              <a
                href="/"
                className="hidden sm:inline-block text-sm text-slate-200 hover:text-white transition"
              >
                Home
              </a>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 ring-1 ring-white/10 transition"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {initial}
                  </span>
                  <span className="hidden sm:flex flex-col items-start leading-4">
                    <span className="text-xs text-slate-300">Signed in as</span>
                    <span className="text-sm font-medium">
                      {user?.name || "User"}
                    </span>
                  </span>
                  <svg
                    className={`ml-1 h-4 w-4 transition ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.53a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-xs text-slate-500">Signed in</p>
                      <p className="text-sm font-medium truncate">
                        {user?.email || "N/A"}
                      </p>
                    </div>
                    <button
                      className="block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50"
                      onClick={() => {
                        setModalOpen(true);
                        setDropdownOpen(false);
                      }}
                    >
                      View Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur">
          <div className="relative w-11/12 max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal accent */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500" />
            <button
              className="absolute right-3 top-3 rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>

            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                  {initial}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {user?.name || "N/A"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {user?.role || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Email
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {user?.email || "N/A"}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Joined
                  </div>
                  <div className="text-sm font-medium text-slate-800">
                    {user?.joined || "N/A"}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
