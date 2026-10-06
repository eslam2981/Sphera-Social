import { Newspaper, User, Bookmark, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/** Renders the sidebar navigation component. */
export default function Sidebar({ onItemClick, bare = false }: { onItemClick?: () => void; bare?: boolean }) {
  const location = useLocation();
    const navItems = [
      { name: "Feed", icon: Newspaper, path: "/feed" },
      { name: "Friends", icon: Users, path: "/friends" },
      { name: "My Posts", icon: User, path: "/my-posts" },
      { name: "Saved", icon: Bookmark, path: "/saved" },
    ];
  const nav = navItems.map((item) => {
    const isActive = location.pathname === item.path || (item.path === "/feed" && location.pathname === "/");
    const Icon = item.icon;
    return (
      <Link
        key={item.name}
        to={item.path}
        onClick={onItemClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-[15px] ${
          isActive
            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
            : "text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Icon size={19} strokeWidth={isActive ? 2 : 1.5} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-gray-400"} />
        {item.name}
      </Link>
    );
  });

  if (bare) return <nav className="flex flex-col gap-0.5">{nav}</nav>;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-3 sticky top-24">
      <nav className="flex flex-col gap-0.5">{nav}</nav>
    </div>
  );
}