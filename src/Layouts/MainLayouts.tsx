import { Outlet, useLocation, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { X, LogOut, Settings, User } from "lucide-react";
import { UserDataContext } from "../contexts/UserData";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import RightSidebar from "../components/RightSidebar/RightSidebar";

/** Renders the main layouts component. */
export default function MainLayouts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { Data, saveUserData } = useContext(UserDataContext) as any;
  const { name, email, photo } = Data || {};
  const location = useLocation();
  const isFullWidthPage = location.pathname.includes('/settings') || location.pathname.includes('/profile') || location.pathname.includes('/user/') || location.pathname.includes('/notification');
  const hideRightSidebar = location.pathname.includes('/friends');
  return (
    <div className="bg-[#F0F2F5] dark:bg-slate-950 min-h-screen transition-colors duration-200">
      <Navbar onSidebarToggle={() => setIsSidebarOpen(true)} />
      {/* Floating sidebar toggle tab */}
      
        <>
          {/* Pill tab on left edge */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-5 h-12 bg-white dark:bg-slate-800 border border-l-0 border-slate-200 dark:border-slate-700 rounded-r-lg shadow-lg cursor-pointer transition-all duration-300 hover:w-7 group"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className={`text-slate-400 group-hover:text-indigo-500 transition-all duration-300 ${isSidebarOpen ? "rotate-180" : ""}`}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Drawer */}
          <div className="fixed inset-0 z-50 lg:hidden pointer-events-none">
            {/* Backdrop */}
            <div 
              className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} 
              onClick={() => setIsSidebarOpen(false)} 
            />

            {/* Panel */}
            <div className={`absolute inset-y-0 left-0 w-[270px] flex flex-col bg-white dark:bg-[#0f172a] shadow-2xl transition-transform duration-300 ease-in-out pointer-events-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <span className="font-black text-[17px] tracking-tight text-slate-800 dark:text-white">Sphera</span>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* User card */}
                <div className="mx-3 mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3 shrink-0">
                  {photo && photo !== 'undefined' && !photo.includes('default') ? (
                    <img src={photo} alt={name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                      <User size={18} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-bold text-slate-800 dark:text-white truncate leading-tight">{name || "User"}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{email}</p>
                  </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1.5">Browse</p>
                    <Sidebar onItemClick={() => setIsSidebarOpen(false)} bare />
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1.5">Account</p>
                    <Link
                      to="/profile"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
                    >
                      <User size={19} strokeWidth={1.5} className="text-slate-400" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
                    >
                      <Settings size={19} strokeWidth={1.5} className="text-slate-400" />
                      Settings
                    </Link>
                  </div>
                </div>

                {/* Logout */}
                <div className="px-3 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
                  <button
                    onClick={() => {
                      setIsSidebarOpen(false);
                      saveUserData(null);
                      localStorage.removeItem('user_token');
                      window.location.href = '/auth/login';
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all cursor-pointer"
                  >
                    <LogOut size={19} strokeWidth={1.5} />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
        </>



      <div className="container mx-auto px-4 py-6 max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {}
          {!isFullWidthPage && (
            <div className="hidden lg:block lg:col-span-3">
              <Sidebar />
            </div>
          )}

          {}
          <main className={`col-span-1 ${isFullWidthPage ? "lg:col-span-12" : (hideRightSidebar ? "lg:col-span-9" : "lg:col-span-6")}`}>
            <Outlet />
          </main>

          {}
          {!isFullWidthPage && !hideRightSidebar && (
            <div className="hidden lg:block lg:col-span-3">
              <RightSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
