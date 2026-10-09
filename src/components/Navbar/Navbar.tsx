import { useState, useRef, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Search, Home, Bell, LogOut, Settings, User, ChevronDown } from "lucide-react";
import spheraLogo from "../../assets/sphera-mark.svg";
import { useContext } from "react";
import { UserDataContext } from "../../contexts/UserData.js";
import { getNotifications } from "../../services/Profile.service";
import { useQuery } from "@tanstack/react-query";
export default function Navbar({ onSidebarToggle: _ }: { onSidebarToggle?: () => void }) {
    const [imgError, setImgError] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
    const { Data } = useContext(UserDataContext);
    const {name, email, photo} = Data || {};
  const token = localStorage.getItem("user_token");
    const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(token, false, 1, 50),
    refetchInterval: 15000,
  });

  const unreadCount = (() => {
    const arr = Array.isArray((notificationsData as any)?.data) ? (notificationsData as any).data : (notificationsData as any)?.data?.notifications || [];
    return arr.filter((n: any) => n.isRead !== true && n.unread !== false).length;
  })();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  const navigate = useNavigate();
    function handelLogout() {
    localStorage.removeItem("user_token");
    navigate("/auth/login");
  }
    function sliceName(username: string | undefined) {
    if (!username) return "U";
    const parts = username.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  }


  return (
    <nav ref={navRef} className="sticky top-0 z-[999] w-full bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/40 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex items-center justify-between h-16 w-full gap-4 lg:gap-8">
          
          <div className="flex items-center gap-2 flex-1 justify-start">
            <RouterLink to="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="p-1 rounded-xl transform transition-transform group-hover:scale-105 shrink-0 bg-white dark:bg-slate-800">
                <img src={spheraLogo} alt="Sphera Social Logo" className="w-7 h-7 object-contain" />
              </div>
              <p className="font-black text-[17px] sm:text-xl tracking-tighter text-slate-800 dark:text-slate-100 whitespace-nowrap hidden lg:block">Sphera Social</p>
            </RouterLink>
          </div>

          {}
          <div className="flex flex-none justify-center">
            <div className="flex items-center p-1.5 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.05)] border border-white/50 dark:border-slate-700/50 rounded-full gap-1">
              <RouterLink 
                to="/feed" 
                className={`flex px-4 py-2 gap-2 items-center justify-center rounded-full font-bold transition-all duration-300 cursor-pointer ${
                  location.pathname === '/' || location.pathname === '/feed' 
                    ? "bg-white/70 dark:bg-slate-800/70 text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/30 dark:hover:bg-slate-800/30"
                }`}
              >
                <Home size={20} strokeWidth={location.pathname === '/feed' || location.pathname === '/' ? 2.5 : 2} />
                <span className="hidden lg:block text-[15px]">Feed</span>
              </RouterLink>
              
              <RouterLink 
                to="/profile" 
                className={`flex px-4 py-2 gap-2 items-center justify-center rounded-full font-bold transition-all duration-300 cursor-pointer ${
                  location.pathname === '/profile' 
                    ? "bg-white/70 dark:bg-slate-800/70 text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/30 dark:hover:bg-slate-800/30"
                }`}
              >
                <User size={20} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
                <span className="hidden lg:block text-[15px]">Profile</span>
              </RouterLink>

              {}
              <RouterLink
                to="/notification"
                className={`flex px-4 py-2 gap-2 items-center justify-center rounded-full font-bold transition-all duration-300 cursor-pointer ${
                  location.pathname === '/notification'
                    ? "bg-white/70 dark:bg-slate-800/70 text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white/30 dark:hover:bg-slate-800/30"
                }`}
                aria-label="Notifications"
              >
                <div className="relative">
                  <Bell size={20} strokeWidth={location.pathname === '/notification' ? 2.5 : 2} />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800/30">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
                <span className="hidden lg:block text-[15px]">Notifications</span>
              </RouterLink>

            </div>
          </div>

          {}
          <div className="flex items-center justify-end gap-3 lg:gap-4 flex-1">
            <div className="hidden lg:flex relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="search"
                className="w-full xl:w-[15rem] h-10 pl-10 pr-4 rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 focus:bg-white/70 dark:focus:bg-slate-800/70 focus:border-indigo-300/40 dark:focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all outline-none shadow-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 cursor-text"
                placeholder="Search Sphera Social..."
              />
            </div>
            
            {}
            {/* Profile Menu */}
            <div className="relative shrink-0" ref={profileRef}>
              {/* Mobile: Link directly to profile */}
              <RouterLink 
                to="/profile"
                aria-label="Profile"
                className="sm:hidden flex items-center bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 p-1 rounded-full transition-all focus:outline-none shadow-sm shrink-0 cursor-pointer"
              >
                {photo && !imgError && photo !== "undefined" && !photo.includes('default') ? (
                  <img src={photo} alt={name} onError={() => setImgError(true)} className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full shrink-0 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {sliceName(name)}
                  </div>
                )}
              </RouterLink>

              {/* Desktop: Dropdown toggle */}
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="hidden sm:flex items-center gap-3 bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 p-1 pr-4 rounded-full transition-all focus:outline-none shadow-sm shrink-0 cursor-pointer"
              >
                {photo && !imgError && photo !== "undefined" && !photo.includes('default') ? (
                  <img src={photo} alt={name} onError={() => setImgError(true)} className="w-9 h-9 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full shrink-0 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                    {sliceName(name)}
                  </div>
                )}
                <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm whitespace-nowrap">{name}</span>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="hidden sm:block absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{name}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{email}</p>
                  </div>
                  <div className="p-2">
                    <RouterLink
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User size={18} className="text-slate-400" />
                      My Profile
                    </RouterLink>
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <RouterLink
                          key={item.label}
                          to={item.path}
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Icon size={18} className="text-slate-400" />
                          {item.label}
                        </RouterLink>
                      );
                    })}
                  </div>
                  <div className="px-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handelLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={18} className="text-red-500" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
}
