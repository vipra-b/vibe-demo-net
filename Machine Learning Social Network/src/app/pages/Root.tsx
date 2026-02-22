import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { Home, Search, User, Users, Play } from "lucide-react";

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Review & Connect", path: "/" },
    { icon: Search, label: "Browse", path: "/browse" },
    { icon: Users, label: "Connections", path: "/connections" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Play className="w-8 h-8 text-red-600 fill-red-600" />
            <h1 className="text-2xl font-bold text-red-600">Netflix Social</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "text-white bg-zinc-800"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800 md:hidden">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-3 py-1 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
