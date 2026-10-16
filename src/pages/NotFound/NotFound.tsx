import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Home, 
  ArrowLeft, 
  Search, 
  Users, 
  Bell, 
  User as UserIcon, 
  Link2Off, 
  Moon, 
  Sun,
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal
} from "lucide-react";
import { ThemeContext } from "../../contexts/ThemeContext";
import spheraIconDark from "../../assets/sphera-icon.svg";
import spheraIconLight from "../../assets/sphera-icon-light.svg";

export default function NotFound() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("user_token") : null;
  const homePath = token ? "/feed" : "/auth/login";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(token ? `/feed` : `/auth/login`);
    }
  };

  const quickLinks = [
    { label: "Newsfeed", path: token ? "/feed" : "/auth/login", icon: Home },
    { label: "Find Friends", path: token ? "/friends" : "/auth/login", icon: Users },
    { label: "Notifications", path: token ? "/notification" : "/auth/login", icon: Bell },
    { label: "My Profile", path: token ? "/profile" : "/auth/login", icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-[#00298D]/20 selection:text-[#00298D] dark:selection:bg-blue-500/30 dark:selection:text-blue-300 transition-colors duration-200">
      
      {/* ── Top Brand Header ── */}
      <header className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/80 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={homePath} className="flex items-center gap-2.5 group cursor-pointer">
            <img 
              src={spheraIconLight} 
              alt="Sphera Logo" 
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105 block dark:hidden" 
            />
            <img 
              src={spheraIconDark} 
              alt="Sphera Logo" 
              className="w-8 h-8 object-contain transition-transform group-hover:scale-105 hidden dark:block" 
            />
            <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight">
              <span className="text-slate-900 dark:text-white font-black">Sphera</span>
              <span className="text-[#00298D] dark:text-blue-400">Social</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              to={homePath}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-[#00298D] hover:bg-[#002275] text-white shadow-sm transition-all"
            >
              <Home size={16} />
              <span>{token ? "Go to Feed" : "Sign In"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center">
        
        {/* Animated Badge & Status */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-[#00298D] dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#00298D] dark:bg-blue-400 animate-pulse" />
          <span>Error 404 • Page Not Found</span>
        </motion.div>

        {/* ── The Authentic Social Post Mockup (Simulating an unavailable social post) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="w-full max-w-xl lg:max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden mb-8"
        >
          {/* Post Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Link2Off size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-md" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">• Just now</span>
                </div>
                <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded-md mt-1.5" />
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Post Body (Unavailable content message box) */}
          <div className="p-6 sm:p-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#00298D] dark:text-blue-400 flex items-center justify-center mb-5 ring-8 ring-blue-50/50 dark:ring-blue-900/10">
              <Link2Off size={30} strokeWidth={2.2} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
              This content isn't available right now
            </h1>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-6 max-w-lg mx-auto">
              When this happens, it's usually because the author deleted the post, changed their privacy settings, or the link you followed was incorrect.
            </p>

            <div className="py-2.5 px-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-700/80 inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>sphera.social{window.location.pathname}</span>
            </div>
          </div>

          {/* Post Footer Mockup */}
          <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-around text-slate-400 dark:text-slate-500 text-sm">
            <span className="flex items-center gap-2 opacity-60">
              <Heart size={16} /> 0 Likes
            </span>
            <span className="flex items-center gap-2 opacity-60">
              <MessageSquare size={16} /> 0 Comments
            </span>
            <span className="flex items-center gap-2 opacity-60">
              <Share2 size={16} /> Share
            </span>
          </div>
        </motion.div>

        {/* ── Search Bar ── */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onSubmit={handleSearch}
          className="w-full max-w-xl lg:max-w-2xl mb-6 relative"
        >
          <div className="relative flex items-center">
            <Search size={19} className="absolute left-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Sphera Social or enter a keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm sm:text-base placeholder:text-slate-400 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00298D] dark:focus:ring-blue-500 transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#00298D] hover:bg-[#002275] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* ── Action Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3.5 mb-8 w-full max-w-xl lg:max-w-2xl"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-sm sm:text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>

          <Link
            to={homePath}
            className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00298D] hover:bg-[#002275] text-white text-sm sm:text-base font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Home size={18} />
            <span>{token ? "Return to Feed" : "Go to Sign In"}</span>
          </Link>
        </motion.div>

        {/* ── Popular Destinations (Quick Chips) ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-full max-w-xl lg:max-w-2xl text-center"
        >
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3.5">
            Quick Navigation
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-[#00298D]/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all text-slate-700 dark:text-slate-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 group-hover:text-[#00298D] dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>

      </main>

      {/* ── Footer ── */}
      <footer className="w-full py-5 border-t border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>© 2026 Sphera Social • All rights reserved.</p>
      </footer>

    </div>
  );
}
