import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "budget", label: "Budget", icon: Wallet },
  { id: "settings", label: "Settings", icon: Settings },
];

// Sidebar props:
// - page / setPage       -> current active page + setter
// - collapsed / onToggle -> desktop collapse (icon-only) state
// - mobileOpen / onCloseMobile -> off-canvas drawer state for small screens
export const Sidebar = ({ page, setPage, collapsed, onToggle, mobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col h-screen
          bg-white  border-r border-slate-200 
          transition-all duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20 w-72" : "w-72 lg:w-[260px]"}
        `}
      >
        {/* Logo */}
        {/* CHANGES: Added dark mode border class */}
        <div className="relative flex items-center h-16 px-5 border-b border-slate-200  flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white text-base">
            💰
          </div>

          {(!collapsed || mobileOpen) && (
            /* CHANGES: Added dark mode text color class */
            <h1 className="ml-3 text-xl font-semibold tracking-tight text-slate-900  truncate">
              FinTrack
            </h1>
          )}

          {/* Desktop collapse toggle */}
          {/* CHANGES: Added dark mode text and hover bg classes */}
          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex ml-auto items-center justify-center w-7 h-7 rounded-lg text-slate-400  hover:text-slate-700  hover:bg-slate-100  transition flex-shrink-0"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>

          {/* Mobile close */}
          {/* CHANGES: Added dark mode hover bg class */}
          <button
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="lg:hidden ml-auto flex items-center justify-center w-8 h-8 rounded-lg text-slate-400  hover:text-slate-700  hover:bg-slate-100  transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            const showLabel = !collapsed || mobileOpen;

            return (
              /* 
                CHANGES:
                - Active item uses dark mode bg/text color classes (/40, ).
                - Inactive items use dark mode hover background and text classes.
              */
              <button
                key={item.id}
                onClick={() => {
                  setPage(item.id);
                  onCloseMobile?.();
                }}
                title={collapsed && !mobileOpen ? item.label : undefined}
                className={`
                  w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5
                  text-sm font-medium transition-colors duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                  ${!showLabel ? "justify-center" : ""}
                  ${
                    active
                      ? "bg-emerald-50  text-emerald-700  border border-emerald-100/10"
                      : "text-slate-500  hover:bg-slate-100  hover:text-slate-700 "
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                {showLabel && <span className="truncate">{item.label}</span>}
                {showLabel && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-slate-200  px-4 py-4 flex-shrink-0">
          <div className={`flex items-center ${collapsed && !mobileOpen ? "justify-center" : "gap-3"}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.displayName
                ? user.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : user?.email?.charAt(0).toUpperCase()}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900  truncate">
                  {user?.displayName || "Name"}
                </p>
                <p className="text-xs text-slate-500  truncate">
                  {user?.email || ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

// Demo shell — shows the sidebar working with collapse + mobile drawer.
export default function SidebarDemo() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        page={page}
        setPage={setPage}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <header className="h-16 flex items-center gap-3 px-4 lg:px-6 border-b border-slate-200 bg-white">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-slate-900 capitalize">{page}</h2>
        </header>

        <main className="p-4 lg:p-8">
          <div className="rounded-2xl border border-dashed border-slate-300 h-[60vh] flex items-center justify-center text-slate-400 text-sm">
            {page} content goes here
          </div>
        </main>
      </div>
    </div>
  );
}
